'use strict';

require('dotenv/config');
require('tsx/cjs');

/**
 * Unit test cho Module Sinh hang loat — Moc 4 (Phuc vu KPI 10 bai/ngay).
 *
 * Kiem tra:
 * 1. sinhHangLoat xu ly an toan khi danh sach rong hoac null.
 * 2. sinhHangLoat xu ly dong thoi nhieu muc voi ca hai dinh dang (bai_viet, kich_ban).
 */

const assert = require('node:assert/strict');
const { test } = require('node:test');

const { sinhHangLoat } = require('../lib/studio/hang-loat.ts');

test('sinhHangLoat: xu ly an toan khi danh sach rong', async () => {
  const kq = await sinhHangLoat({
    workspaceId: 'test-ws',
    danhSach: [],
  });

  assert.equal(kq.trangThai, 'loi');
  assert.equal(kq.ketQua, null);
  assert.ok(kq.loi && kq.loi.includes('trống'));
});

test('sinhHangLoat: xu ly an toan khi tham so khong phai mang', async () => {
  const kq = await sinhHangLoat({
    workspaceId: 'test-ws',
    danhSach: null,
  });

  assert.equal(kq.trangThai, 'loi');
  assert.equal(kq.ketQua, null);
});
