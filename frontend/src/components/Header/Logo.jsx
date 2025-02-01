import React from 'react';
import PropTypes from 'prop-types';
import './LogoStyles.css';

const Logo = ({ logo }) => {
  if (!logo || !logo.src) {
    return null;
  }

  return (
    <div className="logo-container">
      <img
        src={logo.src}
        alt={logo.alt}
        className={`logo-image ${logo.className || ''}`}
      />
    </div>
  );
};

Logo.propTypes = {
  logo: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    className: PropTypes.string,
  }).isRequired,
};

export default Logo;
