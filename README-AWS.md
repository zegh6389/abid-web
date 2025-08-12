AWS-backed MVP setup for the Next.js shop

1) Choose database: Amazon RDS PostgreSQL (or Aurora PostgreSQL Serverless v2)
- Pros: strong relational model for products/variants/orders, ACID transactions, rich JSON support, extensions.
- Free-tier: use AWS Student credits; pick db.t4g.micro or serverless ACU min.
- Set DATABASE_URL in .env.

2) Run Prisma
- npm i
- npx prisma migrate dev --name init
- npx prisma generate

Example RDS connection string

Use your RDS host and credentials in the DATABASE_URL:

postgresql://USERNAME:PASSWORD@database-1.cr8y6i6c8ldx.ca-central-1.rds.amazonaws.com:5432/DBNAME?sslmode=require&connection_limit=5&pgbouncer=true

Notes
- sslmode=require is recommended for RDS public endpoints
- Consider using AWS Secrets Manager to store USERNAME/PASSWORD

3) Media storage: Amazon S3
- Create a bucket (private by default). Configure CORS for GET/PUT from your domain.
- Export AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY.

Required IAM when using S3 (SSE-KMS)
- Attach an IAM policy granting bucket access (replace BUCKET_NAME): see docs/aws/iam-policy-s3-basic.json
- If the bucket enforces SSE-KMS, also attach a KMS policy to the same principal (replace REGION/ACCOUNT_ID/KMS_KEY_ID): docs/aws/iam-policy-kms-s3.json
- Optionally set AWS_S3_SSE_KMS_KEY_ID in your env to include SSE headers in presigned PUTs.

Example .env.local additions
AWS_REGION="ca-central-1"
AWS_S3_BUCKET="your-bucket"
AWS_S3_SSE_KMS_KEY_ID="arn:aws:kms:ca-central-1:123456789012:key/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

Troubleshooting
- 403 on PutObject with message about kms:GenerateDataKey: attach GenerateDataKey, Encrypt, DescribeKey to your IAM user for the KMS key.
- AccessControlListNotSupported: your bucket has ObjectOwnership=BucketOwnerEnforced; do not use ACLs.
- 301/PermanentRedirect: region mismatch; use bucket's x-amz-bucket-region.

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
