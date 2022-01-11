const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const queryString = require('query-string');
const axios = require('axios');

const Platform = require("./Platform");

class Twitter extends Platform {

  #oauth;

  static #INSTANCE;

  #OAUTH_CALLBACK = `${process.env.FRONT_END_URL}/dashboard`;
  #REQUEST_TOKEN_URL = `https://api.twitter.com/oauth/request_token?oauth_callback=${encodeURIComponent(this.#OAUTH_CALLBACK)}`;
  #ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';

  constructor() {
    super();

    this.#oauth = OAuth({
      consumer: {
        key: process.env.TWITTER_CONSUMER_KEY,
        secret: process.env.TWITTER_CONSUMER_SECRET
      },
      signature_method: 'HMAC-SHA1',
      hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
    });
  }

  static getInstance() {
    if (!Twitter.#INSTANCE) {
      Twitter.#INSTANCE = new Twitter();
    }
    return Twitter.#INSTANCE;
  }

  #getRequestApi(authHeader) {
    return axios.create({
      headers: {
        'Authorization': authHeader["Authorization"]
      }
    });
  }

  async requestToken() {
    try {
      const authHeader = this.#oauth.toHeader(this.#oauth.authorize({
        url: this.#REQUEST_TOKEN_URL,
        method: 'POST'
      }));

      const api = this.#getRequestApi(authHeader);
      const response = await api.post(this.#REQUEST_TOKEN_URL);

      const { oauth_token, oauth_token_secret } = queryString.parse(response.data);

      return {
        oauthToken: oauth_token,
        oauthTokenSecret: oauth_token_secret
      }

    } catch (err) {
      console.log('error: ', err);
    }
  }

  async signIn(oauthToken = null, oauthVerifier = null) {

    try {
      if (!oauthToken || !oauthVerifier) {
        return;
      }

      const authHeader = this.#oauth.toHeader(this.#oauth.authorize({
        url: this.#ACCESS_TOKEN_URL,
        method: 'POST'
      }));

      const url = `${this.#ACCESS_TOKEN_URL}?oauth_verifier=${oauthVerifier}&oauth_token=${oauthToken}`;

      const api = this.#getRequestApi(authHeader);

      const response = await api.post(url);

      const { oauth_token, oauth_token_secret } = queryString.parse(response.data);

      return {
        oauthAccessToken: oauth_token,
        oauthAccessTokenSecret: oauth_token_secret,
        idEntity: null
      }

    } catch (err) {
      console.log('error: ', err);
    }

  }

  async createPost(oauthAccessToken = null, oauthAccessTokenSecret = null, idEntity = null, text = null) {
    try {
      if (!oauthAccessToken || !oauthAccessTokenSecret || !text) {
        return;
      }

      const token = {
        key: oauthAccessToken,
        secret: oauthAccessTokenSecret
      };

      const createTweetURL = 'https://api.twitter.com/2/tweets';
      const authHeader = this.#oauth.toHeader(this.#oauth.authorize({
        url: createTweetURL,
        method: 'POST'
      }, token));

      const api = this.#getRequestApi(authHeader);

      const response = await api.post(createTweetURL,
        { text },
        {
          headers: {
            Authorization: authHeader["Authorization"],
            'user-agent': "v2CreateTweetJS",
            'content-type': "application/json",
            'accept': "application/json"
          }
        });

      const { data } = response.data;

      return data;

    } catch (err) {
      console.log('error: ', err);
    }
  }

  async signOut() {
  }
}

module.exports = Twitter.getInstance();