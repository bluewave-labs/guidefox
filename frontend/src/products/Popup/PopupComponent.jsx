import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import styles from './PopupComponent.module.css'; // Use your module CSS file
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Button from '@components/Button/Button';

const PopupComponent = (props) => {
  const {
    header,
    content,
    previewBtnText,
    headerBackgroundColor,
    headerColor,
    textColor,
    buttonBackgroundColor,
    buttonTextColor,
    buttonAction,
    popupSize,
    actionButtonUrl,
    isReal,
  } = props;

  // console.log(props)
  const [isVisible, setIsVisible] = useState(true);

  const validSizes = ['small', 'medium', 'large'];
  const sizeClass = validSizes.includes(popupSize.toLowerCase())
    ? styles[popupSize.toLowerCase()]
    : '';
  const sizeClassContent = validSizes.includes(popupSize.toLowerCase())
    ? styles[popupSize.toLowerCase() + 'Content']
    : '';
  const centeredClass = isReal ? styles.centered : '';

  const handleClose = () => {
    if (isReal) {
      setIsVisible(false);
    }
  };

  const handleButtonClick = () => {
    if (buttonAction === 'close the popup') {
      handleClose();
    } else if (buttonAction === 'open url') {
      window.open(actionButtonUrl, '_self');
    } else if (buttonAction === 'open url in new page') {
      window.open(actionButtonUrl, '_blank');
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className={`${styles.popupContainer} ${sizeClass} ${centeredClass}`}>
        {header && (
          <div
            className={styles.header}
            style={{
              backgroundColor: headerBackgroundColor,
              color: headerColor,
            }}
          >
            <h3 style={{ marginLeft: '5px' }}>{header}</h3>
            <CloseOutlinedIcon
              style={{ color: '#98A2B3', fontSize: '20px', cursor: 'pointer' }}
              onClick={handleClose}
            />
          </div>
        )}
        <div className={`${styles.popupContentContainer} ${sizeClassContent}`}>
          <div className={styles.popupContent} style={{ color: textColor }}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          <div className={styles.popupButtonContainer}>
            {previewBtnText && (
              <Button
                style={{
                  backgroundColor: buttonBackgroundColor,
                  color: buttonTextColor,
                  borderRadius: '8px',
                }}
                text={previewBtnText}
                onClick={handleButtonClick} // Add onClick handler
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

PopupComponent.propTypes = {
  header: PropTypes.string,
  content: PropTypes.string.isRequired,
  previewBtnText: PropTypes.string,
  headerBackgroundColor: PropTypes.string,
  headerColor: PropTypes.string,
  textColor: PropTypes.string,
  buttonBackgroundColor: PropTypes.string,
  buttonTextColor: PropTypes.string,
  buttonAction: PropTypes.string,
  popupSize: PropTypes.string,
  actionButtonUrl: PropTypes.string,
  isReal: PropTypes.bool,
};

export default PopupComponent;
