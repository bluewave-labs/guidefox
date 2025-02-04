import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { CircularProgress } from '@mui/material';
import { Form, Formik } from 'formik';
import { useContext, useEffect, useRef, useState } from 'react';
import { HelperLinkContext } from '../../../services/linksProvider';
import { newLinkSchema, validateUrl } from '../../../utils/linkHelper';
import Switch from '../../Switch/Switch';
import style from './Settings.module.scss';

const defaultState = {
  title: '',
  url: '',
  target: true,
  helperId: null,
  id: 0,
};

const Settings = () => {
  const { toggleSettings, helper, linkToEdit, setLinks, setLinkToEdit } =
    useContext(HelperLinkContext);
  const [oldLink] = useState(linkToEdit);
  const [state, setState] = useState(linkToEdit ?? defaultState);
  const settingsRef = useRef();

  const handleMouseDown = (e) => {
    if (settingsRef.current) {
      const isSettings = settingsRef?.current.contains(e.target);
      const isCards = !!e.target.closest('#cards');
      if (!isSettings && !isCards) {
        handleClose(e);
      }
    }
  };

  useEffect(() => {
    document.querySelector('#title').focus();
    if (linkToEdit) {
      const newState = {
        ...linkToEdit,
        helperId: helper.id,
      };
      setState(newState);
    } else {
      setState({
        ...defaultState,
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      });
    }
    window.addEventListener('mousedown', handleMouseDown);

    return () => window.removeEventListener('mousedown', handleMouseDown);
  }, []);

  const handleClose = async (e, info) => {
    e?.preventDefault();
    if (!info) {
      info = Array.from(settingsRef.current.querySelectorAll('input')).reduce(
        (acc, it) => ({
          ...acc,
          [it.name]: it.name === 'target' ? it.value === 'true' : it.value,
        }),
        {}
      );
    }

    if (!e) {
      e = { target: settingsRef.current };
    }
    if (!info.title.trim() && !info.url.trim()) {
      toggleSettings(e);
      setLinkToEdit(null);
      return;
    }
    if (!validateUrl(info.url)) {
      throw new Error('Invalid URL format');
    }
    if (linkToEdit) {
      setLinks((prev) =>
        prev.map((it) =>
          it.id === oldLink.id ? { ...info, id: oldLink.id } : it
        )
      );
      setLinkToEdit(null);
      toggleSettings(e);
    } else {
      setLinks((prev) => [...prev, { ...info, id: info.id }]);
      toggleSettings(e);
    }
  };

  return (
    <Formik
      initialValues={state}
      validationSchema={newLinkSchema}
      validateOnMount={false}
      validateOnBlur={false}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await handleClose(null, state);
        } catch (error) {
          return;
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        isSubmitting,
        errors,
        handleChange,
        handleBlur,
        values,
        validateField,
      }) => (
        <Form
          className={style.settings}
          ref={settingsRef}
          data-testid="settings-form"
        >
          <div className={style.settings__header}>
            <span className={style['settings__header--title']}>
              Add new link
            </span>
            <div className={style['settings__header--right']}>
              <span className={style['settings__header--info']}>
                Auto-saved
              </span>
              <CloseOutlinedIcon
                onClick={handleClose}
                style={{
                  color: '#98A2B3',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
                data-testid="close"
              />
            </div>
          </div>
          <div className={style.settings__content}>
            <input
              type="hidden"
              name="id"
              value={state.id}
              onChange={(e) => {
                handleChange(e);
                setState((prev) => ({ ...prev, id: e.target.value }));
              }}
            />
            <label
              htmlFor="title"
              className={style['settings__content--label']}
            >
              <span className={style['settings__content--text']}>Title</span>
              <input
                className={`${style['settings__content--input']} ${
                  errors.title ? style.error : ''
                }`}
                id="title"
                type="text"
                name="title"
                onChange={(e) => {
                  handleChange(e);
                  setState((prev) => ({ ...prev, title: e.target.value }));
                }}
                onBlur={(e) => {
                  handleBlur(e);
                  validateField('title');
                }}
                value={values.title}
              />
              {errors.title && (
                <small className={style['settings__content--error']}>
                  {errors.title}
                </small>
              )}
            </label>
            <label htmlFor="url" className={style['settings__content--label']}>
              <span className={style['settings__content--text']}>
                URL to open (can be a relative URL)
              </span>
              <input
                className={`${style['settings__content--input']} ${
                  errors.url ? style.error : ''
                }`}
                id="url"
                type="text"
                name="url"
                onChange={(e) => {
                  handleChange(e);
                  setState((prev) => ({ ...prev, url: e.target.value }));
                }}
                onBlur={(e) => {
                  handleBlur(e);
                  validateField('url');
                }}
                value={values.url}
              />
              {errors.url && (
                <small className={style['settings__content--error']}>
                  {errors.url}
                </small>
              )}
              <small className={style['settings__content--obs']}>
                You can use a URL that starts with https:// or an internal
                address that starts with / (slash) character.
              </small>
            </label>
            <label
              htmlFor="switch"
              className={`${style['settings__content--label']} ${style.last}`}
            >
              <Switch
                id="switch"
                name="target"
                onChange={(e) => {
                  handleChange(e);
                  setState((prev) => ({
                    ...prev,
                    target: e.target.value === 'true',
                  }));
                }}
                value={values.target}
              />
              <span>Open in a new tab</span>
            </label>
          </div>
          <button type="submit" style={{ display: 'none' }}>
            {isSubmitting ? (
              <CircularProgress size={12} color="inherit" />
            ) : (
              'Submit'
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default Settings;
