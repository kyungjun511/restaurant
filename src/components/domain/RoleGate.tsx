// 사용자 유형별 화면 보호 (dev-spec.md 9.2): 유형이 맞지 않으면 /login으로
import { Redirect } from 'expo-router';
import type { ReactNode } from 'react';

import { useAuth } from '@/src/contexts/AuthContext';
import type { UserRole } from '@/src/types/models';
import { Loading } from '../common/Loading';

export function RoleGate({ role, children }: { role: UserRole; children: ReactNode }) {
  const { user, isRestoring } = useAuth();

  if (isRestoring) return <Loading />;
  if (user?.role !== role) return <Redirect href="/login" />;
  return children;
}
