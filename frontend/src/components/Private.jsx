import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/authProvider';
import LoadingPage from './LoadingPage/LoadingPage';

const Private = ({ Component }) => {
  const { isLoggedIn, isFetching } = useAuth();

  return isFetching ? (
    <LoadingPage />
  ) : isLoggedIn ? (
    <Component />
  ) : (
    <Navigate to="/login" />
  );
};

Private.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default Private;
