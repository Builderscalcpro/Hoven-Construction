import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '../use-toast';

describe('useToast Hook', () => {
  it('initializes with empty toasts array', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  it('adds a toast', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast({
        title: 'Success',
        description: 'Operation completed',
      });
    });
    
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      title: 'Success',
      description: 'Operation completed',
    });
  });

  it('removes a toast by id', () => {
    const { result } = renderHook(() => useToast());
    
    let toastId: string;
    act(() => {
      const { id } = result.current.toast({ title: 'Test' });
      toastId = id;
    });
    
    expect(result.current.toasts).toHaveLength(1);
    
    act(() => {
      result.current.dismiss(toastId!);
    });
    
    expect(result.current.toasts).toHaveLength(0);
  });

  it('dismisses all toasts', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast({ title: 'Toast 1' });
      result.current.toast({ title: 'Toast 2' });
      result.current.toast({ title: 'Toast 3' });
    });
    
    expect(result.current.toasts).toHaveLength(3);
    
    act(() => {
      result.current.dismiss();
    });
    
    expect(result.current.toasts).toHaveLength(0);
  });

  it('auto-dismisses toast after timeout', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast({
        title: 'Auto dismiss',
        duration: 3000,
      });
    });
    
    expect(result.current.toasts).toHaveLength(1);
    
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    expect(result.current.toasts).toHaveLength(0);
    vi.useRealTimers();
  });

  it('updates existing toast', () => {
    const { result } = renderHook(() => useToast());
    
    let toastId: string;
    act(() => {
      const { id, update } = result.current.toast({ 
        title: 'Original' 
      });
      toastId = id;
    });
    
    act(() => {
      const toast = result.current.toasts.find(t => t.id === toastId);
      toast?.update({ title: 'Updated' });
    });
    
    expect(result.current.toasts[0].title).toBe('Updated');
  });
});