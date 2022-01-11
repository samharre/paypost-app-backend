const constants = require('./constants');

const facebook = require('../platforms/Facebook');
const twitter = require('../platforms/Twitter');

const getPlatform = (platform) => {
  switch (platform.toLowerCase()) {
    case constants.FACEBOOK:
      return facebook;
    case constants.TWITTER:
      return twitter;
    default:
      return null;
  }
};

module.exports = getPlatform;