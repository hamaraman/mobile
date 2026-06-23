import React, { useState } from 'react';
import type { Person } from '../../types/wedding';
import { copyToClipboard } from '../../utils/clipboard';
import { useToast } from '../../hooks/toastContext';
import { ChevronDown, ChevronUp, Copy } from 'lucide-react';
import OrnamentDivider from './OrnamentDivider';

interface Props {
  groom: Person;
  bride: Person;
}

const AccountItem = ({ person, label, onCopy }: { person: Person, label: string, onCopy: (text: string) => void }) => (
  <div className="border-t border-wedding-accent/15 py-4 first:border-0">
    <div className="flex justify-between items-center mb-3">
      <span className="text-[10px] tracking-[0.3em] text-wedding-secondary/65">{label}</span>
      <span className="font-serif text-sm tracking-wide text-wedding-primary">{person.name}</span>
    </div>
    <div className="flex justify-between items-center px-4 py-3 border border-wedding-accent/20">
      <div>
        <p className="text-[10px] tracking-widest text-wedding-secondary/60 mb-1">{person.bankInfo?.bankName || '신한은행'}</p>
        <p className="text-sm font-mono tracking-widest text-wedding-primary/85">{person.bankInfo?.accountNumber || '110-123-456789'}</p>
      </div>
      <button
        onClick={() => onCopy(person.bankInfo?.accountNumber || '110-123-456789')}
        className="p-2 text-wedding-accent/50 hover:text-wedding-accent transition-colors"
        aria-label={`${person.name} 계좌번호 복사`}
      >
        <Copy className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

const AccountInfo: React.FC<Props> = ({ groom, bride }) => {
  const { toast } = useToast();
  const [openSection, setOpenSection] = useState<'groom' | 'bride' | null>(null);

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast('계좌번호가 복사되었습니다.');
    } else {
      toast('복사에 실패했습니다.', 'error');
    }
  };

  return (
    <section className="py-24 px-6" style={{ background: 'var(--t-page-bg, #FFFFFF)' }}>
      <div className="text-center mb-14">
        <p className="text-[9px] tracking-[0.45em] text-wedding-accent uppercase mb-4">Maeum</p>
        <p className="font-serif text-[13px] text-wedding-secondary/75 leading-[1.9]">
          축하의 마음을 담아 보냅니다.<br />
          전해주시는 따뜻한 마음 잊지 않겠습니다.
        </p>
        <OrnamentDivider size="sm" className="max-w-[140px] mx-auto mt-8" />
      </div>

      <div className="space-y-3 max-w-sm mx-auto">
        <div className="border border-wedding-accent/20 overflow-hidden">
          <button
            onClick={() => setOpenSection(openSection === 'groom' ? null : 'groom')}
            className="w-full px-6 py-4 flex justify-between items-center"
          >
            <span className="text-[11px] tracking-[0.28em] font-light text-wedding-primary">신랑측 마음 전하실 곳</span>
            {openSection === 'groom'
              ? <ChevronUp className="w-3.5 h-3.5 text-wedding-accent/55" />
              : <ChevronDown className="w-3.5 h-3.5 text-wedding-accent/55" />}
          </button>
          {openSection === 'groom' && (
            <div className="px-6 pb-5">
              <AccountItem person={groom} label="신랑" onCopy={handleCopy} />
            </div>
          )}
        </div>

        <div className="border border-wedding-accent/20 overflow-hidden">
          <button
            onClick={() => setOpenSection(openSection === 'bride' ? null : 'bride')}
            className="w-full px-6 py-4 flex justify-between items-center"
          >
            <span className="text-[11px] tracking-[0.28em] font-light text-wedding-primary">신부측 마음 전하실 곳</span>
            {openSection === 'bride'
              ? <ChevronUp className="w-3.5 h-3.5 text-wedding-accent/55" />
              : <ChevronDown className="w-3.5 h-3.5 text-wedding-accent/55" />}
          </button>
          {openSection === 'bride' && (
            <div className="px-6 pb-5">
              <AccountItem person={bride} label="신부" onCopy={handleCopy} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AccountInfo;
