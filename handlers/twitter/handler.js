const Dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const mentions = require('./lib/mentions');
const user = require('./lib/user');
const tweet = require('./lib/tweet');
const render = require('../shotstack/lib/render');
const authenticate = require('./lib/authenticate');

Dayjs.extend(utc);
require('dotenv').config();

module.exports.process = async () => {
  const client = await authenticate();
  const timestamp = new Dayjs(new Date().getTime()).subtract(1, 'minute');
  const startTime = timestamp.second(0).millisecond(0).utc().toISOString();
  const endTime = timestamp.second(0).millisecond(0).add(1, 'minute').utc().toISOString();
  console.info(`Querying mentions between ${startTime} and ${endTime}.`);
  const results = await mentions(client, startTime, endTime);
  const promises = [];
  if (results.length > 0) {
    const tweetPromises = [];
    for (let i = 0; i < results.length; i += 1) {
      tweetPromises.push(user.retrieve(client, results[i].parent.userId));
      tweetPromises.push(tweet.retrieve(client, results[i].parent.id));
    }

    let tweetDetails;
    try {
      tweetDetails = await Promise.all(tweetPromises);
      console.info('Metadata retrieved.');
    } catch (error) {
      throw new Error(error);
    }

    for (let i = 0; i < results.length; i += 1) {
      Object.assign(results[i].parent, {
        username: tweetDetails[0].username,
        profileImageUrl: tweetDetails[0].profile_image_url,
        name: tweetDetails[0].name,
        text: tweetDetails[1].text,
      });
    }
    console.info(results);
    results.map((result) => {
      return promises.push(render(result));
    });
  }
  try {
    const response = await Promise.all(promises);
    console.info('Renders queued.');
    return response;
  } catch (error) {
    throw new Error(error);
  }
};
