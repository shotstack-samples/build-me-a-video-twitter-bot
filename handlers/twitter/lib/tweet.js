module.exports.post = async (client, inReplyToTweetId, mediaId) => {
  try {
    const { data: createdTweet } = await client.v2.tweet('ㅤ', {
      reply: {
        in_reply_to_tweet_id: inReplyToTweetId,
      },
      media: {
        media_ids: [mediaId],
      },
    });
    return createdTweet;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.retrieve = async (client, id) => {
  try {
    const tweet = await client.v2.singleTweet(id);
    return tweet.data;
  } catch (error) {
    throw new Error(error);
  }
};
