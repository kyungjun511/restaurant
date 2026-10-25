// 도착 시간 칩 목록 계산 (F-06): 11:30~13:00, 10분 단위, 지금보다 이른 시간은 비활성
import {
  ARRIVAL_SLOT_END,
  ARRIVAL_SLOT_INTERVAL_MIN,
  ARRIVAL_SLOT_START,
} from '@/src/constants/rules';
import type { Restaurant, TimeString } from '@/src/types/models';
import { minutesToTime, timeToMinutes } from './format';

export interface ArrivalSlot {
  time: TimeString;
  disabled: boolean;
}

export function getArrivalSlots(nowTime: TimeString): ArrivalSlot[] {
  const slots: ArrivalSlot[] = [];
  const end = timeToMinutes(ARRIVAL_SLOT_END);
  for (let m = timeToMinutes(ARRIVAL_SLOT_START); m <= end; m += ARRIVAL_SLOT_INTERVAL_MIN) {
    const time = minutesToTime(m);
    slots.push({ time, disabled: time < nowTime });
  }
  return slots;
}

// 지금 이 음식점에 주문할 수 있는지: 오늘 주문 받기 켜짐 + 주문 마감 전
export function isOrderable(restaurant: Restaurant, nowTime: TimeString): boolean {
  return restaurant.isAcceptingOrders && nowTime <= restaurant.orderDeadline;
}
