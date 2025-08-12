import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { S3Client, HeadBucketCommand } from '@aws-sdk/client-s3';

function loadEnv() {
  const cwd = process.cwd();
  const envLocalPath = path.join(cwd, '.env.local');
  if (fs.existsSync(envLocalPath)) dotenv.config({ path: envLocalPath, override: true });
  dotenv.config({ override: true });
}

async function main() {
  loadEnv();
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_S3_BUCKET;
  if (!region || !bucket) {
    console.error('Missing AWS_REGION or AWS_S3_BUCKET');
    process.exit(1);
  }
  const creds = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined;

  // Unauthenticated HEAD to discover the true region via x-amz-bucket-region
  let actualRegion = region;
  try {
    const url = `https://${bucket}.s3.amazonaws.com/`;
    const res = await fetch(url, { method: 'HEAD' });
    const hdr = res.headers.get('x-amz-bucket-region');
    if (hdr) actualRegion = hdr;
  } catch {}

  // Authenticated HeadBucket with the actual region
  const s3 = new S3Client({ region: actualRegion, credentials: creds });
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }));
    const mismatch = actualRegion !== region;
    console.log(`S3 access OK. Bucket "${bucket}" is in region "${actualRegion}".` + (mismatch ? `\nHint: Update AWS_REGION in .env.local to "${actualRegion}" (currently "${region}").` : ''));
  } catch (err) {
    const code = err?.name || err?.code || 'Error';
    const msg = err?.message || String(err);
    if (code === 'PermanentRedirect' || msg.includes('301')) {
      console.error(`S3 test failed due to region mismatch. Bucket likely in "${actualRegion}" while AWS_REGION is "${region}".\nSet AWS_REGION="${actualRegion}" and retry.`);
    } else if (code === 'InvalidAccessKeyId' || msg.includes('InvalidAccessKeyId')) {
      console.error('S3 test failed: InvalidAccessKeyId. Check AWS_ACCESS_KEY_ID value.');
    } else if (code === 'SignatureDoesNotMatch' || msg.includes('SignatureDoesNotMatch')) {
      console.error('S3 test failed: SignatureDoesNotMatch. The AWS_SECRET_ACCESS_KEY is likely incorrect.');
    } else if (code === 'Forbidden' || code === 'AccessDenied' || err?.$metadata?.httpStatusCode === 403) {
      console.error('S3 test failed: Access denied (403). The bucket exists but credentials lack permissions (s3:ListBucket/HeadBucket).');
    } else if (code === 'NotFound' || err?.$metadata?.httpStatusCode === 404) {
      console.error('S3 test failed: Bucket not found (404). Check AWS_S3_BUCKET name.');
    } else {
      console.error('S3 test failed:', code, '-', msg);
    }
    process.exitCode = 1;
  }
}

main();
