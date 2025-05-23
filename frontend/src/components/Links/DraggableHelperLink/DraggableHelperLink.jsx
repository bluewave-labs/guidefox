import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { ListItemText } from '@mui/material';
import { HelperLinkContext } from '../../../services/linksProvider';
import styles from './DraggableHelperLink.module.scss';
import DraggableListItem from '../../DraggableListItem/DraggableListItem';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const DraggableHelperLink = ({
  card,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
}) => {
  const { toggleSettings, setItemToDelete, setIsPopupOpen } =
    useContext(HelperLinkContext);

  const handleDelete = (e, item) => {
    e.stopPropagation();
    setItemToDelete(item);
    setIsPopupOpen(true);
  };

  return (
    <DraggableListItem
      item={card}
      onDelete={handleDelete}
      deleteIcon={
        <CloseRoundedIcon
          sx={{ color: '#747474', backgroundColor: 'transparent' }}
        />
      }
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      deleteButtonClassName={styles.card__secondaryButton}
      onClick={(e) => toggleSettings(e, card)}
    >
      <ListItemText
        sx={{ marginTop: '0px', marginLeft: '1rem' }}
        primary={card.title}
      />
    </DraggableListItem>
  );
};

DraggableHelperLink.propTypes = {
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

export default DraggableHelperLink;
