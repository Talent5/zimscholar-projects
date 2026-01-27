import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFetch } from '../hooks/useFetch';

// Mock fetch
global.fetch = vi.fn();

describe('useFetch Hook', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useFetch('/api/test'));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  it('handles fetch errors', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useFetch('/api/test', { retries: 1 }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBe(null);
  });

  it('handles HTTP errors', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useFetch('/api/test', { retries: 1 }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain('404');
  });

  it('supports refetch functionality', async () => {
    const mockData = { id: 1, name: 'Test' };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useFetch('/api/test'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Call refetch
    result.current.refetch();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});
