const AWS = require('aws-sdk');
const response = require('../../../helpers/response');

AWS.config.update({
  region: process.env.SLS_REGION,
});
const lambda = new AWS.Lambda();
require('dotenv').config();

module.exports.process = async (event) => {
  const inReplyToTweetId = event.pathParameters.id;
  const payload = JSON.parse(event.body);
  const videoUrl = payload.url;
  console.info(payload);
  if (payload.status === 'done' && payload.type === 'edit' && payload.action === 'render') {
    const params = {
      FunctionName: 'demo-twitter-buildmeavideo-demo-reply',
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({ inReplyToTweetId, videoUrl, shotstackId: payload.id }),
    };
    try {
      const result = await lambda.invoke(params).promise();
      if (result.StatusCode === 200) return response(200, true, 'OK', 'Callback successfully processed.');
    } catch (error) {
      console.error(error);
      return response(501, false, 'OK', 'Callback failed.');
    }
  }
};
