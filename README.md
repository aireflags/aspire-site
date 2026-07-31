# Aspire Homes Portal

Internal Next.js portal for Aspire Homes. Authentication uses Lark OAuth through
Auth.js. Google Gemini remains the AI provider and is independent of login.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and configure:

   ```dotenv
   AUTH_SECRET=<random secret>
   LARK_CLIENT_ID=<Lark App ID>
   LARK_CLIENT_SECRET=<Lark App Secret>
   ```

3. Register this exact development redirect URL in the Lark Developer Console:

   ```text
   http://localhost:3000/api/auth/callback/lark
   ```

4. Start the application:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000/welcome`.

See [docs/LARK_AUTH_SETUP.md](docs/LARK_AUTH_SETUP.md) for Lark console,
access-control, testing, and Vercel instructions.

For moving this login implementation into another application, see
[docs/LARK_LOGIN_MIGRATION_HANDOFF.md](docs/LARK_LOGIN_MIGRATION_HANDOFF.md).
