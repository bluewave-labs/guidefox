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

const newBannerSchema = Yup.object().shape({
  action: Yup.string().oneOf(
    ['no action', 'open url', 'open url in a new tab'],
    'Invalid value for action'
  ),
  url: Yup.string()
    .test('url', 'Invalid value for URL', validateUrl)
    .max(2000, 'URL must be at most 2000 characters'),
  actionUrl: Yup.string()
    .test('actionUrl', 'Invalid value for Action URL', validateUrl)
    .max(2000, 'URL must be at most 2000 characters'),
});

const appearanceSchema = Yup.object().shape({
  backgroundColor: Yup.string()
    .matches(/^#[0-9A-Fa-f]{6}$/, 'Invalid value for Background Color')
    .required('Background Color is required'),
  fontColor: Yup.string()
    .matches(/^#[0-9A-Fa-f]{6}$/, 'Invalid value for Font Color')
    .required('Font Color is required'),
});

export { newBannerSchema, appearanceSchema };
