// 지금 시각 (mock 모드에서 EXPO_PUBLIC_MOCK_NOW가 있으면 오늘 날짜 + 그 시각으로 고정)
import { env } from '@/src/config/env';

export function now(): Date {
  const date = new Date();
  if (env.mockNow) {
    const [hour, minute] = env.mockNow.split(':').map(Number);
    date.setHours(hour, minute, 0, 0);
  }
  return date;
}
