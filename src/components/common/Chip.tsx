// design-spec.md 3.7 칩: 높이 40, 끝까지 둥글게. 선택됨 = 연한 주황 배경 + 주요색 테두리·글자
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '@/src/constants/colors';
import { layout, radius, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';

interface ChipProps {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export function Chip({ label, selected = false, disabled = false, onPress }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={2}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selected,
        pressed && !selected && styles.pressed,
      ]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel, disabled && styles.disabledLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: layout.chipHeight,
    paddingHorizontal: space.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  pressed: {
    backgroundColor: colors.secondaryPressed,
  },
  label: {
    ...typography.body,
    color: colors.text,
  },
  selectedLabel: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
  disabledLabel: {
    color: colors.disabled,
  },
});
