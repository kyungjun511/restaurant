// S-09 오늘의 주문 (F-15, F-14 대체안)
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/src/components/common/EmptyState';
import { ErrorView } from '@/src/components/common/ErrorView';
import { Header } from '@/src/components/common/Header';
import { Loading } from '@/src/components/common/Loading';
import { SegmentedTab } from '@/src/components/common/SegmentedTab';
import { OwnerOrderCard } from '@/src/components/domain/OwnerOrderCard';
import { colors } from '@/src/constants/colors';
import { COMMON_MESSAGES } from '@/src/constants/messages';
import { layout, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';
import { useOwnerOrders } from '@/src/hooks/useOwnerOrders';
import { useOwnerRestaurant } from '@/src/hooks/useOwnerRestaurant';
import { useRefreshOnFocus } from '@/src/hooks/useRefreshOnFocus';
import type { OwnerOrderTab } from '@/src/types/models';
import { now } from '@/src/utils/clock';
import { formatKoreanDate, toDateString, toTimeString } from '@/src/utils/format';

const TAB_LABEL: Record<OwnerOrderTab, string> = { new: '신규', active: '진행 중', done: '완료' };

const EMPTY: Record<OwnerOrderTab, { title: string; description?: string }> = {
  new: { title: '새 주문이 없어요', description: '아래로 당기면 새 주문을 확인해요' },
  active: { title: '진행 중인 주문이 없어요' },
  done: { title: '완료된 주문이 없어요' },
};

export default function OwnerOrdersScreen() {
  const [tab, setTab] = useState<OwnerOrderTab>('new');
  const { data, isLoading, isRefreshing, error, refresh, updatedAt } = useOwnerOrders(tab);
  const restaurant = useOwnerRestaurant();
  useRefreshOnFocus(refresh);

  const counts = data?.counts;
  const tabs = (Object.keys(TAB_LABEL) as OwnerOrderTab[]).map((key) => ({
    key,
    label: TAB_LABEL[key],
    count: counts?.[key],
  }));

  const renderBody = () => {
    if (isLoading) return <Loading />;
    if (error && !data) return <ErrorView message="주문을 불러오지 못했어요" onRetry={refresh} />;
    return (
      <FlatList
        data={data?.orders ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} />
        }
        ListEmptyComponent={
          <EmptyState icon="list-outline" title={EMPTY[tab].title} description={EMPTY[tab].description} />
        }
        renderItem={({ item }) => (
          <OwnerOrderCard order={item} onPress={() => router.push(`/owner/orders/${item.id}`)} />
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={restaurant.data?.name ?? '오늘의 주문'}
        right={<Text style={styles.date}>{formatKoreanDate(toDateString(now()))}</Text>}
      />
      <View style={styles.tabs}>
        <SegmentedTab items={tabs} value={tab} onChange={setTab} />
      </View>
      <Text style={styles.refreshed}>
        {updatedAt ? `마지막 새로고침 ${toTimeString(updatedAt)} · ` : ''}
        {COMMON_MESSAGES.pullToRefresh}
      </Text>
      {renderBody()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  date: {
    ...typography.sub,
    color: colors.textSub,
  },
  tabs: {
    backgroundColor: colors.surface,
  },
  refreshed: {
    ...typography.caption,
    color: colors.textSub,
    paddingHorizontal: layout.screenPadding,
    paddingTop: space.sm,
  },
  list: {
    flexGrow: 1,
    padding: layout.screenPadding,
    gap: space.md,
  },
});
