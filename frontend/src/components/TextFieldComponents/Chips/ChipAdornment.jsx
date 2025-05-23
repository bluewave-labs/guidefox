import React from 'react';
import PropTypes from 'prop-types';
import { Box, Chip } from '@mui/material';

const ChipAdornment = ({ chips }) => (
  <Box sx={{ display: 'flex', gap: 1, mt: -15, mr: 1 }}>
    {chips.map((chip, index) => (
      <Chip
        key={index}
        label={chip.label}
        onDelete={chip.onDelete}
        variant="outlined"
        sx={{ borderRadius: '5px' }}
      />
    ))}
  </Box>
);

ChipAdornment.propTypes = {
  chips: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      onDelete: PropTypes.func,
    })
  ).isRequired,
};

export default ChipAdornment;
