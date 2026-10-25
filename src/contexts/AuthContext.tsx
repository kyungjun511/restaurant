// 로그인 사용자·토큰 (dev-spec.md 9.1). 토큰은 secure-store, 사용자 정보는 메모리
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { api, setUnauthorizedHandler } from '@/src/api';
import type { LoginResult, User } from '@/src/types/models';
import { tokenStorage } from '@/src/utils/secureStorage';

interface AuthContextValue {
  user: User | null;
  isRestoring: boolean; // 앱 시작 시 저장된 토큰 확인 중
  loginEmployee: (companyId: string, employeeNo: string, password: string) => Promise<void>; // API-02
  loginWithId: (loginId: string, password: string) => Promise<void>;                         // API-03
  logout: () => Promise<void>;                                                               // API-04
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  // 앱 시작: 토큰이 있으면 API-05로 사용자 정보를 다시 받음 (F-13 로그인 유지)
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const token = await tokenStorage.get();
        if (!token) return;
        const me = await api.auth.getMe();
        if (active) setUser(me);
      } catch {
        // 토큰 만료·연결 오류 → 로그인 화면부터 다시
        await tokenStorage.clear();
      } finally {
        if (active) setIsRestoring(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // 화면 이동: user가 생기면 로그인 화면이 ROLE_HOME[user.role]로 Redirect
  const finishLogin = useCallback(async (result: LoginResult) => {
    await tokenStorage.set(result.token);
    // [가정] mustChangePassword면 S-02로 보내야 하지만 S-02는 Could 단계라 아직 없음
    setUser(result.user);
  }, []);

  const loginEmployee = useCallback(
    async (companyId: string, employeeNo: string, password: string) => {
      await finishLogin(await api.auth.loginEmployee({ companyId, employeeNo, password }));
    },
    [finishLogin],
  );

  const loginWithId = useCallback(
    async (loginId: string, password: string) => {
      await finishLogin(await api.auth.login({ loginId, password }));
    },
    [finishLogin],
  );

  // 화면 이동은 각 영역 _layout의 보호 검사가 /login으로 보냄
  const clearSession = useCallback(async () => {
    await tokenStorage.clear();
    // 장바구니는 사용자 id에 묶여 있어 user가 null이 되면 CartContext에서 빈 장바구니로 보임
    setUser(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch {
      // 응답과 상관없이 앱에서는 로그아웃 처리 (API-04)
    }
    await clearSession();
  }, [clearSession]);

  // 어느 API에서든 UNAUTHORIZED가 나면 세션 정리
  useEffect(() => {
    setUnauthorizedHandler(() => void clearSession());
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  const value = useMemo(
    () => ({ user, isRestoring, loginEmployee, loginWithId, logout }),
    [user, isRestoring, loginEmployee, loginWithId, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth는 AuthProvider 안에서만 쓸 수 있어요');
  return context;
}
