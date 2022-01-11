const database = require('../config/database');

const UserSchema = new database.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false,
  }
});

const User = database.model('User', UserSchema);
module.exports = User;