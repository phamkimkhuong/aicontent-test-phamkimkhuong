/**
 * Test don ket qua de xuat va rai y tuong theo tru cot — Moc 1.
 */

'use strict';

require('dotenv/config');
require('tsx/cjs');

const assert = require('node:assert/strict');
const { test } = require('node:test');

const {
  TI_LE_KHAM_PHA,
  donKetQuaDeXuat,
  raiTheoTruCot,
} = require('../lib/studio/de-xuat.ts');

test('TI_LE_KHAM_PHA dung bang 0.2', () => {
  assert.equal(TI_LE_KHAM_PHA, 0.2);
});

// ---------------------------------------------------------------------------
// 1. donKetQuaDeXuat
// ---------------------------------------------------------------------------

test('donKetQuaDeXuat: ket qua rong hoac sai kieu van tra mang rong', () => {
  for (const tho of [null, undefined, {}, { yTuong: null }, { yTuong: 'sai' }]) {
    const ket = donKetQuaDeXuat(tho, ['Chia sẻ kiến thức'], ['Chủ shop thời trang'], 'fanpage');
    assert.deepEqual(ket, []);
  }
});

test('donKetQuaDeXuat: bo qua y tuong khong co tieu de', () => {
  const tho = {
    yTuong: [
      { tieuDe: '   ', truCot: 'Chia sẻ kiến thức' },
      { tieuDe: null, truCot: 'Chia sẻ kiến thức' },
      { tieuDe: 'Cách phối đồ mùa đông', truCot: 'Chia sẻ kiến thức' },
    ],
  };
  const ket = donKetQuaDeXuat(tho, ['Chia sẻ kiến thức'], [], 'fanpage');
  assert.equal(ket.length, 1);
  assert.equal(ket[0].tieuDe, 'Cách phối đồ mùa đông');
});

test('donKetQuaDeXuat: doi chieu truCot va chanDung voi danh sach that', () => {
  const dsTruCot = ['Chia sẻ kiến thức', 'Bán hàng trực tiếp'];
  const dsChanDung = ['Chủ shop thời trang', 'Mẹ bỉm sữa'];

  const tho = {
    yTuong: [
      {
        tieuDe: 'Bài 1',
        truCot: 'chia sẻ kiến thức', // viet thuong -> phai khop
        chanDung: 'Mẹ bỉm sữa',
      },
      {
        tieuDe: 'Bài 2',
        truCot: 'Trụ cột tự bịa', // khong co trong ds -> phai thanh null
        chanDung: 'Chân dung tự bịa',
      },
    ],
  };

  const ket = donKetQuaDeXuat(tho, dsTruCot, dsChanDung, 'fanpage');
  assert.equal(ket.length, 2);

  assert.equal(ket[0].truCot, 'Chia sẻ kiến thức');
  assert.equal(ket[0].chanDung, 'Mẹ bỉm sữa');

  assert.equal(ket[1].truCot, null, 'tru cot biet bia phai thanh null');
  assert.equal(ket[1].chanDung, null, 'chan dung biet bia phai thanh null');
});

test('donKetQuaDeXuat: nhan dien dung khamPha va beMat', () => {
  const tho = {
    yTuong: [
      { tieuDe: 'Bài 1', kham_pha: true, beMat: 'tiktok' },
      { tieuDe: 'Bài 2', khamPha: false, beMat: 'zalo' },
      { tieuDe: 'Bài 3', kham_pha: 'true', beMat: 'khong_hop_le' },
    ],
  };

  const ket = donKetQuaDeXuat(tho, [], [], 'fanpage');
  assert.equal(ket[0].khamPha, true);
  assert.equal(ket[0].beMat, 'tiktok');

  assert.equal(ket[1].khamPha, false);
  assert.equal(ket[1].beMat, 'zalo');

  assert.equal(ket[2].khamPha, true);
  assert.equal(ket[2].beMat, 'fanpage', 'be mat khong hop le ve mac dinh');
});

test('donKetQuaDeXuat: trendSignalId chi chap nhan id hop le', () => {
  const tho = {
    yTuong: [
      { tieuDe: 'A', trendSignalId: 'id-1' },
      { tieuDe: 'B', trendSignalId: 'id-fake' },
      { tieuDe: 'C', trendSignalId: null },
      { tieuDe: 'D' },
    ],
  };
  const ket = donKetQuaDeXuat(tho, [], [], 'fanpage', ['id-1', 'id-2']);
  assert.equal(ket[0].trendSignalId, 'id-1', 'id hop le phai duoc giu');
  assert.equal(ket[1].trendSignalId, null, 'id khong hop le phai thanh null');
  assert.equal(ket[2].trendSignalId, null);
  assert.equal(ket[3].trendSignalId, null);
});

// ---------------------------------------------------------------------------
// 2. raiTheoTruCot — Largest Remainder Method
// ---------------------------------------------------------------------------

test('raiTheoTruCot: tra du so luong yeu cau', () => {
  const yTuongTho = [
    { tieuDe: 'A1', truCot: 'Kien thuc', chanDung: null, gocTiepCan: null, cauMoDau: null, lyDoDeXuat: null, beMat: 'fanpage', khamPha: false },
    { tieuDe: 'A2', truCot: 'Kien thuc', chanDung: null, gocTiepCan: null, cauMoDau: null, lyDoDeXuat: null, beMat: 'fanpage', khamPha: false },
    { tieuDe: 'B1', truCot: 'Ban hang', chanDung: null, gocTiepCan: null, cauMoDau: null, lyDoDeXuat: null, beMat: 'fanpage', khamPha: false },
    { tieuDe: 'B2', truCot: 'Ban hang', chanDung: null, gocTiepCan: null, cauMoDau: null, lyDoDeXuat: null, beMat: 'fanpage', khamPha: false },
    { tieuDe: 'C1', truCot: 'Hau truong', chanDung: null, gocTiepCan: null, cauMoDau: null, lyDoDeXuat: null, beMat: 'fanpage', khamPha: true },
  ];

  const truCotMucTieu = [
    { ten: 'Kien thuc', tiLeMucTieu: 60 },
    { ten: 'Ban hang', tiLeMucTieu: 40 },
  ];

  const ketQua = raiTheoTruCot(yTuongTho, truCotMucTieu, 3);
  assert.equal(ketQua.length, 3);
});

test('raiTheoTruCot: xu ly an toan khi mang rong hoac so luong <= 0', () => {
  assert.deepEqual(raiTheoTruCot([], [{ ten: 'A', tiLeMucTieu: 100 }], 5), []);
  assert.deepEqual(raiTheoTruCot([{ tieuDe: 'A', truCot: 'A', chanDung: null, gocTiepCan: null, cauMoDau: null, lyDoDeXuat: null, beMat: 'fanpage', khamPha: false }], [], 0), []);
});

test('raiTheoTruCot: Largest Remainder — tong output LUON bang soLuong', () => {
  // Truong hop kho: 33%/33%/34% voi N=10
  // Math.round thua: round(3.3)+round(3.3)+round(3.4) = 3+3+3 = 9 != 10
  // Largest Remainder: floor(3.3)+floor(3.3)+floor(3.4) = 3+3+3 = 9, con lai 1 → 10 ✓
  const ds = [];
  for (let i = 0; i < 20; i++) {
    const tc = ['A', 'B', 'C'][i % 3];
    ds.push({ tieuDe: `Y${i}`, truCot: tc, chanDung: null, gocTiepCan: null, cauMoDau: null, lyDoDeXuat: null, beMat: 'fanpage', khamPha: false });
  }
  const truCot = [
    { ten: 'A', tiLeMucTieu: 33 },
    { ten: 'B', tiLeMucTieu: 33 },
    { ten: 'C', tiLeMucTieu: 34 },
  ];

  for (const soLuong of [7, 10, 13]) {
    const ket = raiTheoTruCot(ds, truCot, soLuong);
    assert.equal(ket.length, soLuong, `soLuong=${soLuong}: output phai dung bang soLuong`);
  }
});

test('raiTheoTruCot: enforce TI_LE_KHAM_PHA — uu tien chon dung soKhamPha tu candidate pool', () => {
  // Pool 15 y tuong: 3 y tuong kham pha that, 12 y tuong grounded
  const ds = [];
  for (let i = 0; i < 15; i++) {
    ds.push({
      tieuDe: `Y${i}`,
      truCot: 'A',
      chanDung: null,
      gocTiepCan: null,
      cauMoDau: null,
      lyDoDeXuat: null,
      beMat: 'fanpage',
      khamPha: i < 3, // 3 y tuong dau la kham pha
    });
  }
  const truCot = [{ ten: 'A', tiLeMucTieu: 100 }];
  const soLuong = 10;
  const ket = raiTheoTruCot(ds, truCot, soLuong);
  const soKhamPha = ket.filter((y) => y.khamPha).length;
  const mucTieu = Math.round(soLuong * TI_LE_KHAM_PHA);
  assert.equal(soKhamPha, mucTieu, `phai co dung ${mucTieu} y tuong khamPha, co ${soKhamPha}`);
});

test('raiTheoTruCot: semantic immutability — khong tu y mutate khamPha neu pool khong co', () => {
  // Pool 10 y tuong deu la grounded (khamPha = false)
  const ds = [];
  for (let i = 0; i < 10; i++) {
    ds.push({
      tieuDe: `Y${i}`,
      truCot: 'A',
      chanDung: null,
      gocTiepCan: null,
      cauMoDau: null,
      lyDoDeXuat: null,
      beMat: 'fanpage',
      khamPha: false,
    });
  }
  const truCot = [{ ten: 'A', tiLeMucTieu: 100 }];
  const ket = raiTheoTruCot(ds, truCot, 10);
  const soKhamPha = ket.filter((y) => y.khamPha).length;
  assert.equal(soKhamPha, 0, 'khong duoc tu y bien grounded thanh khamPha');
});

test('raiTheoTruCot: phan bo to the ratio correctly', () => {
  // 60/40 voi N=5 => A:3, B:2
  const ds = [];
  for (let i = 0; i < 10; i++) {
    const tc = i < 5 ? 'A' : 'B';
    ds.push({
      tieuDe: `Y${i}`,
      truCot: tc,
      chanDung: 'CD',
      gocTiepCan: null,
      cauMoDau: null,
      lyDoDeXuat: null,
      beMat: 'fanpage',
      khamPha: false,
    });
  }
  const truCot = [
    { ten: 'A', tiLeMucTieu: 60 },
    { ten: 'B', tiLeMucTieu: 40 },
  ];
  const ket = raiTheoTruCot(ds, truCot, 5);
  const soA = ket.filter((y) => y.truCot === 'A').length;
  const soB = ket.filter((y) => y.truCot === 'B').length;
  assert.equal(soA, 3, 'A phai co 3 cho (60% cua 5)');
  assert.equal(soB, 2, 'B phai co 2 cho (40% cua 5)');
});
