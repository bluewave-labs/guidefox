import React, { useState } from 'react';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import styles from './PasswordTab.module.css';
import CustomTextField from '@components/TextFieldComponents/CustomTextField/CustomTextField';
import Button from '@components/Button/Button';

const PasswordTab = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle password change
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.block}>
        <div className={styles.label}>Current Password:</div>
        <CustomTextField
          id="current-password"
          placeholder="Enter current password"
          type="password"
          required
          value={currentPassword}
          onChange={handleCurrentPasswordChange}
          style={{ flexGrow: 1, textAlign: 'right' }}
          TextFieldWidth="450px"
        />
      </div>
      <div className={styles.block}>
        <div className={styles.label}>New Password:</div>
        <CustomTextField
          id="new-password"
          placeholder="Enter new password"
          type="password"
          required
          value={newPassword}
          onChange={handleNewPasswordChange}
          style={{ flexGrow: 1, textAlign: 'right' }}
          TextFieldWidth="450px"
        />
      </div>
      <div className={styles.block}>
        <div className={styles.label}>Confirm New Password:</div>
        <CustomTextField
          id="confirm-password"
          placeholder="Confirm new password"
          type="password"
          required
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          style={{ flexGrow: 1, textAlign: 'right' }}
          TextFieldWidth="450px"
        />
      </div>
      <div className={styles.alert}>
        <p className={styles.alertMessage}>
          <span>
            <WarningAmberRoundedIcon style={{ fontSize: '20px' }} />
          </span>
          New password must contain at least 8 characters and must have at least
          one uppercase letter, one number, and one symbol.
        </p>
      </div>
      <div className={styles.alert}>
        <Button
          text="Save"
          onClick={handleSubmit}
          style={{ width: '120px', marginTop: '50px' }}
        />
      </div>
    </form>
  );
};

export default PasswordTab;
