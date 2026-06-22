import React, { useState } from 'react';
import type { WeddingData, Person } from '../../types/wedding';
import { TEMPLATES } from '../../utils/templates';
import { resizeImage } from '../../utils/image';
import { useToast } from '../../hooks/toastContext';

interface Props {
  onComplete: (data: WeddingData) => void;
  onChange?: (data: WeddingData) => void;
  initialData?: WeddingData;
  isSubmitting?: boolean;
}

const InvitationForm: React.FC<Props> = ({ onComplete, onChange, initialData, isSubmitting }) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<WeddingData>(initialData || {
    groom: { name: '', phoneNumber: '' },
    bride: { name: '', phoneNumber: '' },
    groomParents: { father: { name: '', phoneNumber: '' }, mother: { name: '', phoneNumber: '' } },
    brideParents: { father: { name: '', phoneNumber: '' }, mother: { name: '', phoneNumber: '' } },
    weddingDate: '',
    weddingTime: '',
    location: { name: '', address: '', detailAddress: '' },
    greeting: { title: '모시는 글', content: '' },
    galleryImages: [],
    template: 'minimal',
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const handleUpdate = (updater: (prev: WeddingData) => WeddingData) => {
    setFormData(prev => {
      const next = updater(prev);
      onChange?.(next);
      return next;
    });
  };

  const updatePerson = (target: 'groom' | 'bride' | 'groomParents.father' | 'groomParents.mother' | 'brideParents.father' | 'brideParents.mother', field: keyof Person, value: string) => {
    handleUpdate(prev => {
      const next = { ...prev };
      if (target === 'groom') next.groom = { ...next.groom, [field]: value };
      else if (target === 'bride') next.bride = { ...next.bride, [field]: value };
      else if (target === 'groomParents.father') {
        next.groomParents.father = { ...(next.groomParents.father || { name: '', phoneNumber: '' }), [field]: value } as Person;
      }
      else if (target === 'groomParents.mother') {
        next.groomParents.mother = { ...(next.groomParents.mother || { name: '', phoneNumber: '' }), [field]: value } as Person;
      }
      else if (target === 'brideParents.father') {
        next.brideParents.father = { ...(next.brideParents.father || { name: '', phoneNumber: '' }), [field]: value } as Person;
      }
      else if (target === 'brideParents.mother') {
        next.brideParents.mother = { ...(next.brideParents.mother || { name: '', phoneNumber: '' }), [field]: value } as Person;
      }
      return next;
    });
  };

  const updateBankInfo = (target: 'groom' | 'bride', field: string, value: string) => {
    handleUpdate(prev => {
      const next = { ...prev };
      if (target === 'groom') {
        const currentBankInfo = next.groom.bankInfo || { bankName: '', accountNumber: '', accountHolder: '' };
        next.groom = { 
          ...next.groom, 
          bankInfo: { ...currentBankInfo, [field]: value }
        };
      } else {
        const currentBankInfo = next.bride.bankInfo || { bankName: '', accountNumber: '', accountHolder: '' };
        next.bride = { 
          ...next.bride, 
          bankInfo: { ...currentBankInfo, [field]: value }
        };
      }
      return next;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selected = Array.from(files);
    e.target.value = ''; // allow re-selecting the same file later

    let failed = 0;
    for (const file of selected) {
      try {
        const base64 = await resizeImage(file);
        handleUpdate(prev => ({ ...prev, galleryImages: [...prev.galleryImages, base64] }));
      } catch {
        failed += 1;
      }
    }

    if (failed > 0) {
      toast(`${failed}장의 이미지를 불러오지 못했습니다.`, 'error');
    } else if (selected.length > 0) {
      toast(`${selected.length}장의 사진을 추가했습니다.`);
    }
  };

  const removeImage = (index: number) => {
    handleUpdate(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FCFAF7] px-6 py-20 flex flex-col font-sans text-wedding-primary">
      {/* Editorial Header */}
      <header className="text-center mb-16 space-y-3">
        <span className="text-[10px] tracking-[0.4em] text-wedding-accent font-bold uppercase">The Beginning of Forever</span>
        <h1 className="text-4xl font-serif font-light tracking-tight">Our Story</h1>
        <div className="w-8 h-[1px] bg-wedding-accent/40 mx-auto mt-6"></div>
      </header>

      {/* Modern Progress Bar */}
      <div className="relative w-full h-[2px] bg-gray-100 mb-16">
        <div 
          className="absolute top-0 left-0 h-full bg-wedding-accent transition-all duration-700 ease-in-out"
          style={{ width: `${(step / 6) * 100}%` }}
        />
        <div className="absolute -top-6 w-full flex justify-between px-1">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <span key={i} className={`text-[9px] tracking-tighter ${step >= i ? 'text-wedding-accent' : 'text-gray-300'}`}>
              0{i}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="space-y-12">
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <section className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif italic text-wedding-primary/80">The Couple</h2>
                  <p className="text-xs text-wedding-secondary/70 serif">기록의 시작, 두 분의 이름을 남겨주세요.</p>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-widest text-wedding-accent font-bold">Template</label>
                  <div className="grid grid-cols-5 gap-2">
                    {TEMPLATES.map(tpl => {
                      const isSelected = (formData.template ?? 'minimal') === tpl.key;
                      return (
                        <button
                          key={tpl.key}
                          type="button"
                          onClick={() => handleUpdate(prev => ({ ...prev, template: tpl.key }))}
                          className="flex flex-col items-center gap-1.5 transition-all duration-200"
                          style={{ opacity: isSelected ? 1 : 0.6 }}
                        >
                          <div
                            className="w-full aspect-[3/4] rounded-lg overflow-hidden flex flex-col transition-all duration-200"
                            style={{
                              background: tpl.mainBg,
                              boxShadow: isSelected
                                ? `0 0 0 2px ${tpl.accent}`
                                : '0 0 0 1px #e5e7eb',
                            }}
                          >
                            <div className="flex-1 flex flex-col items-center justify-center gap-1 px-1">
                              <div className="w-4 h-[1px]" style={{ background: tpl.accent }} />
                              <div className="w-5 h-[5px] rounded-full" style={{ background: tpl.primary, opacity: 0.3 }} />
                              <div className="w-3 h-[3px] rounded-full" style={{ background: tpl.secondary, opacity: 0.3 }} />
                            </div>
                            <div className="h-2 w-full" style={{ background: tpl.sectionBg }} />
                          </div>
                          <span className="text-[9px] tracking-tight" style={{ color: isSelected ? tpl.accent : '#9CA3AF' }}>
                            {tpl.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="space-y-12">
                  <div className="group relative">
                    <label className="absolute -top-2 left-0 text-[9px] uppercase tracking-[0.2em] text-wedding-accent font-bold transition-all group-focus-within:text-wedding-primary">Groom</label>
                    <div className="flex gap-4 border-b border-gray-200 py-2 group-focus-within:border-wedding-accent transition-all">
                      <input 
                        type="text" placeholder="성함"
                        className="flex-1 bg-transparent outline-none text-base placeholder:text-gray-300"
                        value={formData.groom.name}
                        onChange={e => updatePerson('groom', 'name', e.target.value)}
                        required
                      />
                      <input 
                        type="tel" placeholder="연락처"
                        className="w-32 bg-transparent outline-none text-sm text-right placeholder:text-gray-300"
                        value={formData.groom.phoneNumber}
                        onChange={e => updatePerson('groom', 'phoneNumber', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="group relative">
                    <label className="absolute -top-2 left-0 text-[9px] uppercase tracking-[0.2em] text-wedding-accent font-bold transition-all group-focus-within:text-wedding-primary">Bride</label>
                    <div className="flex gap-4 border-b border-gray-200 py-2 group-focus-within:border-wedding-accent transition-all">
                      <input 
                        type="text" placeholder="성함"
                        className="flex-1 bg-transparent outline-none text-base placeholder:text-gray-300"
                        value={formData.bride.name}
                        onChange={e => updatePerson('bride', 'name', e.target.value)}
                        required
                      />
                      <input 
                        type="tel" placeholder="연락처"
                        className="w-32 bg-transparent outline-none text-sm text-right placeholder:text-gray-300"
                        value={formData.bride.phoneNumber}
                        onChange={e => updatePerson('bride', 'phoneNumber', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </section>
              <button type="button" onClick={nextStep} className="w-full bg-wedding-primary text-white py-5 text-sm tracking-[0.2em] uppercase font-light hover:bg-black transition-all">Next Chapter</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <section className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif italic text-wedding-primary/80">The Parents</h2>
                  <p className="text-xs text-wedding-secondary/70 serif">감사의 마음을 담아 부모님 성함을 모십니다.</p>
                </div>

                <div className="space-y-12">
                  <div className="space-y-6">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-wedding-accent/60">Groom's Side</span>
                    <div className="grid grid-cols-2 gap-8">
                      <input 
                        type="text" placeholder="아버님"
                        className="bg-transparent border-b border-gray-200 py-2 outline-none focus:border-wedding-accent transition-all text-sm"
                        value={formData.groomParents.father?.name}
                        onChange={e => updatePerson('groomParents.father', 'name', e.target.value)}
                      />
                      <input 
                        type="text" placeholder="어머님"
                        className="bg-transparent border-b border-gray-200 py-2 outline-none focus:border-wedding-accent transition-all text-sm"
                        value={formData.groomParents.mother?.name}
                        onChange={e => updatePerson('groomParents.mother', 'name', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-wedding-accent/60">Bride's Side</span>
                    <div className="grid grid-cols-2 gap-8">
                      <input 
                        type="text" placeholder="아버님"
                        className="bg-transparent border-b border-gray-200 py-2 outline-none focus:border-wedding-accent transition-all text-sm"
                        value={formData.brideParents.father?.name}
                        onChange={e => updatePerson('brideParents.father', 'name', e.target.value)}
                      />
                      <input 
                        type="text" placeholder="어머님"
                        className="bg-transparent border-b border-gray-200 py-2 outline-none focus:border-wedding-accent transition-all text-sm"
                        value={formData.brideParents.mother?.name}
                        onChange={e => updatePerson('brideParents.mother', 'name', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={prevStep} className="w-24 text-[10px] uppercase tracking-widest text-gray-400 hover:text-wedding-primary transition-all">Back</button>
                <button type="button" onClick={nextStep} className="flex-1 bg-wedding-primary text-white py-5 text-sm tracking-[0.2em] uppercase font-light hover:bg-black transition-all">Continue</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <section className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif italic text-wedding-primary/80">Time & Place</h2>
                  <p className="text-xs text-wedding-secondary/70 serif">아름다운 약속이 맺어질 그곳입니다.</p>
                </div>

                <div className="space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-wedding-accent font-bold">Date</label>
                      <input 
                        type="date" 
                        className="w-full bg-transparent border-b border-gray-200 py-2 text-sm outline-none focus:border-wedding-accent transition-all"
                        value={formData.weddingDate}
                        onChange={e => handleUpdate(prev => ({ ...prev, weddingDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-wedding-accent font-bold">Time</label>
                      <input 
                        type="time" 
                        className="w-full bg-transparent border-b border-gray-200 py-2 text-sm outline-none focus:border-wedding-accent transition-all"
                        value={formData.weddingTime}
                        onChange={e => handleUpdate(prev => ({ ...prev, weddingTime: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-wedding-accent font-bold">Venue</label>
                    <input 
                      type="text" 
                      className="w-full bg-transparent border-b border-gray-200 py-2 text-sm outline-none focus:border-wedding-accent transition-all"
                      placeholder="예식장 이름을 입력하세요"
                      value={formData.location.name}
                      onChange={e => handleUpdate(prev => ({ ...prev, location: { ...prev.location, name: e.target.value } }))}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-wedding-accent font-bold">Address</label>
                    <input 
                      type="text" 
                      className="w-full bg-transparent border-b border-gray-200 py-2 text-sm outline-none focus:border-wedding-accent transition-all"
                      placeholder="도로명 주소"
                      value={formData.location.address}
                      onChange={e => handleUpdate(prev => ({ ...prev, location: { ...prev.location, address: e.target.value } }))}
                      required
                    />
                  </div>
                </div>
              </section>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={prevStep} className="w-24 text-[10px] uppercase tracking-widest text-gray-400 hover:text-wedding-primary transition-all">Back</button>
                <button type="button" onClick={nextStep} className="flex-1 bg-wedding-primary text-white py-5 text-sm tracking-[0.2em] uppercase font-light hover:bg-black transition-all">Continue</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <section className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif italic text-wedding-primary/80">Message</h2>
                  <p className="text-xs text-wedding-secondary/70 serif">서로에게, 그리고 소중한 분들께 전하는 글입니다.</p>
                </div>

                <div className="space-y-8">
                  <input 
                    type="text" 
                    className="w-full bg-transparent border-b border-gray-200 py-2 text-lg outline-none focus:border-wedding-accent transition-all font-serif italic"
                    placeholder="제목 (예: 모시는 글)"
                    value={formData.greeting.title}
                    onChange={e => handleUpdate(prev => ({ ...prev, greeting: { ...prev.greeting, title: e.target.value } }))}
                  />
                  <textarea 
                    rows={10}
                    className="w-full bg-white/40 backdrop-blur-sm border border-gray-100 p-6 text-sm outline-none focus:border-wedding-accent transition-all font-serif leading-loose resize-none shadow-sm"
                    placeholder="두 사람이 하나가 되는 소중한 날..."
                    value={formData.greeting.content}
                    onChange={e => handleUpdate(prev => ({ ...prev, greeting: { ...prev.greeting, content: e.target.value } }))}
                  />
                </div>
              </section>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={prevStep} className="w-24 text-[10px] uppercase tracking-widest text-gray-400 hover:text-wedding-primary transition-all">Back</button>
                <button type="button" onClick={nextStep} className="flex-1 bg-wedding-primary text-white py-5 text-sm tracking-[0.2em] uppercase font-light hover:bg-black transition-all">Continue</button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <section className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif italic text-wedding-primary/80">Gratitude</h2>
                  <p className="text-xs text-wedding-secondary/70 serif">축하의 마음을 전달받을 계좌를 안내합니다.</p>
                </div>

                <div className="space-y-12">
                  <div className="space-y-6">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-wedding-accent">Groom's Side</span>
                    <div className="flex gap-4 border-b border-gray-100 py-2">
                      <input 
                        type="text" placeholder="은행명"
                        className="w-24 bg-transparent outline-none text-sm placeholder:text-gray-300"
                        value={formData.groom.bankInfo?.bankName || ''}
                        onChange={e => updateBankInfo('groom', 'bankName', e.target.value)}
                      />
                      <input 
                        type="text" placeholder="계좌번호"
                        className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-300 font-mono"
                        value={formData.groom.bankInfo?.accountNumber || ''}
                        onChange={e => updateBankInfo('groom', 'accountNumber', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-wedding-accent">Bride's Side</span>
                    <div className="flex gap-4 border-b border-gray-100 py-2">
                      <input 
                        type="text" placeholder="은행명"
                        className="w-24 bg-transparent outline-none text-sm placeholder:text-gray-300"
                        value={formData.bride.bankInfo?.bankName || ''}
                        onChange={e => updateBankInfo('bride', 'bankName', e.target.value)}
                      />
                      <input 
                        type="text" placeholder="계좌번호"
                        className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-300 font-mono"
                        value={formData.bride.bankInfo?.accountNumber || ''}
                        onChange={e => updateBankInfo('bride', 'accountNumber', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={prevStep} className="w-24 text-[10px] uppercase tracking-widest text-gray-400 hover:text-wedding-primary transition-all">Back</button>
                <button type="button" onClick={nextStep} className="flex-1 bg-wedding-primary text-white py-5 text-sm tracking-[0.2em] uppercase font-light hover:bg-black transition-all">Continue</button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <section className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif italic text-wedding-primary/80">Final Details</h2>
                  <p className="text-xs text-wedding-secondary/70 serif">아름다운 기록을 완성하는 마지막 단계입니다.</p>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[9px] uppercase tracking-widest text-wedding-accent font-bold">Gallery Images</label>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {formData.galleryImages.map((src, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 group">
                          <img src={src} alt="Uploaded" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] uppercase font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <label className="aspect-square rounded-lg border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all">
                        <span className="text-xl font-light text-gray-300">+</span>
                        <span className="text-[8px] uppercase tracking-widest text-gray-400 mt-1">Upload</span>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/png, image/jpeg" 
                          className="hidden" 
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                    <p className="text-[8px] text-gray-400 italic">PNG, JPG 파일을 업로드하거나 URL을 추가하세요.</p>
                    
                    <textarea
                      rows={2}
                      className="w-full bg-[#F9F9F9] border-none p-4 text-[10px] outline-none focus:ring-1 focus:ring-wedding-accent/30 transition-all leading-loose mt-4"
                      placeholder="외부 이미지 URL을 쉼표(,)로 구분하여 직접 입력할 수도 있습니다."
                      value={formData.galleryImages.filter(img => img.startsWith('http')).join(', ')}
                      onChange={e => {
                        const urls = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                        const base64Images = formData.galleryImages.filter(img => img.startsWith('data:'));
                        handleUpdate(prev => ({ ...prev, galleryImages: [...base64Images, ...urls] }));
                      }}
                    />
                  </div>

                </div>
              </section>

              <div className="flex gap-4 pt-8">
                <button type="button" onClick={prevStep} className="w-24 text-[10px] uppercase tracking-widest text-gray-400 hover:text-wedding-primary transition-all">Back</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-wedding-accent text-white py-5 text-sm tracking-[0.2em] font-bold hover:brightness-110 transition-all shadow-xl shadow-wedding-accent/20 disabled:opacity-60 disabled:cursor-not-allowed">{isSubmitting ? '발행 중…' : '청첩장 발행하기'}</button>
              </div>
            </div>
          )}
        </form>
      </div>
      
      <footer className="mt-20 text-center">
        <p className="text-[8px] tracking-[0.5em] text-wedding-secondary/40 uppercase">Elegance in Every Detail</p>
      </footer>
    </div>
  );
};

export default InvitationForm;
