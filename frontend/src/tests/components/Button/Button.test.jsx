import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '@components/Button/Button';

describe('Button component', () => {
  it('renders with default props', () => {
    render(<Button />);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).not.toBeNull();
    expect(buttonElement.classList.contains('button')).toBe(true);
    expect(buttonElement.classList.contains('primary')).toBe(true);
    expect(buttonElement.textContent).toBe('');
    expect(buttonElement.disabled).toBe(false);
  });

  it('renders with custom text and class', () => {
    render(<Button text="Click Me" buttonType="secondary-purple" />);

    const buttonElement = screen.getByText('Click Me');
    expect(buttonElement).not.toBeNull();
    expect(buttonElement.classList.contains('button')).toBe(true);
    expect(buttonElement.classList.contains('secondary-purple')).toBe(true);
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button text="Click Me" onClick={handleClick} />);

    const buttonElement = screen.getByText('Click Me');
    fireEvent.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
  });

  it('applies variant, style, and disabled props', () => {
    render(
      <Button
        text="Styled Button"
        variant="outlined"
        style={{ backgroundColor: 'blue' }}
        disabled={true}
      />
    );

    const buttonElement = screen.getByText('Styled Button');
    expect(buttonElement.classList.contains('MuiButton-outlined')).toBe(true);
    expect(buttonElement.getAttribute('style')).toBe('background-color: blue;');
    expect(buttonElement.disabled).toBe(true);
  });

  it('applies sx prop correctly', () => {
    render(<Button text="SX Button" sx={{ margin: '10px' }} />);

    const buttonElement = screen.getByText('SX Button');
    expect(buttonElement).not.toBeNull();
  });
});
