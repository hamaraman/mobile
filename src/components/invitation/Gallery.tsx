import React from 'react';

interface Props {
  images: string[];
}

const Gallery: React.FC<Props> = ({ images }) => {
  // Use placeholder images if none provided
  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&auto=format&fit=crop',
  ];

  return (
    <section className="py-20 px-4">
      <h2 className="text-xl tracking-[0.2em] text-wedding-accent text-center mb-12">GALLERY</h2>
      
      <div className="grid grid-cols-2 gap-2">
        {displayImages.map((src, idx) => (
          <div key={idx} className="aspect-[3/4] overflow-hidden bg-gray-100">
            <img 
              src={src} 
              alt={`Gallery ${idx + 1}`} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
