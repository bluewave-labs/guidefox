import { describe, it, expect, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import ToastItem from '@components/Toast/ToastItem';

describe('ToastItem', () => {
  const mockRemoveToast = vi.fn();
  const mockToast = { id: 1, message: 'Test Toast', duration: 1000 };

  it('renders toast message correctly', () => {
    render(<ToastItem toast={mockToast} removeToast={mockRemoveToast} />);

    expect(screen.getByText('Test Toast')).to.exist;
  });

  it('removes toast after the specified duration', () => {
    vi.useFakeTimers();

    render(<ToastItem toast={mockToast} removeToast={mockRemoveToast} />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockRemoveToast).toHaveBeenCalledWith(mockToast.id);

    vi.useRealTimers();
  });

  it('cleans up timeout on unmount', () => {
    vi.useFakeTimers();

    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { unmount } = render(
      <ToastItem toast={mockToast} removeToast={mockRemoveToast} />
    );

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
    vi.useRealTimers();
  });

  it('closes toast when close icon is clicked', () => {
    vi.useFakeTimers();

    render(<ToastItem toast={mockToast} removeToast={mockRemoveToast} />);

    fireEvent.click(screen.getByTestId('CloseIcon'));

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockRemoveToast).toHaveBeenCalledWith(mockToast.id);

    vi.useRealTimers();
  });
});
