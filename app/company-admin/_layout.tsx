// 회사 관리자 영역: Stack (S-15 / S-16 전환은 화면 안의 상단 탭). 회사 관리자가 아니면 /login
import { Stack } from 'expo-router';

import { RoleGate } from '@/src/components/domain/RoleGate';
import { colors } from '@/src/constants/colors';

export default function CompanyAdminLayout() {
  return (
    <RoleGate role="company_admin">
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
    </RoleGate>
  );
}
