// design-spec.md 3.18 화면 전체 오류: 아이콘 + 문구 + "다시 시도"
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import { COMMON_MESSAGES } from '@/src/constants/messages';
import { layout, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';
import { Button } from './Button';

interface ErrorViewProps {
  message: string; // 예: "음식점을 불러오지 못했어요"
  onRetry?: () => void;
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={48} color={colors.textSub} />
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Button title={COMMON_MESSAGES.retry} variant="secondary" fullWidth={false} onPress={onRetry} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.md,
    padding: layout.screenPadding,
  },
  message: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
  },
});
