import { createContext, useContext } from 'react';
import type { AuthUser } from '../utils/api';

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: () => void;              // 구글 로그인 시작(리다이렉트)
  logout: () => Promise<void>;    // 로그아웃 후 상태 초기화
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
