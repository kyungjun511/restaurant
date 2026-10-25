// S-03 홈 — 음식점 목록 (F-03, F-21, F-22)
import { router } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { Banner } from '@/src/components/common/Banner';
import { EmptyState } from '@/src/components/common/EmptyState';
import { ErrorView } from '@/src/components/common/ErrorView';
import { Header } from '@/src/components/common/Header';
import { Loading } from '@/src/components/common/Loading';
import { RestaurantCard } from '@/src/components/domain/RestaurantCard';
import { colors } from '@/src/constants/colors';
import { DEFAULT_ORDER_DEADLINE } from '@/src/constants/rules';
import { layout, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRefreshOnFocus } from '@/src/hooks/useRefreshOnFocus';
import { useRestaurants } from '@/src/hooks/useRestaurants';
import { now } from '@/src/utils/clock';
import { toTimeString } from '@/src/utils/format';
import { isOrderable } from '@/src/utils/timeSlots';

export default function EmployeeHomeScreen() {
  const { user } = useAuth();
  const { data, isLoading, isRefreshing, error, refresh } = useRestaurants();
  useRefreshOnFocus(refresh);

  const nowTime = toTimeString(now());
  const closedForToday = nowTime > DEFAULT_ORDER_DEADLINE;

  const renderBody = () => {
    if (isLoading) return <Loading />;
    if (error && !data) return <ErrorView message="음식점을 불러오지 못했어요" onRetry={refresh} />;
    return (
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} />
        }
        ListEmptyComponent={<EmptyState icon="restaurant-outline" title="아직 등록된 음식점이 없어요" />}
        renderItem={({ item }) => (
          <RestaurantCard
            restaurant={item}
            orderable={isOrderable(item, nowTime)}
            onPress={() => router.push(`/employee/home/restaurant/${item.id}`)}
          />
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="점심 미리주문"
        right={
          <Text style={styles.user} numberOfLines={1}>
            {user?.companyName} {user?.name}
          </Text>
        }
      />
      <Banner
        type="info"
        message={closedForToday ? '오늘 주문이 마감됐어요' : `오늘 주문 마감 ${DEFAULT_ORDER_DEADLINE}`}
      />
      {renderBody()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  user: {
    ...typography.sub,
    color: colors.textSub,
  },
  list: {
    flexGrow: 1,
    padding: layout.screenPadding,
    gap: space.lg,
  },
});
