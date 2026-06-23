import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import OrnamentDivider from './OrnamentDivider';

interface Props {
  images: string[];
}

const Gallery: React.FC<Props> = ({ images }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = React.useRef<number | null>(null);

  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&auto=format&fit=crop',
  ];

  const goPrev = () => setLightboxIndex(i => (i !== null && i > 0 ? i - 1 : i));
  const goNext = () => setLightboxIndex(i => (i !== null && i < displayImages.length - 1 ? i + 1 : i));

  const prev = (e: React.MouseEvent) => { e.stopPropagation(); goPrev(); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); goNext(); };

  // 키보드 탐색 + 라이트박스 열린 동안 스크롤 잠금
  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex === null]);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 50) goPrev();
    else if (dx < -50) goNext();
    touchStartX.current = null;
  };

  return (
    <section className="py-24 px-4" style={{ background: 'var(--t-section-bg, #FAF9F7)' }}>
      <div className="text-center mb-12 px-4">
        <p className="text-[9px] tracking-[0.45em] text-wedding-accent uppercase mb-5">Gallery</p>
        <OrnamentDivider size="sm" className="max-w-[140px] mx-auto" />
      </div>

      <div className="grid grid-cols-2 gap-1">
        {displayImages.map((src, idx) => (
          <motion.div
            key={idx}
            className="overflow-hidden bg-gray-100 cursor-pointer"
            style={{ aspectRatio: '3/4' }}
            onClick={() => setLightboxIndex(idx)}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '0px 0px -8% 0px' }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: (idx % 2) * 0.08 + Math.floor(idx / 2) * 0.04 }}
          >
            <img
              src={src}
              alt={`Gallery ${idx + 1}`}
              className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-700"
            />
          </motion.div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="사진 크게 보기"
        >
          <button
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors z-10 p-1"
            onClick={() => setLightboxIndex(null)}
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>

          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 text-white/70 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 rounded-full p-2"
              onClick={prev}
              aria-label="이전 사진"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <img
            src={displayImages[lightboxIndex]}
            alt={`Gallery ${lightboxIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain select-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          />

          {lightboxIndex < displayImages.length - 1 && (
            <button
              className="absolute right-4 text-white/70 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 rounded-full p-2"
              onClick={next}
              aria-label="다음 사진"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div className="absolute bottom-6 flex gap-2 items-center">
            {displayImages.map((_, i) => (
              <button
                key={i}
                className={`h-px rounded-none transition-all duration-300 ${
                  i === lightboxIndex ? 'bg-white w-8' : 'bg-white/35 w-2'
                }`}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                aria-label={`${i + 1}번째 사진으로 이동`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
