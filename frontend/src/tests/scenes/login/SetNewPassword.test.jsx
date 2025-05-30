import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../../services/authProvider';
import SetNewPasswordPage from '../../../scenes/login/SetNewPassword';
import { resetPassword } from '../../../services/loginServices';

vi.mock('../../../services/loginServices', () => ({
  resetPassword: vi.fn(),
}));

describe('SetNewPasswordPage', () => {
  it('renders the set new password reset page', () => {
    render(
      <MemoryRouter initialEntries={['/reset-password?token=mock-token']}>
        {' '}
        {/* Mock the route */}
        <AuthProvider>
          <SetNewPasswordPage />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Set new Password')).toBeTruthy();
  });

  it('handles reset password success', async () => {
    resetPassword.mockResolvedValueOnce({ data: { success: true } });

    render(
      <MemoryRouter initialEntries={['/reset-password?token=mock-token']}>
        <AuthProvider>
          <SetNewPasswordPage />
        </AuthProvider>
      </MemoryRouter>
    );

    await act(async () => {
      const validPassword = 'Test123!@';

      fireEvent.change(screen.getByPlaceholderText('Create your password'), {
        target: { value: validPassword },
      });
      fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
        target: { value: validPassword },
      });

      fireEvent.blur(screen.getByPlaceholderText('Create your password'));
      fireEvent.blur(screen.getByPlaceholderText('Confirm your password'));

      const resetButton = screen.getByText('Reset Password');
      fireEvent.click(resetButton);
    });

    expect(resetPassword).toHaveBeenCalledWith({
      token: 'mock-token', // Ensure token is passed
      newPassword: 'Test123!@', // Ensure the new password is passed
    });
  });

  it('handles reset password internal server error', async () => {
    resetPassword.mockRejectedValueOnce({
      response: {
        data: { error: 'Internal Server Error' },
      },
    });

    render(
      <MemoryRouter initialEntries={['/reset-password?token=mock-token']}>
        <AuthProvider>
          <SetNewPasswordPage />
        </AuthProvider>
      </MemoryRouter>
    );

    await act(async () => {
      const validPassword = 'Test123!@';

      fireEvent.change(screen.getByPlaceholderText('Create your password'), {
        target: { value: validPassword },
      });
      fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
        target: { value: validPassword },
      });

      fireEvent.blur(screen.getByPlaceholderText('Create your password'));
      fireEvent.blur(screen.getByPlaceholderText('Confirm your password'));

      fireEvent.click(screen.getByText('Reset Password'));
    });

    await waitFor(() => {
      expect(screen.getByText('Internal Server Error')).toBeTruthy();
    });

    expect(resetPassword).toHaveBeenCalledWith({
      token: 'mock-token',
      newPassword: 'Test123!@',
    });
  });
});
