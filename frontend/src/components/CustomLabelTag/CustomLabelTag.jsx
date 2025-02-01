import React from 'react';
import PropTypes from 'prop-types';
import './CustomLabelTagStyles.css';

const VALID_BACKGROUND_COLORS = [
  'orange',
  'gray',
  'purple',
  'green',
  'seen',
  'waiting',
  'new',
];

const CustomLabelTag = ({
  text,
  backgroundColor = 'white',
  textColor = '',
  className = '',
}) => {
  const labelClass = `label label-${backgroundColor} ${className}`;

  const style = {
    color: textColor,
  };

  return (
    <span className={labelClass} style={style}>
      {['seen', 'waiting', 'new'].includes(backgroundColor) && (
        <span className="dot"></span>
      )}
      {text}
    </span>
  );
};

CustomLabelTag.propTypes = {
  text: PropTypes.string.isRequired,
  backgroundColor: PropTypes.oneOf(VALID_BACKGROUND_COLORS),
  textColor: PropTypes.string,
  className: PropTypes.string,
};

export default CustomLabelTag;
