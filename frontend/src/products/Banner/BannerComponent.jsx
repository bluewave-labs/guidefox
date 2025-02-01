import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './BannerComponent.module.css';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const BannerComponent = ({
  backgroundColor,
  fontColor,
  isTopPosition,
  bannerText,
  url,
  buttonAction,
  isReal,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = (event) => {
    event.stopPropagation(); // Prevent the event from bubbling up to the parent div
    if (isReal) {
      setIsVisible(false);
    }
  };

  const handleButtonClick = () => {
    if (buttonAction === 'close the popup') {
      handleClose();
    } else if (buttonAction === 'open url') {
      window.open(url, '_self');
    } else if (buttonAction === 'open url in new page') {
      window.open(url, '_blank');
    }
  };

  if (!isVisible) {
    return null;
  }

  const bannerStyles = {
    backgroundColor,
    position: isReal ? 'fixed' : 'relative',
    left: isReal ? '50%' : 'initial',
    transform: isReal ? 'translateX(-50%)' : 'none',
    top: isReal && isTopPosition ? '50px' : 'initial',
    bottom: isReal && !isTopPosition ? '50px' : 'initial',
  };

  return (
    <div
      className={styles.container}
      style={bannerStyles}
      onClick={handleButtonClick}
    >
      <div className={styles.text} style={{ color: fontColor }}>
        {bannerText}
      </div>
      <CloseOutlinedIcon
        style={{ color: fontColor, fontSize: '22px', cursor: 'pointer' }}
        onClick={handleClose}
      />
    </div>
  );
};

BannerComponent.propTypes = {
  backgroundColor: PropTypes.string,
  fontColor: PropTypes.string,
  isTopPosition: PropTypes.bool,
  bannerText: PropTypes.string,
  url: PropTypes.string,
  buttonAction: PropTypes.string,
  isReal: PropTypes.bool,
};

export default BannerComponent;
