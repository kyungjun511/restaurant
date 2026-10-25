// 홈 탭 안의 화면 쌓기 (S-03 → S-04 → S-05 → S-06)
import { Stack } from 'expo-router';

import { colors } from '@/src/constants/colors';

export default function HomeStackLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />;
}
