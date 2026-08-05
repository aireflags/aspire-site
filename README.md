# Aspire Homes Portal

Internal Next.js portal for Aspire Homes. Authentication supports both Lark and
Google OAuth through Auth.js. Google Gemini remains the AI provider and is
independent of account login.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and configure:

   ```dotenv
   AUTH_SECRET=<random secret>

   # Configure Lark, Google, or both.
   LARK_CLIENT_ID=<Lark App ID>
   LARK_CLIENT_SECRET=<Lark App Secret>
   GOOGLE_CLIENT_ID=<Google OAuth Client ID>
   GOOGLE_CLIENT_SECRET=<Google OAuth Client Secret>
   ```

   At least one complete provider pair is required. To restrict Google access,
   optionally set comma-separated domains or email addresses:

   ```dotenv
   GOOGLE_ALLOWED_DOMAINS=aspirehomes.com
   GOOGLE_ALLOWED_EMAILS=
   ```

3. Register the exact development redirect URL for each enabled provider.

   Lark Developer Console:

   ```text
   http://localhost:3000/api/auth/callback/lark
   ```

   Google Cloud Console OAuth client:

   ```text
   http://localhost:3000/api/auth/callback/google
   ```

4. Start the application:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000/welcome`.

See [docs/LARK_AUTH_SETUP.md](docs/LARK_AUTH_SETUP.md) for detailed Lark console,
access-control, testing, and Vercel instructions. Google and Lark can be enabled
together; each provider keeps its own callback URL and credentials.

For moving this login implementation into another application, see
[docs/LARK_LOGIN_MIGRATION_HANDOFF.md](docs/LARK_LOGIN_MIGRATION_HANDOFF.md).
