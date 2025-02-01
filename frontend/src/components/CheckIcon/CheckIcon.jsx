import React from 'react';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const CheckIcon = ({ size = 'medium', outline = true, color = 'purple' }) => {
  const getColorVariable = (color) => {
    switch (color) {
      case 'purple':
        return 'var(--main-purple)';
      case 'green':
        return 'var(--checkIcon-green)';
      case 'black':
        return 'var(--third-text-color)';
      default:
        return color; // Fallback to the passed color
    }
  };

  const mappedColor = getColorVariable(color);

  return (
    <div>
      {outline ? (
        <CheckCircleOutlinedIcon fontSize={size} sx={{ color: mappedColor }} />
      ) : (
        <CheckCircleIcon fontSize={size} sx={{ color: mappedColor }} />
      )}
    </div>
  );
};

CheckIcon.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  outline: PropTypes.bool,
  color: PropTypes.oneOf(['purple', 'green', 'black']),
};

export default CheckIcon;
