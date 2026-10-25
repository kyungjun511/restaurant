// 사장님 영역: 하단 탭 (주문 / 요약 / 메뉴 / 설정). 사장님이 아니면 /login
import { Tabs } from 'expo-router/js-tabs';

import { tabIcon, tabScreenOptions } from '@/src/components/common/TabIcon';
import { RoleGate } from '@/src/components/domain/RoleGate';

export default function OwnerLayout() {
  return (
    <RoleGate role="owner">
      <Tabs screenOptions={tabScreenOptions}>
        <Tabs.Screen name="orders" options={{ title: '주문', tabBarIcon: tabIcon('list') }} />
        <Tabs.Screen name="summary" options={{ title: '요약', tabBarIcon: tabIcon('time') }} />
        <Tabs.Screen name="menus" options={{ title: '메뉴', tabBarIcon: tabIcon('fast-food') }} />
        <Tabs.Screen name="settings" options={{ title: '설정', tabBarIcon: tabIcon('settings') }} />
      </Tabs>
    </RoleGate>
  );
}
