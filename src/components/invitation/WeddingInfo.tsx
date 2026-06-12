import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface Props {
  date: string;
  time: string;
  location: { name: string; address: string; detailAddress?: string };
}

const WeddingInfo: React.FC<Props> = ({ date, time, location }) => {
  const d = date ? new Date(date) : null;
  const formattedDate = d && !isNaN(d.getTime())
    ? d.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '2026년 10월 24일';

  return (
    <section className="py-20 bg-[#FAF9F7] px-8 text-center">
      <h2 className="text-xl tracking-[0.2em] text-wedding-accent mb-12">LOCATION</h2>
      
      <div className="space-y-8 serif">
        <div className="flex flex-col items-center gap-2">
          <Calendar className="w-5 h-5 text-wedding-accent mb-1" strokeWidth={1.5} />
          <p className="text-lg">{formattedDate}</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Clock className="w-5 h-5 text-wedding-accent mb-1" strokeWidth={1.5} />
          <p className="text-lg">{time || "오후 12:30"}</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <MapPin className="w-5 h-5 text-wedding-accent mb-1" strokeWidth={1.5} />
          <p className="text-lg font-bold">{location.name}</p>
          <p className="text-wedding-secondary text-sm">{location.address}</p>
          {location.detailAddress && (
            <p className="text-wedding-secondary text-sm">{location.detailAddress}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default WeddingInfo;
