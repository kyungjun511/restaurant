// design-spec.md 3.19 안내 띠: 화면 위쪽 가로 띠, 높이 44 (정보 / 성공 / 오류)
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import { layout, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';

export type BannerType = 'info' | 'success' | 'error';

const STYLE: Record<BannerType, { background: string; text: string; icon: 'time-outline' | 'checkmark-circle-outline' | 'alert-circle-outline' }> = {
  info: { background: colors.primaryLight, text: colors.primary, icon: 'time-outline' },
  success: { background: colors.successLight, text: colors.success, icon: 'checkmark-circle-outline' },
  error: { background: colors.errorLight, text: colors.error, icon: 'alert-circle-outline' },
};

export function Banner({ type, message }: { type: BannerType; message: string }) {
  const style = STYLE[type];
  return (
    <View
      style={[styles.banner, { backgroundColor: style.background }]}
      accessibilityRole={type === 'error' ? 'alert' : undefined}
      accessibilityLiveRegion="polite"
    >
      <Ionicons name={style.icon} size={18} color={style.text} />
      <Text style={[styles.message, { color: style.text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: layout.bannerHeight,
    paddingHorizontal: layout.screenPadding,
  },
  message: {
    ...typography.sub,
    flex: 1,
  },
});
