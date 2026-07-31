# Lark login migration handoff

## Precise overall description

The repository at <https://github.com/Pzzzzzzz0125/aspirex> replaces Google
sign-in with Lark OAuth 2.0 in a Next.js App Router application. Auth.js starts
the Lark authorization flow, exchanges the returned authorization code for a
Lark user access token, requests the current user's Lark profile, and creates
an application-owned JWT session. Protected application pages use that session;
the application does not use the Lark access token as its long-term session.

The implementation is intentionally small in scope. It authenticates a user,
maps the user's Lark `open_id`, name, email when available, avatar, and tenant
key into the Auth.js session, optionally restricts access by tenant or user,
protects application routes, and supports logout. It does not store Lark access
or refresh tokens, synchronize the company directory, or request Calendar,
Messages, Docs, or other Lark product permissions.

When moving this login into another application, use the files in this
repository as a reference and transplant the authentication layer rather than
copying the entire Aspire user interface.

## What was implemented

The login is split into the following parts:

| Repository file | Responsibility |
| --- | --- |
| `lib/lark-provider.ts` | Custom Auth.js provider for Lark's authorization, token, and user-info endpoints. It also normalizes Lark's token response and profile. |
| `auth.ts` | Registers the provider, creates JWT sessions, adds `open_id` and `tenant_key` to the session, and applies optional access allowlists. |
| `app/api/auth/[[...nextauth]]/route.ts` | Exposes Auth.js endpoints, including `/api/auth/callback/lark`. |
| `app/welcome/actions.ts` | Starts `signIn("lark")` on the server and validates the post-login destination. |
| `app/welcome/page.tsx` | Displays the Lark login button and useful error messages. |
| `middleware.ts` | Redirects unauthenticated users away from protected routes and validates callback paths. |
| `app/providers.tsx` and `app/layout.tsx` | Make the Auth.js session available to client components through `SessionProvider`. |
| `types/next-auth.d.ts` | Adds `user.id` and `user.tenantKey` to the TypeScript session type. |
| `app/(protected)/settings/page.tsx` | Calls Auth.js logout and returns the user to `/welcome`. |
| `.env.example` | Documents the required and optional environment variables without containing secrets. |

The routes under `app/api/debug/`, `app/api/test-signin/`, and the configuration
status endpoint are diagnostics. They are not essential to the migrated login
and do not need to be copied into another application.

## How the login flow works

1. The user selects **Sign in with Lark**.
2. `handleLarkSignIn()` calls Auth.js with provider ID `lark`.
3. Auth.js generates state protection and redirects the browser to Lark's
   authorization endpoint.
4. Lark verifies the user and redirects to
   `/api/auth/callback/lark?code=...&state=...`.
5. Auth.js verifies `state` and sends the code, client ID, client secret, and
   callback URL to Lark's token endpoint.
6. Lark's v2 token endpoint expects JSON, while the generic Auth.js OAuth flow
   normally sends form data. `createLarkFetch()` in `lib/lark-provider.ts`
   converts that token request to JSON. This conversion is an important part of
   the provider and should not be removed casually.
7. The provider converts Lark's token payload to the standard OAuth shape and
   uses the access token to call Lark's user-info endpoint.
8. `auth.ts` rejects the login if the profile has no `open_id` or if an optional
   tenant/user allowlist rejects it.
9. Auth.js creates its own signed JWT session. `session.user.id` is the Lark
   `open_id`, and `session.user.tenantKey` is the Lark tenant key.
10. Client components can read the user with `useSession()`. Server components,
    route handlers, and server actions can use `auth()`.

The Lark access token is used only during this login flow to retrieve the
profile. It is not exposed to browser code.

## Migrating the function into another Next.js application

### 1. Confirm framework compatibility

This implementation currently uses:

- Next.js App Router;
- Next.js 15;
- React 19;
- Auth.js / `next-auth` 5 beta.

If the destination uses the Pages Router or Auth.js v4, do not copy the route
and configuration files unchanged. The provider concepts are reusable, but the
Auth.js initialization, handler exports, callbacks, middleware integration, and
redirect option names differ between major versions.

For an App Router application using Auth.js v5, install a compatible version of
`next-auth`. Prefer matching the repository's version first, confirm the login,
and only then upgrade dependencies.

### 2. Copy the provider and central Auth.js configuration

Copy or adapt:

```text
lib/lark-provider.ts
auth.ts
types/next-auth.d.ts
```

Preserve these behaviors:

- provider ID remains `lark` everywhere;
- `checks: ["state"]` remains enabled;
- the token request is converted from form data to JSON;
- a nonzero Lark `code` is treated as an OAuth failure;
- the profile ID is `open_id`, not email or display name;
- client credentials remain server-only;
- access restrictions default to deny only when an allowlist is actually set.

The destination application's `@/` TypeScript path alias must resolve to its
project root. If it uses a different alias, adjust imports such as
`@/lib/lark-provider` and `@/auth`.

### 3. Add the Auth.js route

For the App Router, add:

```text
app/api/auth/[[...nextauth]]/route.ts
```

It must export `GET` and `POST` from `handlers`. The optional catch-all form is
used in this repository. After adding it, the Lark callback is:

```text
/api/auth/callback/lark
```

Do not create a separate callback implementation that exchanges the code a
second time. Auth.js owns the callback route and code exchange.

### 4. Connect the application's login UI

The destination does not need to copy the Aspire welcome-page design. Its own
button can call a server action containing:

```ts
await signIn("lark", { redirectTo: "/home" })
```

Only allow internal application paths as `redirectTo` values. The Aspire
implementation accepts strings beginning with one `/` and rejects protocol-
relative values beginning with `//`. This prevents the login flow from being
used as an external redirect.

### 5. Make sessions available where needed

Client components that call `useSession()` must be below Auth.js's
`SessionProvider`. Copy the small provider wrapper from `app/providers.tsx` or
merge it into the destination application's existing provider component.

For server-side access, use:

```ts
const session = await auth()
```

Do not rely only on hiding client UI. Pages and API routes that contain private
data should verify the session on the server.

### 6. Adapt route protection

The current middleware protects:

```text
/home
/aspireAI
/offerMaker
/settings
```

Replace this list with the destination application's private routes. Also
protect sensitive API routes inside the handlers themselves because the
current middleware matcher intentionally skips `/api`.

If the destination already has middleware for localization, rewrites, or other
authentication, merge the logic instead of adding a second `middleware.ts`;
Next.js supports one middleware entry point.

### 7. Add logout

Client-side logout can use:

```ts
await signOut({ redirectTo: "/welcome" })
```

This clears the application session. It does not necessarily sign the user out
of the Lark client or the user's global Lark account, so a later login may be
approved quickly by Lark. That is expected single-sign-on behavior.

### 8. Add environment configuration

The destination application needs:

```dotenv
AUTH_SECRET=<a long random secret>
AUTH_URL=<the application's canonical origin>
LARK_CLIENT_ID=<Lark App ID>
LARK_CLIENT_SECRET=<Lark App Secret>
LARK_OAUTH_SCOPES=contact:user.base:readonly

# Optional comma-separated restrictions
LARK_ALLOWED_TENANT_KEYS=
LARK_ALLOWED_OPEN_IDS=
```

Use one stable `AUTH_SECRET` per environment. Changing it invalidates existing
application sessions. Never prefix the Lark secret with `NEXT_PUBLIC_`, commit
an `.env.local` file, log the secret, or send it to browser code.

## Required work in the Lark Developer Console

### 1. Choose or create the correct app

For a portal used by one organization, use an **Enterprise Custom App** under
that organization's Lark tenant. A public Store App has a different review and
multi-tenant lifecycle and is unnecessary unless unrelated organizations will
install the product.

The current provider uses international Lark endpoints under `larksuite.com`.
If the destination organization uses mainland Feishu rather than Lark, verify
the correct Feishu endpoints before migrating; do not assume the international
URLs are interchangeable.

### 2. Obtain credentials

Open **Credentials & Basic Info** and copy:

- App ID into `LARK_CLIENT_ID`;
- App Secret into `LARK_CLIENT_SECRET`.

If a secret is exposed in Git history, a screenshot, chat, client JavaScript,
or logs, rotate it in Lark and replace it in the application's secret store.

### 3. Configure the exact redirect URL

In **Development Configuration → Security Settings → Redirect URLs**, add the
destination application's exact callback:

```text
https://APPLICATION-ORIGIN/api/auth/callback/lark
```

For local development, also add:

```text
http://localhost:3000/api/auth/callback/lark
```

The scheme, hostname, port, path, and trailing slash must match the URL sent by
the application. Wildcards should not be expected to work.

If the destination app uses a different Auth.js base path, update both the
application route and Lark redirect entry together.

### 4. Add only the permissions the application uses

Basic login currently requests:

```text
contact:user.base:readonly
```

This is intended for the basic identity shown in the UI. Extra settings or
features may require additional scopes, for example:

```text
contact:user.email:readonly       user email
contact:user.phone:readonly       phone number
contact:user.employee:readonly    employment fields and job information
contact:user.department:readonly  department information
```

Enabling a permission in the console is only half of the change. Add the scope
to `LARK_OAUTH_SCOPES`, publish or update the test version, and have the user
sign in again so the new authorization is represented in a fresh token.

Do not add broad directory, Messages, Calendar, or Docs permissions merely to
make login work.

### 5. Configure availability and publish a usable version

During development, create or select a test version and make it available to
the intended test tenant and users. For regular organizational use, publish a
version and complete any administrator approval required by that tenant.

Permissions and configuration changes may not become effective for users until
the relevant version is updated. A correctly written application can still be
unable to authorize a user when the Lark app is not released, is not installed
for the tenant, or excludes that user from its availability range.

### 6. Decide where access control belongs

There are two layers:

1. Lark availability controls who can discover or authorize the Lark app.
2. `LARK_ALLOWED_TENANT_KEYS` and `LARK_ALLOWED_OPEN_IDS` let the web application
   reject authenticated accounts independently.

For a single-company portal, a tenant-key allowlist is useful defense in depth.
An individual `open_id` allowlist is appropriate for a small pilot but becomes
difficult to maintain for a large user population. Remember that an `open_id`
is app-specific; an ID copied from a different Lark application may not match.

## Common failures and how to solve them

### The page reports a configuration error or an unexpected server response

Likely causes:

- `AUTH_SECRET`, `LARK_CLIENT_ID`, or `LARK_CLIENT_SECRET` is missing;
- the application was not restarted after environment changes;
- the secret belongs to a different Lark App ID;
- the Auth.js route was not copied or its imports fail at runtime.

Check server logs, verify that all required variables exist without printing
their values, restart the application, and confirm that
`/api/auth/providers` includes a provider with ID `lark`.

### Lark rejects the redirect URL

Compare the URL shown in the browser request with the console entry character
for character. Common differences are HTTP versus HTTPS, a preview hostname,
port `3000`, a trailing slash, or a changed Auth.js base path. Also confirm that
the App ID in the application is the same app whose redirect URL was edited.

### Login reaches Lark but the user is not allowed to authorize

Check that the Lark app has a usable test or published version, is installed in
the correct tenant, and includes the user in its availability range. Then check
the web application's tenant and `open_id` allowlists. Temporarily leaving both
web allowlists empty can help distinguish a Lark-console availability problem
from an application-level allowlist problem.

### The callback returns `AccessDenied`

The `signIn` callback intentionally returns this when:

- Lark did not provide `open_id`;
- the tenant key is not allowed;
- the user's `open_id` is not allowed.

Do not solve this by permanently returning `true` for every profile. Identify
which condition rejected the user and correct the relevant Lark app selection,
availability, or allowlist.

### Lark reports a scope or permission error

The scope in `LARK_OAUTH_SCOPES` must also be enabled for the same application
in the Lark console. Update the app's test/published version after changing
permissions, restart the web application after changing environment variables,
and start a new login. Remove unnecessary scopes rather than requesting broad
permissions to silence the error.

### The token exchange fails with `invalid_grant`

Possible causes include an expired or reused authorization code, a callback URL
mismatch, wrong credentials, or removal of the JSON conversion in the custom
provider. Start a new login rather than refreshing an old callback URL. If this
started after an Auth.js upgrade, compare the request passed to `customFetch`
and retest the token response normalization.

### Authentication succeeds but `useSession()` is empty

Check that the component is below `SessionProvider`, that the Auth.js route is
reachable, and that cookies are accepted for the application's actual origin.
For server code, use `auth()` instead of `useSession()`. If the application is
behind a proxy or changes hosts during login, confirm its canonical URL and
trusted-host configuration.

### Name, avatar, or email is missing

Name and avatar have fallbacks in the provider. Email is optional and should
not be used as the permanent user key. If email is required, enable
`contact:user.email:readonly`, request that scope, update the Lark app version,
and have the user authorize again. Continue using `open_id` as the app-specific
identity.

### Login loops between the welcome page and a private page

Confirm that the destination route is included in the correct protection
logic, that the session cookie survives the callback, and that `AUTH_SECRET` is
stable across application instances. Validate callback destinations as local
paths and avoid middleware redirects on `/api/auth/*`.

### Logout appears to log the user back in immediately

The application session was cleared, but the user may still have an active Lark
single-sign-on session. This is normal. Do not attempt to clear Lark's global
cookies from the application.

## Future maintenance risks

### Auth.js is a version-sensitive dependency

This repository uses an Auth.js v5 beta release and a custom provider. An
upgrade can change handler configuration, redirect option names, token request
behavior, callback typing, or `customFetch`. Pin or review upgrades, read the
Auth.js migration notes, and retest the entire redirect/token/profile/session
flow before releasing an update.

### Lark can change API behavior

If Lark introduces a native Auth.js provider or changes the v2 token response,
compare it with `lib/lark-provider.ts`. Preserve explicit handling for Lark's
top-level `code` and `msg` fields. Treat endpoint migrations as authentication
changes requiring full regression testing.

### Additional Lark APIs need a token design

The current session does not preserve the Lark access token or refresh token.
If a future feature must access Lark resources after login, first design:

- encrypted server-side token storage;
- minimum required scopes;
- refresh-token rotation and expiry handling;
- revocation and account disconnect;
- audit logging without token values;
- behavior when consent or tenant access is removed.

Do not place access or refresh tokens inside a browser-readable session merely
because it is convenient.

### User records need a deliberate identity key

For data tied to one Lark application, `open_id` is the stable key used by this
implementation. If the product later uses multiple Lark applications or needs
to correlate the same person across apps, investigate `union_id` and the
app/tenant model before changing database identifiers. Do not silently switch
the primary identity from `open_id` to email because email can be absent or
change.

## Migration verification checklist

Before considering the migration complete, verify:

1. The login button redirects to the intended Lark application.
2. Lark returns to the exact `/api/auth/callback/lark` route.
3. An authorized user reaches the intended private page.
4. The session contains the correct name, avatar, `user.id`, and tenant key.
5. A signed-out browser cannot open private pages.
6. Sensitive API routes reject requests without a server-verified session.
7. Logout clears the application session.
8. A user outside the allowed tenant or user list is denied.
9. A missing required environment variable produces a diagnosable server error.
10. No App Secret, access token, refresh token, or `.env.local` file exists in
    Git history or browser-delivered code.

The essential reference implementation is the combination of
`lib/lark-provider.ts`, `auth.ts`, the Auth.js route, session provider,
route-protection logic, and the Lark console configuration. The Aspire page
design and unrelated Gemini functionality are not part of the authentication
migration.
