const database = require('../config/database');

//TODO: Mudar o padrao dos campos
const TokenSchema = new database.Schema({
  oauthToken: {
    type: String,
    required: true
  },
  oauthTokenSecret: {
    type: String,
    required: false
  },
  oauthAccessToken: {
    type: String,
    required: false
  },
  oauthAccessTokenSecret: {
    type: String,
    required: false
  },
  idEntity: {
    type: String,
    required: false
  }
});

const Token = database.model('Token', TokenSchema);
module.exports = Token;