import React from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItemButton,
  ListItemText,
  Paper,
  ListItemIcon,
} from '@mui/material';
import './DropdownMenuList.css';

const DropdownMenuList = ({ menuItems, direction = 'up' }) => {
  if (!menuItems || menuItems.length === 0) {
    return null;
  }

  const className = 'dropdownMenu-' + direction;

  return (
    <Paper className={`dropdownMenu ${className}`} elevation={3}>
      <List className="dropdownList">
        {menuItems.map(({ text, icon, onClick }, index) => (
          <ListItemButton
            key={index}
            className="dropdownItem"
            onClick={(e) => onClick(e, index)}
          >
            {icon && <ListItemIcon>{icon}</ListItemIcon>}
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

DropdownMenuList.propTypes = {
  menuItems: PropTypes.array.isRequired,
  direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),
};

export default DropdownMenuList;
