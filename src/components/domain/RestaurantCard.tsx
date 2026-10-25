// design-spec.md 3.4 음식점 카드: 대표 사진(16:9) + 이름 + 위치·영업시간 + 영업 배지
import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/src/components/common/Badge';
import { Card } from '@/src/components/common/Card';
import { PhotoPlaceholder } from '@/src/components/common/PhotoPlaceholder';
import { badgeColors, colors } from '@/src/constants/colors';
import { layout, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';
import type { Restaurant } from '@/src/types/models';

interface RestaurantCardProps {
  restaurant: Restaurant;
  orderable: boolean; // false면 "오늘 주문 마감" + 흐리게 (눌러서 메뉴판은 볼 수 있음)
  onPress: () => void;
}

export function RestaurantCard({ restaurant, orderable, onPress }: RestaurantCardProps) {
  const badge = orderable ? badgeColors.open : badgeColors.closed;

  return (
    <Card onPress={onPress} dimmed={!orderable} padded={false}>
      <PhotoPlaceholder uri={restaurant.imageUrl} icon="restaurant-outline" iconSize={40} style={styles.photo} />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <Badge
            label={orderable ? '영업 중' : '오늘 주문 마감'}
            backgroundColor={badge.background}
            color={badge.text}
          />
        </View>
        <Text style={styles.meta}>
          {restaurant.location} · {restaurant.openTime}~{restaurant.closeTime}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  photo: {
    aspectRatio: 16 / 9,
    width: '100%',
  },
  body: {
    padding: layout.cardPadding,
    gap: space.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  name: {
    ...typography.sectionTitle,
    flex: 1,
    color: colors.text,
  },
  meta: {
    ...typography.sub,
    color: colors.textSub,
  },
});
