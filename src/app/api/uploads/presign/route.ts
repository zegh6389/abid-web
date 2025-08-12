import { NextResponse } from 'next/server';
import { s3 } from '@/lib/aws/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { cookies } from 'next/headers';
import { getAdminSessionCookieName, verifyAdminSessionCookieValue } from '@/lib/auth/session';
import { PresignSchema } from '@/lib/validation/upload';

export async function POST(req: Request) {
  // Require admin session
  const cookieStore = cookies();
  const raw = cookieStore.get(getAdminSessionCookieName())?.value;
  const session = await verifyAdminSessionCookieValue(raw);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = PresignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, code: 'BAD_REQUEST', errors: parsed.error.flatten() }, { status: 400 });
  }
  const { key, contentType } = parsed.data;
  const bucket = process.env.AWS_S3_BUCKET as string;
  if (!bucket) return NextResponse.json({ error: 'bucket missing' }, { status: 500 });
  const content = typeof contentType === 'string' && contentType ? contentType : 'application/octet-stream';
  // If bucket policy enforces SSE-KMS headers, include them in the presign
  const sseKmsKeyId = process.env.AWS_S3_SSE_KMS_KEY_ID;
  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: content,
    ...(sseKmsKeyId ? { ServerSideEncryption: 'aws:kms', SSEKMSKeyId: sseKmsKeyId } : {}),
  });
  const url = await getSignedUrl(s3, cmd, { expiresIn: 60 });
  const requiredHeaders: Record<string, string> = { 'content-type': content };
  if (sseKmsKeyId) {
    requiredHeaders['x-amz-server-side-encryption'] = 'aws:kms';
    requiredHeaders['x-amz-server-side-encryption-aws-kms-key-id'] = sseKmsKeyId;
  }
  return NextResponse.json({
    url,
    publicUrl: `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURIComponent(key)}`,
    requiredHeaders,
  });
}
