// design-spec.md 2.1 컬러
export const colors = {
  primary: '#C2410C',
  primaryPressed: '#9A3412',
  primaryLight: '#FFF7ED',
  secondary: '#1F2937',
  background: '#F6F7F9',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  text: '#111827',
  textSub: '#6B7280',
  disabled: '#D1D5DB',
  success: '#15803D',
  successLight: '#DCFCE7',
  warning: '#B45309',
  error: '#B91C1C',
  errorLight: '#FEE2E2',
  info: '#1D4ED8',
  white: '#FFFFFF',
  pressed: '#F9FAFB',          // 카드·리스트 눌림
  secondaryPressed: '#F3F4F6', // 보조 버튼 눌림, 비활성 입력창 배경
  overlay: 'rgba(0, 0, 0, 0.4)', // 바텀시트 뒤 배경
} as const;

// design-spec.md 2.1 주문 상태 배지 색 (연한 배경 + 진한 글자)
export const badgeColors = {
  requested: { background: '#FEF3C7', text: '#B45309' },
  accepted: { background: '#DBEAFE', text: '#1D4ED8' },
  preparing: { background: '#EDE9FE', text: '#6D28D9' },
  ready: { background: '#DCFCE7', text: '#15803D' },
  served: { background: '#F3F4F6', text: '#4B5563' },
  rejected: { background: '#FEE2E2', text: '#B91C1C' },
  no_show: { background: '#FEE2E2', text: '#B91C1C' },
  cancelled: { background: '#F3F4F6', text: '#6B7280' },
  // 영업 배지 (design-spec.md 3.8)
  open: { background: '#DCFCE7', text: '#15803D' },
  closed: { background: '#F3F4F6', text: '#6B7280' },
  soldOut: { background: '#F3F4F6', text: '#6B7280' },
} as const;
