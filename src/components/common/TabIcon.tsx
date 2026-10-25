// design-spec.md 3.10 탭바: 아이콘 24, 선택 = 채운 아이콘 / 기본 = 선 아이콘
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

import { colors } from '@/src/constants/colors';
import { layout } from '@/src/constants/spacing';

type IconName = ComponentProps<typeof Ionicons>['name'];

// 사용 예: options={{ tabBarIcon: tabIcon('restaurant') }} → 선택 시 'restaurant', 기본 'restaurant-outline'
export function tabIcon(name: string) {
  return function TabBarIcon({ focused, color }: { focused: boolean; color: ColorValue }) {
    const iconName = (focused ? name : `${name}-outline`) as IconName;
    // 탭바는 tabScreenOptions의 문자열 색(주요색·보조 글자색)을 그대로 넘겨줌
    return <Ionicons name={iconName} size={24} color={color as string} />;
  };
}

// 하단 탭 공통 옵션 (헤더는 각 화면의 Header 컴포넌트를 씀)
export const tabScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textSub,
  tabBarLabelStyle: { fontSize: 12 },
  tabBarStyle: { minHeight: layout.headerHeight, backgroundColor: colors.surface },
} as const;
