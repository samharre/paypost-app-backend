const routes = require('express').Router();

const getPlatform = require('../utils/getPlatform');
const Token = require('../models/Token');
const AppError = require('../errors/AppError');

routes.post('/request_token', async (req, res, next) => {

  try {
    const platformName = req.body.platform;
    if (!platformName) {
      throw new AppError('Platform not informed!');
    }

    const platform = getPlatform(platformName.toLowerCase());
    const data = await platform.requestToken();

    const { oauthToken, oauthTokenSecret } = data;

    if (!!oauthToken && !!oauthTokenSecret) {
      const token = await Token.findOne({
        oauthToken,
        oauthTokenSecret
      });

      if (!token) {
        await Token.create({
          oauthToken,
          oauthTokenSecret
        });
      }
    }

    res.status(200).send({ oauthToken });

  } catch (err) {
    console.log('error: ', err);
    next(err);
  }

});

routes.post('/signin', async (req, res) => {

  try {
    const oauthToken = req.body.oauthToken;
    const platformName = req.body.platform;
    const oauthVerifier = req.body?.oauthVerifier;

    if (!oauthToken) {
      throw new AppError('Platform token not informed!');
    }

    if (!platformName) {
      throw new AppError('Platform not informed!');
    }

    const platform = getPlatform(platformName.toLowerCase());
    const data = await platform.signIn(oauthToken, oauthVerifier);

    const { oauthAccessToken, oauthAccessTokenSecret, idEntity } = data;

    if (!!oauthAccessToken) {
      const token = await Token.findOne({ oauthToken });

      if (token) {
        await Token.findByIdAndUpdate(token._id, {
          oauthAccessToken,
          oauthAccessTokenSecret,
          idEntity
        });
      } else {
        await Token.create({
          oauthToken,
          oauthAccessToken,
          idEntity
        });
      }
    }

    res.status(200).send({
      signedIn: true
    });

  } catch (err) {
    //TODO: See later
    console.log('error: ', err);
  }

});

routes.get('/connected', async (req, res) => {

  try {
    const { oauthToken } = req.query;

    const token = await Token.findOne({ oauthToken });

    if (!!token?.oauthAccessToken) {
      return res.status(200).send({
        isConnected: true
      });
    }

    res.status(200).send({
      isConnected: false
    });
  } catch (err) {
    console.log('error: ', err);
  }

});

module.exports = routes;