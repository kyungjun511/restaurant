// 직원 영역: 하단 탭 (홈 / 내 주문 / 마이). 직원이 아니면 /login
import { Tabs } from 'expo-router/js-tabs';

import { tabIcon, tabScreenOptions } from '@/src/components/common/TabIcon';
import { RoleGate } from '@/src/components/domain/RoleGate';

export default function EmployeeLayout() {
  return (
    <RoleGate role="employee">
      <Tabs screenOptions={tabScreenOptions}>
        <Tabs.Screen name="home" options={{ title: '홈', tabBarIcon: tabIcon('restaurant') }} />
        <Tabs.Screen name="orders" options={{ title: '내 주문', tabBarIcon: tabIcon('receipt') }} />
        <Tabs.Screen name="my" options={{ title: '마이', tabBarIcon: tabIcon('person') }} />
      </Tabs>
    </RoleGate>
  );
}
