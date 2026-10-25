// S-17 회사 관리 (F-25, Could) — 이후 단계에서 구현. 지금은 로그아웃만
import { ComingSoon } from '@/src/components/common/ComingSoon';
import { useAuth } from '@/src/contexts/AuthContext';

export default function AdminCompaniesScreen() {
  const { user, logout } = useAuth();
  return (
    <ComingSoon
      title="회사 관리"
      icon="business-outline"
      subtitle={user?.name}
      description="회사 관리는 Could 단계에서 만들어요 (S-17)"
      onLogout={logout}
    />
  );
}
