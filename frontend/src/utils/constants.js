// API constants
//local environment
export const API_BASE_URL = 'http://localhost:3000/api/';

//staging environment
// export const API_BASE_URL = 'https://onboarding-demo.bluewavelabs.ca/api/';
// Other constants
export const APP_TITLE = 'Bluewave Onboarding';
export const SUPPORT_EMAIL = 'support@bluewave.com';

export const roles = Object.freeze(["admin", "member"]);
export const URL_REGEX = Object.freeze({
  PROTOCOL: /^(https?:\/\/)/,
  DOMAIN: /^https?:\/\/([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
});