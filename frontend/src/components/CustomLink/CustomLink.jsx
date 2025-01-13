import React from 'react';
import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
import './CustomLinkStyles.css';

const CustomLink = ({
  text = 'Default Text',
  url = '',
  className = '',
  underline = 'none',
  onClick, 
}) => {
  const handleClick = (event) => {
    if (onClick) {
      event.preventDefault(); 
      onClick(event);
    }
  };

  return (
    <Link
      href={url}
      className={`custom-link ${className}`}
      underline={underline}
      onClick={handleClick} 
    >
      {text}
    </Link>
  );
};

CustomLink.propTypes = {
  text: PropTypes.string,
  url: PropTypes.string,
  className: PropTypes.string,
  underline: PropTypes.oneOf(['none', 'hover', 'always']),
  onClick: PropTypes.func, 
};

export default CustomLink;
