const { format } = require('../../../helpers/emoticons');

module.exports.retrieve = async (client, id) => {
  try {
    const tweet = await client.v2.singleTweet(id);
    tweet.data.text = await format(tweet.data.text, 'text');
    return tweet.data;
  } catch (error) {
    throw new Error(error);
  }
};
