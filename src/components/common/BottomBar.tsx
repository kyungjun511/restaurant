// design-spec.md 3.13 하단 고정 바: 흰 배경 + 위쪽 구분선, 안쪽 여백 16
// (하단 탭이 보이는 화면에서는 탭바가 하단 안전 영역을 맡으므로 safeArea=false)
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/src/constants/colors';
import { layout, space } from '@/src/constants/spacing';

interface BottomBarProps {
  children: ReactNode;
  safeArea?: boolean;
}

export function BottomBar({ children, safeArea = false }: BottomBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: layout.screenPadding + (safeArea ? insets.bottom : 0) }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: layout.screenPadding,
    paddingTop: layout.screenPadding,
    gap: space.sm,
  },
});
