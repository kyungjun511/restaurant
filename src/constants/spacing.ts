// design-spec.md 2.3 간격·모서리·그림자
import type { ViewStyle } from 'react-native';

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const layout = {
  screenPadding: 16,
  cardPadding: 16,
  buttonHeight: 52,
  ownerButtonHeight: 56,
  inputHeight: 52,
  headerHeight: 56,
  chipHeight: 40,
  badgeHeight: 24,
  bannerHeight: 44,
  listItemHeight: 56,
  stepperButton: 40,
  minTouch: 44,
} as const;

export const radius = {
  card: 12,
  control: 10, // 버튼·입력창
  pill: 999,   // 배지·칩
  sheet: 16,   // 바텀시트 위쪽
} as const;

// 카드만 아주 옅은 그림자 (iOS 투명도 6%, Android elevation 2)
export const cardShadow: ViewStyle = {
  shadowColor: '#000000',
  shadowOpacity: 0.06,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};
