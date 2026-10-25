// design-spec.md 3.1 버튼 (주요 / 보조 / 위험 / 텍스트)
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors } from '@/src/constants/colors';
import { layout, radius, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'text';
export type ButtonSize = 'default' | 'large' | 'small'; // large = 사장님 화면 56, small = 목록 안 작은 버튼

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const MIN_HEIGHT: Record<ButtonSize, number> = {
  default: layout.buttonHeight,
  large: layout.ownerButtonHeight,
  small: layout.minTouch,
};

const LABEL_COLOR: Record<ButtonVariant, string> = {
  primary: colors.white,
  secondary: colors.secondary,
  danger: colors.error,
  text: colors.primary,
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  fullWidth = variant !== 'text' && size !== 'small',
  style,
}: ButtonProps) {
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { minHeight: MIN_HEIGHT[size] },
        size === 'small' && styles.small,
        variantStyles[variant],
        pressed && pressedStyles[variant],
        disabled && variant !== 'text' && styles.disabled,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.primary} />
      ) : (
        <Text
          style={[
            size === 'small' ? typography.sub : typography.bodyStrong,
            size === 'large' && typography.ownerBodyStrong,
            { color: disabled ? (variant === 'text' ? colors.disabled : colors.white) : LABEL_COLOR[variant] },
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    borderRadius: radius.control,
  },
  small: {
    paddingHorizontal: space.md,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  danger: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.error },
  text: { backgroundColor: 'transparent' },
});

const pressedStyles = StyleSheet.create({
  primary: { backgroundColor: colors.primaryPressed },
  secondary: { backgroundColor: colors.secondaryPressed },
  danger: { backgroundColor: colors.errorLight },
  text: { opacity: 0.6 },
});
