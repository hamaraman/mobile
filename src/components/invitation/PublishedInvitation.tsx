import { useEffect, useState } from 'react';
import type { WeddingData } from '../../types/wedding';
import { fetchInvitation } from '../../utils/api';
import InvitationView from './InvitationView';

// ?id=xxx 공유 링크로 들어온 방문자에게 서버에 저장된 청첩장을 보여준다.
export default function PublishedInvitation({ id }: { id: string }) {
  const [data, setData] = useState<WeddingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchInvitation(id)
      .then(d => { if (active) setData(d); })
      .catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCFAF7] text-center px-6 gap-3">
        <p className="text-lg font-serif text-wedding-primary">청첩장을 찾을 수 없습니다</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAF7]">
        <p className="text-sm text-gray-400 animate-pulse font-serif tracking-widest">불러오는 중…</p>
      </div>
    );
  }

  return <InvitationView data={data} />;
}
