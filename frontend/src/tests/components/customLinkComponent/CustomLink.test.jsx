import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CustomLink from '@components/CustomLink/CustomLink';

describe('CustomLink', () => {
  it('renders CustomLink with text and url', () => {
    render(<CustomLink text="Link Text" url="https://example.com" />);
    const linkElement = screen.getByText(/Link Text/i);
    expect(linkElement).not.toBeNull();
    expect(linkElement.getAttribute('href')).toBe('https://example.com');
  });

  it('applies default text and url correctly', () => {
    render(<CustomLink />);
    const linkElement = screen.getByText(/Default Text/i);
    expect(linkElement).not.toBeNull();
    expect(linkElement.getAttribute('href')).toBe('');
  });

  it('applies custom class names correctly', () => {
    render(
      <CustomLink
        text="Link Text"
        url="https://example.com"
        className="tertiary"
      />
    );
    const linkElement = screen.getByText(/Link Text/i);
    expect(linkElement.classList.contains('custom-link')).toBe(true);
    expect(linkElement.classList.contains('tertiary')).toBe(true);
  });

  it('applies underline prop correctly', () => {
    render(
      <CustomLink
        text="Link Text"
        url="https://example.com"
        underline="hover"
      />
    );
    const linkElement = screen.getByText(/Link Text/i);
    expect(linkElement.classList.contains('MuiLink-underlineHover')).toBe(true);
  });
});
