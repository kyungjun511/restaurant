// API-07 ~ API-09 mock 구현
import { db } from '@/src/mocks/db';
import { delay } from '@/src/mocks/delay';
import { ApiError } from '@/src/types/api';
import type { RestaurantsApi } from '../contracts';
import { requireUser } from './session';

function findActiveRestaurant(restaurantId: string) {
  const restaurant = db.findRestaurant(restaurantId);
  if (!restaurant || !restaurant.isActive) {
    throw new ApiError('NOT_FOUND', '음식점을 찾을 수 없어요', 404);
  }
  return restaurant;
}

export const mockRestaurantsApi: RestaurantsApi = {
  async getRestaurants() {
    await delay();
    await requireUser('employee');
    return db.listRestaurants().filter((r) => r.isActive);
  },

  async getRestaurant(restaurantId) {
    await delay();
    await requireUser('employee');
    return findActiveRestaurant(restaurantId);
  },

  async getMenus(restaurantId) {
    await delay();
    await requireUser('employee');
    findActiveRestaurant(restaurantId);
    return db.listMenus(restaurantId);
  },
};
