const download = require('./lib/download');
const upload = require('./lib/upload');
const tweet = require('./lib/tweet');
const authenticate = require('../../helpers/authenticate');

module.exports.process = async (event) => {
  const { inReplyToTweetId, videoUrl, shotstackId } = event;
  const client = await authenticate();
  const videoPath = await download(videoUrl);
  const mediaId = await upload(client, videoPath);
  const createdTweet = await tweet.post(client, inReplyToTweetId, mediaId);
  console.info(`Shotstack ID: ${shotstackId} Tweet: ${createdTweet.id} : ${createdTweet.text}`);
};
