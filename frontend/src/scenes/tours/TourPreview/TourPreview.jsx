import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import Turndown from 'turndown';
import styles from './TourPreview.module.scss';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { Close } from '@mui/icons-material';
import { Button } from '@mui/material';

const TourPreview = ({
  stepsData,
  currentStep,
  setCurrentStep,
  tourAppearance,
  style,
}) => {
  const { header, description } = currentStep;
  const markdownContent = new Turndown().turndown(description);

  const {
    headerColor,
    textColor,
    buttonBackgroundColor,
    buttonTextColor,
    tourSize,
    finalButtonText,
  } = tourAppearance;

  const buttonStyles = {
    minWidth: '96px',
    textTransform: 'none',
    fontWeight: '400',
    boxShadow: 'none',

    '&:hover': {
      boxShadow: 'none',
    },

    '&.Mui-disabled': {
      cursor: 'not-allowed',
      pointerEvents: 'auto',
    },
  };

  const findCurrentIndex = (activeStep) =>
    stepsData.findIndex(({ id }) => id === activeStep.id);

  const currentIndex = findCurrentIndex(currentStep);
  const prevDisabled = currentIndex === 0;
  const nextDisabled = currentIndex === stepsData.length - 1;

  const onClickHandler = (identifier) => {
    if (identifier === 'prev' && currentIndex > 0)
      setCurrentStep(stepsData[currentIndex - 1]);
    else if (identifier === 'next' && currentIndex < stepsData.length - 1)
      setCurrentStep(stepsData[currentIndex + 1]);
  };

  const arrowStyles = {
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.1)',
      transition: 'all 0.3s ease',
    },
  };

  return (
    <div style={style} className={`${styles.container} ${styles[tourSize]}`}>
      <div className={styles.title}>
        <ArrowCircleLeftOutlinedIcon
          sx={{
            ...arrowStyles,
            visibility: prevDisabled ? 'hidden' : 'visible',
          }}
          onClick={!prevDisabled ? () => onClickHandler('prev') : undefined}
          aria-label="Previous"
        />
        <span>Preview</span>
        <ArrowCircleRightOutlinedIcon
          sx={{
            ...arrowStyles,
            visibility: nextDisabled ? 'hidden' : 'visible',
          }}
          onClick={!nextDisabled ? () => onClickHandler('next') : undefined}
          aria-label="Next"
        />
      </div>

      <div className={styles.preview}>
        <div className={styles.heading}>
          <h3 style={{ color: `${headerColor}` }}>{header}</h3>
          <Close className={styles.closeIcon} aria-label="Close Preview" />
        </div>

        <div className={styles.preview__content} style={{ color: textColor }}>
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>

        <div className={styles.buttons}>
          <Button
            onClick={() => onClickHandler('prev')}
            disabled={prevDisabled}
            color="var(--main-text-color)"
            sx={buttonStyles}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            // disabled={nextDisabled}
            onClick={() => onClickHandler('next')}
            sx={{
              ...buttonStyles,
              color: `${buttonTextColor}`,
              backgroundColor: `${buttonBackgroundColor}`,
            }}
          >
            {findCurrentIndex(currentStep) === stepsData.length - 1
              ? finalButtonText
              : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const stepShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  title: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  targetElement: PropTypes.string.isRequired,
});

TourPreview.propTypes = {
  stepsData: PropTypes.arrayOf(stepShape).isRequired,
  currentStep: stepShape.isRequired,
  setCurrentStep: PropTypes.func,
  tourAppearance: PropTypes.shape({
    headerColor: PropTypes.string,
    textColor: PropTypes.string,
    buttonBackgroundColor: PropTypes.string,
    buttonTextColor: PropTypes.string,
    tourSize: PropTypes.string,
    finalButtonText: PropTypes.string,
    url: PropTypes.string,
  }),
  style: PropTypes.object,
};

export default TourPreview;
