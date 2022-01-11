const axios = require('axios');

const Platform = require("./Platform");

class Facebook extends Platform {

  #EXCHANGE_TOKEN_URL = 'https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token';
  #api;
  #userId;
  #accessToken;
  #shortLivedPageAccessToken;
  #longLivedPageAccessToken;
  #pageId;

  constructor() {
    super();

    this.#api = axios.create({
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async #exchangeShortUserTokenForLongToken(oauthToken) {

    const url = `${this.#EXCHANGE_TOKEN_URL}&client_id=${process.env.FACEBOOK_CONSUMER_KEY}&client_secret=${process.env.FACEBOOK_CONSUMER_SECRET}&fb_exchange_token=${oauthToken}`;

    const response = await this.#api.get(url);
    const accessToken = response.data.access_token;

    this.#accessToken = accessToken;
    return this.#accessToken;
  }

  async #getUserId() {
    const url = `https://graph.facebook.com/v12.0/me?access_token=${this.#accessToken}`;
    const response = await this.#api.get(url);

    const userId = response.data.id

    console.log('userId: ', userId);

    this.#userId = userId;
    return this.#userId;
  }

  async #getUserPages() {

    const url = `https://graph.facebook.com/${this.#userId}/accounts?access_token=${this.#accessToken}`;
    console.log('getUserPages - url: ', url);

    const response = await this.#api.get(url);

    const { data } = response.data;
    console.log('getUserPages - data: ', data);
    const shortLivedPageAccessToken = data[data.length - 1].access_token;

    this.#shortLivedPageAccessToken = shortLivedPageAccessToken;
    return this.#shortLivedPageAccessToken

  }

  async #getLongLivedPageAccessToken() {

    const url = `https://graph.facebook.com/${this.#userId}/accounts?access_token=${this.#shortLivedPageAccessToken}`;
    const response = await this.#api.get(url);

    const { data } = response.data;
    const longLivedPageAccessToken = data[data.length - 1].access_token;
    this.#pageId = data[data.length - 1].id

    this.#longLivedPageAccessToken = longLivedPageAccessToken;
    return this.#longLivedPageAccessToken;
  }

  async signIn(oauthToken = null) {

    try {

      if (!oauthToken) {
        return;
      }

      console.log('signIn - oauthToken: ', oauthToken);
      await this.#exchangeShortUserTokenForLongToken(oauthToken);
      await this.#getUserId();
      await this.#getUserPages();
      await this.#getLongLivedPageAccessToken();

      return {
        oauthAccessToken: this.#longLivedPageAccessToken,
        oauthAccessTokenSecret: null,
        idEntity: this.#pageId
      }
    } catch (err) {
      console.log('error: ', err);
    }

  }

  async createPost(oauthAccessToken = null, oauthAccessTokenSecret = null, idEntity = null, text = '') {
    try {
      if (!oauthAccessToken || !idEntity || !text) {
        return;
      }

      text = text.replace(/#/g, encodeURIComponent('#'));

      const url = `https://graph.facebook.com/${idEntity}/feed?message=${text}&access_token=${oauthAccessToken}`;
      const response = await this.#api.post(url);

      return response.data;
      return null
    } catch (err) {
      console.log('error: ', err);
    }
  }

}

module.exports = new Facebook();