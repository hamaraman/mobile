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
      // 발행 후 곧장 완성된 청첩장을 보여준다. URL을 공유 링크(?id=xxx)로 바꾸면
      // 청첩장 맨 하단 공유 영역에 그 링크가 표시되고, 새로고침해도 그대로 열린다.
      window.history.pushState({}, '', `${window.location.origin}/?id=${id}`);
      setPublishedId(id);
      toast('청첩장이 발행되었습니다. 맨 아래에서 공유 링크를 확인하세요. 🎉');
    } catch (e) {
      toast(e instanceof Error ? e.message : '저장에 실패했습니다.', 'error');
    } finally {
      setPublishing(false);
    }
  };

  // 3) 발행 완료 → 완성된 청첩장 표시 (공유 링크는 맨 하단 ShareSection에 노출)
  if (publishedId) {
    return <InvitationView data={data} />;
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
