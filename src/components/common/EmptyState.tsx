// design-spec.md 3.16 빈 화면: 아이콘(48) + 안내(16) + 보조(14) + 버튼(선택)
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import { layout, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';
import { Button } from './Button';

interface EmptyStateProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={colors.textSub} />
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <Button title={actionLabel} variant="secondary" fullWidth={false} onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    padding: layout.screenPadding,
  },
  title: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    ...typography.sub,
    color: colors.textSub,
    textAlign: 'center',
  },
  action: {
    marginTop: space.sm,
  },
});
