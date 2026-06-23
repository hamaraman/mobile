import React from 'react';

interface Props {
  className?: string;
  size?: 'sm' | 'md';
}

const OrnamentDivider: React.FC<Props> = ({ className = '', size = 'md' }) => (
  <div className={`flex items-center gap-4 ${size === 'sm' ? 'my-0' : 'my-0'} ${className}`}>
    <div className="flex-1 h-px bg-wedding-accent/25" />
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className="text-wedding-accent/55 flex-shrink-0"
      fill="currentColor"
    >
      <path d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8L6 0Z" />
    </svg>
    <div className="flex-1 h-px bg-wedding-accent/25" />
  </div>
);

export default OrnamentDivider;
