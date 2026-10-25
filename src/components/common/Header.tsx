// design-spec.md 3.12 헤더: 높이 56, 흰 배경, 제목 18 SemiBold, 왼쪽 뒤로가기(하위 화면만), 오른쪽 선택
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/src/constants/colors';
import { layout, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';

interface HeaderProps {
  title: string;
  onBack?: () => void; // 있으면 뒤로가기 표시
  right?: ReactNode;   // 오른쪽 텍스트 버튼, 날짜 등
}

export function Header({ title, onBack, right }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.bar}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="뒤로가기"
            onPress={onBack}
            hitSlop={space.sm}
            style={styles.back}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
        ) : null}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: layout.headerHeight,
    paddingHorizontal: layout.screenPadding,
    gap: space.sm,
  },
  back: {
    minWidth: layout.minTouch,
    minHeight: layout.minTouch,
    justifyContent: 'center',
    marginLeft: -space.sm,
  },
  title: {
    ...typography.headerTitle,
    flex: 1,
    color: colors.secondary,
  },
  right: {
    flexShrink: 0,
  },
});
