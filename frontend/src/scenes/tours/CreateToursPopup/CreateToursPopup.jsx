import { useState, React } from 'react';
import PropTypes from 'prop-types';
import styles from './CreateToursPopup.module.scss';
import Switch from '@components/Switch/Switch';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DropdownList from '@components/DropdownList/DropdownList';

const CreateToursPopup = ({ onClose }) => {
  const [text, setText] = useState('/');

  const handleInputChange = (event) => {
    let newText = event.target.value;
    if (!newText.startsWith('/')) {
      newText = '/' + newText;
    }
    setText(newText);
  };

  return (
    <div className={styles.settings}>
      <div className={styles.settingsHeader}>
        <span style={{ marginLeft: '5px' }}>Settings</span>
        <CloseOutlinedIcon
          onClick={onClose}
          style={{ color: '#98A2B3', fontSize: '20px', cursor: 'pointer' }}
        />
      </div>
      <div className={styles.settingsContent}>
        <h3>Main dashboard - first login tour</h3>
        <h4 style={{ fontWeight: 600 }}>Status</h4>
        <div className={styles.status}>
          <div className={styles.switch}>
            {' '}
            <Switch />{' '}
          </div>
          <h4>Active and visible</h4>
        </div>
        <div className={styles.tourName}>
          <h4>Tour Name</h4>
          <input type="text" />
        </div>
        <div className={styles.description}>
          <h4>Description</h4>
          <input type="text" />
        </div>
        <div className={styles.pageTargeting}>
          <h4>Page Targeting</h4>
          <div className={styles.pageTargetingOption}>
            <DropdownList actions={['Equals to']} />
            <input
              type="text"
              value={text}
              style={{ marginBottom: '5px' }}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.smallText}>
            Only show when the page URL matches
          </div>
        </div>
        <div className={styles.triggeringFrequency}>
          <h4>Triggering Frequency</h4>
          <div className={styles.freqButtonContainer}>
            <DropdownList
              actions={[
                'Just Once',
                'Once in every session',
                'Once every day',
                'Once every week',
                'Once every month',
                'Always',
              ]}
            />
            <span /> {/* empty */}
          </div>
        </div>
        <div className={styles.theme}>
          <h4>Theme</h4>
          <div className={styles.themeButtonContainer}>
            <DropdownList actions={['Default Theme']} />
            <span /> {/* empty */}
          </div>
        </div>
      </div>
    </div>
  );
};

CreateToursPopup.propTypes = {
  onClose: PropTypes.func,
};

export default CreateToursPopup;
