// 로딩·오류·데이터·새로고침 공통 처리 (dev-spec.md 9.3)
// 사용 예: const { data, isLoading, isRefreshing, error, refresh } = useAsync(() => api.orders.getMyOrders(scope), [scope]);
import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react';

interface AsyncState<T> {
  data: T | null;
  error: unknown;
  isLoading: boolean;    // 처음 불러오는 중 → 화면 가운데 로딩
  isRefreshing: boolean; // 당겨서 새로고침·화면 재진입 갱신 중 → 목록은 그대로 두고 위에 표시
  updatedAt: Date | null; // 마지막으로 받아온 시각 ("마지막 새로고침 11:42" 표시용, 기기 실제 시각)
}

export interface AsyncResult<T> extends AsyncState<T> {
  refresh: () => Promise<void>;
  setData: (data: T) => void; // 처리 API가 돌려준 최신 값으로 바로 바꿀 때 (다시 부르지 않음)
}

export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList): AsyncResult<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: true,
    isRefreshing: false,
    updatedAt: null,
  });
  // deps가 바뀔 때만 fn을 새로 씀 (화면이 다시 그려질 때마다 다시 부르지 않도록)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(fn, deps);
  // 늦게 도착한 이전 응답이 최신 결과를 덮어쓰지 않게 요청 번호로 구분
  const latestRequest = useRef(0);

  const run = useCallback(
    async (mode: 'initial' | 'refresh') => {
      const requestId = ++latestRequest.current;
      setState((prev) =>
        mode === 'refresh' && prev.data !== null
          ? { ...prev, error: null, isRefreshing: true }
          : { ...prev, error: null, isLoading: true },
      );
      try {
        const data = await load();
        if (requestId === latestRequest.current) {
          setState({ data, error: null, isLoading: false, isRefreshing: false, updatedAt: new Date() });
        }
      } catch (error) {
        if (requestId === latestRequest.current) {
          setState((prev) => ({ ...prev, error, isLoading: false, isRefreshing: false }));
        }
      }
    },
    [load],
  );

  useEffect(() => {
    void run('initial');
  }, [run]);

  const refresh = useCallback(() => run('refresh'), [run]);

  const setData = useCallback((data: T) => {
    latestRequest.current++; // 진행 중이던 요청 결과는 버림
    setState({ data, error: null, isLoading: false, isRefreshing: false, updatedAt: new Date() });
  }, []);

  return { ...state, refresh, setData };
}
