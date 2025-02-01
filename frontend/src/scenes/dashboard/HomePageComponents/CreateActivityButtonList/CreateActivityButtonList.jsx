import PropTypes from 'prop-types';
import CreateActivityButton from '../CreateActivityButton/CreateActivityButton';
import styles from './CreateActivityButtonList.module.scss';

const CreateActivityButtonList = ({ buttons }) => {
  return (
    <div className={styles.activityButtons}>
      {buttons.map((button, index) => (
        <CreateActivityButton key={index} {...button} />
      ))}
    </div>
  );
};

CreateActivityButtonList.propTypes = {
  buttons: PropTypes.array.isRequired,
};

export default CreateActivityButtonList;
