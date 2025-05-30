import React from 'react';
import styles from './BannerPreview.module.scss';

export default function BannerSkeleton() {
  return (
    <>
      <div className={styles.bannerOne}></div>
      <div className={styles.bannerTwo}></div>
      <div className={styles.bannerThree}></div>
      <div className={styles.bannerFour}></div>
    </>
  );
}
