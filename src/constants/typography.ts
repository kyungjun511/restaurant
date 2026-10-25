// design-spec.md 2.2 글자 (시스템 기본 폰트, 줄 간격 = 크기 × 1.4)
import type { TextStyle } from 'react-native';

const make = (fontSize: number, fontWeight: TextStyle['fontWeight']): TextStyle => ({
  fontSize,
  fontWeight,
  lineHeight: Math.round(fontSize * 1.4),
});

export const typography = {
  screenTitle: make(22, '700'),
  sectionTitle: make(18, '600'),
  headerTitle: make(18, '600'),
  body: make(16, '400'),
  bodyStrong: make(16, '600'),
  sub: make(14, '400'),
  label: make(14, '400'),
  caption: make(12, '400'),
  badge: make(12, '600'),
  ownerArrival: make(28, '700'),
  // 사장님 화면(S-09~S-14) 본문은 한 단계 크게
  ownerBody: make(18, '400'),
  ownerBodyStrong: make(18, '600'),
} as const;
