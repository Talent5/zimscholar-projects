import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface UseFetchOptions {
  initialData?: any;
  retries?: number;
  retryDelay?: number;
}

/**
 * Custom hook for data fetching with loading, error states, and retry logic
 * 
 * @example
 * const { data, loading, error, refetch } = useFetch<Service[]>('/api/services');
 */
export function useFetch<T>(
  url: string,
  options: UseFetchOptions = {}
): FetchState<T> {
  const { initialData = null, retries = 3, retryDelay = 1000 } = options;
  
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          // Retry logic
          if (retryCount < retries) {
            retryCount++;
            console.log(`Retrying... (${retryCount}/${retries})`);
            setTimeout(fetchData, retryDelay * retryCount);
          } else {
            setError(err instanceof Error ? err : new Error('Failed to fetch'));
            setLoading(false);
          }
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, fetchKey, retries, retryDelay]);

  const refetch = () => setFetchKey(prev => prev + 1);

  return { data, loading, error, refetch };
}

/**
 * Custom hook for POST/PUT/DELETE operations
 */
interface UseMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useMutation<T>(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST',
  options: UseMutationOptions = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (data?: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Mutation failed');
      setError(error);
      
      if (options.onError) {
        options.onError(error);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
