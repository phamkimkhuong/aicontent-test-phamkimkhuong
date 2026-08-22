'use strict';

require('dotenv/config');
const fs = require('fs');
const path = require('path');
const { beKetNoi, dongBeKetNoi } = require('../db/client-worker.js');

const pool = beKetNoi();

async function main() {
  console.log('🔄 Đang nạp dữ liệu mẫu vào PostgreSQL...');

  console.log('1️⃣  Đang chạy db/seed.sql (Tạo Workspace SANG 5M STUDIO & 5 Trụ cột)...');
  const seedSql = fs.readFileSync(path.resolve(__dirname, '../db/seed.sql'), 'utf8');
  await pool.query(seedSql);
  console.log('   ✅ Hoàn thành db/seed.sql!');

  console.log('2️⃣  Đang chạy db/seed-test.sql (Tạo Chân dung, Insight, Bài đã đăng, Kênh theo dõi)...');
  const seedTestRaw = fs.readFileSync(path.resolve(__dirname, '../db/seed-test.sql'), 'utf8');
  const seedTestSql = seedTestRaw
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith('\\'))
    .join('\n')
    .replaceAll(':ws', "'00000000-0000-4000-8000-000000000002'")
    .replaceAll(':nguoi', "'00000000-0000-4000-8000-000000000001'");

  await pool.query(seedTestSql);
  console.log('   ✅ Hoàn thành db/seed-test.sql!');

  console.log('\n🎉 NẠP DỮ LIỆU MẪU THÀNH CÔNG VÀO DATABASE!');
  await dongBeKetNoi();
}

main().catch(async (err) => {
  console.error('❌ Lỗi khi nạp dữ liệu:', err.message);
  await dongBeKetNoi();
  process.exit(1);
});
