// design-spec.md 3.8 배지: 높이 24, 글자 12 SemiBold, 끝까지 둥글게
import { StyleSheet, Text, View } from 'react-native';

import { layout, radius, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';

interface BadgeProps {
  label: string;
  backgroundColor: string;
  color: string;
}

export function Badge({ label, backgroundColor, color }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    minHeight: layout.badgeHeight,
    paddingHorizontal: space.sm,
    borderRadius: radius.pill,
  },
  label: {
    ...typography.badge,
  },
});
