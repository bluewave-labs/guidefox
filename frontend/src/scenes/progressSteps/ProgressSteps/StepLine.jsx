import React from 'react';
import PropTypes from 'prop-types';
import styles from './ProgressSteps.module.scss';

const light_gray = 'var(--light-gray)';
const main_purple = 'var(--main-purple)';

const StepLine = ({ currentStep = false }) => {
  return (
    <div
      className={styles.line}
      style={{ backgroundColor: currentStep ? main_purple : light_gray }}
    ></div>
  );
};

StepLine.propTypes = {
  currentStep: PropTypes.bool.isRequired,
};

export default StepLine;
