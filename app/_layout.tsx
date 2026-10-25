// 앱 최상위 틀: Provider 감싸기 (dev-spec.md 9.2)
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { env } from '@/src/config/env';
import { colors } from '@/src/constants/colors';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { CartProvider } from '@/src/contexts/CartContext';

// 앱이 처음 켜질 때 한 번만 실행 환경을 터미널 로그에 남김
console.log(
  env.useMock
    ? `[env] MOCK 모드 (${env.appEnv}, 응답 지연 ${env.mockDelayMs}ms${env.mockNow ? `, 현재 시각 ${env.mockNow} 고정` : ''})`
    : `[env] 서버 모드 (${env.appEnv}, ${env.apiBaseUrl})`,
);

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
