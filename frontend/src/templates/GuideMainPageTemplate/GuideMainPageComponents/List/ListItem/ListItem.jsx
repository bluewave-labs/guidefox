import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import {
  DuplicateIcon,
  EditIcon,
  TrashIcon,
} from '../../../../../assets/icons/utilityIcons';
import './ListItem.css';
import { useAuth } from '../../../../../services/authProvider';
import { renderIfAuthorized } from '../../../../../utils/generalHelper';

const ListItem = ({
  title,
  text,
  id,
  onClick,
  onDelete,
  onEdit,
  onDuplicate,
}) => {
  const { userInfo } = useAuth();
  const role = userInfo.role;

  return (
    <div className="list-item" onClick={onClick}>
      <div className="list-item-info">
        <div className="list-item-header">
          <h4>{title}</h4>
        </div>
        {text && <p>{text}</p>}
        {id && <p className="item-id">ID: {id}</p>}
      </div>

      <div className="list-item-actions">
        {renderIfAuthorized(
          role,
          'admin',
          <>
            <IconButton onClick={onDuplicate}>
              <DuplicateIcon />
            </IconButton>
            <IconButton onClick={onEdit}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={onDelete}>
              <TrashIcon />
            </IconButton>
          </>
        )}
      </div>
    </div>
  );
};

ListItem.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  id: PropTypes.number,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onDuplicate: PropTypes.func,
};

export default ListItem;
