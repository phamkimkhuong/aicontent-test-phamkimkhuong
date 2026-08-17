/**
 * Test cong dem tu va kiem tra do dai be mat — Moc 2.
 */

'use strict';

require('dotenv/config');
require('tsx/cjs');

const assert = require('node:assert/strict');
const { test } = require('node:test');

const { demTu, kiemDoDai, KHOANG_TU_BE_MAT } = require('../lib/studio/cong-dem-tu.ts');

test('demTu: dem dung so tieng cach nhau boi khoang trang', () => {
  assert.equal(demTu(''), 0);
  assert.equal(demTu('   '), 0);
  assert.equal(demTu('Một hai ba'), 3);
  assert.equal(demTu('  Một   hai   ba   bốn  '), 4);
});

test('kiemDoDai: kiem tra dung nguong cua tung be mat', () => {
  // TikTok: 60-120 tu
  const vanBanNgan = new Array(30).fill('tu').join(' ');
  const ketNgan = kiemDoDai('tiktok', vanBanNgan);
  assert.equal(ketNgan.dat, false);
  assert.equal(ketNgan.trangThai, 'ngan');

  const vanBanVua = new Array(80).fill('tu').join(' ');
  const ketVua = kiemDoDai('tiktok', vanBanVua);
  assert.equal(ketVua.dat, true);
  assert.equal(ketVua.trangThai, 'dat');

  const vanBanDai = new Array(150).fill('tu').join(' ');
  const ketDai = kiemDoDai('tiktok', vanBanDai);
  assert.equal(ketDai.dat, false);
  assert.equal(ketDai.trangThai, 'dai');

  // Fanpage: 150-300 tu
  const fanpageVua = new Array(200).fill('tu').join(' ');
  assert.equal(kiemDoDai('fanpage', fanpageVua).dat, true);

  // Ho so ca nhan: 120-250 tu
  const hoSoVua = new Array(180).fill('tu').join(' ');
  assert.equal(kiemDoDai('ho_so_ca_nhan', hoSoVua).dat, true);

  // Zalo: 40-100 tu
  const zaloVua = new Array(60).fill('tu').join(' ');
  assert.equal(kiemDoDai('zalo', zaloVua).dat, true);
});

test('KHOANG_TU_BE_MAT: co du bon be mat', () => {
  assert.ok(KHOANG_TU_BE_MAT.fanpage);
  assert.ok(KHOANG_TU_BE_MAT.tiktok);
  assert.ok(KHOANG_TU_BE_MAT.ho_so_ca_nhan);
  assert.ok(KHOANG_TU_BE_MAT.zalo);
});

test('quetQuyTacNgonNgu: nhan dien tu ngu cam ky cua thuong hieu', () => {
  const { quetQuyTacNgonNgu } = require('../lib/brand/quy-tac-ngon-ngu.ts');
  const doanVan = 'Dùng AI tự động 100% giúp bạn tạo ra video đột phá và thay thế editor hoàn toàn.';
  const viPham = quetQuyTacNgonNgu(doanVan);
  assert.ok(viPham.length >= 2, 'phai phat hien it nhat 2 cum tu vi pham');
  const coCumTuCam = viPham.some(
    (v) => v.cumTu === 'tự động 100%' || v.cumTu === 'thay thế editor' || v.cumTu === 'đột phá',
  );
  assert.ok(coCumTuCam, 'phai phat hien tu ngu cam ky');
});
