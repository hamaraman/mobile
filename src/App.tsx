import { useState } from 'react';
import type { WeddingData } from './types/wedding';
import InvitationForm from './components/form/InvitationForm';
import InvitationView from './components/invitation/InvitationView';
import { ToastProvider } from './hooks/useToast';
import { useToast } from './hooks/toastContext';

const STORAGE_KEY = 'wedding-invitation-data';

const INITIAL_DATA: WeddingData = {
  groom: { name: '이도현', phoneNumber: '010-1234-5678' },
  bride: { name: '김지원', phoneNumber: '010-5678-1234' },
  groomParents: { father: { name: '이건호', phoneNumber: '' }, mother: { name: '박미숙', phoneNumber: '' } },
  brideParents: { father: { name: '김철수', phoneNumber: '' }, mother: { name: '이영희', phoneNumber: '' } },
  weddingDate: '2026-10-24',
  weddingTime: '12:30',
  location: { name: '아펠가모 반포', address: '서울특별시 서초구 반포동 74-1', lat: 37.5042, lng: 126.9964 },
  greeting: {
    title: '모시는 글',
    content: '서로가 마주보며 다진 사랑을 이제 함께\n한 곳을 바라보며 걸어가려 합니다.\n\n저희의 새로운 시작을\n축복해주시면 감사하겠습니다.',
  },
  galleryImages: [],
  template: 'minimal',
  kakaoApiKey: '35a6b3e9d3e47ea098f206c51459dbd9',
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

function App() {
  const [data, setData] = useState<WeddingData>(loadData);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { toast } = useToast();

  const persist = (newData: WeddingData) => {
    if (!saveData(newData)) {
      toast('이미지 용량이 커서 자동 저장에 실패했습니다.', 'error');
    }
  };

  const handleChange = (newData: WeddingData) => {
    setData(newData);
    persist(newData);
  };

  const handleComplete = (newData: WeddingData) => {
    setData(newData);
    persist(newData);
    setIsPreviewMode(true);
  };

  if (isPreviewMode) {
    return (
      <div className="relative">
        <button 
          onClick={() => setIsPreviewMode(false)}
          className="fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg text-sm font-medium hover:bg-white transition-all border border-gray-100"
        >
          ← 다시 수정하기
        </button>
        <InvitationView data={data} />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FCFAF7]">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 overflow-y-auto max-h-screen border-r border-gray-100">
        <InvitationForm
          initialData={data}
          onChange={handleChange}
          onComplete={handleComplete}
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

      {/* Mobile Floating Preview Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsPreviewMode(true)}
          className="bg-wedding-accent text-white px-6 py-4 rounded-full shadow-xl font-medium text-sm tracking-wider active:scale-95 transition-all"
        >
          미리보기
        </button>
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
