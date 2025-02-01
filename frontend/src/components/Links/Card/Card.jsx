import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SvgIcon,
} from '@mui/material';

import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import { HelperLinkContext } from '../../../services/linksProvider';
import s from './Card.module.scss';

const Card = ({ card, onDragEnd, onDragOver, onDragStart, onDrop }) => {
  const { toggleSettings, setItemToDelete, setIsPopupOpen } =
    useContext(HelperLinkContext);
  const { title } = card;

  const onDelete = (e) => {
    try {
      e.stopPropagation();
      setItemToDelete(card);
      setIsPopupOpen(true);
    } catch (error) {
      console.error('Failed to initiate delete:', error);
    }
  };

  return (
    <ListItem
      onClick={(e) => toggleSettings(e, card)}
      secondaryAction={
        <IconButton
          style={{ fontSize: '0.6rem' }}
          onClick={onDelete}
          id="delete"
        >
          <SvgIcon fontSize="1">
            <svg
              width="9"
              height="9"
              viewBox="0 0 9 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1L1 8M1 1L8 8"
                stroke="#747474"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </SvgIcon>
        </IconButton>
      }
      draggable={true}
      onDragStart={() => onDragStart(card)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={() => onDrop(card)}
    >
      <ListItemAvatar id={`drag-${card.id}`}>
        <IconButton style={{ fontSize: '1rem' }}>
          <SvgIcon className={s.card__icon} fontSize="1">
            <svg
              width="14"
              height="15"
              viewBox="0 0 14 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 5.33333H1M13 14H1M13 1H1M13 9.66667H1"
                stroke="#747474"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </SvgIcon>
        </IconButton>
      </ListItemAvatar>
      <ListItemText primary={title} />
    </ListItem>
  );
};

Card.propTypes = {
  card: PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    order: PropTypes.number,
  }),
  onDragEnd: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragStart: PropTypes.func,
  onDrop: PropTypes.func,
};

export default Card;
