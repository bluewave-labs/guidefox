const settings = require('../../config/settings');

const validateTriggeringFrequency = (value) => {
  const validFrequencies = settings.tour.triggeringFrequency;
  return validFrequencies.includes(value.toLowerCase());
};

const validatePageTargeting = (value) => {
  const validPageTargetingValues = settings.tour.pageTargeting;
  return validPageTargetingValues.includes(value.toLowerCase());
};

const validateTheme = (value) => {
  const validThemes = settings.tour.themes;
  return validThemes.includes(value.toLowerCase());
};

module.exports = {
  validateTriggeringFrequency,
  validatePageTargeting,
  validateTheme,
};
