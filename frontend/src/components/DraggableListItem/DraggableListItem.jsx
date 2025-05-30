import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemAvatar } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Hamburger } from '../../assets/icons/utilityIcons';
import styles from './DraggableListItem.module.scss';

const DraggableListItem = ({
  item,
  onDelete,
  deleteIcon = <CloseRoundedIcon />,
  dragHandleIcon = <Hamburger />,
  children,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  deleteButtonClassName,
  deleteDisabled = false,
  ...listItemProps
}) => {
  return (
    <ListItem
      draggable
      onDragStart={() => onDragStart?.(item)}
      onDragEnd={() => onDragEnd?.(item)}
      onDragOver={(e) => onDragOver?.(e, item)}
      onDrop={() => onDrop?.(item)}
      secondaryAction={
        <button
          className={deleteButtonClassName}
          onClick={(e) => onDelete(e, item)}
          disabled={deleteDisabled}
        >
          {deleteIcon}
        </button>
      }
      {...listItemProps}
    >
      <ListItemAvatar sx={{ minWidth: 'auto' }}>
        <div className={styles.grabHandle}>{dragHandleIcon}</div>
      </ListItemAvatar>
      {children}
    </ListItem>
  );
};

DraggableListItem.propTypes = {
  item: PropTypes.any.isRequired,
  onDelete: PropTypes.func.isRequired,
  deleteIcon: PropTypes.element,
  dragHandleIcon: PropTypes.element,
  children: PropTypes.node,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func,
  grabHandleClassName: PropTypes.string,
  deleteButtonClassName: PropTypes.string,
  deleteDisabled: PropTypes.bool,
};

export default DraggableListItem;
