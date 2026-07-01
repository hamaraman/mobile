import { useEffect, useState } from 'react';
import { fetchMyInvitations, deleteInvitation, type InvitationSummary } from '../../utils/api';
import { useAuth } from '../../hooks/authContext';
import { useToast } from '../../hooks/toastContext';

// 로그인 사용자의 청첩장 목록. 보기 / 수정 / 삭제 / 새로 만들기.
export default function MyInvitations({
  onEdit,
  onCreateNew,
}: {
  onEdit: (id: string) => void;
  onCreateNew: () => void;
}) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<InvitationSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchMyInvitations()
      .then(list => { if (active) setItems(list); })
      .catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('이 청첩장을 삭제할까요? 되돌릴 수 없습니다.')) return;
    setDeletingId(id);
    try {
      await deleteInvitation(id);
      setItems(prev => (prev ? prev.filter(x => x.id !== id) : prev));
      toast('청첩장을 삭제했습니다.');
    } catch (e) {
      toast(e instanceof Error ? e.message : '삭제에 실패했습니다.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (raw: string) => {
    if (!raw) return '날짜 미정';
    const d = new Date(raw);
    return isNaN(d.getTime())
      ? raw
      : d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7]">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white/70 backdrop-blur sticky top-0 z-10">
        <div className="flex flex-col">
          <span className="text-sm font-serif text-wedding-primary tracking-wide">내 청첩장</span>
          {user && <span className="text-[11px] text-gray-400">{user.name}님</span>}
        </div>
        <button
          onClick={() => { void logout().then(() => { window.location.href = '/'; }); }}
          className="text-[11px] text-gray-400 hover:text-wedding-primary transition-colors"
        >
          로그아웃
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-6 space-y-4">
        <button
          onClick={onCreateNew}
          className="w-full py-4 rounded-xl border border-dashed border-gray-300 text-sm text-gray-500 hover:border-wedding-primary hover:text-wedding-primary transition-all"
        >
          + 새 청첩장 만들기
        </button>

        {error && <p className="text-center text-sm text-gray-400 py-8">{error}</p>}

        {!error && items === null && (
          <p className="text-center text-sm text-gray-400 py-12 animate-pulse font-serif tracking-widest">불러오는 중…</p>
        )}

        {!error && items?.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-12">아직 만든 청첩장이 없어요.</p>
        )}

        {items?.map(item => {
          const names = [item.groomName, item.brideName].filter(Boolean).join(' ♥ ') || '무제 청첩장';
          return (
            <div key={item.id} className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-wedding-primary truncate">{names}</p>
                <p className="text-[12px] text-gray-400 mt-0.5">{formatDate(item.weddingDate)}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={`/?id=${encodeURIComponent(item.id)}`}
                  className="px-3 py-1.5 text-[12px] rounded-md text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  보기
                </a>
                <button
                  onClick={() => onEdit(item.id)}
                  className="px-3 py-1.5 text-[12px] rounded-md text-wedding-primary hover:bg-gray-50 transition-colors"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="px-3 py-1.5 text-[12px] rounded-md text-red-400 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {deletingId === item.id ? '삭제 중…' : '삭제'}
                </button>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
