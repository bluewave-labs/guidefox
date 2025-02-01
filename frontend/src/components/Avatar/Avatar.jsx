import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './AvatarStyles.css';

const Avatar = ({ src, alt, size = 'medium', className }) => {
  const defaultClasses = classNames(
    'avatar-container',
    { [`avatar-${size}`]: size },
    className
  );

  //Validation check so that picture string follows base64 constraints
  const validSrc =
    src &&
    (src.startsWith('data:image') ||
      src.startsWith('/') ||
      src.startsWith('http'))
      ? src
      : '/vendetta.png';

  return <img src={validSrc} alt={alt} className={defaultClasses} />;
};

Avatar.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
};

export default Avatar;
