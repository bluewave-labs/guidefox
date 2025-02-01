import React from 'react';
import styles from './Loading.module.css';
import LeftMenu from '../LeftMenu/LeftMenu';

const LoadingPage = () => {
  return (
    <div className={styles['container']}>
      <div className={styles['loading-container']}>
        <LeftMenu />
        <div className={styles['loading']}></div>
      </div>
    </div>
  );
};

export default LoadingPage;
