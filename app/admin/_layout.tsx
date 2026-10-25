// 총괄 관리자 영역: 하단 탭 (회사 / 음식점 / 주문 현황). 총괄 관리자가 아니면 /login
import { Tabs } from 'expo-router/js-tabs';

import { tabIcon, tabScreenOptions } from '@/src/components/common/TabIcon';
import { RoleGate } from '@/src/components/domain/RoleGate';

export default function AdminLayout() {
  return (
    <RoleGate role="super_admin">
      <Tabs screenOptions={tabScreenOptions}>
        <Tabs.Screen name="companies" options={{ title: '회사', tabBarIcon: tabIcon('business') }} />
        <Tabs.Screen name="restaurants" options={{ title: '음식점', tabBarIcon: tabIcon('storefront') }} />
        <Tabs.Screen name="orders" options={{ title: '주문 현황', tabBarIcon: tabIcon('stats-chart') }} />
      </Tabs>
    </RoleGate>
  );
}
