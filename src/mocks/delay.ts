// mock 응답 지연 흉내 (EXPO_PUBLIC_MOCK_DELAY_MS) → 로딩 화면 확인용
import { env } from '@/src/config/env';

export function delay(ms: number = env.mockDelayMs): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
