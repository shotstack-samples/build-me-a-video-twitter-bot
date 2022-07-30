const Dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

Dayjs.extend(utc);

const twitterId = process.env.TWITTER_ID;

module.exports.retrieve = async (client) => {
  const timestamp = new Dayjs(new Date().getTime()).subtract(1, 'minute');
  const startTime = timestamp.second(0).millisecond(0).utc().toISOString();
  const endTime = timestamp.second(0).millisecond(0).add(1, 'minute').utc().toISOString();
  console.info(`Querying mentions between ${startTime} and ${endTime}.`);
  try {
    const results = [];

    const response = await client.v2.userMentionTimeline(twitterId, {
      start_time: startTime,
      end_time: endTime,
      'tweet.fields': ['id', 'in_reply_to_user_id', 'text'],
      expansions: ['in_reply_to_user_id', 'referenced_tweets.id'],
    });

    if (response.data.meta.result_count > 0) {
      for (let i = 0; i < response.data.data.length; i += 1) {
        if (
          typeof response.data.data[i].referenced_tweets !== 'undefined' &&
          response.data.data[i].in_reply_to_user_id !== twitterId
        ) {
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
