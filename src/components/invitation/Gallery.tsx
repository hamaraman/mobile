import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  images: string[];
}

const Gallery: React.FC<Props> = ({ images }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&auto=format&fit=crop',
  ];

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex(i => (i !== null && i > 0 ? i - 1 : i));
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex(i => (i !== null && i < displayImages.length - 1 ? i + 1 : i));
  };

  return (
    <section className="py-20 px-4">
      <h2 className="text-xl tracking-[0.2em] text-wedding-accent text-center mb-12">GALLERY</h2>

      <div className="grid grid-cols-2 gap-2">
        {displayImages.map((src, idx) => (
          <div
            key={idx}
            className="aspect-[3/4] overflow-hidden bg-gray-100 cursor-pointer"
            onClick={() => setLightboxIndex(idx)}
          >
            <img
              src={src}
              alt={`Gallery ${idx + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-5 right-5 text-white/80 hover:text-white transition-colors z-10 p-1"
            onClick={() => setLightboxIndex(null)}
          >
            <X className="w-7 h-7" />
          </button>

          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 text-white/80 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 rounded-full p-2"
              onClick={prev}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <img
            src={displayImages[lightboxIndex]}
            alt={`Gallery ${lightboxIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain select-none"
            onClick={(e) => e.stopPropagation()}
          />

          {lightboxIndex < displayImages.length - 1 && (
            <button
              className="absolute right-4 text-white/80 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 rounded-full p-2"
              onClick={next}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <div className="absolute bottom-6 flex gap-2">
            {displayImages.map((_, i) => (
              <button
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === lightboxIndex ? 'bg-white w-5' : 'bg-white/40 w-1.5'
                }`}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
