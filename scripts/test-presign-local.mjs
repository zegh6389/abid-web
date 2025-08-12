import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

function loadEnv() {
  const cwd = process.cwd();
  const envLocalPath = path.join(cwd, '.env.local');
  if (fs.existsSync(envLocalPath)) dotenv.config({ path: envLocalPath, override: true });
  dotenv.config({ override: true });
}

async function detectRegion(bucket) {
  try {
    const res = await fetch(`https://${bucket}.s3.amazonaws.com/`, { method: 'HEAD' });
    const hdr = res.headers.get('x-amz-bucket-region');
    return hdr || process.env.AWS_REGION || 'us-east-1';
  } catch {
    return process.env.AWS_REGION || 'us-east-1';
  }
}

async function main() {
  loadEnv();
  const bucket = process.env.AWS_S3_BUCKET;
  if (!bucket) throw new Error('Missing AWS_S3_BUCKET');
  const region = await detectRegion(bucket);
  const sseKmsKeyId = process.env.AWS_S3_SSE_KMS_KEY_ID;

  const creds = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined;

  const s3 = new S3Client({ region, credentials: creds });
  const key = `healthcheck/presign-local-${Date.now()}.txt`;
  const contentType = 'text/plain';

  // Create a presigned PUT URL locally (same as server route logic)
  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    ...(sseKmsKeyId ? { ServerSideEncryption: 'aws:kms', SSEKMSKeyId: sseKmsKeyId } : {}),
  });
  const url = await getSignedUrl(s3, cmd, { expiresIn: 60 });

  // Use the URL to upload
  const putHeaders = { 'content-type': contentType };
  if (sseKmsKeyId) {
    putHeaders['x-amz-server-side-encryption'] = 'aws:kms';
    putHeaders['x-amz-server-side-encryption-aws-kms-key-id'] = sseKmsKeyId;
  }
  const put = await fetch(url, { method: 'PUT', headers: putHeaders, body: 'hello-from-presign-local' });
  if (!put.ok) {
    const txt = await put.text().catch(() => '');
    throw new Error(`PUT failed ${put.status} ${txt}`);
  }
  console.log(`Presign local PUT OK in region "${region}" to s3://${bucket}/${key}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
