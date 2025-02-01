import { React } from 'react';
import styles from './BannerPreview.module.scss';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PropTypes from 'prop-types';

const BannerPreview = ({
  bannerText = '',
  setBannerText = () => null,
  backgroundColor = 'var(--light-purple-background)',
  color = 'var(--main-text-color)',
  isTopPosition = true,
}) => {
  const handleChange = (event) => {
    setBannerText(event.target.value);
  };
  const banner = (
    <div
      className={styles.banner}
      style={{ backgroundColor: backgroundColor, color: color }}
    >
      <span />
      <input
        type="text"
        className={styles.bannertext}
        placeholder="Change the Banner Text Here"
        value={bannerText}
        onChange={handleChange}
        style={{ color: color }}
      />
      <CloseOutlinedIcon style={{ color: color, fontSize: '20px' }} />
    </div>
  );

  return (
    <div className={styles.container}>
      <h2>Preview</h2>
      <div className={styles.preview}>
        {isTopPosition && banner}
        <div className={styles.bannerOne}></div>
        <div className={styles.bannerTwo}></div>
        <div className={styles.bannerThree}></div>
        <div className={styles.bannerFour}></div>
        {!isTopPosition && banner}
      </div>
    </div>
  );
};

BannerPreview.propTypes = {
  bannerText: PropTypes.string,
  setBannerText: PropTypes.func,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  isTopPosition: PropTypes.bool,
};

export default BannerPreview;
