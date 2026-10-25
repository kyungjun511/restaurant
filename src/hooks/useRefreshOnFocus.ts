// 화면이 다시 보일 때 refresh (dev-spec.md 9.3 "화면 재진입 갱신"). 처음 들어올 때는 useAsync가 이미 불러오므로 건너뜀
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

export function useRefreshOnFocus(refresh: () => unknown) {
  const firstFocus = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false;
        return;
      }
      void refresh();
    }, [refresh]),
  );
}
