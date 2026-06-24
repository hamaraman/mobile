import React from 'react';
import type { DesignStyle } from '../../types/wedding';

interface Props {
  className?: string;
  size?: 'sm' | 'md';
  design?: DesignStyle;
}

/* 미니멀: 얇은 선만 */
const MinimalDivider = () => (
  <div className="w-16 h-px bg-wedding-accent/30 mx-auto" />
);

/* 클래식: 별 오너먼트 + 양쪽 선 (기존) */
const ClassicDivider = () => (
  <div className="flex items-center gap-4">
    <div className="flex-1 h-px bg-wedding-accent/25" />
    <svg width="12" height="12" viewBox="0 0 12 12" className="text-wedding-accent/55 flex-shrink-0" fill="currentColor">
      <path d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8L6 0Z" />
    </svg>
    <div className="flex-1 h-px bg-wedding-accent/25" />
  </div>
);

/* 로맨틱: 작은 꽃 + 양쪽 점선 */
const RomanticDivider = () => (
  <div className="flex items-center gap-3">
    <div className="flex-1 flex gap-1 justify-end">
      {[0,1,2].map(i => <div key={i} className="w-1 h-1 rounded-full bg-wedding-accent/30" />)}
    </div>
    <svg width="20" height="20" viewBox="0 0 20 20" className="text-wedding-accent/60 flex-shrink-0" fill="currentColor">
      <path d="M10 2C10 2 8 6 10 10C12 6 10 2 10 2Z" />
      <path d="M10 18C10 18 8 14 10 10C12 14 10 18 10 18Z" />
      <path d="M2 10C2 10 6 8 10 10C6 12 2 10 2 10Z" />
      <path d="M18 10C18 10 14 8 10 10C14 12 18 10 18 10Z" />
      <circle cx="10" cy="10" r="2" opacity="0.7" />
    </svg>
    <div className="flex-1 flex gap-1">
      {[0,1,2].map(i => <div key={i} className="w-1 h-1 rounded-full bg-wedding-accent/30" />)}
    </div>
  </div>
);

/* 모던: 이중 선 */
const ModernDivider = () => (
  <div className="flex flex-col items-center gap-1">
    <div className="w-20 h-px bg-wedding-accent/60" />
    <div className="w-10 h-px bg-wedding-accent/25" />
  </div>
);

const OrnamentDivider: React.FC<Props> = ({ className = '', design = 'classic' }) => (
  <div className={className}>
    {design === 'minimal'  && <MinimalDivider />}
    {design === 'classic'  && <ClassicDivider />}
    {design === 'romantic' && <RomanticDivider />}
    {design === 'modern'   && <ModernDivider />}
  </div>
);

export default OrnamentDivider;
