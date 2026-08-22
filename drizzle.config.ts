/**
 * Cau hinh Drizzle Kit.
 *
 * CHI dung `generate` + `migrate`. KHONG dung `drizzle-kit push`: push so sanh
 * schema roi tu sinh lenh, tren production no lang le DROP cot/bang de "cho
 * khop" — mat du lieu khong khoi phuc duoc. Xem `scripts/db-rollback.md`.
 */

import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const rawUrl = process.env.DATABASE_URL;
if (!rawUrl) {
  throw new Error('Thieu bien moi truong DATABASE_URL');
}

const laLocal = rawUrl.includes('127.0.0.1') || rawUrl.includes('localhost');
const certPath = process.env.DATABASE_CA_CERT || path.resolve(process.cwd(), 'certs/aiven-ca.pem');

if (!laLocal && fs.existsSync(certPath)) {
  process.env.NODE_EXTRA_CA_CERTS = certPath;
  process.env.PGSSLROOTCERT = certPath;
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schema/index.ts',
  out: './db/migrations',
  dbCredentials: { url: rawUrl },
  casing: 'snake_case',
  verbose: true,
  strict: true,
});
