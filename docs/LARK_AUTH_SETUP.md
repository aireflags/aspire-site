# Lark authentication setup

This project uses Lark OAuth for sign-in and Auth.js for the application's own
JWT session. The Gemini/Google Cloud configuration is unrelated to sign-in and
should not be removed.

## 1. Create the Lark application

1. Sign in to <https://open.larksuite.com/>.
2. Open the Developer Console.
3. Select **Create Enterprise Custom App**.
4. Enter an application name, description, and icon. A suitable name is
   `Aspire Homes Portal`.
5. Create the application under the Aspire Lark organization.

Do not create a public store app unless the portal is intended for multiple
unrelated organizations.

## 2. Copy the credentials

In the application, open **Credentials & Basic Info** and copy:

- App ID, used as `LARK_CLIENT_ID`
- App Secret, used as `LARK_CLIENT_SECRET`

The App Secret must remain server-side. Never:

- commit it to Git;
- place it in a `NEXT_PUBLIC_` variable;
- paste it into an issue, pull request, or chat;
- put it in browser-side code.

## 3. Register redirect URLs

Open **Development Configuration → Security Settings → Redirect URLs** and add
each exact callback URL.

Development:

```text
http://localhost:3000/api/auth/callback/lark
```

Production:

```text
https://YOUR-PRODUCTION-DOMAIN/api/auth/callback/lark
```

If Vercel Preview deployments need authentication, add the exact stable preview
domain as another redirect. Lark does not support wildcard redirect URLs.

The protocol, hostname, port, path, and trailing slash must match exactly.

## 4. Configure permissions and availability

The current login flow needs only Lark's basic login identity: `open_id`, name,
avatar, and tenant key. Do not add broad Contacts, messaging, document, or
calendar permissions for login alone.

If the owner requires email-based account matching, add the Lark permission
named **Obtain user's email information**. The code treats email as optional.

The default OAuth scope is:

```text
contact:user.base:readonly
```

If email is enabled, set the scope in `.env.local` to:

```dotenv
LARK_OAUTH_SCOPES=contact:user.base:readonly contact:user.email:readonly
```

Under the application's availability settings:

1. Select the Aspire employees or test group that can use the portal.
2. Avoid making the application available to the whole organization during
   initial testing.
3. Expand availability only after login and access-denial tests pass.

The project can additionally enforce:

- `LARK_ALLOWED_TENANT_KEYS`: comma-separated allowed Lark tenants;
- `LARK_ALLOWED_OPEN_IDS`: comma-separated allowed individual users.

If both variables are empty, access relies on the Lark application's
availability settings.

## 5. Publish the Lark application

1. Open **App Release → Version Management & Release**.
2. Create a version such as `1.0.0`.
3. Review its permissions and availability.
4. Submit it for release.
5. Ask an Aspire Lark tenant administrator to approve it if approval is
   required.

Configuration changes may not affect regular users until a version is
published and approved.

## 6. Configure local environment variables

Create `.env.local` from `.env.example`. Generate a new Auth.js secret:

```bash
openssl rand -base64 32
```

Then set:

```dotenv
AUTH_SECRET=<generated value>
LARK_CLIENT_ID=cli_xxxxxxxxxxxxx
LARK_CLIENT_SECRET=<Lark App Secret>

# Optional; comma-separated with no quotation marks required.
LARK_ALLOWED_TENANT_KEYS=
LARK_ALLOWED_OPEN_IDS=
```

Keep the existing Gemini or Vertex AI variables if Aspire AI is being used.

To discover the tenant key and current user's `open_id`:

1. Leave the optional restriction variables empty initially.
2. Restrict the test application through Lark's availability settings.
3. Sign in once.
4. Open `http://localhost:3000/api/auth/session`.
5. Copy `user.tenantKey` for `LARK_ALLOWED_TENANT_KEYS`.
6. Copy `user.id` for `LARK_ALLOWED_OPEN_IDS` if individual allowlisting is
   required.
7. Restart the development server after changing `.env.local`.

## 7. Test locally

Run:

```bash
npm run dev
```

Test the following:

1. `/welcome` displays **Sign in with Lark**.
2. Clicking the button opens Lark authorization.
3. Successful authorization returns to `/home`.
4. The user's Lark name and avatar appear on the home screen.
5. Opening `/home` in a signed-out browser redirects to `/welcome`.
6. **Settings → Log Out** deletes the local session and returns to `/welcome`.
7. A user outside the configured tenant or user allowlist receives
   `AccessDenied`.

## 8. Configure Vercel

In **Vercel → Project → Settings → Environment Variables**, add:

```text
AUTH_SECRET
LARK_CLIENT_ID
LARK_CLIENT_SECRET
LARK_ALLOWED_TENANT_KEYS       optional
LARK_ALLOWED_OPEN_IDS          optional
AUTH_URL                       recommended production URL
```

Set `AUTH_URL` to the canonical origin, without a trailing slash:

```text
https://YOUR-PRODUCTION-DOMAIN
```

Use a production `AUTH_SECRET` that is different from local development.
Configure variables for the intended Vercel environments and redeploy after
adding or changing them.

Finally, confirm that the production callback registered in Lark is:

```text
https://YOUR-PRODUCTION-DOMAIN/api/auth/callback/lark
```

## 9. Future Lark API access

The current implementation uses Lark only to authenticate the user. It does not
retain a refresh token or request `offline_access`.

If a future feature must read Lark documents, calendars, messages, or other
resources on behalf of the user, design token encryption, refresh-token
rotation, storage, revocation, and the minimum required scopes before enabling
those permissions.
