// dev-spec.md 4.4 환경변수를 읽는 유일한 파일
// 주의: process.env.EXPO_PUBLIC_XXX 처럼 "점(.)으로 한 번에" 써야 값이 들어갑니다.
//       process.env['EXPO_PUBLIC_XXX'] 나 구조 분해({ ... } = process.env)는 동작하지 않습니다.

const appEnv = process.env.EXPO_PUBLIC_APP_ENV ?? 'development';
const useMock = process.env.EXPO_PUBLIC_USE_MOCK !== 'false'; // 값이 없으면 mock 사용
const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
const mockDelayMs = Number(process.env.EXPO_PUBLIC_MOCK_DELAY_MS ?? '500');
// [추가] mock 모드에서 "지금 시각"을 고정 (예: '11:00'). 비우면 실제 시각.
// 주문 마감(11:30)·지난 도착 시간 규칙 때문에 오후에도 시연할 수 있게 함
const mockNowRaw = process.env.EXPO_PUBLIC_MOCK_NOW ?? '';
const mockNow = /^([01]\d|2[0-3]):[0-5]\d$/.test(mockNowRaw) ? mockNowRaw : null;

if (!useMock && !apiBaseUrl) {
  throw new Error('EXPO_PUBLIC_API_BASE_URL이 비어 있습니다. .env를 확인하세요.');
}

export const env = {
  appEnv,
  useMock,
  apiBaseUrl,
  mockDelayMs: Number.isNaN(mockDelayMs) ? 500 : mockDelayMs,
  mockNow: useMock ? mockNow : null,
} as const;
