import { apiClient } from './apiClient';
import axios from 'axios';
import Cookies from 'js-cookie';

const authClient = axios.create({
  ...apiClient.defaults,
  baseURL: `${apiClient.defaults.baseURL}auth`,
});

// Function to handle login
export const login = async (values) => {
  try {
    const response = await authClient.post('/login', values);
    const token = response.data.token;
    localStorage.setItem('authToken', token);

    return response.data;
  } catch (error) {
    console.error('Login error:', error.response);
    throw error;
  }
};

// Function to handle logout
export const logout = async () => {
  try {
    await apiClient.post('auth/logout');
    localStorage.removeItem('authToken');
    return true;
  } catch (error) {
    console.error('Logout error:', error.response);
    localStorage.removeItem('authToken');
    throw error;
  }
};

// Function to handle sign up
export const signUp = async (userData) => {
  try {
    const response = await authClient.post('/register', userData);
    const token = response.data.token;
    localStorage.setItem('authToken', token);
    return response.data;
  } catch (error) {
    console.error('Sign up error:', error.response);
    throw error;
  }
};

// Function to handle sign up
export const forgotPassword = async (userData) => {
  try {
    const response = await authClient.post('/forget-password', userData);
    return response.data;
  } catch (error) {
    console.error(error.response);
    throw error;
  }
};

export const resetPassword = async (userData) => {
  try {
    const response = await authClient.post('/reset-password', userData);
    return response.data;
  } catch (error) {
    console.error(error.response);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('users/current-user');
    const user = response.data.user;
    const fullName = user.surname ? user.name + ' ' + user.surname : user.name;

    Cookies.set('fullName', fullName);
    Cookies.set('role', user.role);

    return user;
  } catch (error) {
    console.error('Get user error:', error.response);
    return { fullName: 'John Doe', role: 'visitor' };
  }
};

export const getHasUsers = async () => {
  try {
    const response = await apiClient.get('users/has-users');
    return response.data;
  } catch (err) {
    throw err;
  }
};

export default authClient;
