// 화면 위 안내 띠를 잠깐 보여주고 3초 뒤 숨김 (design-spec.md 3.18 "처리 실패", 3.19)
import { useCallback, useEffect, useRef, useState } from 'react';

import type { BannerType } from '@/src/components/common/Banner';

export interface TimedBanner {
  type: BannerType;
  message: string;
}

const SHOW_MS = 3000;

export function useTimedBanner() {
  const [banner, setBanner] = useState<TimedBanner | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((type: BannerType, message: string) => {
    if (timer.current) clearTimeout(timer.current);
    setBanner({ type, message });
    timer.current = setTimeout(() => setBanner(null), SHOW_MS);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return { banner, show };
}
