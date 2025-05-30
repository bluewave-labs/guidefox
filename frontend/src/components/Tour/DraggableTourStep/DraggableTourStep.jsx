import PropTypes from 'prop-types';
import styles from './DraggableTourStep.module.scss';
import { TrashIcon } from '../../../assets/icons/utilityIcons';
import DraggableListItem from '../../DraggableListItem/DraggableListItem';

const DraggableTourStep = ({
  id,
  text,
  isActive,
  stepsLength,
  stepNameChangeHandler,
  onSelectHandler,
  onDeleteHandler,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  return (
    <DraggableListItem
      item={id}
      onDelete={(e, itemId) => {
        e.stopPropagation();
        onDeleteHandler(itemId);
      }}
      deleteIcon={<TrashIcon stroke="var(--second-text-color)" />}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      deleteButtonClassName={styles.stepContainer__button}
      className={`${styles.stepContainer} ${
        isActive ? styles.stepContainer__isActive : ''
      }`}
      disablePadding
      onClick={onSelectHandler}
      deleteDisabled={stepsLength === 1}
      sx={{
        '& .MuiListItemSecondaryAction-root': {
          right: '8px',
        },
      }}
    >
      <div style={{ flexGrow: 1, paddingLeft: '1rem' }}>
        <input
          type="text"
          value={text}
          onChange={(e) => stepNameChangeHandler?.(e.target.value)}
          className={`${styles.stepContainer__customInput}`}
        />
      </div>
    </DraggableListItem>
  );
};

DraggableTourStep.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  text: PropTypes.string,
  isActive: PropTypes.bool,
  stepsLength: PropTypes.number,
  stepNameChangeHandler: PropTypes.func.isRequired,
  onSelectHandler: PropTypes.func,
  onDeleteHandler: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func,
};

export default DraggableTourStep;
