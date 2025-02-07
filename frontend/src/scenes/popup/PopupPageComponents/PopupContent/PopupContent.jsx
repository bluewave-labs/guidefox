import { React } from 'react';
import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import styles from './PopupContent.module.scss';
import DropdownList from '@components/DropdownList/DropdownList';
import CustomTextField from '@components/TextFieldComponents/CustomTextField/CustomTextField';
import { popupContentSchema } from '../../../../utils/popupHelper';

const PopupContent = ({
  buttonRepetition,
  action,
  url,
  actionButtonUrl,
  actionButtonText,
  setPopupContent,
  onSave,
}) => {
  return (
    <Formik
      initialValues={{
        buttonRepetition,
        action,
        url,
        actionButtonUrl,
        actionButtonText,
      }}
      validateOnMount={false}
      enableReinitialize={true}
      validationSchema={popupContentSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          onSave();
        } catch (error) {
          return;
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        touched,
        handleBlur,
        handleChange,
        values,
        validateField,
        setFieldValue,
      }) => {

        const handleDropdownChange = (fieldName, newValue) => {
          setFieldValue(fieldName, newValue.toLowerCase());
          setPopupContent((prev) => ({
            ...prev,
            [fieldName]: newValue.toLowerCase(),
          }));
        };
        
        const renderError = (field) =>
          Boolean(touched[field] && errors[field]) && (
            <small className="error-message">{errors[field]}</small>
          );

        return (
          <Form className={styles.container}>
            <h2 style={{ marginTop: '1.5rem' }}>Repetition</h2>
            <DropdownList
              actions={['Show only once', 'Show every visit']}
              onActionChange={(newValue) =>
                handleDropdownChange('buttonRepetition', newValue)
              }
              selectedActionString={buttonRepetition}
            />

            <h2>Action</h2>
            <DropdownList
              actions={['No action', 'Open URL', 'Open URL in a new tab']}
              onActionChange={(newValue) =>
                handleDropdownChange('action', newValue)
              }
              selectedActionString={action}
            />

            <h2 style={{ marginBottom: 0 }}>URL</h2>
            <CustomTextField
              TextFieldWidth="241px"
              name="url"
              value={values.url}
              error={Boolean(touched.url && errors.url)}
              onChange={(e) => {
                setPopupContent((prev) => ({ ...prev, url: e.target.value }));
                handleChange({ target: { name: 'url', value: e.target.value } });
              }}
              onBlur={(e) => {
                handleBlur(e);
                validateField('url');
              }}
            />
            {renderError('url')}

            <h2 style={{ marginBottom: 0 }}>
              Action button URL (can be relative)
            </h2>
            <CustomTextField
              TextFieldWidth="241px"
              name="actionButtonUrl"
              value={values.actionButtonUrl}
              error={Boolean(touched.actionButtonUrl && errors.actionButtonUrl)}
              onChange={(e) => {
                setPopupContent((prev) => ({
                  ...prev,
                  actionButtonUrl: e.target.value,
                }));
                handleChange({
                  target: { name: 'actionButtonUrl', value: e.target.value },
                });
              }}
              onBlur={(e) => {
                handleBlur(e);
                validateField('actionButtonUrl');
              }}
            />
            {renderError('actionButtonUrl')}

            <h2 style={{ marginBottom: 0 }}>Action button text</h2>
            <CustomTextField
              TextFieldWidth="241px"
              value={values.actionButtonText}
              name="actionButtonText"
              error={!!errors.actionButtonText}
              onChange={(e) => {
                const newValue = e.target.value;
                setPopupContent((prev) => ({
                  ...prev,
                  actionButtonText: newValue,
                }));
                setFieldValue('actionButtonText', newValue);
              }}
              onBlur={(e) => {
                handleBlur(e);
                validateField('actionButtonText');
              }}
            />
            {renderError('actionButtonText')}
          </Form>
        );
      }}
    </Formik>
  );
};

PopupContent.propTypes = {
  actionButtonText: PropTypes.string,
  buttonAction: PropTypes.string,
  actionButtonUrl: PropTypes.string,
  url: PropTypes.string,
  buttonRepetition: PropTypes.string,
  setPopupContent: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default PopupContent;
