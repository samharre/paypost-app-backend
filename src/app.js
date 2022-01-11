require('./config/database');

const express = require('express');
const router = require('express').Router();
const cors = require('cors');

const authenticateRouter = require('./controllers/authController');
const platformRouter = require('./controllers/platformController');
const postRouter = require('./controllers/postController');
const ensureAuthenticated = require('./middlewares/ensureAuthenticated');

const AppError = require('./errors/AppError');

const app = express();

app.use(cors());
app.use(express.json());

router.use('/auth', authenticateRouter);

router.use(ensureAuthenticated);
router.use('/platforms', platformRouter);
router.use('/posts', postRouter);

app.use('/api', router);

app.use((err, req, resp, next) => {
  console.log('entrou aqui...');
  if (err instanceof AppError) {
    return resp.status(err.statusCode).json({
      error: err.message,
    });
  }

  return resp.status(500).json({
    error: 'Internal server error',
  });
});

app.use((req, resp, next) => {
  console.log('entrou aqui...');
  return resp.status(404).json({
    error: 'Not found',
  });
});

module.exports = app;