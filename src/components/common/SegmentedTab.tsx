// design-spec.md 3.11 상단 탭: 선택 = 주요색 글자 + 아래 2px 선, 개수 배지 가능 ("신규 3")
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import { layout } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';

export interface SegmentedTabItem<K extends string> {
  key: K;
  label: string;
  count?: number;
}

interface SegmentedTabProps<K extends string> {
  items: SegmentedTabItem<K>[];
  value: K;
  onChange: (key: K) => void;
}

export function SegmentedTab<K extends string>({ items, value, onChange }: SegmentedTabProps<K>) {
  return (
    <View style={styles.container} accessibilityRole="tablist">
      {items.map((item) => {
        const selected = item.key === value;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(item.key)}
            style={[styles.tab, selected && styles.selectedTab]}
          >
            <Text style={[styles.label, selected && styles.selectedLabel]}>
              {item.count === undefined ? item.label : `${item.label} ${item.count}`}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    minHeight: layout.minTouch,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  selectedTab: {
    borderBottomColor: colors.primary,
  },
  label: {
    ...typography.bodyStrong,
    color: colors.textSub,
  },
  selectedLabel: {
    color: colors.primary,
  },
});
