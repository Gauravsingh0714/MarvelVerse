import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiClientError } from '../api/types.js';

export interface ApiQueryResult<T> {
  data: T | null;
  error: ApiClientError | Error | null;
  isLoading: boolean;
  refetch: () => void;
}

export function useApiQuery<T>(
  queryFn: () => Promise<T>,
  deps: any[] = []
): ApiQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiClientError | Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isMountedRef = useRef<boolean>(true);

  const executeQuery = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await queryFn();
      if (isMountedRef.current) {
        setData(result);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    isMountedRef.current = true;
    executeQuery();

    return () => {
      isMountedRef.current = false;
    };
  }, [executeQuery]);

  return {
    data,
    error,
    isLoading,
    refetch: executeQuery,
  };
}
