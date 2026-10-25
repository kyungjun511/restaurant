// 메뉴 탭 안의 화면 쌓기 (S-12 → S-13)
import { Stack } from 'expo-router';

import { colors } from '@/src/constants/colors';

export default function OwnerMenusStackLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />;
}
