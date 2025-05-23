import * as Yup from 'yup';

const RELATIVE_URL_REGEX = /^\/([a-zA-Z0-9_-]+\/?)+$/;
const COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return RELATIVE_URL_REGEX.test(url);
  }
};

export const appearanceSchema = Yup.object().shape({
  headerColor: Yup.string()
    .required('Header color is required')
    .matches(COLOR_REGEX, 'Invalid value for header color'),

  textColor: Yup.string()
    .required('Text color is required')
    .matches(COLOR_REGEX, 'Invalid value for text color'),

  buttonBackgroundColor: Yup.string()
    .required('Button background color is required')
    .matches(COLOR_REGEX, 'Invalid value for button background color'),

  buttonTextColor: Yup.string()
    .required('Button text color is required')
    .matches(COLOR_REGEX, 'Invalid value for button text color'),

  size: Yup.string()
    .oneOf(['small', 'medium', 'large'], 'Invalid value for tour size')
    .required('Tour size is required'),

  finalButtonText: Yup.string().required('Final button text is required'),

  url: Yup.string()
    .test('is-valid-url', 'Invalid value for URL', validateUrl)
    .max(2000, 'URL must be at most 2000 characters'),
});
