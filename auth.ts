import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// Allowed email domains
const ALLOWED_EMAIL_DOMAINS = [
  "aspirehomesrealty.com",
  "gmail.com",
  "ratednagroup.com"
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const email = user.email;
        if (email) {
          const domain = email.split('@')[1];
          if (domain && ALLOWED_EMAIL_DOMAINS.includes(domain)) {
            return true; // Grant access
          }
        }
        // Deny access for unauthorized domains
        return "/welcome?error=AccessDenied";
      }
      return true; // Default to allowing other sign-in methods
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});

