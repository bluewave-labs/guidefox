import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const InfoTooltip = ({ text }) => {
  return (
    <Tooltip title={text}>
      <IconButton>
        <InfoIcon />
      </IconButton>
    </Tooltip>
  );
};

InfoTooltip.propTypes = {
  text: PropTypes.string,
};

export default InfoTooltip;
