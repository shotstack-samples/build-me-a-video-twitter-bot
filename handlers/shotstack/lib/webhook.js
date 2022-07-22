const response = require('../../../helpers/response');
const download = require('../../download/handler');
const upload = require('../../twitter/lib/upload');
const tweet = require('../../twitter/lib/tweet');
const authenticate = require('../../twitter/lib/authenticate');
require('dotenv').config();

module.exports.process = async (event) => {
  const client = await authenticate();
  const inReplyToTweetId = event.pathParameters.id;
  const payload = JSON.parse(event.body);
  console.info(payload);
  // const videoUrl = payload.status === 'done' ? payload.url : null;
  if (payload.status === 'done' && payload.type === 'edit' && payload.action === 'render') {
    const videoUrl = payload.url;
    const videoPath = await download(videoUrl);
    const mediaId = await upload(client, videoPath);
    const createdTweet = await tweet.post(client, inReplyToTweetId, mediaId);
    console.info('Tweet', createdTweet.id, ':', createdTweet.text);
    return response(200, true, 'OK', 'Callback successfully processed.');
  }
  return response(501, false, 'OK', 'Callback successfully processed.');
};
