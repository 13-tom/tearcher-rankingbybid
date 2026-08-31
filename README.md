# Teacher Rankings

Students sign up and buy stars via Stripe to boost their favorite teacher up
a public leaderboard. Teacher profiles are added by the site owner through
`/admin/teachers`.

## Stack

Next.js (App Router) + Prisma + Postgres (Supabase) + NextAuth (email/password)
+ Stripe Checkout.

## Local setup

1. Copy `.env.example` to `.env.local` and fill in the values (see below).
2. `npm install`
3. `npx prisma db push` — creates/updates tables from `prisma/schema.prisma`.
4. `npm run db:seed` — creates the one admin login from `ADMIN_EMAIL`/`ADMIN_PASSWORD`.
5. `npm run dev` — open http://localhost:3000.

### Environment variables

- `DATABASE_URL` — your Postgres connection string (Supabase: Project Settings
  → Database → Connection string → "Transaction" pooler mode, port 6543).
  Append `?pgbouncer=true` to the end of it, or Prisma will fail with a
  "prepared statement already exists" error against the pooler.
- `DIRECT_URL` — same connection string but the **direct** connection (Supabase:
  same page, "Direct connection", port 5432, no "pooler" in the hostname). No
  `?pgbouncer=true` needed here. Only used for `prisma db push`/`migrate`.
- `NEXTAUTH_SECRET` — random string, e.g. `openssl rand -base64 32`.
- `NEXTAUTH_URL` — `http://localhost:3000` locally, your deployed URL in prod.
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` — from the Stripe dashboard
  (use test keys until you're ready to take real payments).
- `STRIPE_WEBHOOK_SECRET` — from `stripe listen` locally, or the webhook
  endpoint's signing secret in the Stripe dashboard once deployed.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials for the one admin account,
  created by `npm run db:seed`.
- `NEXT_PUBLIC_APP_URL` — used to build Stripe's success/cancel redirect URLs.

### Testing the Stripe flow locally

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Use test card `4242 4242 4242 4242`, any future expiry, any CVC.

## Deploying

1. Push this repo to GitHub, import it into [Vercel](https://vercel.com/new).
2. Set all the env vars above in the Vercel project settings, using **live**
   Stripe keys once you're ready to charge real students.
3. In the Stripe dashboard, add a webhook endpoint pointing at
   `https://<your-domain>/api/webhooks/stripe` for the `checkout.session.completed`
   event, and copy its signing secret into `STRIPE_WEBHOOK_SECRET`.
4. Run `npx prisma db push` and `npm run db:seed` once against the production
   database (e.g. from your machine with `DATABASE_URL` pointed at prod) to
   create tables and the admin login.
5. Log in as admin at `/admin/teachers` and add your teachers.
