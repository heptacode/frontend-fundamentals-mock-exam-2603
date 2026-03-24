'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useLoading(): [boolean, <T>(promise: Promise<T>) => Promise<T>] {
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef({ isMounted: true }).current;

  useEffect(() => {
    ref.isMounted = true;
    return () => {
      ref.isMounted = false;
    };
  }, [ref]);

  const startLoading = useCallback(
    async <T>(promise: Promise<T>) => {
      try {
        setIsLoading(true);
        const data = await promise;
        return data;
      } finally {
        if (ref.isMounted) {
          setIsLoading(false);
        }
      }
    },
    [ref.isMounted],
  );

  return useMemo(() => [isLoading, startLoading], [isLoading, startLoading]);
}