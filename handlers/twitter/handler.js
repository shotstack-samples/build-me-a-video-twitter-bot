const Dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const download = require('../download/handler');
const upload = require('./lib/upload');
const mentions = require('./lib/mentions');
const user = require('./lib/user');
const tweet = require('./lib/tweet');
const render = require('../shotstack/lib/render');
const authenticate = require('./lib/authenticate');



Dayjs.extend(utc);
require('dotenv').config();

module.exports.process = async () => {
  const client = await authenticate();
  const twitterId = process.env.TWITTER_ID;
  const timestamp = new Dayjs(new Date().getTime()).subtract(1, 'minute');
  const startTime = timestamp.second(0).millisecond(0).utc().toISOString();
  const endTime = timestamp.second(0).millisecond(0).add(1, 'minute').utc().toISOString();
  console.info(`Querying mentions between ${startTime} and ${endTime}.`);
  const results = await mentions(client, twitterId, startTime, endTime);
  const promises = [];
  if (results.length > 0) {
    const tweetPromises = [];
    for (let i = 0; i < results.length; i += 1) {
      tweetPromises.push(user.retrieve(client, results[i].parent.userId));
      tweetPromises.push(tweet.retrieve(client, results[i].parent.id));
    }

    const tweetDetails = await Promise.all(tweetPromises);

    const tweetSets = [];
    for (let i = 0; i < tweetDetails.length; i += 2) {
      tweetSets.push([tweetDetails[i], tweetDetails[i + 1]]);
    }

    for (let i = 0; i < results.length; i += 1) {
      tweetSets.map(async (set) => {
        if (set[0].id === results[i].parent.userId) {
          Object.assign(results[i].parent, {
            username: set[0].username,
            profileImageUrl: set[0].profile_image_url,
            name: set[0].name,
          });
        }
        if (set[1].id === results[i].parent.id) {
          Object.assign(results[i].parent, {
            text: set[1].text,
          });
        }
      });
    }
    console.info(results);
    results.map((result) => {
      return promises.push(render(result));
    });
  }
  try {
    const response = await Promise.all(promises);
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.reply = async (event) => {
  const { inReplyToTweetId, videoUrl, shotstackId } = event;
  const client = await authenticate();
  const videoPath = await download(videoUrl);
  const mediaId = await upload(client, videoPath);
  const createdTweet = await tweet.post(client, inReplyToTweetId, mediaId);
  console.info(`Shotstack ID: ${shotstackId} Tweet: ${createdTweet.id} : ${createdTweet.text}`);
};
