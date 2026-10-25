// S-03 음식점 목록 (API-07)
import { api } from '@/src/api';
import { useAsync } from './useAsync';

export function useRestaurants() {
  return useAsync(() => api.restaurants.getRestaurants(), []);
}
