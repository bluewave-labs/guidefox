import React, { useEffect, useContext, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { apiClient } from './apiClient';

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// HTML entity decoder function
const decodeHtmlEntities = (str) => {
  if (!str) return str;
  const parser = new DOMParser();
  const dom = parser.parseFromString(
    `<!doctype html><body>${str}`,
    'text/html'
  );
  return dom.body.textContent;
};

// Function to handle user data processing
const processUserData = (userData) => {
  return {
    ...userData,
    picture: userData.picture ? decodeHtmlEntities(userData.picture) : null,
  };
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isLoggedIn: true };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false, userInfo: null };
    case 'SET_USER_INFO': {
      const processedData = processUserData(action.payload);
      localStorage.setItem('userInfo', JSON.stringify(processedData));
      return { ...state, userInfo: processedData };
    }
    case 'LOGIN_AND_SET_USER_INFO': {
      const processedData = processUserData(action.payload);
      localStorage.setItem('userInfo', JSON.stringify(processedData));
      return { isLoggedIn: true, userInfo: processedData };
    }
    case 'UPDATE_AND_SET_UPDATED_USER_INFO': {
      const updatedUserInfo = processUserData({
        ...state.userInfo,
        ...action.payload,
      });
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      return { isLoggedIn: true, userInfo: updatedUserInfo };
    }
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  // Decoding any existing stored data on initial load
  const getInitialState = () => {
    const storedData = localStorage.getItem('userInfo');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        return {
          isLoggedIn: false,
          userInfo: processUserData(parsedData),
        };
      } catch (e) {
        console.error('Error parsing stored user data:', e);
        return { isLoggedIn: false, userInfo: null };
      }
    }
    return { isLoggedIn: false, userInfo: null };
  };

  const [state, dispatch] = useReducer(authReducer, getInitialState());
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          dispatch({ type: 'LOGOUT' });
          setIsFetching(false);
          return;
        }
        const response = await apiClient.get('/users/current-user');
        if (response.status === 200 && response.data.user) {
          const { id, name, surname, email, role, picture } =
            response.data.user;
          const payload = { id, name, surname, email, role, picture };
          dispatch({ type: 'LOGIN_AND_SET_USER_INFO', payload });
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        dispatch({ type: 'LOGOUT' });
      } finally {
        setIsFetching(false);
      }
    };
    fetchUser();
  }, []);

  const loginAuth = (userInfo) => {
    dispatch({ type: 'LOGIN_AND_SET_USER_INFO', payload: userInfo });
  };

  const updateProfile = (userInfo) => {
    dispatch({ type: 'UPDATE_AND_SET_UPDATED_USER_INFO', payload: userInfo });
  };

  const logoutAuth = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: state.isLoggedIn,
        loginAuth,
        logoutAuth,
        updateProfile,
        userInfo: state.userInfo,
        isFetching,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
