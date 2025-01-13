import * as Yup from 'yup';

const RELATIVE_URL_REGEX = /^\/([a-zA-Z0-9_-]+\/?)+$/;

const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return RELATIVE_URL_REGEX.test(url);
  }
};

const newLinkSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be at most 50 characters'),
  url: Yup.string()
    .required('URL is required')
    .test('url', 'Invalid value for URL', validateUrl)
    .max(2000, 'URL must be at most 2000 characters'),
  target: Yup.boolean(),
});

const appearanceSchema = Yup.object().shape({
  title: Yup.string()
    .required('Header is required')
    .trim()
    .matches(
      /^[A-Za-z'\s-]+$/,
      'Header can only contain letters, hyphens and apostrophes'
    ),
  headerBackgroundColor: Yup.string()
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/, 'Invalid value for headerBackgroundColor'),
  linkFontColor: Yup.string()
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/, 'Invalid value for linkFontColor'),
  iconColor: Yup.string()
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/, 'Invalid value for iconColor'),
});

export { appearanceSchema, newLinkSchema, validateUrl };
