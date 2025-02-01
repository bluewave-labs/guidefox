import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../../../services/authProvider';
import CreateAccountPage from '../../../scenes/login/CreateAccountPage';
import { signUp } from '../../../services/loginServices';

// Mock login services
vi.mock('../../../services/loginServices', () => ({
  signUp: vi.fn(),
}));

describe('CreateAccountPage', () => {
  it('renders the create account page', () => {
    render(
      <Router>
        <AuthProvider>
          <CreateAccountPage />
        </AuthProvider>
      </Router>
    );

    expect(screen.getByText('Create an account')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your name')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your surname')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Create your password')).toBeTruthy();
    expect(screen.getByText('Get started')).toBeTruthy();
  });

  it('validates name input', () => {
    render(
      <Router>
        <AuthProvider>
          <CreateAccountPage />
        </AuthProvider>
      </Router>
    );

    const nameInput = screen.getByPlaceholderText('Enter your name');
    fireEvent.change(nameInput, { target: { value: 'testname' } });
    expect(nameInput.value).toBe('testname');
  });

  it('validates surname input', () => {
    render(
      <Router>
        <AuthProvider>
          <CreateAccountPage />
        </AuthProvider>
      </Router>
    );

    const surnameInput = screen.getByPlaceholderText('Enter your surname');
    fireEvent.change(surnameInput, { target: { value: 'testsurname' } });
    expect(surnameInput.value).toBe('testsurname');
  });

  it('validates email input', () => {
    render(
      <Router>
        <AuthProvider>
          <CreateAccountPage />
        </AuthProvider>
      </Router>
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('validates password input', () => {
    render(
      <Router>
        <AuthProvider>
          <CreateAccountPage />
        </AuthProvider>
      </Router>
    );

    const passwordInput = screen.getByPlaceholderText('Create your password');
    fireEvent.change(passwordInput, { target: { value: 'Password1!' } });
    expect(passwordInput.value).toBe('Password1!');
  });

  it('handles sign up success', async () => {
    signUp.mockResolvedValueOnce({ data: { success: true } });

    render(
      <Router>
        <AuthProvider>
          <CreateAccountPage />
        </AuthProvider>
      </Router>
    );

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
        target: { value: 'testname' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your surname'), {
        target: { value: 'testsurname' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Create your password'), {
        target: { value: 'Password1!' },
      });
      fireEvent.click(screen.getByText('Get started'));
    });

    expect(signUp).toHaveBeenCalledWith({
      name: 'testname',
      surname: 'testsurname',
      email: 'test@example.com',
      password: 'Password1!',
    });
    expect(screen.queryByText('An error occurred.')).toBeFalsy();
  });

  it('handles sign up failure with email already exists error', async () => {
    signUp.mockRejectedValueOnce({
      response: {
        data: { error: 'Email already exists' },
        status: 400,
      },
    });

    render(
      <Router>
        <AuthProvider>
          <CreateAccountPage />
        </AuthProvider>
      </Router>
    );

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
        target: { value: 'testname' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your surname'), {
        target: { value: 'testsurname' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Create your password'), {
        target: { value: 'Password1!' },
      });
      fireEvent.click(screen.getByText('Get started'));
    });

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeTruthy();
    });

    expect(signUp).toHaveBeenCalledWith({
      name: 'testname',
      surname: 'testsurname',
      email: 'test@example.com',
      password: 'Password1!',
    });
    expect(screen.queryByText('An error occurred.')).toBeFalsy();
  });

  it('handles network errors gracefully', async () => {
    signUp.mockRejectedValueOnce(new Error('Network Error'));

    render(
      <Router>
        <AuthProvider>
          <CreateAccountPage />
        </AuthProvider>
      </Router>
    );

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
        target: { value: 'testname' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your surname'), {
        target: { value: 'testsurname' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Create your password'), {
        target: { value: 'Password1!' },
      });
      fireEvent.click(screen.getByText('Get started'));
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          'An error occurred. Please check your network connection and try again.'
        )
      ).toBeTruthy();
    });
  });
});
