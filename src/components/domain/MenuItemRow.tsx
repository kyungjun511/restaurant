// design-spec.md 3.5 메뉴 항목: 왼쪽 사진(64×64) + 메뉴명·설명·가격 + 오른쪽 "담기" / 수량 조절기 / 품절
import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/src/components/common/Badge';
import { Button } from '@/src/components/common/Button';
import { PhotoPlaceholder } from '@/src/components/common/PhotoPlaceholder';
import { Stepper } from '@/src/components/common/Stepper';
import { badgeColors, colors } from '@/src/constants/colors';
import { layout, radius, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';
import type { Menu } from '@/src/types/models';
import { formatPrice } from '@/src/utils/format';

interface MenuItemRowProps {
  menu: Menu;
  quantity: number;   // 장바구니에 담긴 수량 (0이면 "담기" 버튼)
  canAdd: boolean;    // 주문 마감·주문 안 받는 음식점이면 false
  onAdd: () => void;
  onChangeQuantity: (quantity: number) => void;
}

export function MenuItemRow({ menu, quantity, canAdd, onAdd, onChangeQuantity }: MenuItemRowProps) {
  const soldOut = menu.isSoldOut;

  return (
    <View style={styles.row}>
      <PhotoPlaceholder uri={menu.imageUrl} icon="fast-food-outline" iconSize={24} style={styles.photo} />
      <View style={styles.info}>
        <Text style={[styles.name, soldOut && styles.disabledText]} numberOfLines={2}>
          {menu.name}
        </Text>
        {menu.description ? (
          <Text style={[styles.description, soldOut && styles.disabledText]} numberOfLines={1}>
            {menu.description}
          </Text>
        ) : null}
        <Text style={[styles.price, soldOut && styles.disabledText]}>{formatPrice(menu.price)}</Text>
      </View>
      <View style={styles.action}>
        {soldOut ? (
          <Badge label="품절" backgroundColor={badgeColors.soldOut.background} color={badgeColors.soldOut.text} />
        ) : quantity > 0 ? (
          <Stepper
            value={quantity}
            min={0}
            onChange={onChangeQuantity}
            unit="개"
            label={`${menu.name} 수량`}
          />
        ) : (
          <Button title="담기" variant="secondary" size="small" disabled={!canAdd} onPress={onAdd} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: space.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: radius.control,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.body,
    color: colors.text,
  },
  description: {
    ...typography.sub,
    color: colors.textSub,
  },
  price: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  disabledText: {
    color: colors.disabled,
  },
  action: {
    flexShrink: 0,
  },
});
