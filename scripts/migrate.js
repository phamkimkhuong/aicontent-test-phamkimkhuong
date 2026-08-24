'use strict';

require('dotenv/config');
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { beKetNoi, dongBeKetNoi, taoDrizzle } = require('../db/client-worker.js');

async function main() {
  console.log('🔄 Đang kiểm tra và áp dụng Migration Database...');
  const pool = beKetNoi();
  const db = taoDrizzle(pool);
  await migrate(db, { migrationsFolder: './db/migrations' });
  console.log('✅ Migration Database hoàn tất thành công!');
  await dongBeKetNoi();
}

main().catch(async (err) => {
  console.error('❌ Lỗi migration:', err.message || err);
  await dongBeKetNoi();
  process.exit(1);
});
