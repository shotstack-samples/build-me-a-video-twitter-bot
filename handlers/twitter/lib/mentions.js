module.exports = async (client, startTime, endTime) => {
  try {
    const results = [];
    const response = await client.v2.userMentionTimeline('1547419252465905664', {
      start_time: startTime,
      end_time: endTime,
      'tweet.fields': ['id', 'in_reply_to_user_id', 'text'],
      expansions: ['in_reply_to_user_id', 'referenced_tweets.id'],
    });
    console.info(`${response.data.meta.result_count} mention(s) found.`);
    if (response.data.meta.result_count > 0) {
      for (let i = 0; i < response.data.data.length; i += 1) {
        if (typeof response.data.data[i].referenced_tweets !== 'undefined') {
          const referencedTweets = response.data.data[i].referenced_tweets;
          for (let j = 0; j < referencedTweets.length; j += 1) {
            if (referencedTweets[j].type === 'replied_to') {
              results.push({
                id: response.data.data[i].id,
                text: response.data.data[i].text,
                parent: {
                  id: referencedTweets[j].id,
                  userId: response.data.data[i].in_reply_to_user_id,
                },
              });
            }
          }
        }
      }
    }
    return results;
  } catch (error) {
    throw new Error(error);
  }
};
