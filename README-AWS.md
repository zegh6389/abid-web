AWS-backed MVP setup for the Next.js shop

1) Choose database: Amazon RDS PostgreSQL (or Aurora PostgreSQL Serverless v2)
- Pros: strong relational model for products/variants/orders, ACID transactions, rich JSON support, extensions.
- Free-tier: use AWS Student credits; pick db.t4g.micro or serverless ACU min.
- Set DATABASE_URL in .env.

2) Run Prisma
- npm i
- npx prisma migrate dev --name init
- npx prisma generate

3) Media storage: Amazon S3
- Create a bucket (private by default). Configure CORS for GET/PUT from your domain.
- Export AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY.

Stripe (optional)
- Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to enable Stripe Checkout.
- Optionally set STRIPE_CURRENCY (defaults to currency provided by client, fallback to usd).

4) Local development
- Copy .env.example to .env and fill values.
- npm run dev
- Admin at /admin (login is a temporary cookie gate; replace with Cognito later).

5) Production deployment
- Host Next.js on Vercel or AWS Amplify.
- DB on RDS/Aurora, media on S3, optional CloudFront CDN.
- Rotate secrets via AWS Secrets Manager; set env vars.

Next steps
- Replace temp admin auth with Amazon Cognito Hosted UI or email/password stored in User table with Argon2 hash.
- Build product variant editor UI, image uploads to S3, and webhooks to revalidate pages.
- Add search with Amazon OpenSearch or Meilisearch for facets/typo tolerance.
