// API-07 ~ API-09 실제 서버 호출
import { request } from '../client';
import type { RestaurantsApi } from '../contracts';

export const httpRestaurantsApi: RestaurantsApi = {
  getRestaurants: () => request('GET', '/restaurants'),
  getRestaurant: (restaurantId) => request('GET', `/restaurants/${restaurantId}`),
  getMenus: (restaurantId) => request('GET', `/restaurants/${restaurantId}/menus`),
};
