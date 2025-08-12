import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';

function loadEnv() {
  const cwd = process.cwd();
  const envLocalPath = path.join(cwd, '.env.local');
  if (fs.existsSync(envLocalPath)) dotenv.config({ path: envLocalPath, override: true });
  dotenv.config({ override: true });
}

async function main() {
  loadEnv();
  // Normalize and lightly validate env
  const rawId = (process.env.AWS_ACCESS_KEY_ID || '').trim();
  const rawSecret = (process.env.AWS_SECRET_ACCESS_KEY || '').trim();
  if (!rawId || !rawSecret) {
    console.error('Missing AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY in environment.');
    process.exit(1);
  }
  const mask = (s) => (s ? `${s.slice(0,4)}...${s.slice(-4)} (len=${s.length})` : '');
  const looksLikeId = /^A(KIA|SIA|ROA)[A-Z0-9]{16,}$/i.test(rawId);
  console.log('Using AWS key id:', mask(rawId), looksLikeId ? '' : '(unexpected format)');
  const creds = { accessKeyId: rawId, secretAccessKey: rawSecret };
  const client = new STSClient({ region: process.env.AWS_REGION || 'us-east-1', credentials: creds });
  try {
    const out = await client.send(new GetCallerIdentityCommand({}));
    console.log('STS OK:', out);
  } catch (err) {
    console.error('STS failed:', err?.name || err?.code || 'Error', '-', err?.message || err);
    process.exitCode = 1;
  }
}

main();
