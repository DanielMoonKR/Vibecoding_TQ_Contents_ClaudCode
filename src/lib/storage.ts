import { useCallback, useEffect, useState } from 'react';

// 로컬 저장소 래퍼. 연동 단계에서 회원 정보 API(진단 결과·내 체크리스트)로 교체한다.
const PREFIX = 'tqc.guide.';
const EVENT = 'tqc-storage';

export function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStore<T>(key: string, value: T) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // 저장 불가 환경(시크릿 모드 등)에서는 메모리 상태만 유지
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
}

/** 같은 key를 쓰는 컴포넌트끼리 값이 동기화되는 useState */
export function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStore(key, fallback));

  useEffect(() => {
    const onChange = (e: Event) => {
      if ((e as CustomEvent).detail === key) setValue(readStore(key, fallback));
    };
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
    // fallback은 초기값 용도라 의존성에서 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (next: T) => {
      setValue(next);
      writeStore(key, next);
    },
    [key],
  );

  return [value, set] as const;
}
