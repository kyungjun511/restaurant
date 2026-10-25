// design-spec.md 3.2 입력창 (기본 / 포커스 / 비활성 / 오류)
import { useState, type ComponentRef, type Ref } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/src/constants/colors';
import { layout, radius, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';

interface InputProps extends TextInputProps {
  ref?: Ref<ComponentRef<typeof TextInput>>;
  label?: string;
  error?: string | null; // 있으면 빨간 테두리 + 아래 안내 문구
  invalid?: boolean;     // 문구 없이 빨간 테두리만 (오류 문구는 다른 칸 아래에 있을 때)
  hint?: string;         // 오류가 없을 때 아래 보조 문구 (예: "8자 이상 입력해 주세요")
}

export function Input({
  ref,
  label,
  error,
  invalid,
  hint,
  editable = true,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        {...rest}
        ref={ref}
        editable={editable}
        placeholderTextColor={colors.textSub}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          styles.input,
          focused && styles.focused,
          !editable && styles.disabled,
          error || invalid ? styles.error : null,
          style,
        ]}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: space.xs,
  },
  label: {
    ...typography.label,
    color: colors.text,
  },
  input: {
    ...typography.body,
    minHeight: layout.inputHeight,
    paddingHorizontal: space.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.control,
    color: colors.text,
  },
  focused: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  disabled: {
    backgroundColor: colors.secondaryPressed,
    color: colors.textSub,
  },
  error: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
  hintText: {
    ...typography.caption,
    color: colors.textSub,
  },
});
