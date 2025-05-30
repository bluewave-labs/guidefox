import { List } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import s from './DraggableHelperLink.module.scss';

const ListItemContainer = ({ children }) => {
  return (
    <div data-testid="cards" id="cards">
      <List className={s.card__container}>{children}</List>
    </div>
  );
};

ListItemContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ListItemContainer;
