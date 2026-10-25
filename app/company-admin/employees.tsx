// S-15 직원 명단 (F-23, F-24, Could) — 이후 단계에서 구현. 지금은 로그아웃만
import { ComingSoon } from '@/src/components/common/ComingSoon';
import { useAuth } from '@/src/contexts/AuthContext';

export default function CompanyEmployeesScreen() {
  const { user, logout } = useAuth();
  return (
    <ComingSoon
      title={`${user?.companyName ?? ''} 관리`}
      icon="people-outline"
      subtitle={user?.name}
      description="직원 명단은 Could 단계에서 만들어요 (S-15)"
      onLogout={logout}
    />
  );
}
