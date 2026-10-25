// S-04 음식점 상세 — 메뉴판 (F-04, F-05, F-20)
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { Banner } from '@/src/components/common/Banner';
import { BottomBar } from '@/src/components/common/BottomBar';
import { Button } from '@/src/components/common/Button';
import { ConfirmModal } from '@/src/components/common/ConfirmModal';
import { EmptyState } from '@/src/components/common/EmptyState';
import { ErrorView } from '@/src/components/common/ErrorView';
import { Header } from '@/src/components/common/Header';
import { Loading } from '@/src/components/common/Loading';
import { MenuItemRow } from '@/src/components/domain/MenuItemRow';
import { colors } from '@/src/constants/colors';
import { ERROR_MESSAGES } from '@/src/constants/messages';
import { layout, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';
import { useCart } from '@/src/contexts/CartContext';
import { useRestaurantDetail } from '@/src/hooks/useRestaurantDetail';
import type { Menu } from '@/src/types/models';
import { now } from '@/src/utils/clock';
import { formatPrice, toTimeString } from '@/src/utils/format';
import { isOrderable } from '@/src/utils/timeSlots';

export default function RestaurantMenuScreen() {
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();
  const { data, isLoading, isRefreshing, error, refresh } = useRestaurantDetail(restaurantId ?? null);
  const { cart, totalCount, totalPrice, addItem, changeQuantity } = useCart();
  // 다른 음식점 메뉴가 담겨 있을 때 담으려던 메뉴 (확인 모달용)
  const [pendingMenu, setPendingMenu] = useState<Menu | null>(null);

  const restaurant = data?.restaurant;
  const goBack = () => router.back();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="" onBack={goBack} />
        <Loading />
      </View>
    );
  }
  if (!restaurant || (error && !data)) {
    return (
      <View style={styles.container}>
        <Header title="" onBack={goBack} />
        <ErrorView message="메뉴를 불러오지 못했어요" onRetry={refresh} />
      </View>
    );
  }

  const orderable = isOrderable(restaurant, toTimeString(now()));
  const isThisRestaurantCart = cart.restaurantId === restaurant.id;
  const quantityOf = (menuId: string) =>
    isThisRestaurantCart ? (cart.items.find((i) => i.menuId === menuId)?.quantity ?? 0) : 0;

  const handleAdd = (menu: Menu) => {
    if (!addItem(restaurant, menu)) setPendingMenu(menu);
  };

  return (
    <View style={styles.container}>
      <Header title={restaurant.name} onBack={goBack} />
      {!orderable ? (
        <Banner
          type="info"
          message={restaurant.isAcceptingOrders ? ERROR_MESSAGES.ORDER_CLOSED : ERROR_MESSAGES.RESTAURANT_NOT_ACCEPTING}
        />
      ) : null}

      <FlatList
        data={data.menus}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} />
        }
        ListHeaderComponent={
          <View style={styles.info}>
            <Text style={styles.infoText}>
              {restaurant.location} · {restaurant.openTime}~{restaurant.closeTime} · {restaurant.phone}
            </Text>
          </View>
        }
        ListEmptyComponent={<EmptyState icon="fast-food-outline" title="아직 등록된 메뉴가 없어요" />}
        renderItem={({ item }) => (
          <MenuItemRow
            menu={item}
            quantity={quantityOf(item.id)}
            canAdd={orderable}
            onAdd={() => handleAdd(item)}
            onChangeQuantity={(q) => changeQuantity(item.id, q)}
          />
        )}
      />

      {isThisRestaurantCart && totalCount > 0 ? (
        <BottomBar>
          <View style={styles.cartRow}>
            <View style={styles.cartSummary}>
              <Ionicons name="cart-outline" size={20} color={colors.text} />
              <Text style={styles.cartText}>
                {totalCount}개 · {formatPrice(totalPrice)}
              </Text>
            </View>
            <Button
              title="주문하기"
              fullWidth={false}
              onPress={() => router.push('/employee/home/cart')}
              style={styles.orderButton}
            />
          </View>
        </BottomBar>
      ) : null}

      <ConfirmModal
        visible={pendingMenu !== null}
        title="장바구니를 비울까요?"
        description="다른 음식점 메뉴가 담겨 있어요. 한 번에 한 음식점만 주문할 수 있어요."
        confirmLabel="비우고 담기"
        onCancel={() => setPendingMenu(null)}
        onConfirm={() => {
          if (pendingMenu) addItem(restaurant, pendingMenu, { replace: true });
          setPendingMenu(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    flexGrow: 1,
  },
  info: {
    paddingHorizontal: layout.screenPadding,
    paddingVertical: space.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoText: {
    ...typography.sub,
    color: colors.textSub,
  },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  cartSummary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  cartText: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  orderButton: {
    paddingHorizontal: space.xl,
  },
});
