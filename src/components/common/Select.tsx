// design-spec.md 3.3 선택창: 입력창 모양 + chevron-down, 누르면 바텀시트 목록
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import { layout, radius, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';
import { BottomSheet } from './BottomSheet';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectProps {
  label?: string;
  placeholder: string;      // 선택 전 회색 안내 문구
  sheetTitle?: string;      // 바텀시트 제목 (없으면 label)
  options: SelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string | null;
}

export function Select({
  label,
  placeholder,
  sheetTitle,
  options,
  value,
  onChange,
  disabled = false,
  error,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={[
          styles.field,
          open && styles.focused,
          disabled && styles.disabled,
          error ? styles.error : null,
        ]}
      >
        <Text style={[styles.value, !selected && styles.placeholder]} numberOfLines={1}>
          {selected ? selected.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSub} />
      </Pressable>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <BottomSheet visible={open} title={sheetTitle ?? label ?? placeholder} onClose={() => setOpen(false)}>
        <FlatList
          data={options}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => {
            const isSelected = item.value === value;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
                style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
              >
                <View style={styles.optionText}>
                  <Text style={[styles.optionLabel, isSelected && styles.optionSelected]}>{item.label}</Text>
                  {item.description ? <Text style={styles.optionDescription}>{item.description}</Text> : null}
                </View>
                {isSelected ? <Ionicons name="checkmark" size={20} color={colors.primary} /> : null}
              </Pressable>
            );
          }}
        />
      </BottomSheet>
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
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: layout.inputHeight,
    paddingHorizontal: space.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.control,
  },
  focused: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  disabled: {
    backgroundColor: colors.secondaryPressed,
  },
  error: {
    borderColor: colors.error,
  },
  value: {
    ...typography.body,
    flex: 1,
    color: colors.text,
  },
  placeholder: {
    color: colors.textSub,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: layout.listItemHeight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionPressed: {
    backgroundColor: colors.pressed,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    ...typography.body,
    color: colors.text,
  },
  optionSelected: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
  optionDescription: {
    ...typography.sub,
    color: colors.textSub,
  },
});
