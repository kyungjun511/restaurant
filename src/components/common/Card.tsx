// design-spec.md 3.4 카드 (기본 / 눌림 / 비활성 / 강조)
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/src/constants/colors';
import { cardShadow, radius, layout } from '@/src/constants/spacing';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  highlighted?: boolean; // 사장님 신규 주문: 주요색 테두리 + 연한 주황 배경
  dimmed?: boolean;      // 비활성: 투명도 50% (누르는 건 막지 않음. 예: 오늘 주문 마감 음식점)
  padded?: boolean;      // 기본 안쪽 여백 16 (사진이 꽉 차는 카드는 false)
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, onPress, highlighted, dimmed, padded = true, style }: CardProps) {
  const cardStyle = [
    styles.card,
    padded && styles.padded,
    highlighted && styles.highlighted,
    dimmed && styles.dimmed,
    style,
  ];

  if (!onPress) return <View style={cardStyle}>{children}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [cardStyle, pressed && !highlighted && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    overflow: 'hidden',
    ...cardShadow,
  },
  padded: {
    padding: layout.cardPadding,
  },
  pressed: {
    backgroundColor: colors.pressed,
  },
  highlighted: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  dimmed: {
    opacity: 0.5,
  },
});
