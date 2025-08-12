import { getDb } from '../src/lib/db/client.js';

async function checkDb() {
  console.log('Checking database connection...');
  const db = await getDb();
  if (db) {
    console.log('Database connection successful!');
  } else {
    console.log('Database connection failed!');
  }
}

checkDb();
