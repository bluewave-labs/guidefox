import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CustomTextField from '@components/TextFieldComponents/CustomTextField/CustomTextField';

describe('CustomTextField', () => {
  it('renders the CustomTextField with default props', () => {
    render(<CustomTextField labelText="Test Label" />);

    expect(screen.getByText('Test Label')).not.toBeNull();
    expect(screen.getByRole('textbox')).not.toBeNull();
  });

  it('displays the correct value', () => {
    render(<CustomTextField labelText="Test Label" value="Test Value" />);

    expect(screen.getByDisplayValue('Test Value')).not.toBeNull();
  });

  it('calls onChange when the input value changes', () => {
    const handleChange = vi.fn();
    render(<CustomTextField labelText="Test Label" onChange={handleChange} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'New Value' },
    });
    expect(handleChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it('displays helper text when provided', () => {
    render(<CustomTextField labelText="Test Label" helperText="Helper Text" />);

    expect(screen.getByText('Helper Text')).not.toBeNull();
  });

  it('renders with multiline and rows props', () => {
    render(
      <CustomTextField labelText="Test Label" multiline={true} rows={4} />
    );

    expect(screen.getByRole('textbox').getAttribute('rows')).toBe('4');
  });

  it('renders with startAdornment and endAdornment', () => {
    render(
      <CustomTextField
        labelText="Test Label"
        startAdornment={<div>Start</div>}
        endAdornment={<div>End</div>}
      />
    );

    expect(screen.getByText('Start')).not.toBeNull();
    expect(screen.getByText('End')).not.toBeNull();
  });

  it('renders with chips', () => {
    const chips = [{ label: 'Chip 1' }, { label: 'Chip 2' }];
    render(<CustomTextField labelText="Test Label" chips={chips} />);

    expect(screen.getByText('Chip 1')).not.toBeNull();
    expect(screen.getByText('Chip 2')).not.toBeNull();
  });

  // Additional tests
  it('renders with a placeholder', () => {
    render(
      <CustomTextField labelText="Test Label" placeholder="Enter text here" />
    );

    expect(screen.getByPlaceholderText('Enter text here')).not.toBeNull();
  });

  it('renders with custom input height', () => {
    render(<CustomTextField labelText="Test Label" inputHeight="50px" />);

    expect(
      screen.getByRole('textbox').closest('.MuiOutlinedInput-root').style.height
    ).toBe('50px');
  });

  it('renders with custom label font weight', () => {
    render(<CustomTextField labelText="Test Label" labelFontWeight={700} />);

    const label = screen.getByText('Test Label');
    expect(window.getComputedStyle(label).fontWeight).toBe('700');
  });

  it('renders with no chips when chips prop is empty', () => {
    render(<CustomTextField labelText="Test Label" chips={[]} />);

    expect(screen.queryByText('Chip 1')).toBeNull();
    expect(screen.queryByText('Chip 2')).toBeNull();
  });
});
