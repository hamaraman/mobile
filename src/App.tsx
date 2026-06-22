import { useState } from 'react';
import type { WeddingData } from './types/wedding';
import InvitationForm from './components/form/InvitationForm';
import InvitationView from './components/invitation/InvitationView';
import PublishedInvitation from './components/invitation/PublishedInvitation';
import { publishInvitation } from './utils/api';
import { ToastProvider } from './hooks/useToast';
import { useToast } from './hooks/toastContext';

const STORAGE_KEY = 'wedding-invitation-data';

// 편집기에서 새 청첩장을 만들 때 시작점이 되는 예시 데이터.
const INITIAL_DATA: WeddingData = {
  groom: { name: '', phoneNumber: '' },
  bride: { name: '', phoneNumber: '' },
  groomParents: { father: { name: '', phoneNumber: '' }, mother: { name: '', phoneNumber: '' } },
  brideParents: { father: { name: '', phoneNumber: '' }, mother: { name: '', phoneNumber: '' } },
  weddingDate: '',
  weddingTime: '',
  location: { name: '', address: '' },
  greeting: {
    title: '모시는 글',
    content: '서로가 마주보며 다진 사랑을 이제 함께\n한 곳을 바라보며 걸어가려 합니다.\n\n저희의 새로운 시작을\n축복해주시면 감사하겠습니다.',
  },
  galleryImages: [],
  template: 'minimal',
};

function loadData(): WeddingData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as WeddingData) : INITIAL_DATA;
  } catch {
    return INITIAL_DATA;
  }
}

function saveData(data: WeddingData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.warn('Failed to persist wedding data:', err);
    return false;
  }
}

// 공유 링크(?id=xxx)로 들어온 방문자는 서버에 저장된 청첩장을 본다.
const VIEW_ID = new URLSearchParams(window.location.search).get('id');

function App() {
  const [data, setData] = useState<WeddingData>(loadData);
  const [publishing, setPublishing] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const { toast } = useToast();

  // 1) 공유 링크로 들어온 방문자 → 서버에서 불러와 청첩장만 표시
  if (VIEW_ID) {
    return <PublishedInvitation id={VIEW_ID} />;
  }

  const persist = (newData: WeddingData) => {
    if (!saveData(newData)) {
      toast('이미지 용량이 커서 임시 저장에 실패했습니다.', 'error');
    }
  };

  const handleChange = (newData: WeddingData) => {
    setData(newData);
    persist(newData);
  };

  // 2) 발행: 서버에 저장하고 공유 링크를 발급받는다.
  const handleComplete = async (newData: WeddingData) => {
    setData(newData);
    persist(newData);
    setPublishing(true);
    try {
      const { id, editToken } = await publishInvitation(newData);
      try { localStorage.setItem(`edit-token-${id}`, editToken); } catch { /* ignore */ }
      setPublishedId(id);
    } catch (e) {
      toast(e instanceof Error ? e.message : '저장에 실패했습니다.', 'error');
    } finally {
      setPublishing(false);
    }
  };

  // 3) 발행 완료 → 공유 링크 안내 화면
  if (publishedId) {
    const shareUrl = `${window.location.origin}/?id=${publishedId}`;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCFAF7] px-6 text-center gap-6">
        <div className="space-y-2">
          <span className="text-[10px] tracking-[0.4em] text-wedding-accent font-bold uppercase">Published</span>
          <h1 className="text-2xl font-serif text-wedding-primary">청첩장이 발행되었습니다 🎉</h1>
          <p className="text-sm text-gray-500">아래 링크를 공유하면 누구나, 어떤 기기에서든 볼 수 있어요.</p>
        </div>
        <div className="w-full max-w-md flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3">
          <input readOnly value={shareUrl} className="flex-1 bg-transparent text-sm outline-none text-gray-700" />
          <button
            onClick={async () => { await navigator.clipboard.writeText(shareUrl); toast('링크가 복사되었습니다.'); }}
            className="text-xs font-bold text-wedding-accent whitespace-nowrap"
          >복사</button>
        </div>
        <div className="flex gap-3">
          <a href={shareUrl} className="bg-wedding-primary text-white px-6 py-3 rounded-md text-sm font-medium">청첩장 보기</a>
          <button onClick={() => setPublishedId(null)} className="px-6 py-3 rounded-md text-sm text-gray-500 border border-gray-200">계속 수정</button>
        </div>
      </div>
    );
  }

  // 4) 편집기 (생성/수정)
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FCFAF7]">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 overflow-y-auto max-h-screen border-r border-gray-100">
        <InvitationForm
          initialData={data}
          onChange={handleChange}
          onComplete={handleComplete}
          isSubmitting={publishing}
        />
      </div>

      {/* Real-time Preview Section (Desktop) */}
      <div className="hidden lg:block lg:w-1/2 bg-gray-50 overflow-y-auto max-h-screen p-12">
        <div className="max-w-[420px] mx-auto shadow-2xl rounded-[3rem] overflow-hidden border-[8px] border-black aspect-[9/19.5]">
          <div className="w-full h-full overflow-y-auto bg-white custom-scrollbar">
            <InvitationView data={data} />
          </div>
        </div>
        <p className="text-center mt-6 text-xs text-gray-400 font-serif italic">Mobile Preview</p>
      </div>
    </div>
  );
}

export default function AppWithProviders() {
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  );
}
