'use strict';

/**
 * Be ket noi PostgreSQL cho hang doi va worker.
 *
 * Vi sao khong dung `db/client.ts`: file do la be ket noi Drizzle cua TIEN TRINH
 * WEB va viet bang TypeScript. Worker chay bang `node` tran duoi pm2, Node 20
 * khong doc duoc `.ts`, nen hang doi phai co duong ket noi rieng bang `pg`.
 *
 * Worker dung `DATABASE_URL_WORKER` (vai tro bo qua phan quyen theo hang cua
 * Phase 13); tien trinh web dung `DATABASE_URL`. Hai chuoi tach nhau la co chu
 * y — tien trinh web tuyet doi khong duoc cam chuoi cua worker.
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

function docCauHinhSSL(chuoiKetNoi) {
  const laLocal = chuoiKetNoi.includes('127.0.0.1') || chuoiKetNoi.includes('localhost');
  if (laLocal) return { cleanUrl: chuoiKetNoi, ssl: undefined };

  const certPath = process.env.DATABASE_CA_CERT || path.resolve(process.cwd(), 'certs/aiven-ca.pem');
  if (fs.existsSync(certPath)) {
    const ca = fs.readFileSync(certPath, 'utf8');
    const cleanUrl = chuoiKetNoi.replace('?sslmode=require', '').replace('&sslmode=require', '');
    return { cleanUrl, ssl: { ca, rejectUnauthorized: true } };
  }

  return { cleanUrl: chuoiKetNoi, ssl: { rejectUnauthorized: false } };
}

/** @type {Map<string, import('pg').Pool>} */
const be = new Map();

/**
 * @param {string} [tenBien] ten bien moi truong chua chuoi ket noi
 * @returns {import('pg').Pool}
 */
function beKetNoi(tenBien = 'DATABASE_URL') {
  const dangCo = be.get(tenBien);
  if (dangCo) return dangCo;

  const chuoi = process.env[tenBien];
  // Chet ngay luc mo ket noi con hon chet giua mot truy van sau nay.
  if (!chuoi) throw new Error(`Thieu bien moi truong ${tenBien}`);

  const { cleanUrl, ssl } = docCauHinhSSL(chuoi);
  const moi = new Pool({
    connectionString: cleanUrl,
    ssl,
    max: Number(process.env.QUEUE_POOL_MAX || 6),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

  // Loi cua ket noi dang ranh khong gan voi truy van nao; khong bat o day thi no
  // thanh uncaughtException va giet ca tien trinh worker.
  moi.on('error', (loi) => {
    console.error(`[hang-doi] loi ket noi nhan roi (${tenBien}):`, loi.message);
  });

  be.set(tenBien, moi);
  return moi;
}

const { drizzle } = require('drizzle-orm/node-postgres');

function taoDrizzle(beDung) {
  return drizzle(beDung);
}

async function dongBeKetNoi() {
  const dang = [...be.values()];
  be.clear();
  await Promise.all(dang.map((b) => b.end().catch(() => {})));
}

module.exports = { beKetNoi, dongBeKetNoi, taoDrizzle };
