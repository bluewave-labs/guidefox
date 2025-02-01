import React from 'react';
import styles from './Login.module.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

function PasswordResetPage() {
  const navigate = useNavigate();
  return (
    <div className={styles['login-container']}>
      <h2 style={{ marginBottom: '0px' }}>Password reset</h2>
      <h3>
        Your password has been successfully reset. Click below to log in
        manually.
      </h3>
      <button
        className={styles['sign-in-button']}
        style={{ marginTop: '20px' }}
        onClick={() => navigate('/')}
      >
        Continue
      </button>
      <button className={styles['back-to-login-button']}>
        {' '}
        <ArrowBackIcon style={{ fontSize: '18px', marginRight: '5px' }} />
        Back to log in
      </button>
    </div>
  );
}

export default PasswordResetPage;
