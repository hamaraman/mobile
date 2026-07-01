import { useEffect, useState, useCallback, useRef } from 'react';
import type { WeddingData } from './types/wedding';
import LandingPage from './components/LandingPage';
import EditorLayout from './components/EditorLayout';
import PublishedInvitation from './components/invitation/PublishedInvitation';
import InvitationView from './components/invitation/InvitationView';
import LoginGate from './components/auth/LoginGate';
import MyInvitations from './components/dashboard/MyInvitations';
import { publishInvitation, updateInvitation, fetchInvitation, UnauthorizedError } from './utils/api';
import { ToastProvider } from './hooks/useToast';
import { useToast } from './hooks/toastContext';
import { AuthProvider } from './hooks/useAuth';
import { useAuth } from './hooks/authContext';

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
const VIEW_ID = params.get('id');           // ?id=xxx  → 공개 보기
const SHOW_MINE = params.has('mine');        // ?mine    → 내 청첩장 대시보드
const EDIT_ID = params.get('edit') || null;  // ?edit=xx → 기존 청첩장 수정(값 있을 때만)

type Mode = 'landing' | 'editor' | 'published' | 'mine';

function getInitialMode(): Mode {
  if (VIEW_ID) return 'published';
  if (SHOW_MINE) return 'mine';
  if (params.has('edit')) return 'editor';
  return 'landing';
}

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#F4F0E8' }}>
    <p className="text-sm animate-pulse font-serif tracking-widest" style={{ color: '#9A8F80' }}>불러오는 중…</p>
  </div>
);

function App() {
  const { user, loading: authLoading, login } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<Mode>(getInitialMode);
  const [data, setData] = useState<WeddingData>(loadData);
  const [publishing, setPublishing] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [autoSaved, setAutoSaved] = useState(true);
  const [editLoading, setEditLoading] = useState<boolean>(!!EDIT_ID);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 모든 훅은 조건부 반환 이전에 선언한다.
  const handleChange = useCallback((newData: WeddingData) => {
    setData(newData);
    setAutoSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const ok = saveData(newData);
      setAutoSaved(ok);
    }, 800);
  }, []);

  // 콜백 오류(?login=error)가 있으면 한 번 안내한다.
  useEffect(() => {
    if (params.get('login') === 'error') {
      toast('카카오 로그인에 실패했습니다. 다시 시도해주세요.', 'error');
    }
  }, [toast]);

  // 수정 모드(?edit=xx): 서버에서 해당 청첩장을 불러와 편집기에 채운다.
  useEffect(() => {
    if (!EDIT_ID) return;
    let active = true;
    fetchInvitation(EDIT_ID)
      .then(d => { if (active) setData(d); })
      .catch(e => { if (active) toast(e instanceof Error ? e.message : '청첩장을 불러올 수 없습니다.', 'error'); })
      .finally(() => { if (active) setEditLoading(false); });
    return () => { active = false; };
  }, [toast]);

  // 발행된 뷰 (공유 링크 방문자)
  if (mode === 'published' && VIEW_ID && !publishedId) {
    return <PublishedInvitation id={VIEW_ID} />;
  }

  // 발행/수정 완료 후 청첩장 뷰
  if (publishedId) {
    return <InvitationView data={data} />;
  }

  // 발행(신규) 또는 수정 저장. 둘 다 로그인 필요.
  const handleComplete = async (newData: WeddingData) => {
    setData(newData);
    saveData(newData);
    if (!user) {
      toast('발행하려면 로그인이 필요합니다.');
      login();
      return;
    }
    setPublishing(true);
    try {
      if (EDIT_ID) {
        // 소유자면 editToken 없이도 서버가 통과시킨다.
        const token = (() => { try { return localStorage.getItem(`edit-token-${EDIT_ID}`); } catch { return null; } })();
        await updateInvitation(EDIT_ID, token, newData);
        window.history.pushState({}, '', `${window.location.origin}/?id=${EDIT_ID}`);
        setPublishedId(EDIT_ID);
        toast('청첩장을 수정했습니다. 🎉');
      } else {
        const { id, editToken } = await publishInvitation(newData);
        try { localStorage.setItem(`edit-token-${id}`, editToken); } catch { /* ignore */ }
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
        window.history.pushState({}, '', `${window.location.origin}/?id=${id}`);
        setPublishedId(id);
        toast('청첩장이 발행되었습니다. 맨 아래에서 공유 링크를 확인하세요. 🎉');
      }
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        toast('로그인이 필요합니다.');
        login();
      } else {
        toast(e instanceof Error ? e.message : '저장에 실패했습니다.', 'error');
      }
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

  // 인증 상태 확인 중
  if (authLoading) return <Spinner />;

  // 내 청첩장 대시보드
  if (mode === 'mine') {
    if (!user) return <LoginGate title="내 청첩장 관리" />;
    return (
      <MyInvitations
        onEdit={(id) => { window.location.href = `/?edit=${encodeURIComponent(id)}`; }}
        onCreateNew={() => { window.location.href = '/?edit'; }}
      />
    );
  }

  // 랜딩
  if (mode === 'landing') {
    return <LandingPage onStart={goToEditor} />;
  }

  // 기존 청첩장 수정은 소유권이 필요하므로 로그인 필수
  if (EDIT_ID && !user) {
    return <LoginGate title="청첩장 수정" message="본인이 만든 청첩장만 수정할 수 있어요. 카카오로 로그인해주세요." />;
  }
  // 수정 대상 로딩 중
  if (EDIT_ID && editLoading) return <Spinner />;

  return (
    <EditorLayout
      data={data}
      onChange={handleChange}
      onPublish={handleComplete}
      isSubmitting={publishing}
      autoSaved={autoSaved}
      onBack={goToLanding}
      publishLabel={EDIT_ID ? '수정 저장' : undefined}
    />
  );
}

export default function AppWithProviders() {
  // 공개 보기(?id=xxx)는 인증이 필요 없다 — 불필요한 /api/auth/me 호출을 피한다.
  if (VIEW_ID) {
    return (
      <ToastProvider>
        <PublishedInvitation id={VIEW_ID} />
      </ToastProvider>
    );
  }
  return (
    <ToastProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ToastProvider>
  );
}
