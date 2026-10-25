// dev-spec.md 4.6 로그인 토큰만 기기 보안 영역에 저장 (값이 크면 실패할 수 있어 토큰 문자열만)
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

export const tokenStorage = {
  get: () => SecureStore.getItemAsync(TOKEN_KEY),
  set: (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token),
  clear: () => SecureStore.deleteItemAsync(TOKEN_KEY),
};
