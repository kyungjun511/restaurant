// API-10 ~ API-12 mock 구현 (직원 주문)
import { ERROR_MESSAGES } from '@/src/constants/messages';
import { EMPLOYEE_SCOPE_STATUSES } from '@/src/constants/orderStatus';
import {
  ARRIVAL_SLOT_END,
  ARRIVAL_SLOT_INTERVAL_MIN,
  ARRIVAL_SLOT_START,
  PARTY_SIZE_MAX,
  PARTY_SIZE_MIN,
  REQUEST_NOTE_MAX,
} from '@/src/constants/rules';
import { db } from '@/src/mocks/db';
import { delay } from '@/src/mocks/delay';
import { ApiError } from '@/src/types/api';
import type { CreateOrderInput, OrderItem } from '@/src/types/models';
import { now } from '@/src/utils/clock';
import { timeToMinutes, toDateString, toDateTimeString, toTimeString } from '@/src/utils/format';
import type { OrdersApi } from '../contracts';
import { requireUser } from './session';

const validationError = (message: string) => new ApiError('VALIDATION_ERROR', message, 400);

function isValidArrivalTime(time: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(time)) return false;
  const minutes = timeToMinutes(time);
  return (
    minutes >= timeToMinutes(ARRIVAL_SLOT_START) &&
    minutes <= timeToMinutes(ARRIVAL_SLOT_END) &&
    (minutes - timeToMinutes(ARRIVAL_SLOT_START)) % ARRIVAL_SLOT_INTERVAL_MIN === 0
  );
}

function validateInput(input: CreateOrderInput) {
  if (!input.arrivalTime || !isValidArrivalTime(input.arrivalTime)) {
    throw validationError('도착 시간을 선택해 주세요');
  }
  if (
    !Number.isInteger(input.partySize) ||
    input.partySize < PARTY_SIZE_MIN ||
    input.partySize > PARTY_SIZE_MAX
  ) {
    throw validationError(`식사 인원은 ${PARTY_SIZE_MIN}~${PARTY_SIZE_MAX}명이에요`);
  }
  if (input.items.length === 0 || input.items.some((i) => !Number.isInteger(i.quantity) || i.quantity < 1)) {
    throw validationError('메뉴를 담아 주세요');
  }
  if ((input.requestNote ?? '').length > REQUEST_NOTE_MAX) {
    throw validationError(`요청사항은 ${REQUEST_NOTE_MAX}자까지 쓸 수 있어요`);
  }
}

export const mockOrdersApi: OrdersApi = {
  async createOrder(input) {
    await delay();
    const user = await requireUser('employee');
    validateInput(input);

    const restaurant = db.findRestaurant(input.restaurantId);
    if (!restaurant || !restaurant.isActive) {
      throw new ApiError('NOT_FOUND', '음식점을 찾을 수 없어요', 404);
    }
    if (!restaurant.isAcceptingOrders) {
      throw new ApiError('RESTAURANT_NOT_ACCEPTING', ERROR_MESSAGES.RESTAURANT_NOT_ACCEPTING, 409);
    }
    const current = now();
    const currentTime = toTimeString(current);
    if (currentTime > restaurant.orderDeadline) {
      throw new ApiError('ORDER_CLOSED', ERROR_MESSAGES.ORDER_CLOSED, 409);
    }
    if (input.arrivalTime < currentTime) {
      throw validationError('이미 지난 도착 시간이에요');
    }

    // 금액은 앱이 보낸 값을 믿지 않고 메뉴 가격으로 다시 계산
    const items: OrderItem[] = input.items.map(({ menuId, quantity }) => {
      const menu = db.findMenu(menuId);
      if (!menu || menu.restaurantId !== restaurant.id) {
        throw validationError('메뉴를 찾을 수 없어요');
      }
      if (menu.isSoldOut) throw new ApiError('MENU_SOLD_OUT', ERROR_MESSAGES.MENU_SOLD_OUT, 409);
      return { menuId, menuName: menu.name, quantity, unitPrice: menu.price };
    });

    const requestNote = input.requestNote?.trim();
    return db.insertOrder({
      orderDate: toDateString(current),
      arrivalTime: input.arrivalTime,
      partySize: input.partySize,
      status: 'requested',
      ...(requestNote ? { requestNote } : {}),
      items,
      totalPrice: items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
      employee: { id: user.id, name: user.name, companyName: user.companyName ?? '' },
      restaurant: { id: restaurant.id, name: restaurant.name },
      createdAt: toDateTimeString(current),
    });
  },

  async getMyOrders(scope) {
    await delay();
    const user = await requireUser('employee');
    const statuses = EMPLOYEE_SCOPE_STATUSES[scope];
    if (!statuses) throw validationError('scope 값이 올바르지 않아요');
    const orders = db.listOrders((o) => o.employee.id === user.id && statuses.includes(o.status));
    // active: 도착 시간 빠른 순 / past: 최신 순
    return scope === 'active'
      ? orders.sort((a, b) => (a.orderDate + a.arrivalTime).localeCompare(b.orderDate + b.arrivalTime))
      : orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getMyOrder(orderId) {
    await delay();
    const user = await requireUser('employee');
    const order = db.findOrder(orderId);
    if (!order || order.employee.id !== user.id) {
      throw new ApiError('NOT_FOUND', '주문을 찾을 수 없어요', 404);
    }
    return order;
  },
};
