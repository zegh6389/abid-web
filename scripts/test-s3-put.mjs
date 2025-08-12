import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

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
  if (!bucket) {
    console.error('Missing AWS_S3_BUCKET');
    process.exit(1);
  }
  const region = await detectRegion(bucket);
  const sseKmsKeyId = process.env.AWS_S3_SSE_KMS_KEY_ID;
  const creds = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined;

  const s3 = new S3Client({ region, credentials: creds });
  const key = `healthcheck/${Date.now()}.txt`;
  try {
    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: 'ok',
      ContentType: 'text/plain',
      ...(sseKmsKeyId ? { ServerSideEncryption: 'aws:kms', SSEKMSKeyId: sseKmsKeyId } : {}),
    }));
    console.log(`PutObject OK in region "${region}" to s3://${bucket}/${key}`);
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    console.log('Cleanup OK (deleted test object).');
  } catch (err) {
    const code = err?.name || err?.code || 'Error';
    const msg = err?.message || String(err);
    if (code === 'InvalidAccessKeyId' || msg.includes('InvalidAccessKeyId')) {
      console.error('PutObject failed: InvalidAccessKeyId. Check AWS_ACCESS_KEY_ID.');
    } else if (code === 'SignatureDoesNotMatch' || msg.includes('SignatureDoesNotMatch')) {
      console.error('PutObject failed: SignatureDoesNotMatch. The AWS_SECRET_ACCESS_KEY is likely incorrect.');
    } else if (msg.includes('kms') && (msg.includes('AccessDenied') || msg.includes('NotAuthorized'))) {
      console.error('PutObject failed: KMS access denied. Grant kms:Encrypt and kms:GenerateDataKey on your KMS key to this IAM user.');
    } else if (err?.$metadata?.httpStatusCode === 403 || code === 'AccessDenied' || code === 'Forbidden') {
      console.error('PutObject failed: Access denied (403). Ensure s3:PutObject permission on arn:aws:s3:::' + bucket + '/*');
      // Try again with ACL in case the bucket policy enforces bucket-owner-full-control
      try {
        const key2 = `healthcheck/${Date.now()}-acl.txt`;
        await s3.send(new PutObjectCommand({
          Bucket: bucket,
          Key: key2,
          Body: 'ok',
          ContentType: 'text/plain',
          ACL: 'bucket-owner-full-control',
          ...(sseKmsKeyId ? { ServerSideEncryption: 'aws:kms', SSEKMSKeyId: sseKmsKeyId } : {}),
        }));
        console.log('Second attempt with ACL succeeded. Your bucket policy likely requires x-amz-acl=bucket-owner-full-control.');
        await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key2 }));
        console.log('Cleanup OK (deleted test object with ACL).');
      } catch (err2) {
        const code2 = err2?.name || err2?.code || 'Error';
        const msg2 = err2?.message || String(err2);
        if (code2 === 'AccessControlListNotSupported') {
          console.error('Bucket has ObjectOwnership=BucketOwnerEnforced (ACLs disabled). Do not set ACL; fix IAM/bucket policy to allow s3:PutObject.');
        } else {
          console.error('Second attempt also failed:', code2, '-', msg2);
        }
      }
    } else {
      console.error('PutObject failed:', code, '-', msg);
    }
    process.exitCode = 1;
  }
}

main();
