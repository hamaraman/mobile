import { useAuth } from '../../hooks/authContext';

// 로그인이 필요한 화면(발행·내 청첩장) 진입 시 노출되는 안내 + 카카오 로그인 버튼.
export default function LoginGate({
  title = '로그인이 필요합니다',
  message = '카카오로 로그인하면 내 청첩장을 어느 기기에서든 관리할 수 있어요.',
}: {
  title?: string;
  message?: string;
}) {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCFAF7] px-6 text-center gap-6">
      <div className="space-y-2">
        <h1 className="text-xl font-serif text-wedding-primary tracking-wide">{title}</h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{message}</p>
      </div>

      {/* 카카오 로그인 버튼 (카카오 브랜드 컬러 #FEE500) */}
      <button
        onClick={login}
        className="flex items-center justify-center gap-2 w-full max-w-xs py-3.5 rounded-lg bg-[#FEE500] text-[#191600] text-sm font-medium hover:brightness-95 transition-all shadow-sm"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path
            fill="#191600"
            d="M9 1.5C4.86 1.5 1.5 4.14 1.5 7.4c0 2.1 1.4 3.94 3.5 5l-.9 3.3c-.08.29.25.52.5.35l3.96-2.62c.15.01.29.02.44.02 4.14 0 7.5-2.64 7.5-5.95S13.14 1.5 9 1.5Z"
          />
        </svg>
        카카오로 로그인
      </button>
    </div>
  );
}
