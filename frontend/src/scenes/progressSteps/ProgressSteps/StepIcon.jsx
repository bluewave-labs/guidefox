import React from 'react';
import PropTypes from 'prop-types';
import styles from './ProgressSteps.module.scss';
import {
  CheckCircle as CheckCircleIcon,
  TripOrigin as TripOriginIcon,
} from '@mui/icons-material';

const StepIcon = ({ prevStep = false, currentStep = false }) => {
  return (
    <>
      {currentStep ? (
        <CheckCircleIcon className={styles['check-circle-icon']} />
      ) : (
        <TripOriginIcon
          className={prevStep ? styles['on-progress'] : styles['future-step']}
        />
      )}
    </>
  );
};

StepIcon.propTypes = {
  prevStep: PropTypes.bool,
  currentStep: PropTypes.bool,
};

export default StepIcon;
