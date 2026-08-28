'use client';

import { useState, useTransition, useEffect, useRef } from 'react';

import { Icon } from '../../../sprite-icon';
import { luuGiongDieu } from '../actions';
import { TRONG_SO } from '@/lib/brand/do-day-du';

type HoSo = {
  moTa: string | null;
  giongDieu: string | null;
  dieuCamKy: string | null;
  phongChu: string | null;
};

/** Nguong ky tu de nhom `giongDieu` duoc tinh la da co — xem lib/brand/do-day-du.ts. */
const TOI_THIEU_GIONG_DIEU = 100;

function tuCoGian(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = `${Math.max(115, el.scrollHeight)}px`;
}

export function FormGiongDieu({ hoSo }: { hoSo: HoSo }) {
  const [giongDieu, datGiongDieu] = useState(hoSo.giongDieu ?? '');
  const [xong, datXong] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);
  const [loiTruong, datLoiTruong] = useState<Record<string, string>>({});
  const [dangChay, batDau] = useTransition();

  const moTaRef = useRef<HTMLTextAreaElement | null>(null);
  const giongDieuRef = useRef<HTMLTextAreaElement | null>(null);
  const dieuCamKyRef = useRef<HTMLTextAreaElement | null>(null);

  const daDu = giongDieu.trim().length >= TOI_THIEU_GIONG_DIEU;

  // Tu dong co gian chieu cao khi mount de hien thi toan bo van ban co san
  useEffect(() => {
    tuCoGian(moTaRef.current);
    tuCoGian(giongDieuRef.current);
    tuCoGian(dieuCamKyRef.current);
  }, []);

  function xuLyGui(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const cacLoi: Record<string, string> = {};

    const gdVal = (formData.get('giongDieu') as string)?.trim() ?? '';
    const dckVal = (formData.get('dieuCamKy') as string)?.trim() ?? '';

    if (!gdVal) {
      cacLoi['giongDieu'] = 'Vui lòng nhập mô tả giọng điệu thương hiệu';
    }
    if (!dckVal) {
      cacLoi['dieuCamKy'] = 'Vui lòng nhập các điều cấm kỵ (mỗi dòng một điều)';
    }

    if (Object.keys(cacLoi).length > 0) {
      datLoiTruong(cacLoi);
      datLoi('Vui lòng kiểm tra lại các trường bắt buộc có đánh dấu *.');
      if (cacLoi['giongDieu']) {
        giongDieuRef.current?.focus();
      } else if (cacLoi['dieuCamKy']) {
        dieuCamKyRef.current?.focus();
      }
      return;
    }

    datLoi(null);
    datLoiTruong({});
    datXong(false);

    batDau(async () => {
      await luuGiongDieu(formData);
      datXong(true);
    });
  }

  function xoaLoi(khoa: string) {
    if (loiTruong[khoa]) {
      datLoiTruong((prev) => {
        const moi = { ...prev };
        delete moi[khoa];
        return moi;
      });
      if (Object.keys(loiTruong).length <= 1) {
        datLoi(null);
      }
    }
  }

  return (
    <form className="bieu-mau" onSubmit={xuLyGui} noValidate>
      {loi ? (
        <div className="hop-loi" role="alert">
          <div className="hop-loi__icon">
            <Icon name="i-alert" size={18} />
          </div>
          <div className="hop-loi__noi-dung">
            <p className="hop-loi__tieu-de">Thông tin chưa đầy đủ</p>
            <p className="hop-loi__chi-tiet">{loi}</p>
          </div>
        </div>
      ) : null}

      <div className="o">
        <label className="o__nhan" htmlFor="o-moTa">
          Mô tả thương hiệu
        </label>
        <p className="o__goi-y">Kênh này là ai, làm gì, khác gì chỗ khác.</p>
        <textarea
          id="o-moTa"
          name="moTa"
          ref={(el) => {
            moTaRef.current = el;
            tuCoGian(el);
          }}
          defaultValue={hoSo.moTa ?? ''}
          onInput={(e) => tuCoGian(e.currentTarget)}
          placeholder="Ví dụ: Nền tảng tự học và luyện thi trực tuyến bám sát chương trình GDPT 2018..."
        />
      </div>

      <div className={`o ${loiTruong['giongDieu'] ? 'o--loi' : ''}`}>
        <label className="o__nhan" htmlFor="o-giongDieu">
          Giọng điệu <span className="o__bat-buoc">*</span>
        </label>
        <p className="o__goi-y">
          Cách kênh nói chuyện. Cần từ {TOI_THIEU_GIONG_DIEU} ký tự thì nhóm này mới được tính
          vào độ đầy đủ ({TRONG_SO.giongDieu}%) — mô tả càng cụ thể thì bài viết càng ít nhạt.
        </p>
        <textarea
          id="o-giongDieu"
          name="giongDieu"
          value={giongDieu}
          ref={(el) => {
            giongDieuRef.current = el;
            tuCoGian(el);
          }}
          onInput={(e) => tuCoGian(e.currentTarget)}
          onChange={(e) => {
            datGiongDieu(e.target.value);
            xoaLoi('giongDieu');
            tuCoGian(e.target);
          }}
          placeholder="Mô tả cách xưng hô, phong cách kể chuyện, từ ngữ ưa chuộng..."
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="o__goi-y" aria-live="polite">
            {giongDieu.trim().length}/{TOI_THIEU_GIONG_DIEU} ký tự{daDu ? ' — đã đủ chuẩn' : ''}
          </p>
        </div>
        {loiTruong['giongDieu'] ? (
          <p className="o__loi-nhan" role="alert">
            <Icon name="i-alert" size={13} />
            <span>{loiTruong['giongDieu']}</span>
          </p>
        ) : null}
      </div>

      <div className={`o ${loiTruong['dieuCamKy'] ? 'o--loi' : ''}`}>
        <label className="o__nhan" htmlFor="o-dieuCamKy">
          Điều cấm kỵ <span className="o__bat-buoc">*</span>
        </label>
        <p className="o__goi-y">
          Thứ tuyệt đối không được viết. Mỗi dòng một điều. Đây là chỗ chặn hệ thống viết ra
          câu làm hỏng uy tín kênh.
        </p>
        <textarea
          id="o-dieuCamKy"
          name="dieuCamKy"
          defaultValue={hoSo.dieuCamKy ?? ''}
          ref={(el) => {
            dieuCamKyRef.current = el;
            tuCoGian(el);
          }}
          onInput={(e) => {
            tuCoGian(e.currentTarget);
            xoaLoi('dieuCamKy');
          }}
          placeholder="- Không dùng từ ngữ hạ thấp học sinh...&#10;- Không cam kết điểm số tuyệt đối..."
        />
        {loiTruong['dieuCamKy'] ? (
          <p className="o__loi-nhan" role="alert">
            <Icon name="i-alert" size={13} />
            <span>{loiTruong['dieuCamKy']}</span>
          </p>
        ) : null}
      </div>

      <div className="o">
        <label className="o__nhan" htmlFor="o-phongChu">
          Phông chữ
        </label>
        <input
          type="text"
          id="o-phongChu"
          name="phongChu"
          defaultValue={hoSo.phongChu ?? ''}
          placeholder="Be Vietnam Pro, Outfit, Inter..."
        />
      </div>

      <div className="bieu-mau__nut">
        <button className="btn btn--primary" type="submit" disabled={dangChay}>
          {dangChay ? 'Đang lưu…' : 'Lưu hồ sơ'}
        </button>
        {xong && !dangChay ? (
          <span className="ghi-chu-mo-hinh" role="status" style={{ color: 'var(--sage)', fontWeight: 600 }}>
            ✓ Đã lưu thành công.
          </span>
        ) : null}
      </div>
    </form>
  );
}
