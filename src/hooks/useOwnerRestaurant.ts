// 사장님 본인 음식점 정보 (API-26) — S-09 헤더 음식점명
import { api } from '@/src/api';
import { useAsync } from './useAsync';

export function useOwnerRestaurant() {
  return useAsync(() => api.owner.getMyRestaurant(), []);
}
