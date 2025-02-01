import React from 'react';
import PropTypes from 'prop-types';
import { Button as MuiButton } from '@mui/material';
import './ButtonStyles.css';
import CircularProgress from '@mui/material/CircularProgress';

const Button = ({
  text = '',
  onClick = () => {},
  variant = 'contained',
  style = null,
  sx = null,
  disabled = false,
  buttonType = 'primary',
  type = 'button',
  loading = false,
}) => {
  const classname = 'button ' + buttonType;
  return (
    <MuiButton
      disableRipple
      variant={variant}
      className={classname}
      onClick={onClick}
      disabled={disabled || loading}
      sx={sx}
      style={style}
      type={type}
    >
      {loading ? <CircularProgress size={12} color="inherit" /> : text}
    </MuiButton>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
  style: PropTypes.object,
  sx: PropTypes.object,
  disabled: PropTypes.bool,
  buttonType: PropTypes.oneOf([
    'primary',
    'secondary',
    'secondary-grey',
    'secondary-purple',
    'error',
  ]),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  loading: PropTypes.bool,
};

export default Button;
