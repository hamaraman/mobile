import React, { useState } from 'react';
import type { Person } from '../../types/wedding';
import { copyToClipboard } from '../../utils/clipboard';
import { ChevronDown, ChevronUp, Copy } from 'lucide-react';

interface Props {
  groom: Person;
  bride: Person;
}

const AccountItem = ({ person, label, onCopy }: { person: Person, label: string, onCopy: (text: string) => void }) => (
  <div className="border-b border-gray-100 py-4 last:border-0">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm text-wedding-secondary">{label}</span>
      <span className="font-medium">{person.name}</span>
    </div>
    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
      <div className="text-sm">
        <p className="text-wedding-secondary">{person.bankInfo?.bankName || '신한은행'}</p>
        <p className="font-mono">{person.bankInfo?.accountNumber || '110-123-456789'}</p>
      </div>
      <button 
        onClick={() => onCopy(person.bankInfo?.accountNumber || '110-123-456789')}
        className="p-2 text-wedding-accent hover:bg-wedding-accent/10 rounded-full transition-colors"
      >
        <Copy className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const AccountInfo: React.FC<Props> = ({ groom, bride }) => {
  const [openSection, setOpenSection] = useState<'groom' | 'bride' | null>(null);

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      alert('계좌번호가 복사되었습니다.');
    }
  };

  return (
    <section className="py-20 px-6 bg-[#FAF9F7]">
      <h2 className="text-xl tracking-[0.2em] text-wedding-accent text-center mb-12">MAUM</h2>
      <p className="text-center serif text-sm text-wedding-secondary mb-12 leading-relaxed">
        축하의 마음을 담아 보냅니다.<br />
        전해주시는 따뜻한 마음 잊지 않고 잘 살겠습니다.
      </p>

      <div className="space-y-4 max-w-sm mx-auto">
        {/* Groom's side */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <button 
            onClick={() => setOpenSection(openSection === 'groom' ? null : 'groom')}
            className="w-full px-6 py-4 flex justify-between items-center text-wedding-primary"
          >
            <span className="serif">신랑측 마음 전하실 곳</span>
            {openSection === 'groom' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {openSection === 'groom' && (
            <div className="px-6 pb-4">
              <AccountItem person={groom} label="신랑" onCopy={handleCopy} />
            </div>
          )}
        </div>

        {/* Bride's side */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <button 
            onClick={() => setOpenSection(openSection === 'bride' ? null : 'bride')}
            className="w-full px-6 py-4 flex justify-between items-center text-wedding-primary"
          >
            <span className="serif">신부측 마음 전하실 곳</span>
            {openSection === 'bride' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {openSection === 'bride' && (
            <div className="px-6 pb-4">
              <AccountItem person={bride} label="신부" onCopy={handleCopy} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AccountInfo;

