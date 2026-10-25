// design-spec.md 3.6 수량 조절기: `−  2  +`, 버튼 각 40×40. 최소값이면 −, 최대값이면 + 비활성
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import { layout, radius, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;   // 화면 낭독용 단위 (예: '개', '명')
  label?: string;  // 화면 낭독용 이름 (예: '김치찌개 수량')
}

export function Stepper({ value, onChange, min = 1, max = 99, unit = '', label }: StepperProps) {
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <View style={styles.container} accessibilityLabel={label}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label ?? ''} 빼기`}
        accessibilityState={{ disabled: !canDecrease }}
        disabled={!canDecrease}
        onPress={() => onChange(value - 1)}
        hitSlop={2}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Ionicons name="remove" size={20} color={canDecrease ? colors.text : colors.disabled} />
      </Pressable>
      <Text style={styles.value} accessibilityLabel={`${value}${unit}`}>
        {value}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label ?? ''} 더하기`}
        accessibilityState={{ disabled: !canIncrease }}
        disabled={!canIncrease}
        onPress={() => onChange(value + 1)}
        hitSlop={2}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Ionicons name="add" size={20} color={canIncrease ? colors.text : colors.disabled} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  button: {
    width: layout.stepperButton,
    height: layout.stepperButton,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.control,
    backgroundColor: colors.surface,
  },
  pressed: {
    backgroundColor: colors.secondaryPressed,
  },
  value: {
    ...typography.bodyStrong,
    minWidth: 28,
    textAlign: 'center',
    color: colors.text,
  },
});
