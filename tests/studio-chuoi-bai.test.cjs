'use strict';

require('dotenv/config');
require('tsx/cjs');

/**
 * Unit test cho Module Chuoi bai noi mach (/studio/chuoi-bai).
 *
 * Kiem tra:
 * 1. taoDanYMacDinh sinh dung dan y 3 ky va 5 ky.
 * 2. sinhChuoiBai xu ly an toan khi tieu de rong hoac null.
 */

const assert = require('node:assert/strict');
const { test } = require('node:test');

const { taoDanYMacDinh, sinhChuoiBai } = require('../lib/studio/chuoi-bai.ts');

test('taoDanYMacDinh: sinh dung 3 ky voi tieu de va goc tiep can ro rang', () => {
  const danY = taoDanYMacDinh('Kinh doanh TikTok 0đ', 3);
  assert.equal(danY.length, 3);
  assert.ok(danY[0].vaiTro.includes('Kỳ 1'));
  assert.ok(danY[1].vaiTro.includes('Kỳ 2'));
  assert.ok(danY[2].vaiTro.includes('Kỳ 3'));
  assert.ok(danY[0].gocTiepCan.includes('Kinh doanh TikTok 0đ'));
});

test('taoDanYMacDinh: sinh dung 5 ky voi lo trinh chuyen sau', () => {
  const danY = taoDanYMacDinh('Xay dung thuong hieu', 5);
  assert.equal(danY.length, 5);
  assert.ok(danY[4].vaiTro.includes('Kỳ 5'));
  assert.ok(danY[4].gocTiepCan.includes('Kỳ cuối'));
});

test('sinhChuoiBai: xu ly an toan khi tieu de rong', async () => {
  const res = await sinhChuoiBai({
    workspaceId: 'test-ws',
    tieuDeChuoi: '',
    beMat: 'fanpage',
  });

  assert.equal(res.trangThai, 'loi');
  assert.equal(res.ketQua, null);
  assert.ok(res.loi && res.loi.includes('chủ đề'));
});
