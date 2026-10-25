// S-05 장바구니 / 주문하기 (F-05, F-06, F-07, F-08)
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Banner } from '@/src/components/common/Banner';
import { BottomBar } from '@/src/components/common/BottomBar';
import { Button } from '@/src/components/common/Button';
import { Chip } from '@/src/components/common/Chip';
import { EmptyState } from '@/src/components/common/EmptyState';
import { Header } from '@/src/components/common/Header';
import { Input } from '@/src/components/common/Input';
import { Stepper } from '@/src/components/common/Stepper';
import { colors } from '@/src/constants/colors';
import { COMMON_MESSAGES, ERROR_MESSAGES, getErrorMessage } from '@/src/constants/messages';
import { PARTY_SIZE_MAX, PARTY_SIZE_MIN, REQUEST_NOTE_MAX } from '@/src/constants/rules';
import { layout, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';
import { useCart } from '@/src/contexts/CartContext';
import { useCreateOrder } from '@/src/hooks/useCreateOrder';
import { useRestaurantDetail } from '@/src/hooks/useRestaurantDetail';
import { useTimedBanner } from '@/src/hooks/useTimedBanner';
import { now } from '@/src/utils/clock';
import { formatPrice, toTimeString } from '@/src/utils/format';
import { getArrivalSlots, isOrderable } from '@/src/utils/timeSlots';

export default function CartScreen() {
  const { cart, totalPrice, changeQuantity, clear } = useCart();
  // 주문 마감 확인용 음식점 정보 (API-08)
  const detail = useRestaurantDetail(cart.restaurantId);
  const { createOrder, isSubmitting } = useCreateOrder();
  const { banner, show } = useTimedBanner();

  const [arrivalTime, setArrivalTime] = useState<string | null>(null);
  const [partySize, setPartySize] = useState(PARTY_SIZE_MIN);
  const [requestNote, setRequestNote] = useState('');

  const goBack = () => router.back();

  if (cart.items.length === 0 || !cart.restaurantId) {
    return (
      <View style={styles.container}>
        <Header title="주문하기" onBack={goBack} />
        <EmptyState
          icon="cart-outline"
          title="장바구니가 비었어요"
          actionLabel="메뉴 보러 가기"
          onAction={goBack}
        />
      </View>
    );
  }

  const nowTime = toTimeString(now());
  const slots = getArrivalSlots(nowTime);
  const restaurant = detail.data?.restaurant;
  const closed = restaurant ? !isOrderable(restaurant, nowTime) : false;
  const selectedSlotValid = slots.some((s) => s.time === arrivalTime && !s.disabled);
  const canSubmit = selectedSlotValid && !closed && !detail.isLoading && !isSubmitting;
  const restaurantId = cart.restaurantId;

  const submit = async () => {
    if (!canSubmit || !arrivalTime) return;
    try {
      const order = await createOrder({
        restaurantId,
        arrivalTime,
        partySize,
        requestNote: requestNote.trim() || undefined,
        items: cart.items.map((i) => ({ menuId: i.menuId, quantity: i.quantity })),
      });
      if (!order) return;
      // 주문 완료 화면은 뒤로가기를 막기 위해 replace (dev-spec.md 9.4)
      router.replace(`/employee/home/order-complete/${order.id}`);
      clear();
    } catch (e) {
      show('error', getErrorMessage(e) || '주문을 보내지 못했어요. 다시 시도해 주세요');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="주문하기" onBack={goBack} />
      {banner ? <Banner type={banner.type} message={banner.message} /> : null}
      {closed && restaurant ? (
        <Banner
          type="info"
          message={restaurant.isAcceptingOrders ? ERROR_MESSAGES.ORDER_CLOSED : ERROR_MESSAGES.RESTAURANT_NOT_ACCEPTING}
        />
      ) : null}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={layout.headerHeight}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          pointerEvents={isSubmitting ? 'none' : 'auto'}
        >
          {/* 담은 메뉴 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{cart.restaurantName}</Text>
            {cart.items.map((item) => (
              <View key={item.menuId} style={styles.itemRow}>
                <View style={styles.flex}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                </View>
                <Stepper
                  value={item.quantity}
                  min={0}
                  onChange={(q) => changeQuantity(item.menuId, q)}
                  unit="개"
                  label={`${item.name} 수량`}
                />
              </View>
            ))}
          </View>

          {/* 도착 시간 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>도착 시간</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {slots.map((slot) => (
                <Chip
                  key={slot.time}
                  label={slot.time}
                  selected={slot.time === arrivalTime}
                  disabled={slot.disabled}
                  onPress={() => setArrivalTime(slot.time)}
                />
              ))}
            </ScrollView>
            {!selectedSlotValid ? <Text style={styles.hint}>도착 시간을 선택해 주세요</Text> : null}
          </View>

          {/* 식사 인원 */}
          <View style={[styles.section, styles.inlineSection]}>
            <Text style={styles.sectionTitle}>식사 인원</Text>
            <Stepper
              value={partySize}
              min={PARTY_SIZE_MIN}
              max={PARTY_SIZE_MAX}
              onChange={setPartySize}
              unit="명"
              label="식사 인원"
            />
          </View>

          {/* 요청사항 */}
          <View style={styles.section}>
            <Input
              label="요청사항 (선택)"
              placeholder="예: 덜 맵게 해주세요"
              value={requestNote}
              onChangeText={setRequestNote}
              maxLength={REQUEST_NOTE_MAX}
              hint={`${requestNote.length}/${REQUEST_NOTE_MAX}`}
              returnKeyType="done"
            />
          </View>

          {/* 결제 안내 + 합계 */}
          <View style={styles.section}>
            <Text style={styles.hint}>{COMMON_MESSAGES.paymentOnSite}</Text>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>합계</Text>
              <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
            </View>
          </View>
        </ScrollView>

        <BottomBar>
          <Button title="주문 요청하기" onPress={submit} disabled={!canSubmit} loading={isSubmitting} />
        </BottomBar>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingVertical: space.sm,
    gap: space.sm,
  },
  section: {
    backgroundColor: colors.surface,
    padding: layout.screenPadding,
    gap: space.md,
  },
  inlineSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.text,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  itemName: {
    ...typography.body,
    color: colors.text,
  },
  itemPrice: {
    ...typography.sub,
    color: colors.textSub,
  },
  chips: {
    gap: space.sm,
  },
  hint: {
    ...typography.sub,
    color: colors.textSub,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  totalPrice: {
    ...typography.sectionTitle,
    color: colors.text,
  },
});
