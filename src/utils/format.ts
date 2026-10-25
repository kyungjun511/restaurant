// 가격·날짜·시간 표시 도우미 (화면과 무관한 순수 함수)
import type { DateString, DateTimeString, TimeString } from '@/src/types/models';

const pad = (n: number) => String(n).padStart(2, '0');

// 9000 → '9,000원'
export function formatPrice(price: number): string {
  return `${String(Math.round(price)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`;
}

// Date → '2026-10-26'
export function toDateString(date: Date): DateString {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Date → '12:10'
export function toTimeString(date: Date): TimeString {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Date → '2026-10-26T11:02:00+09:00' (기기 시간대를 그대로 붙임)
export function toDateTimeString(date: Date): DateTimeString {
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const abs = Math.abs(offset);
  return `${toDateString(date)}T${toTimeString(date)}:${pad(date.getSeconds())}${sign}${pad(
    Math.floor(abs / 60),
  )}:${pad(abs % 60)}`;
}

// '12:10' → 730 (분), 시간 비교·계산용
export function timeToMinutes(time: TimeString): number {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

// 730 → '12:10'
export function minutesToTime(minutes: number): TimeString {
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// '2026-10-26' → '10월 26일 (월)'
export function formatKoreanDate(date: DateString): string {
  const [y, m, d] = date.split('-').map(Number);
  const weekday = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  return `${m}월 ${d}일 (${weekday})`;
}
