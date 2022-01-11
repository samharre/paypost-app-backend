class Platform {

  constructor() { }

  // async requestToken() {
  //   throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
  // }

  async signIn(oauthToken = null, oauthVerifier = null) {
    throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
  }

  async createPost(oauthAccessToken = null, oauthAccessTokenSecret = null, idEntity = null, text = null) {
    throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
  }

  async signOut() {
    throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
  }

}

module.exports = Platform