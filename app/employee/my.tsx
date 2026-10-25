// S-08 마이페이지 (F-01) — 2단계: 내 정보 + 로그아웃만. 알림 설정·비밀번호 변경은 이후 단계
import { ComingSoon } from '@/src/components/common/ComingSoon';
import { useAuth } from '@/src/contexts/AuthContext';

export default function MyPageScreen() {
  const { user, logout } = useAuth();
  return (
    <ComingSoon
      title="마이페이지"
      icon="person-outline"
      subtitle={user?.name}
      description={[user?.companyName, user?.department, user?.employeeNo && `사번 ${user.employeeNo}`]
        .filter(Boolean)
        .join(' · ')}
      onLogout={logout}
    />
  );
}
