import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';
import ColorInput from '../../../components/Links/ColorInput';
import Switch from '../../../components/Switch/Switch';
import { HelperLinkContext } from '../../../services/linksProvider';
import { appearanceSchema } from '../../../utils/linkHelper';
import styles from '../LinkPage.module.scss';

const LinkAppearance = () => {
  const context = useContext(HelperLinkContext);
  if (!context) {
    throw new Error('LinkAppearance must be used within a HelperLinkProvider');
  }

  const { helper, setHelper } = context;

  useEffect(() => {
    document.querySelector('#header').focus();
  }, []);

  const handleHelperChange = (e) => {
    const { name, checked } = e.target;
    let { value } = e.target;
    if (name === 'active') {
      value = checked;
    }
    if (name === 'absolutePath') {
      value = !checked;
    }
    setHelper((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Formik
      initialValues={helper}
      validationSchema={appearanceSchema}
      validateOnMount={false}
      validateOnBlur={true}
      enableReinitialize={true}
    >
      {({ errors, handleChange, handleBlur, values, validateField }) => (
        <Form className={styles.appearance} data-testid="appearance-form">
          <label htmlFor="header" className={styles.appearance__label}>
            Header text{' '}
            <input
              type="text"
              id="header"
              className={`${styles.appearance__input} ${
                errors.title && styles.error
              }`}
              name="title"
              value={values.title || ''}
              onChange={(e) => {
                handleChange(e);
                handleHelperChange(e);
              }}
              onBlur={(e) => {
                handleBlur(e);
                handleHelperChange(e);
                validateField('title');
              }}
            />
            {errors.title && (
              <span className={styles.appearance__error}>{errors.title}</span>
            )}
          </label>
          <label htmlFor="url" className={styles.appearance__label}>
            URL (can be relative){' '}
            <input
              type="text"
              id="url"
              className={`${styles.appearance__input} ${
                errors.url && styles.error
              }`}
              name="url"
              value={values.url || ''}
              onChange={(e) => {
                handleChange(e);
                handleHelperChange(e);
              }}
              onBlur={(e) => {
                handleBlur(e);
                handleHelperChange(e);
                validateField('url');
              }}
            />
            {errors.url && (
              <span className={styles.appearance__error}>{errors.url}</span>
            )}
          </label>
          <label
            htmlFor="absolutePath"
            className={`${styles.appearance__label} ${styles.row}`}
          >
            <span>Show on dependent pages?</span>
            <Switch
              id="absolutePath"
              name="absolutePath"
              onChange={(e) => {
                handleChange(e);
                handleHelperChange(e);
              }}
              value={!values.absolutePath}
            />
          </label>
          <ColorInput
            id="header-bg"
            name="headerBackgroundColor"
            value={values.headerBackgroundColor}
            onChange={(e) => {
              handleChange(e);
              handleHelperChange(e);
            }}
            onBlur={(e) => {
              handleBlur(e);
              handleHelperChange(e);
            }}
            error={errors.headerBackgroundColor}
            title={'Header background color'}
            className={'header'}
          />
          <ColorInput
            id="link-color"
            name="linkFontColor"
            value={values.linkFontColor}
            onChange={(e) => {
              handleChange(e);
              handleHelperChange(e);
            }}
            onBlur={(e) => {
              handleBlur(e);
              handleHelperChange(e);
            }}
            error={errors.linkFontColor}
            title={'Link font color'}
            className={'link'}
          />
          <ColorInput
            id="icon"
            name="iconColor"
            value={values.iconColor}
            onChange={(e) => {
              handleChange(e);
              handleHelperChange(e);
            }}
            onBlur={(e) => {
              handleBlur(e);
              handleHelperChange(e);
            }}
            error={errors.iconColor}
            title={'Helper icon color'}
            className={'icon'}
          />
          <label
            htmlFor="switch"
            className={`${styles.appearance__label} ${styles.row}`}
          >
            <span>Helper link is active?</span>
            <Switch
              id="switch"
              name="active"
              onChange={(e) => {
                handleChange(e);
                handleHelperChange(e);
              }}
              value={values.active}
            />
          </label>
        </Form>
      )}
    </Formik>
  );
};

export default LinkAppearance;

LinkAppearance.propTypes = {
  handleSaveHelper: PropTypes.func.isRequired,
};
