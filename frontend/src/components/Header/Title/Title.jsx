import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import Button from '../../Button/Button';
import './TitleStyles.css';

const Title = ({
  title,
  buttonText,
  onButtonClick,
  titleStyle,
  buttonStyle,
  children,
}) => {
  return (
    <div className="titleContainer">
      <Box className="titleHeader">
        <Typography
          className="titleBanner"
          component="div"
          style={{ ...titleStyle }}
        >
          {title}
        </Typography>
        <Button text={buttonText} onClick={onButtonClick} style={buttonStyle} />
      </Box>
      {children}
    </div>
  );
};

Title.propTypes = {
  title: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func.isRequired,
  titleStyle: PropTypes.object,
  buttonStyle: PropTypes.object,
  children: PropTypes.node,
};

Title.defaultProps = {
  titleStyle: {},
  buttonStyle: {},
};

export default Title;
