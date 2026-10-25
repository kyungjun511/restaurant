// S-14 가게 설정 (F-13) — 2단계: 로그아웃만. 영업시간·주문 받기 설정은 Could 단계
import { ComingSoon } from '@/src/components/common/ComingSoon';
import { useAuth } from '@/src/contexts/AuthContext';

export default function OwnerSettingsScreen() {
  const { user, logout } = useAuth();
  return (
    <ComingSoon
      title="가게 설정"
      icon="settings-outline"
      subtitle={user?.name}
      description="영업시간·주문 받기 설정은 Could 단계에서 만들어요 (S-14)"
      onLogout={logout}
    />
  );
}
