const { TwitterApi } = require('twitter-api-v2');

module.exports = async () => {
  return new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_KEY_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_TOKEN_SECRET,
  });
};
