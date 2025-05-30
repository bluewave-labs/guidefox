
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authProvider';
import LoadingPage from './LoadingPage/LoadingPage';

const Private = ({ Component }) => {
  const { isLoggedIn, isFetching } = useAuth();
  const location = useLocation();

  if (isFetching) return <LoadingPage />;

  return isLoggedIn ? (
    <Component />
  ) : (
    <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} />
  );
};

export default Private;
