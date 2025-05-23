import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CreatePopupPage from '../../../scenes/popup/CreatePopupPage';
import * as popupServices from '../../../services/popupServices';
import * as loginServices from '../../../services/loginServices';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react';
import toastEmitter from '../../../utils/toastEmitter';
import { GuideTemplateProvider } from '../../../templates/GuideTemplate/GuideTemplateContext';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => vi.fn(), // Mock useNavigate to avoid actual routing
  };
});

vi.mock('../../../services/popupServices');
vi.mock('../../../services/loginServices');

const Wrapper = ({ children }) => (
  <GuideTemplateProvider>
    <Router>{children}</Router>
  </GuideTemplateProvider>
);

describe('CreatePopupPage component', () => {
  it('handles onSave and successful popup creation', async () => {
    // Mock the sign-up process to simulate a successful registration
    vi.spyOn(loginServices, 'signUp').mockResolvedValueOnce({
      token: 'mockAuthToken',
    });

    // Simulate user registration and set token in localStorage
    await act(async () => {
      await loginServices.signUp({
        name: 'test',
        surname: 'user',
        email: 'test_user@example.com',
        password: 'password123',
      });
      localStorage.setItem('authToken', 'mockAuthToken');
    });

    const mockAddPopup = vi
      .spyOn(popupServices, 'addPopup')
      .mockResolvedValueOnce({
        data: { success: true },
      });

    await act(async () => {
      render(<CreatePopupPage autoOpen />, { wrapper: Wrapper });
    });

    const saveButton = await waitFor(() =>
      screen.getByRole('button', { name: /Save/i })
    );
    fireEvent.click(saveButton);
    expect(mockAddPopup).toHaveBeenCalledTimes(1);
  });

  it('handles onSave and failed popup creation', async () => {
    // Mock the sign-up process
    vi.spyOn(loginServices, 'signUp').mockResolvedValueOnce({
      token: 'mockAuthToken',
    });

    // Simulate user registration and set token in localStorage
    await act(async () => {
      await loginServices.signUp({
        name: 'test',
        surname: 'user',
        email: 'test_user@example.com',
        password: 'password123',
      });
      localStorage.setItem('authToken', 'mockAuthToken');
    });

    const mockAddPopup = vi
      .spyOn(popupServices, 'addPopup')
      .mockRejectedValueOnce({
        response: {
          data: {
            errors: [{ msg: 'headerColor must be a valid hex color code' }],
          },
        },
      });

    const emitSpy = vi.spyOn(toastEmitter, 'emit');

    await act(async () => {
      render(<CreatePopupPage autoOpen />, { wrapper: Wrapper });
    });

    // Wait for the "Save" button to appear in the DOM
    const saveButton = await waitFor(() =>
      screen.getByRole('button', { name: /Save/i })
    );

    // Trigger the Save button click
    fireEvent.click(saveButton);

    // Check if the toastEmitter.emit function was called
    await waitFor(() => {
      expect(emitSpy).toHaveBeenCalledWith(
        expect.anything(), // The first argument is the key, which can be anything
        expect.stringContaining('An error occurred')
      );
    });

    // Ensure the addPopup service was called and handled the error
    expect(mockAddPopup).toHaveBeenCalledTimes(1);
  });

  it('initializes form fields correctly', async () => {
    render(<CreatePopupPage autoOpen />, { wrapper: Wrapper });

    // Check initial state of form fields
    const headerBackgroundColor = screen.getByDisplayValue('No action');
    const headerColor = screen.getAllByDisplayValue('https://')[0];

    expect(headerBackgroundColor).not.toBeNull(); // Example for headerBackgroundColor
    expect(headerColor).not.toBeNull(); // Example for headerColor
    // Add more checks for other form fields
  });

  // TODO: Write a edit test
  // it('initializes with existing popup data in edit mode', async () => {
  //   // Mock the sign-up process
  //   vi.spyOn(loginServices, 'signUp').mockResolvedValueOnce({
  //     token: 'mockAuthToken',
  //   });

  //   await act(async () => {
  //     await loginServices.signUp({ name: 'test', surname: 'user', email: 'test_user@example.com', password: 'password123' });
  //     localStorage.setItem('authToken', 'mockAuthToken');
  //   });

  //   const popupData = {
  //     headerBackgroundColor: '#FF0000',
  //     headerColor: '#00FF00',
  //     textColor: '#0000FF',
  //     buttonBackgroundColor: '#FFFF00',
  //     buttonTextColor: '#FF00FF',
  //     header: 'Test Header',
  //     content: 'Test Content',
  //     url: 'https://example.com',
  //     actionButtonText: 'Test Action',
  //     closeButtonAction: 'open url',
  //     popupSize: 'Medium',
  //   };

  //   // Mock fetching existing popup data
  //   vi.spyOn(popupServices, 'getPopupById').mockResolvedValueOnce(popupData);

  //   await act(async () => {
  //     render(
  //       <Router>
  //         <CreatePopupPage />
  //       </Router>
  //     );
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument(); // Example for actionButtonUrl
  //     // Add more checks for other input values as needed
  //   }, { timeout: 1000 });

  // });
});
