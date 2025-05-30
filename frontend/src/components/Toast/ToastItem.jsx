import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CloseIcon from '@mui/icons-material/Close';
import styles from './Toast.module.scss';

const ToastItem = ({ toast, removeToast }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        removeToast(toast.id);
      }, 500);
    }, toast.duration || 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [toast, removeToast]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      removeToast(toast.id);
    }, 500);
  };

  return (
    <div
      className={classNames(styles.toast, {
        [styles.slideIn]: isVisible,
        [styles.slideOut]: !isVisible,
      })}
    >
      <p className={styles.text}>{toast.message}</p>
      <CloseIcon
        onClick={handleClose}
        className={styles.icon}
        data-testid="CloseIcon"
      />
    </div>
  );
};

ToastItem.propTypes = {
  toast: PropTypes.shape({
    id: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    duration: PropTypes.number,
  }).isRequired,
  removeToast: PropTypes.func.isRequired,
};

export default ToastItem;
