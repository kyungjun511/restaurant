// 장바구니 (dev-spec.md 9.1, F-05). 기기 메모리에만 있고 주문 요청 때 API-10으로 보냄
// [가정] 한 번에 한 음식점 메뉴만 담을 수 있음
// 장바구니는 담은 사용자 id와 함께 저장 → 로그아웃·다른 계정 로그인 시 자동으로 빈 장바구니
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { Cart, Menu, Restaurant } from '@/src/types/models';
import { useAuth } from './AuthContext';

const EMPTY_CART: Cart = { restaurantId: null, restaurantName: null, items: [] };

interface CartContextValue {
  cart: Cart;
  totalCount: number;
  totalPrice: number;
  // 다른 음식점 메뉴가 담겨 있으면 담지 않고 false (화면이 확인 모달 표시). replace: true면 비우고 담음
  addItem: (restaurant: Restaurant, menu: Menu, options?: { replace?: boolean }) => boolean;
  changeQuantity: (menuId: string, quantity: number) => void; // 0이면 빼기
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [stored, setStored] = useState<{ userId: string | null; cart: Cart }>({
    userId: null,
    cart: EMPTY_CART,
  });

  const cart = stored.userId === userId ? stored.cart : EMPTY_CART;

  const update = useCallback(
    (change: (current: Cart) => Cart) => {
      setStored((prev) => {
        const current = prev.userId === userId ? prev.cart : EMPTY_CART;
        const next = change(current);
        return { userId, cart: next.items.length === 0 ? EMPTY_CART : next };
      });
    },
    [userId],
  );

  const addItem = useCallback(
    (restaurant: Restaurant, menu: Menu, options?: { replace?: boolean }) => {
      if (!options?.replace && cart.restaurantId !== null && cart.restaurantId !== restaurant.id) {
        return false;
      }
      update((current) => {
        const base = current.restaurantId === restaurant.id ? current : EMPTY_CART;
        const existing = base.items.find((i) => i.menuId === menu.id);
        const items = existing
          ? base.items.map((i) => (i.menuId === menu.id ? { ...i, quantity: i.quantity + 1 } : i))
          : [...base.items, { menuId: menu.id, name: menu.name, price: menu.price, quantity: 1 }];
        return { restaurantId: restaurant.id, restaurantName: restaurant.name, items };
      });
      return true;
    },
    [cart.restaurantId, update],
  );

  const changeQuantity = useCallback(
    (menuId: string, quantity: number) => {
      update((current) => ({
        ...current,
        items:
          quantity <= 0
            ? current.items.filter((i) => i.menuId !== menuId)
            : current.items.map((i) => (i.menuId === menuId ? { ...i, quantity } : i)),
      }));
    },
    [update],
  );

  const clear = useCallback(() => update(() => EMPTY_CART), [update]);

  const value = useMemo(
    () => ({
      cart,
      totalCount: cart.items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      addItem,
      changeQuantity,
      clear,
    }),
    [cart, addItem, changeQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart는 CartProvider 안에서만 쓸 수 있어요');
  return context;
}
