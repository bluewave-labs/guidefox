import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import Toast from '@components/Toast/Toast';
import toastEmitter, { TOAST_EMITTER_KEY } from '../../../utils/toastEmitter';

describe('Toast', () => {
  it('renders toasts correctly when event is emitted', () => {
    render(<Toast />);

    act(() => {
      toastEmitter.emit(TOAST_EMITTER_KEY, 'Test Toast');
    });

    expect(screen.getByText('Test Toast')).to.exist;
  });

  it('limits visible toasts to the maximum allowed count', () => {
    render(<Toast />);

    act(() => {
      for (let i = 1; i <= 10; i++) {
        toastEmitter.emit(TOAST_EMITTER_KEY, `Toast ${i}`);
      }
    });

    expect(screen.getAllByText(/Toast/).length).toBe(8);
  });

  it('cleans up event listener on unmount', () => {
    const { unmount } = render(<Toast />);
    unmount();
    expect(toastEmitter.listenerCount(TOAST_EMITTER_KEY)).toBe(0);
  });
});
