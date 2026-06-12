import React from 'react';
import type { WeddingData } from '../../types/wedding';
import { motion } from 'framer-motion';

interface Props {
  data: WeddingData;
}

const MainVisual: React.FC<Props> = ({ data }) => {
  const date = data.weddingDate ? new Date(data.weddingDate) : null;
  const formattedDate = date && !isNaN(date.getTime()) 
    ? date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      })
    : '2026년 10월 24일 토요일';

  return (
    <section className="relative h-[80vh] flex flex-col items-center justify-center bg-[#FDFBF7] overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center z-10 space-y-4"
      >
        <p className="tracking-[0.3em] text-sm text-wedding-secondary mb-2">WEDDING DAY</p>
        <h1 className="text-4xl md:text-5xl font-serif text-wedding-primary">
          {data.groom.name} <span className="text-2xl align-middle mx-1">&</span> {data.bride.name}
        </h1>
        <div className="w-px h-12 bg-wedding-accent mx-auto my-6"></div>
        <p className="serif text-lg text-wedding-secondary">
          {formattedDate}
        </p>
        <p className="serif text-lg text-wedding-secondary">
          {data.location.name}
        </p>
      </motion.div>
      
      {/* Abstract decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-wedding-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-wedding-accent/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default MainVisual;
