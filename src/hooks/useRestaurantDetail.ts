// S-04 음식점 정보 + 메뉴 (API-08, API-09), S-05 마감 시간 확인 (API-08)
// restaurantId가 없으면(빈 장바구니) 아무것도 부르지 않고 null
import { api } from '@/src/api';
import type { Menu, Restaurant } from '@/src/types/models';
import { useAsync } from './useAsync';

export interface RestaurantDetail {
  restaurant: Restaurant;
  menus: Menu[];
}

export function useRestaurantDetail(restaurantId: string | null) {
  return useAsync<RestaurantDetail | null>(async () => {
    if (!restaurantId) return null;
    const [restaurant, menus] = await Promise.all([
      api.restaurants.getRestaurant(restaurantId),
      api.restaurants.getMenus(restaurantId),
    ]);
    return { restaurant, menus };
  }, [restaurantId]);
}
