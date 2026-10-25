// API-15 ~ API-19, API-26 mock 구현 (사장님)
import { ERROR_MESSAGES } from '@/src/constants/messages';
import { canTransition, OWNER_TAB_STATUSES, REJECT_REASONS } from '@/src/constants/orderStatus';
import { db } from '@/src/mocks/db';
import type { MockUser } from '@/src/mocks/data/users';
import { delay } from '@/src/mocks/delay';
import { ApiError } from '@/src/types/api';
import type { Order, OrderStatus, OwnerNextStatus, OwnerOrderTab } from '@/src/types/models';
import { now } from '@/src/utils/clock';
import { toDateString } from '@/src/utils/format';
import type { OwnerApi } from '../contracts';
import { requireUser } from './session';

const OWNER_NEXT_STATUSES: OwnerNextStatus[] = ['preparing', 'ready', 'served', 'no_show'];
const TABS: OwnerOrderTab[] = ['new', 'active', 'done'];

// 본인 음식점 주문만 꺼냄
function findOwnOrder(owner: MockUser, orderId: string): Order {
  const order = db.findOrder(orderId);
  if (!order) throw new ApiError('NOT_FOUND', '주문을 찾을 수 없어요', 404);
  if (order.restaurant.id !== owner.restaurantId) {
    throw new ApiError('FORBIDDEN', ERROR_MESSAGES.FORBIDDEN, 403);
  }
  return order;
}

function transitionError(order: Order) {
  const message =
    order.status === 'cancelled' ? '직원이 취소한 주문이에요' : ERROR_MESSAGES.INVALID_STATUS_TRANSITION;
  return new ApiError('INVALID_STATUS_TRANSITION', message, 409);
}

function changeStatus(owner: MockUser, orderId: string, next: OrderStatus, patch: Partial<Order> = {}) {
  const order = findOwnOrder(owner, orderId);
  if (!canTransition(order.status, next)) throw transitionError(order);
  return db.updateOrder(orderId, { ...patch, status: next });
}

export const mockOwnerApi: OwnerApi = {
  async getOrders({ date, tab }) {
    await delay();
    const owner = await requireUser('owner');
    if (!TABS.includes(tab)) throw new ApiError('VALIDATION_ERROR', 'tab 값이 올바르지 않아요', 400);
    const day = date ?? toDateString(now());
    const todays = db.listOrders((o) => o.restaurant.id === owner.restaurantId && o.orderDate === day);
    const counts = Object.fromEntries(
      TABS.map((t) => [t, todays.filter((o) => OWNER_TAB_STATUSES[t].includes(o.status)).length]),
    ) as Record<OwnerOrderTab, number>;
    const orders = todays
      .filter((o) => OWNER_TAB_STATUSES[tab].includes(o.status))
      .sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime));
    return { counts, orders };
  },

  async getOrder(orderId) {
    await delay();
    const owner = await requireUser('owner');
    return findOwnOrder(owner, orderId);
  },

  async acceptOrder(orderId) {
    await delay();
    return changeStatus(await requireUser('owner'), orderId, 'accepted');
  },

  async rejectOrder(orderId, reason) {
    await delay();
    const owner = await requireUser('owner');
    if (!REJECT_REASONS.includes(reason)) {
      throw new ApiError('VALIDATION_ERROR', '거절 사유를 선택해 주세요', 400);
    }
    return changeStatus(owner, orderId, 'rejected', { rejectReason: reason });
  },

  async updateOrderStatus(orderId, status) {
    await delay();
    const owner = await requireUser('owner');
    if (!OWNER_NEXT_STATUSES.includes(status)) {
      throw new ApiError('VALIDATION_ERROR', ERROR_MESSAGES.VALIDATION_ERROR, 400);
    }
    return changeStatus(owner, orderId, status);
  },

  async getMyRestaurant() {
    await delay();
    const owner = await requireUser('owner');
    const restaurant = owner.restaurantId ? db.findRestaurant(owner.restaurantId) : undefined;
    if (!restaurant) throw new ApiError('NOT_FOUND', '음식점을 찾을 수 없어요', 404);
    return restaurant;
  },
};
