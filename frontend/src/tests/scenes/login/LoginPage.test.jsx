import {
  render,
  waitFor,
  screen,
  fireEvent,
  act,
} from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from '../../../scenes/login/LoginPage';
import * as loginServices from '../../../services/loginServices';
import { AuthProvider } from '../../../services/authProvider';

vi.mock('../../../services/loginServices');

describe('LoginPage', () => {
  it('renders the login page', () => {
    render(
      <Router>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </Router>
    );

    expect(screen.getByText('Log in to your account')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter password')).toBeTruthy();
  });

  it('handles login success', async () => {
    loginServices.login.mockResolvedValueOnce({ data: { success: true } });

    render(
      <Router>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </Router>
    );

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter email'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter password'), {
        target: { value: 'password' },
      });
      fireEvent.click(screen.getByText('Sign In'));
    });

    expect(loginServices.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('handles login failure', async () => {
    loginServices.login.mockRejectedValueOnce({
      response: { data: { error: 'Invalid credentials' } },
    });

    render(
      <Router>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </Router>
    );

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter email'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter password'), {
        target: { value: 'wrongpassword' },
      });
      fireEvent.click(screen.getByText('Sign In'));
    });

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeTruthy();
    });
  });

  it('handles remember me checkbox', () => {
    render(
      <Router>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </Router>
    );

    const checkbox = screen.getByLabelText('Remember for 30 days');
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });
});
