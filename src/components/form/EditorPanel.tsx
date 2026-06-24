import React, { useRef } from 'react';
import type { WeddingData } from '../../types/wedding';
import { TEMPLATES } from '../../utils/templates';
import { resizeImage } from '../../utils/image';
import { openAddressSearch, geocodeAddress } from '../../utils/geocode';
import { useToast } from '../../hooks/toastContext';

interface Props {
  data: WeddingData;
  onChange: (data: WeddingData) => void;
  onPublish: (data: WeddingData) => void;
  isSubmitting: boolean;
}

const SectionHeader: React.FC<{ num: number; title: string }> = ({ num, title }) => (
  <div className="flex items-center gap-3 mb-5">
    <span
      className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
      style={{ background: '#C9A36B', color: '#fff', fontFamily: 'Cormorant Garamond, serif' }}
    >
      {num}
    </span>
    <h3 className="text-sm font-medium tracking-wide" style={{ color: '#3A342D' }}>
      {title}
    </h3>
  </div>
);

const inputCls = `
  w-full bg-transparent border rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all
  placeholder:text-[#C5BBB0]
`;
const inputStyle = { borderColor: '#E6DDCE', color: '#3A342D' };

const EditorPanel: React.FC<Props> = ({ data, onChange, onPublish, isSubmitting }) => {
  const { toast } = useToast();
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const update = (updater: (prev: WeddingData) => WeddingData) => {
    onChange(updater(data));
  };

  const handleAddressSearch = async () => {
    const picked = await openAddressSearch();
    if (!picked) return;
    update(prev => ({
      ...prev,
      location: { ...prev.location, address: picked.address, lat: undefined, lng: undefined },
    }));
    const coords = await geocodeAddress(picked.address);
    if (coords) {
      update(prev => ({
        ...prev,
        location: { ...prev.location, lat: coords.lat, lng: coords.lng },
      }));
    } else {
      toast('주소는 저장됐지만 지도 좌표를 찾지 못했어요.', 'error');
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    e.target.value = '';
    let failed = 0;
    for (const file of Array.from(files)) {
      try {
        const base64 = await resizeImage(file);
        update(prev => ({ ...prev, galleryImages: [...prev.galleryImages, base64] }));
      } catch {
        failed++;
      }
    }
    if (failed > 0) toast(`${failed}장의 이미지를 불러오지 못했습니다.`, 'error');
  };

  const removeGalleryImage = (idx: number) => {
    update(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="px-6 py-8 space-y-10">

      {/* ① 기본 정보 */}
      <section>
        <SectionHeader num={1} title="기본 정보" />
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] tracking-widest mb-1.5" style={{ color: '#9A8F80' }}>신랑</label>
              <input
                type="text"
                placeholder="이름"
                className={inputCls}
                style={inputStyle}
                value={data.groom.name}
                onChange={e => update(prev => ({ ...prev, groom: { ...prev.groom, name: e.target.value } }))}
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest mb-1.5" style={{ color: '#9A8F80' }}>신부</label>
              <input
                type="text"
                placeholder="이름"
                className={inputCls}
                style={inputStyle}
                value={data.bride.name}
                onChange={e => update(prev => ({ ...prev, bride: { ...prev.bride, name: e.target.value } }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] tracking-widest mb-1.5" style={{ color: '#9A8F80' }}>예식 날짜</label>
              <input
                type="date"
                className={inputCls}
                style={inputStyle}
                value={data.weddingDate}
                onChange={e => update(prev => ({ ...prev, weddingDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest mb-1.5" style={{ color: '#9A8F80' }}>예식 시간</label>
              <input
                type="time"
                className={inputCls}
                style={inputStyle}
                value={data.weddingTime}
                onChange={e => update(prev => ({ ...prev, weddingTime: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ② 인사말 */}
      <section>
        <SectionHeader num={2} title="인사말" />
        <textarea
          rows={6}
          placeholder="서로가 마주보며 다진 사랑을 이제 함께&#10;한 곳을 바라보며 걸어가려 합니다.&#10;&#10;저희의 새로운 시작을&#10;축복해주시면 감사하겠습니다."
          className={`${inputCls} resize-none leading-relaxed`}
          style={{ ...inputStyle, fontFamily: 'Gowun Batang, serif', fontSize: '13px' }}
          value={data.greeting.content}
          onChange={e => update(prev => ({ ...prev, greeting: { ...prev.greeting, content: e.target.value } }))}
        />
      </section>

      <Divider />

      {/* ③ 예식 장소 */}
      <section>
        <SectionHeader num={3} title="예식 장소" />
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] tracking-widest mb-1.5" style={{ color: '#9A8F80' }}>예식장 / 홀</label>
            <input
              type="text"
              placeholder="더채플앳논현 3F 그랜드홀"
              className={inputCls}
              style={inputStyle}
              value={data.location.name}
              onChange={e => update(prev => ({ ...prev, location: { ...prev.location, name: e.target.value } }))}
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest mb-1.5" style={{ color: '#9A8F80' }}>주소</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="주소를 검색하세요"
                className={`${inputCls} flex-1`}
                style={inputStyle}
                value={data.location.address}
                onChange={e => update(prev => ({ ...prev, location: { ...prev.location, address: e.target.value, lat: undefined, lng: undefined } }))}
              />
              <button
                type="button"
                onClick={handleAddressSearch}
                className="flex-shrink-0 px-3 py-2 text-[11px] rounded-lg border transition-colors hover:bg-[#F4F0E8]"
                style={{ borderColor: '#E6DDCE', color: '#9A8F80' }}
              >
                검색
              </button>
            </div>
            {data.location.lat != null && (
              <p className="mt-1 text-[10px]" style={{ color: '#8C9E76' }}>✓ 지도 위치 확인됨</p>
            )}
          </div>
        </div>
      </section>

      <Divider />

      {/* ④ 마음 전하실 곳 */}
      <section>
        <SectionHeader num={4} title="마음 전하실 곳" />
        <div className="space-y-4">
          <AccountInput
            label="신랑측"
            bankName={data.groom.bankInfo?.bankName || ''}
            accountNumber={data.groom.bankInfo?.accountNumber || ''}
            accountHolder={data.groom.bankInfo?.accountHolder || ''}
            onBankName={v => update(prev => ({ ...prev, groom: { ...prev.groom, bankInfo: { ...(prev.groom.bankInfo || { bankName: '', accountNumber: '', accountHolder: '' }), bankName: v } } }))}
            onAccountNumber={v => update(prev => ({ ...prev, groom: { ...prev.groom, bankInfo: { ...(prev.groom.bankInfo || { bankName: '', accountNumber: '', accountHolder: '' }), accountNumber: v } } }))}
            onAccountHolder={v => update(prev => ({ ...prev, groom: { ...prev.groom, bankInfo: { ...(prev.groom.bankInfo || { bankName: '', accountNumber: '', accountHolder: '' }), accountHolder: v } } }))}
          />
          <AccountInput
            label="신부측"
            bankName={data.bride.bankInfo?.bankName || ''}
            accountNumber={data.bride.bankInfo?.accountNumber || ''}
            accountHolder={data.bride.bankInfo?.accountHolder || ''}
            onBankName={v => update(prev => ({ ...prev, bride: { ...prev.bride, bankInfo: { ...(prev.bride.bankInfo || { bankName: '', accountNumber: '', accountHolder: '' }), bankName: v } } }))}
            onAccountNumber={v => update(prev => ({ ...prev, bride: { ...prev.bride, bankInfo: { ...(prev.bride.bankInfo || { bankName: '', accountNumber: '', accountHolder: '' }), accountNumber: v } } }))}
            onAccountHolder={v => update(prev => ({ ...prev, bride: { ...prev.bride, bankInfo: { ...(prev.bride.bankInfo || { bankName: '', accountNumber: '', accountHolder: '' }), accountHolder: v } } }))}
          />
        </div>
      </section>

      <Divider />

      {/* ⑤ 테마 색감 */}
      <section>
        <SectionHeader num={5} title="테마 색감" />
        <div className="grid grid-cols-4 gap-x-3 gap-y-4 mb-3">
          {TEMPLATES.map(tpl => {
            const selected = (data.template ?? 'ivory') === tpl.key;
            return (
              <button
                key={tpl.key}
                type="button"
                title={tpl.name}
                onClick={() => update(prev => ({ ...prev, template: tpl.key }))}
                className="flex flex-col items-center gap-1.5 transition-all"
              >
                <div
                  className="w-10 h-10 rounded-full transition-all"
                  style={{
                    background: tpl.accent,
                    boxShadow: selected
                      ? `0 0 0 2px #fff, 0 0 0 4px ${tpl.accent}`
                      : '0 0 0 1px #E8E0D2',
                  }}
                />
                <span className="text-[9px]" style={{ color: selected ? tpl.accent : '#A89C8C' }}>
                  {tpl.name}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[11px]" style={{ color: '#A89C8C' }}>
          청첩장 전체 색감이 바로 바뀝니다.
        </p>
      </section>

      <Divider />

      {/* 갤러리 */}
      <section>
        <SectionHeader num={6} title="갤러리 사진" />
        <div className="grid grid-cols-3 gap-2 mb-3">
          {data.galleryImages.map((src, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border" style={{ borderColor: '#E8E0D2' }}>
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeGalleryImage(idx)}
                className="absolute inset-0 bg-black/40 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                삭제
              </button>
            </div>
          ))}
          {data.galleryImages.length < 8 && (
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-colors hover:bg-[#F4F0E8]"
              style={{ borderColor: '#E6DDCE' }}
            >
              <span className="text-xl" style={{ color: '#C9A36B' }}>+</span>
              <span className="text-[9px] mt-1" style={{ color: '#A89C8C' }}>사진 추가</span>
            </button>
          )}
        </div>
        <input
          ref={galleryInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleGalleryUpload}
        />
        <p className="text-[10px]" style={{ color: '#A89C8C' }}>
          최대 8장 · PNG, JPG 업로드
        </p>
      </section>

      {/* 발행 버튼 */}
      <div className="pt-4 pb-8">
        <button
          type="button"
          onClick={() => onPublish(data)}
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl text-sm font-medium tracking-wide transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: '#C9A36B',
            color: '#fff',
            fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
          }}
        >
          {isSubmitting ? '발행 중…' : '청첩장 발행하기'}
        </button>
      </div>
    </div>
  );
};

const Divider = () => (
  <div className="border-t" style={{ borderColor: '#EDE8DF' }} />
);

interface AccountInputProps {
  label: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  onBankName: (v: string) => void;
  onAccountNumber: (v: string) => void;
  onAccountHolder: (v: string) => void;
}

const AccountInput: React.FC<AccountInputProps> = ({
  label, bankName, accountNumber, accountHolder,
  onBankName, onAccountNumber, onAccountHolder,
}) => (
  <div className="p-4 rounded-xl space-y-2.5" style={{ background: '#F4F0E8' }}>
    <p className="text-[10px] tracking-widest font-medium" style={{ color: '#9A8F80' }}>{label}</p>
    <div className="grid grid-cols-3 gap-2">
      <input
        type="text"
        placeholder="은행명"
        className={`${inputCls} col-span-1`}
        style={{ ...inputStyle, background: '#fff', fontSize: '12px' }}
        value={bankName}
        onChange={e => onBankName(e.target.value)}
      />
      <input
        type="text"
        placeholder="계좌번호"
        className={`${inputCls} col-span-2 font-mono`}
        style={{ ...inputStyle, background: '#fff', fontSize: '12px' }}
        value={accountNumber}
        onChange={e => onAccountNumber(e.target.value)}
      />
    </div>
    <input
      type="text"
      placeholder="예금주"
      className={inputCls}
      style={{ ...inputStyle, background: '#fff', fontSize: '12px' }}
      value={accountHolder}
      onChange={e => onAccountHolder(e.target.value)}
    />
  </div>
);

export default EditorPanel;
