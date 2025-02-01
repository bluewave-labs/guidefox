import { List } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import s from './Card.module.scss';

const CardContainer = ({ children }) => {
  return (
    <div data-testid="cards" id="cards">
      <List className={s.card__container}>{children}</List>
    </div>
  );
};

CardContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CardContainer;
