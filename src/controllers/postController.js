const routes = require('express').Router();
const getPlatform = require('../utils/getPlatform');

const Post = require('../models/Post');
const Token = require('../models/Token');
const AppError = require('../errors/AppError');

routes.post('/', async (req, res) => {

  const oauthToken = req.body.oauthToken;
  const post = req.body.post;
  const platformName = req.body.platform;

  if (!oauthToken) {
    throw new AppError('Platform token not informed!');
  }

  if (!platformName) {
    throw new AppError('Platform not informed!');
  }

  if (!post) {
    throw new AppError('Post content not informed!');
  }

  const token = await Token.findOne({ oauthToken });

  if (!token.oauthAccessToken) {
    return res.status(400).send({
      error: true,
      message: `Invalid token. Please connect to ${platform}!`
    })
  }

  const { oauthAccessToken } = token;
  const idEntity = token?.idEntity;
  const oauthAccessTokenSecret = token?.oauthAccessTokenSecret;

  const platform = getPlatform(platformName.toLowerCase());
  const data = await platform.createPost(oauthAccessToken, oauthAccessTokenSecret, idEntity, post);

  if (!data) {
    return res.status(500).send();
  }

  const newPost = await Post.create({
    user: req.userId,
    platform: platformName,
    idPostPlatform: data.id,
    content: post,
    totalEarned: 5
  });

  res.status(201).send(newPost);

});

routes.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).sort({ createdAt: 'desc' });

    return res.send({ posts })
  } catch (err) {
    console.log('error: ', err);
    return res.status(500).send({ error: 'Error listing posts.' })
  }

});

module.exports = routes;