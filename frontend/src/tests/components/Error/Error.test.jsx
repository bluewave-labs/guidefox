import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ErrorComponent } from '../../../scenes/errors/Error';

describe('ErrorComponent', () => {
  const mockErrorAction = vi.fn();

  it('renders the error message and text', () => {
    const errorMessage = 'Page not found';

    render(
      <ErrorComponent text={errorMessage} errorAction={mockErrorAction} />
    );

    expect(screen.getByText('We cannot find this page')).not.toBeNull();
    expect(screen.getByText(errorMessage)).not.toBeNull();
  });

  it('calls errorAction when button is clicked', () => {
    render(
      <ErrorComponent text="Error occurred" errorAction={mockErrorAction} />
    );

    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(mockErrorAction).toHaveBeenCalled();
  });

  it('applies custom styles to the button', () => {
    render(
      <ErrorComponent text="Error occurred" errorAction={mockErrorAction} />
    );

    const button = screen.getByRole('button');

    expect(button.style.borderRadius).toBe('8px');
    expect(button.style.marginTop).toBe('58px');
    expect(button.style.fontSize).toBe('13px');
    expect(button.style.lineHeight).toBe('24px');
    expect(button.style.padding).toBe('5px 27px');
  });
});
