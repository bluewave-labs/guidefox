import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../../../services/authProvider'; // Import your AuthProvider
import ForgotPasswordPage from '../../../scenes/login/ForgotPasswordPage';
import { forgotPassword } from '../../../services/loginServices';

vi.mock('../../../services/loginServices', () => ({
  forgotPassword: vi.fn(),
}));

describe('ForgotPasswordPage', () => {
  it('renders the forgot password page', () => {
    render(
      <Router>
        <AuthProvider>
          <ForgotPasswordPage />
        </AuthProvider>
      </Router>
    );

    expect(screen.getByText('Forgot password?')).not.toBeNull();
    expect(screen.getByPlaceholderText('Enter your email')).not.toBeNull();
    expect(
      screen.getByText("No worries, we'll send you reset instructions.")
    ).not.toBeNull();
  });

  it('handles forgot password success', async () => {
    forgotPassword.mockResolvedValueOnce({ data: { success: true } });

    render(
      <Router>
        <AuthProvider>
          <ForgotPasswordPage />
        </AuthProvider>
      </Router>
    );

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.click(screen.getByText('Reset password'));
    });

    expect(forgotPassword).toHaveBeenCalledWith({ email: 'test@example.com' });
  });

  it('handles forgot password internal server error', async () => {
    forgotPassword.mockRejectedValueOnce({
      response: { data: { error: 'Internal Server Error' } },
    });

    render(
      <Router>
        <AuthProvider>
          <ForgotPasswordPage />
        </AuthProvider>
      </Router>
    );
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.click(screen.getByText('Reset password'));
    });

    await waitFor(() => {
      expect(screen.getByText('Internal Server Error')).to.exist;
    });

    expect(forgotPassword).toHaveBeenCalledWith({ email: 'test@example.com' });
  });
});
