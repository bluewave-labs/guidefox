import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Dialog } from '@mui/material';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { React } from 'react';
import Button from '../../components/Button/Button';
import styles from './GuideTemplate.module.scss';
import { useDialog } from './GuideTemplateContext';
import { useLocation, useNavigate } from 'react-router';
import Switch from '../../components/Switch/Switch';

const GuideTemplate = ({
  title = '',
  handleButtonClick = () => null,
  activeButton = 0,
  leftContent = () => null,
  rightContent = () => null,
  leftAppearance = () => null,
  onSave = () => null,
  setIsEdit = () => null,
  headerButtons = [],
  enableActiveButton = false,
  switchValue,
  onSwitchChange = () => null,
  disableSaveButton = false,
}) => {
  const { isOpen, closeDialog } = useDialog();
  const location = useLocation();
  const navigate = useNavigate();
  const buttons =
    headerButtons.length === 0 ? ['Content', 'Appearance'] : headerButtons;

  const onCloseHandler = () => {
    if (location.state?.autoOpen) navigate('/', { state: {} });

    //To remove the query string when redirecting the user to the create guide dashboard with prefilled values.
    window.history.replaceState({}, '', window.location.pathname);

    closeDialog();
    setIsEdit(false);
  };

  return (
    <Dialog
      closeAfterTransition={isOpen}
      open={isOpen}
      onClose={onCloseHandler}
      maxWidth="lg"
      PaperProps={{ style: { position: 'static' } }}
    >
      <div className={styles.container}>
        <div className={styles.popup}>
          <div className={styles.header}>
            <span style={{ marginLeft: '5px' }}>{title}</span>
            <CloseOutlinedIcon
              style={{
                color: '#98A2B3',
                fontSize: '20px',
                cursor: 'pointer',
              }}
              onClick={onCloseHandler}
            />
          </div>
          <div className={styles.content}>
            {/* Content and Appereance buttons */}
            <div className={styles.buttons}>
              {buttons.map((buttonName, index) => (
                <button
                  key={index}
                  className={classNames(styles.menuButton, {
                    [styles.active]: activeButton === index,
                  })}
                  onClick={() => handleButtonClick(index)}
                >
                  {buttonName}
                </button>
              ))}

              {enableActiveButton && (
                <div
                  style={{
                    alignSelf: 'center',
                    marginLeft: 'auto',
                    display: 'flex',
                    gap: 6,
                  }}
                >
                  <Switch
                    id="switch"
                    name="isActive"
                    value={switchValue}
                    onChange={onSwitchChange}
                  />
                  <label
                    style={{
                      fontSize: 'var(--font-regular)',
                      alignSelf: 'center',
                    }}
                  >
                    Active and visible
                  </label>
                </div>
              )}
            </div>
            <div className={styles.leftRightContent}>
              {activeButton === 1 ? leftAppearance() : leftContent()}
              {rightContent()}
            </div>
            <div className={styles.optionButtons}>
              <Button
                text="Cancel"
                buttonType="secondary-grey"
                onClick={onCloseHandler}
              />
              <Button
                text="Save"
                onClick={onSave}
                disabled={disableSaveButton}
              />
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

GuideTemplate.propTypes = {
  title: PropTypes.string,
  handleButtonClick: PropTypes.func,
  activeButton: PropTypes.number,
  leftContent: PropTypes.func,
  rightContent: PropTypes.func,
  leftAppearance: PropTypes.func,
  onSave: PropTypes.func,
  setIsEdit: PropTypes.func,
  headerButtons: PropTypes.array,
  enableActiveButton: PropTypes.bool,
  switchValue: PropTypes.bool,
  onSwitchChange: PropTypes.func,
  disableSaveButton: PropTypes.bool,
};

export default GuideTemplate;
