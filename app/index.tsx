// 시작 화면: 저장된 로그인 확인이 끝나면 사용자 유형별 첫 화면 또는 로그인으로 이동
import { Redirect } from 'expo-router';

import { Loading } from '@/src/components/common/Loading';
import { ROLE_HOME } from '@/src/constants/routes';
import { useAuth } from '@/src/contexts/AuthContext';

export default function Index() {
  const { user, isRestoring } = useAuth();

  if (isRestoring) return <Loading />;
  return <Redirect href={user ? ROLE_HOME[user.role] : '/login'} />;
}
