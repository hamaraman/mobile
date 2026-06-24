import { useState, useCallback, useRef } from 'react';
import type { WeddingData } from './types/wedding';
import LandingPage from './components/LandingPage';
import EditorLayout from './components/EditorLayout';
import PublishedInvitation from './components/invitation/PublishedInvitation';
import InvitationView from './components/invitation/InvitationView';
import { publishInvitation } from './utils/api';
import { ToastProvider } from './hooks/useToast';
import { useToast } from './hooks/toastContext';

const STORAGE_KEY = 'wedding-invitation-data';

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
  template: 'ivory',
};

function loadData(): WeddingData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return INITIAL_DATA;
    const parsed = JSON.parse(saved) as WeddingData;
    // 기존 데이터에 template이 구 스펙이면 기본값으로 리셋
    const validTemplates = ['ivory', 'blush', 'sage', 'blue'];
    if (!validTemplates.includes(parsed.template as string)) {
      parsed.template = 'ivory';
    }
    return parsed;
  } catch {
    return INITIAL_DATA;
  }
}

function saveData(data: WeddingData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

// URL 파라미터로 현재 모드를 결정한다.
const params = new URLSearchParams(window.location.search);
const VIEW_ID = params.get('id');

function getInitialMode(): 'landing' | 'editor' | 'published' {
  if (VIEW_ID) return 'published';
  if (params.has('edit')) return 'editor';
  return 'landing';
}

function App() {
  const [mode, setMode] = useState<'landing' | 'editor' | 'published'>(getInitialMode);
  const [data, setData] = useState<WeddingData>(loadData);
  const [publishing, setPublishing] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [autoSaved, setAutoSaved] = useState(true);
  const { toast } = useToast();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 모든 훅은 조건부 반환 이전에 선언해야 한다.
  const handleChange = useCallback((newData: WeddingData) => {
    setData(newData);
    setAutoSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const ok = saveData(newData);
      setAutoSaved(ok);
    }, 800);
  }, []);

  // 발행된 뷰 (공유 링크 방문자)
  if (mode === 'published' && VIEW_ID && !publishedId) {
    return <PublishedInvitation id={VIEW_ID} />;
  }

  // 발행 완료 후 청첩장 뷰
  if (publishedId) {
    return <InvitationView data={data} />;
  }

  const handlePublish = async (newData: WeddingData) => {
    setData(newData);
    saveData(newData);
    setPublishing(true);
    try {
      const { id, editToken } = await publishInvitation(newData);
      try { localStorage.setItem(`edit-token-${id}`, editToken); } catch { /* ignore */ }
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      window.history.pushState({}, '', `${window.location.origin}/?id=${id}`);
      setPublishedId(id);
      toast('청첩장이 발행되었습니다. 맨 아래에서 공유 링크를 확인하세요. 🎉');
    } catch (e) {
      toast(e instanceof Error ? e.message : '저장에 실패했습니다.', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const goToEditor = () => {
    window.history.pushState({}, '', '?edit');
    setMode('editor');
  };

  const goToLanding = () => {
    window.history.pushState({}, '', '/');
    setMode('landing');
  };

  if (mode === 'landing') {
    return <LandingPage onStart={goToEditor} />;
  }

  return (
    <EditorLayout
      data={data}
      onChange={handleChange}
      onPublish={handlePublish}
      isSubmitting={publishing}
      autoSaved={autoSaved}
      onBack={goToLanding}
    />
  );
}

export default function AppWithProviders() {
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  );
}
