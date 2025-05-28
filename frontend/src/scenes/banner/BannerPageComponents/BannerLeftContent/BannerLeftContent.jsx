import DropdownList from '@components/DropdownList/DropdownList';
import RadioButton from '@components/RadioButton/RadioButton';
import CustomTextField from '@components/TextFieldComponents/CustomTextField/CustomTextField';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './BannerLeftContent.module.scss';
import { newBannerSchema } from '../../../../utils/bannerHelper.js';
import { Form, Formik } from 'formik';

const BannerLeftContent = React.forwardRef((props, ref) => {
  const {
    setIsTopPosition,
    url,
    setUrl,
    setButtonAction,
    isTopPosition,
    buttonAction,
    buttonRepetition,
    setButtonRepetition,
    actionUrl,
    setActionUrl,
  } = props;
  const handleSetUrl = (event) => {
    setUrl(event.target.value);
  };

  const handleSetActionUrl = (event) => {
    setActionUrl(event.target.value);
  };

  const handleActionChange = (newAction) => {
    setButtonAction(newAction);
  };

  const handlePositionChange = (newPosition) => {
    setIsTopPosition(newPosition);
  };

  const handleRepetitionChange = (newRepetitionType) => {
    setButtonRepetition(newRepetitionType);
  };

  return (
    <Formik
      innerRef={ref}
      initialValues={{ url, actionUrl }}
      validationSchema={newBannerSchema}
      enableReinitialize={true}
      validateOnMount={false}
      validateOnBlur={false}
    >
      {({ errors, handleBlur, validateField }) => (
        <Form className="left-content-container">
          <div className={styles.container}>
            <h2 style={{ marginTop: '1.5rem', marginBottom: '5.3px' }}>
              Repetition
            </h2>
            <DropdownList
              actions={['Show only once', 'Show every visit']}
              onActionChange={handleRepetitionChange}
              selectedActionString={buttonRepetition}
            />
            <h2>Action</h2>
            <DropdownList
              actions={['No action', 'Open URL', 'Open URL in a new tab']}
              onActionChange={handleActionChange}
              selectedActionString={buttonAction}
            />
            <h2 style={{ marginBottom: '10px' }}>Position</h2>
            <div className={styles.radioContent}>
              <RadioButton
                label="Top (centered)"
                checked={isTopPosition}
                onChange={() => handlePositionChange(true)}
              />
            </div>
            <div className={styles.radioContent}>
              <RadioButton
                label="Bottom (centered)"
                checked={!isTopPosition}
                onChange={() => handlePositionChange(false)}
              />
            </div>

            <h2>URL</h2>
            <CustomTextField
              TextFieldWidth="241px"
              error={!!errors.url}
              value={url}
              name="url"
              onChange={handleSetUrl}
              onBlur={(e) => {
                handleBlur(e);
                validateField('url');
              }}
            />
            {errors.url && (
              <small className="error-message">{errors.url}</small>
            )}

            <h2>Action URL</h2>
            <CustomTextField
              TextFieldWidth="241px"
              error={!!errors.actionUrl}
              value={actionUrl}
              name="actionUrl"
              onChange={handleSetActionUrl}
              onBlur={(e) => {
                handleBlur(e);
                validateField('actionUrl');
              }}
            />
            {errors.actionUrl && (
              <small className="error-message">{errors.actionUrl}</small>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
});

BannerLeftContent.displayName = 'BannerLeftContent';

export default BannerLeftContent;
BannerLeftContent.propTypes = {
  setIsTopPosition: PropTypes.func,
  url: PropTypes.string,
  setUrl: PropTypes.func,
  setButtonAction: PropTypes.func,
  isTopPosition: PropTypes.bool,
  buttonAction: PropTypes.string,
  actionUrl: PropTypes.string,
  setActionUrl: PropTypes.func,
  setButtonRepetition: PropTypes.func,
  buttonRepetition: PropTypes.string,
};
