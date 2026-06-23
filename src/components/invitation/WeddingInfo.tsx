import React from 'react';
import OrnamentDivider from './OrnamentDivider';

interface Props {
  date: string;
  time: string;
  location: { name: string; address: string; detailAddress?: string };
}

const WeddingInfo: React.FC<Props> = ({ date, time, location }) => {
  const d = date ? new Date(date) : null;
  const formattedDate = d && !isNaN(d.getTime())
    ? d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : '2026년 10월 24일';

  const weekday = d && !isNaN(d.getTime())
    ? d.toLocaleDateString('ko-KR', { weekday: 'long' })
    : '';

  return (
    <section className="py-24 px-8 text-center" style={{ background: 'var(--t-section-bg, #FAF9F7)' }}>
      <div className="mb-14">
        <p className="text-[9px] tracking-[0.45em] text-wedding-accent uppercase">Invitation</p>
        <OrnamentDivider size="sm" className="max-w-[140px] mx-auto mt-5" />
      </div>

      <div className="max-w-xs mx-auto space-y-10">
        <div className="space-y-2">
          <p className="text-[9px] tracking-[0.4em] text-wedding-secondary/60 uppercase mb-4">Date &amp; Time</p>
          <p className="font-serif text-xl font-light tracking-wide text-wedding-primary">{formattedDate}</p>
          {weekday && (
            <p className="text-xs tracking-[0.2em] text-wedding-secondary/70">{weekday}</p>
          )}
          <p className="font-serif text-lg tracking-widest text-wedding-primary/75 mt-2">{time || '오후 12:30'}</p>
        </div>

        <div className="w-px h-8 bg-wedding-accent/25 mx-auto" />

        <div className="space-y-2">
          <p className="text-[9px] tracking-[0.4em] text-wedding-secondary/60 uppercase mb-4">Venue</p>
          <p className="font-serif text-xl font-light tracking-wide text-wedding-primary">{location.name}</p>
          <p className="text-sm text-wedding-secondary/75 tracking-wide mt-2 leading-relaxed">{location.address}</p>
          {location.detailAddress && (
            <p className="text-sm text-wedding-secondary/60 tracking-wide">{location.detailAddress}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default WeddingInfo;
