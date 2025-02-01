import styles from './ParagraphCSS.module.scss';

const ParagraphCSS = () => {
  return (
    <div className={styles.preview}>
      <div className={styles.bannerOne}></div>
      <div className={styles.bannerTwo}></div>
      <div className={styles.bannerThree}></div>
    </div>
  );
};
export default ParagraphCSS;
