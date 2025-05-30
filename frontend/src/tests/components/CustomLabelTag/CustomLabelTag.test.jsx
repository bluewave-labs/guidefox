import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import CustomLabelTag from '@components/CustomLabelTag/CustomLabelTag';

describe('CustomLabelTag', () => {
  it('renders the text correctly', () => {
    const { container } = render(<CustomLabelTag text="Test Label" />);
    expect(container.textContent).toContain('Test Label');
  });

  it('applies the correct background color class', () => {
    const { container } = render(
      <CustomLabelTag text="Test Label" backgroundColor="orange" />
    );
    const label = container.querySelector('.label-orange');
    expect(label).not.toBeNull();
  });

  it('applies the correct text color style', () => {
    const { container } = render(
      <CustomLabelTag text="Test Label" textColor="red" />
    );
    const label = container.querySelector('.label');
    expect(label.style.color).toBe('red');
  });

  it('renders the dot for specific background colors', () => {
    const { container } = render(
      <CustomLabelTag text="Test Label" backgroundColor="seen" />
    );
    const dot = container.querySelector('.dot');
    expect(dot).not.toBeNull();
  });

  it('does not render the dot for other background colors', () => {
    const { container } = render(
      <CustomLabelTag text="Test Label" backgroundColor="orange" />
    );
    const dot = container.querySelector('.dot');
    expect(dot).toBeNull();
  });

  it('logs an error for invalid background color', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    render(<CustomLabelTag text="Test Label" backgroundColor="invalidColor" />);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
