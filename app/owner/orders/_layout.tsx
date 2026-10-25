// 주문 탭 안의 화면 쌓기 (S-09 → S-10)
import { Stack } from 'expo-router';

import { colors } from '@/src/constants/colors';

export default function OwnerOrdersStackLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />;
}
