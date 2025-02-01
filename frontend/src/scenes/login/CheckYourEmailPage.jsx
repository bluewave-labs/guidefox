import React from 'react';
import styles from './Login.module.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomLink from '@components/CustomLink/CustomLink';
import { forgotPassword } from '../../services/loginServices';

const CheckYourEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const values = location.state?.values || {};
  const { email: emailFromState } = values;

  const handleResendClick = () => {
    if (emailFromState) {
      forgotPassword(values)
        .then((response) => {
          console.log('Password reset link resent successfully:', response);
        })
        .catch((error) => {
          console.error('Error resending password reset link:', error);
        });
    } else {
      console.warn('No email provided to resend the password reset link.');
    }
  };

  return (
    <div className={styles['login-container']}>
      <h2>Check Your Email</h2>
      <h3 style={{ margin: '0px' }}>We sent a password reset link to</h3>
      <h3
        style={{
          marginTop: '0.25rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
        }}
      >
        {emailFromState || 'Email not provided'}
      </h3>
      <div className={styles['sign-up-link']}>
        Didn&apos;t receive the email?
        <CustomLink text="Click to resend" onClick={handleResendClick} />
      </div>
      <button
        className={styles['back-to-login-button']}
        style={{ marginTop: '20px' }}
        onClick={() => navigate('/')}
      >
        <ArrowBackIcon style={{ fontSize: '18px', marginRight: '5px' }} />
        Back to log in
      </button>
    </div>
  );
};

export default CheckYourEmailPage;
