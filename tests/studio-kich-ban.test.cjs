'use strict';

require('dotenv/config');
require('tsx/cjs');

/**
 * Unit test cho Module Kịch bản video phân cảnh (Mốc 3).
 *
 * Kiểm tra:
 * 1. donKetQuaKichBan: Xử lý dữ liệu thô từ mô hình an toàn.
 * 2. Phân cảnh hợp lệ: Ép kiểu thoiLuongGiay, hinhAnh, loiThoai.
 * 3. Bắt đúng vi phạm quy tắc ngôn ngữ trong lời thoại kịch bản.
 */

const assert = require('node:assert/strict');
const { test } = require('node:test');

const { donKetQuaKichBan } = require('../lib/studio/kich-ban.ts');
const { quetQuyTacNgonNgu } = require('../lib/brand/quy-tac-ngon-ngu.ts');

test('donKetQuaKichBan: xu ly an toan khi dau vao null hoac khong phai object', () => {
  assert.deepEqual(donKetQuaKichBan(null), { tieuDe: '', phanCanh: [] });
  assert.deepEqual(donKetQuaKichBan(undefined), { tieuDe: '', phanCanh: [] });
  assert.deepEqual(donKetQuaKichBan('chuoi string'), { tieuDe: '', phanCanh: [] });
});

test('donKetQuaKichBan: trich xuat dung tieu de va danh sach phan canh hop le', () => {
  const tho = {
    tieuDe: '  Bi quyet quay video trieu view  ',
    phanCanh: [
      {
        thoiLuongGiay: 3,
        hinhAnh: 'Canh 1: Can canh nguoi noi nhin thang camera',
        loiThoai: 'Dung voi mua may quay dat tien!',
      },
      {
        thoiLuongGiay: '5',
        hinhAnh: 'Canh 2: Quay man hinh dien thoai',
        loiThoai: 'Chi can 1 chiec smartphone va meo nay.',
      },
      {
        // Thieu thoiLuongGiay -> fallback ve 3
        hinhAnh: 'Canh 3: Demo san pham',
        loiThoai: 'Ket qua sau 5 phut set up.',
      },
      // Phan canh rong -> bo qua
      {
        thoiLuongGiay: 2,
        hinhAnh: '',
        loiThoai: '',
      },
    ],
  };

  const kq = donKetQuaKichBan(tho);
  assert.equal(kq.tieuDe, 'Bi quyet quay video trieu view');
  assert.equal(kq.phanCanh.length, 3);
  assert.equal(kq.phanCanh[0].thoiLuongGiay, 3);
  assert.equal(kq.phanCanh[1].thoiLuongGiay, 5);
  assert.equal(kq.phanCanh[2].thoiLuongGiay, 3);
  assert.equal(kq.phanCanh[0].loiThoai, 'Dung voi mua may quay dat tien!');
});

test('quetQuyTacNgonNgu: bat duoc tu cam ky trong loi thoai kich ban', () => {
  const loiThoai = 'Phan mem nay giup ban tu dong 100% va tao ra su dot pha cach mang.';
  const viPham = quetQuyTacNgonNgu(loiThoai);

  assert.ok(viPham.length >= 2, 'Phai bat duoc it nhat 2 tu cam trong loi thoai');
  assert.ok(viPham.some((v) => v.cumTu === 'tự động 100%'));
  assert.ok(viPham.some((v) => v.cumTu === 'đột phá'));
});
