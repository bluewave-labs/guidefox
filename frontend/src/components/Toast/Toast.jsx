import React, { useState, useEffect } from 'react';
import ToastItem from './ToastItem';
import { defaultToastOptions, MAXIMUM_TOAST_COUNT } from './constant';
import toastEmitter, { TOAST_EMITTER_KEY } from '../../utils/toastEmitter';
import styles from './Toast.module.scss';

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleNewToast = (toastMessage) => {
      const newToast = {
        id: `${Date.now()}-${Math.random()}`,
        message: toastMessage,
        duration: defaultToastOptions.duration,
      };
      setToasts((prevToasts) => {
        const updatedToasts = [...prevToasts, newToast];
        return updatedToasts.length > MAXIMUM_TOAST_COUNT
          ? updatedToasts.slice(1)
          : updatedToasts;
      });
    };

    toastEmitter.on(TOAST_EMITTER_KEY, handleNewToast);

    return () => {
      toastEmitter.off(TOAST_EMITTER_KEY, handleNewToast);
    };
  }, []);

  const handleRemoveToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          removeToast={handleRemoveToast}
        />
      ))}
    </div>
  );
};

export default Toast;
