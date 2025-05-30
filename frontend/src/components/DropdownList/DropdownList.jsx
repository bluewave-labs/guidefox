import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './DropdownList.css';

const DropdownList = ({
  id,
  actions = [],
  onActionChange,
  selectedActionIndex = 0,
  selectedActionString = '',
  className = '',
  name = 'select',
  styles = {},
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
      id={id}
      name={name}
      value={selectedAction}
      onChange={handleChange}
      className={`select ${className}`}
      sx={{ marginTop: 1, ...styles }}
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
  id: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.string),
  onActionChange: PropTypes.func,
  selectedActionIndex: PropTypes.number,
  selectedActionString: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
  styles: PropTypes.object,
};

export default DropdownList;
