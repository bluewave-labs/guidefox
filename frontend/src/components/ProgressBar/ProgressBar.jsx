import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../ProgressBar/styles.css';

const ProgressBar = ({ value = 30 }) => {
  const [percent, setPercent] = useState(value);
  useEffect(() => {
    setPercent(Math.min(100, Math.max(value, 0)));
  }, value);

  return (
    <div className="app">
      <div className="progress">
        <div style={{ width: `${percent}%` }}></div>
      </div>
      <span>{value.toFixed()}%</span>
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number,
};

export default ProgressBar;
