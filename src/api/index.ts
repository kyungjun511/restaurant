// dev-spec.md 5.2 ⑤ mock / http 중 하나를 골라 내보냄. 훅·Context는 여기서만 import
import { env } from '@/src/config/env';
import { ApiError } from '@/src/types/api';
import type { Api } from './contracts';
import { httpAuthApi } from './http/auth';
import { httpOrdersApi } from './http/orders';
import { httpOwnerApi } from './http/owner';
import { httpRestaurantsApi } from './http/restaurants';
import { mockAuthApi } from './mock/auth';
import { mockOrdersApi } from './mock/orders';
import { mockOwnerApi } from './mock/owner';
import { mockRestaurantsApi } from './mock/restaurants';

const selected: Api = env.useMock
  ? { auth: mockAuthApi, restaurants: mockRestaurantsApi, orders: mockOrdersApi, owner: mockOwnerApi }
  : { auth: httpAuthApi, restaurants: httpRestaurantsApi, orders: httpOrdersApi, owner: httpOwnerApi };

// dev-spec.md 9.3 "401 오류 → 어느 화면이든 logout()"
// 토큰 없음·만료(UNAUTHORIZED)가 나면 등록된 처리 함수(AuthContext의 로그아웃)를 부름
let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

function withUnauthorizedHandler<T extends object>(group: T): T {
  const wrapped = {} as Record<string, unknown>;
  for (const [name, fn] of Object.entries(group)) {
    wrapped[name] = async (...args: unknown[]) => {
      try {
        return await (fn as (...a: unknown[]) => Promise<unknown>)(...args);
      } catch (error) {
        if (error instanceof ApiError && error.code === 'UNAUTHORIZED') unauthorizedHandler?.();
        throw error;
      }
    };
  }
  return wrapped as T;
}

export const api: Api = {
  auth: withUnauthorizedHandler(selected.auth),
  restaurants: withUnauthorizedHandler(selected.restaurants),
  orders: withUnauthorizedHandler(selected.orders),
  owner: withUnauthorizedHandler(selected.owner),
};
