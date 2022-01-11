const routes = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../models/User");

function generateToken(params = {}) {
  return jwt.sign(params, process.env.JWT_SECRET, {
    expiresIn: 86400
  });
};

routes.post('/signin', async (req, res, next) => {
  const { email, password } = req.body;
  try {

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).send(
        {
          error: true,
          message: 'User or Password incorrect.'
        }
      );
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).send(
        {
          error: true,
          message: 'User or Password incorrect.'
        }
      );
    }

    user.password = undefined;

    res.send({
      user,
      token: generateToken({ id: user.id })
    });
  } catch (error) {
    console.log('error: ', error);
  }
});

module.exports = routes;