'use client';

import { useState, useTransition } from 'react';

import { Icon } from '../../../sprite-icon';
import { suaMuc, taoMuc, xoaMuc } from '../actions';
import type { DacTaNhom, Truong } from '@/lib/brand/dac-ta-nhom';

type Dong = Record<string, unknown> & { id: string };

/**
 * Man hinh dung chung cho bon nhom danh sach. Khac nhau duy nhat la `dacTa` —
 * bon ban chep rieng se lech nhau ngay lan dau co ai sua mot cai.
 */
export function DanhSachNhom({ dacTa, danhSach }: { dacTa: DacTaNhom; danhSach: Dong[] }) {
  const [dangSua, datDangSua] = useState<string | null>(null);
  const [dangThem, datDangThem] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);
  const [dangChay, batDau] = useTransition();

  function goiHanhDong(viec: () => Promise<{ ok: boolean; loi?: string }>, xong: () => void) {
    datLoi(null);
    batDau(async () => {
      const kq = await viec();
      if (kq.ok) {
        datLoi(null);
        xong();
      } else {
        datLoi(kq.loi ?? 'Không lưu được.');
      }
    });
  }

  return (
    <>
      {/* Chi hien thong bao loi tong khi khong co form nao dang mo */}
      {loi && !dangThem && !dangSua ? (
        <div className="hop-loi" role="alert">
          <div className="hop-loi__icon">
            <Icon name="i-alert" size={18} />
          </div>
          <div className="hop-loi__noi-dung">
            <p className="hop-loi__tieu-de">Có lỗi xảy ra</p>
            <p className="hop-loi__chi-tiet">{loi}</p>
          </div>
        </div>
      ) : null}

      {dangThem ? (
        <BieuMau
          dacTa={dacTa}
          dangChay={dangChay}
          loiServer={loi}
          onHuy={() => {
            datLoi(null);
            datDangThem(false);
          }}
          onGui={(form) =>
            goiHanhDong(
              () => taoMuc(dacTa.slug, form),
              () => datDangThem(false),
            )
          }
        />
      ) : (
        <button
          className="btn btn--primary"
          type="button"
          onClick={() => {
            datLoi(null);
            datDangThem(true);
          }}
        >
          <Icon name="i-plus" size={17} />
          Thêm {dacTa.tenMot}
        </button>
      )}

      {danhSach.length === 0 && !dangThem ? (
        <p className="trong">
          Chưa có {dacTa.tenMot} nào. Thêm tay ở đây, hoặc dán một trang văn bản có sẵn để hệ
          thống bóc tách giúp.
        </p>
      ) : null}

      <div className="muc-ds">
        {danhSach.map((dong) =>
          dangSua === dong.id ? (
            <div className="muc" key={dong.id}>
              <BieuMau
                dacTa={dacTa}
                dong={dong}
                dangChay={dangChay}
                loiServer={loi}
                onHuy={() => {
                  datLoi(null);
                  datDangSua(null);
                }}
                onGui={(form) =>
                  goiHanhDong(
                    () => suaMuc(dacTa.slug, dong.id, form),
                    () => datDangSua(null),
                  )
                }
              />
            </div>
          ) : (
            <article className="muc" key={dong.id}>
              <div className="muc__dau">
                <p className="muc__ten">{chuoiCua(dong[dacTa.khoaTieuDe]) || '(chưa đặt tên)'}</p>
                <div className="muc__nut">
                  <button
                    className="btn btn--ghost btn--sm"
                    type="button"
                    disabled={dangChay}
                    onClick={() => {
                      datLoi(null);
                      datDangSua(dong.id);
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn--ghost btn--sm"
                    type="button"
                    disabled={dangChay}
                    onClick={() => {
                      if (!confirm(`Xoá ${dacTa.tenMot} này?`)) return;
                      goiHanhDong(
                        () => xoaMuc(dacTa.slug, dong.id),
                        () => undefined,
                      );
                    }}
                  >
                    Xoá
                  </button>
                </div>
              </div>

              <dl className="muc__truong">
                {dacTa.truong
                  .filter((t) => t.khoa !== dacTa.khoaTieuDe)
                  .map((truong) => (
                    <div key={truong.khoa}>
                      <dt className="muc__nhan">{truong.nhan}</dt>
                      <dd className="muc__gia-tri">{hienGiaTri(truong, dong[truong.khoa])}</dd>
                    </div>
                  ))}
              </dl>
            </article>
          ),
        )}
      </div>
    </>
  );
}

function BieuMau({
  dacTa,
  dong,
  dangChay,
  loiServer,
  onGui,
  onHuy,
}: {
  dacTa: DacTaNhom;
  dong?: Dong;
  dangChay: boolean;
  loiServer?: string | null;
  onGui: (form: FormData) => void;
  onHuy: () => void;
}) {
  const [loiTruong, datLoiTruong] = useState<Record<string, string>>({});
  const [loiCucBo, datLoiCucBo] = useState<string | null>(null);

  // Tong hop loi giua validation client va server response
  const thongBaoLoi = loiCucBo || loiServer;

  function xuLyGui(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const cacLoi: Record<string, string> = {};

    // Validate client-side cac truong bat buoc
    for (const truong of dacTa.truong) {
      if (truong.batBuoc) {
        const val = formData.get(truong.khoa);
        const chuoi = typeof val === 'string' ? val.trim() : '';
        if (!chuoi) {
          cacLoi[truong.khoa] = `Vui lòng nhập ${truong.nhan.toLowerCase()}`;
        }
      }
    }

    if (Object.keys(cacLoi).length > 0) {
      datLoiTruong(cacLoi);
      const truongDauTien = dacTa.truong.find((t) => cacLoi[t.khoa]);
      datLoiCucBo(
        truongDauTien
          ? `Vui lòng điền thông tin bắt buộc: "${truongDauTien.nhan}"`
          : 'Vui lòng kiểm tra lại các trường bắt buộc.'
      );
      if (truongDauTien) {
        document.getElementById(`o-${truongDauTien.khoa}`)?.focus();
      }
      return;
    }

    datLoiTruong({});
    datLoiCucBo(null);
    onGui(formData);
  }

  function xoaLoiTruong(khoa: string) {
    if (loiTruong[khoa] || loiCucBo) {
      datLoiTruong((prev) => {
        const moi = { ...prev };
        delete moi[khoa];
        return moi;
      });
      datLoiCucBo(null);
    }
  }

  return (
    <form
      className="bieu-mau"
      onSubmit={xuLyGui}
      // `key` doi theo dong dang sua de React dung lai gia tri mac dinh moi khi
      // chuyen sang sua dong khac.
      key={dong?.id ?? 'them-moi'}
      noValidate
    >
      {thongBaoLoi ? (
        <div className="hop-loi" role="alert">
          <div className="hop-loi__icon">
            <Icon name="i-alert" size={18} />
          </div>
          <div className="hop-loi__noi-dung">
            <p className="hop-loi__tieu-de">Thông tin chưa hợp lệ</p>
            <p className="hop-loi__chi-tiet">{thongBaoLoi}</p>
          </div>
        </div>
      ) : null}

      {dacTa.truong.map((truong) => (
        <ONhap
          key={truong.khoa}
          truong={truong}
          giaTri={dong?.[truong.khoa]}
          loi={loiTruong[truong.khoa]}
          onThayDoi={() => xoaLoiTruong(truong.khoa)}
        />
      ))}

      <div className="bieu-mau__nut">
        <button className="btn btn--primary" type="submit" disabled={dangChay}>
          {dangChay ? 'Đang lưu…' : 'Lưu'}
        </button>
        <button className="btn btn--ghost" type="button" onClick={onHuy} disabled={dangChay}>
          Huỷ
        </button>
      </div>
    </form>
  );
}

function ONhap({
  truong,
  giaTri,
  loi,
  onThayDoi,
}: {
  truong: Truong;
  giaTri?: unknown;
  loi?: string;
  onThayDoi?: () => void;
}) {
  const id = `o-${truong.khoa}`;

  if (truong.kieu === 'co') {
    return (
      <div className="o o--co">
        <input type="checkbox" id={id} name={truong.khoa} defaultChecked={giaTri === true} />
        <span>
          <label className="o__nhan" htmlFor={id}>
            {truong.nhan}
          </label>
          {truong.goiY ? <p className="o__goi-y">{truong.goiY}</p> : null}
        </span>
      </div>
    );
  }

  return (
    <div className={`o ${loi ? 'o--loi' : ''}`}>
      <label className="o__nhan" htmlFor={id}>
        {truong.nhan}
        {truong.batBuoc ? <span className="o__bat-buoc"> *</span> : null}
      </label>
      {truong.goiY ? <p className="o__goi-y">{truong.goiY}</p> : null}
      {truong.kieu === 'doan' ? (
        <textarea
          id={id}
          name={truong.khoa}
          defaultValue={chuoiCua(giaTri)}
          ref={(el) => {
            if (el) {
              el.style.height = 'auto';
              el.style.height = `${Math.max(115, el.scrollHeight)}px`;
            }
          }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = 'auto';
            el.style.height = `${Math.max(115, el.scrollHeight)}px`;
            onThayDoi?.();
          }}
          onChange={onThayDoi}
          aria-invalid={loi ? 'true' : undefined}
          aria-describedby={loi ? `${id}-loi` : undefined}
        />
      ) : (
        <input
          type="text"
          id={id}
          name={truong.khoa}
          defaultValue={chuoiCua(giaTri)}
          onChange={onThayDoi}
          aria-invalid={loi ? 'true' : undefined}
          aria-describedby={loi ? `${id}-loi` : undefined}
        />
      )}
      {loi ? (
        <p className="o__loi-nhan" id={`${id}-loi`} role="alert">
          <Icon name="i-alert" size={13} />
          <span>{loi}</span>
        </p>
      ) : null}
    </div>
  );
}

function chuoiCua(giaTri: unknown): string {
  if (giaTri === null || giaTri === undefined) return '';
  return String(giaTri);
}

function hienGiaTri(truong: Truong, giaTri: unknown) {
  if (truong.kieu === 'co') return giaTri === true ? 'Có' : 'Không';
  const chu = chuoiCua(giaTri);
  return chu === '' ? '—' : chu;
}
