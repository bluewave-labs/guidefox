import React from 'react';
import PropTypes from 'prop-types';
import GoogleIconSvg from '../../../assets/icons/google-icon.svg';
import './GoogleSignInButton.css';

const GoogleSignInButton = ({
  text = 'Sign in with Google',
  onClick = () => {},
}) => {
  return (
    <button className="google-sign-in-button" onClick={onClick}>
      <img src={GoogleIconSvg} alt="Google Icon" className="google-icon" />
      {text}
    </button>
  );
};

GoogleSignInButton.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
};

export default GoogleSignInButton;
