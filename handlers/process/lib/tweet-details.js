module.exports.retrieve = async (client, id) => {
  try {
    const tweet = await client.v2.singleTweet(id);
    return tweet.data;
  } catch (error) {
    throw new Error(error);
  }
};
