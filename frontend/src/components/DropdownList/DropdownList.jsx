import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './DropdownList.css';

const DropdownList = ({
  actions = [],
  onActionChange,
  selectedActionIndex = 0,
  selectedActionString = '',
  className = '',
  name = 'select',
}) => {
  const [selectedAction, setSelectedAction] = useState('');

  const getInitialSelectedAction = () => {
    if (selectedActionString) {
      const index = actions.findIndex(
        (action) => action.toLowerCase() === selectedActionString.toLowerCase()
      );
      return index !== -1 ? actions[index] : actions[0] || '';
    }
    return actions[selectedActionIndex] || '';
  };

  useEffect(() => {
    setSelectedAction(getInitialSelectedAction());
  }, [selectedActionString]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedAction(newValue);
    if (onActionChange) {
      onActionChange(newValue);
    }
  };

  return (
    <Select
      name={name}
      value={selectedAction}
      onChange={handleChange}
      className={`select ${className}`}
      sx={{ marginTop: 1 }}
    >
      {actions.length > 0 ? (
        actions.map((action, index) => (
          <MenuItem key={index} className="menuItem" value={action}>
            {action}
          </MenuItem>
        ))
      ) : (
        <MenuItem value="" disabled className="menuItem">
          No Actions Available
        </MenuItem>
      )}
    </Select>
  );
};

DropdownList.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string),
  onActionChange: PropTypes.func,
  selectedActionIndex: PropTypes.number,
  selectedActionString: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
};

export default DropdownList;
