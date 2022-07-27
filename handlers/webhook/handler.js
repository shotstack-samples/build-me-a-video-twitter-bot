const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.REGION,
});

const lambda = new AWS.Lambda();

const response = async (code, success, msg, data) => {
  return {
    statusCode: parseInt(code, 10),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      success: !!success,
      message: msg,
      response: data,
    }),
  };
};

module.exports.process = async (event) => {
  const inReplyToTweetId = event.pathParameters.id;
  const payload = JSON.parse(event.body);
  const videoUrl = payload.url;
  console.info(payload);
  if (payload.status === 'done' && payload.type === 'edit' && payload.action === 'render') {
    const params = {
      FunctionName: 'demo-twitter-buildmeavideo-demo-reply',
      InvocationType: 'Event',
      Payload: JSON.stringify({ inReplyToTweetId, videoUrl, shotstackId: payload.id }),
    };
    try {
      const result = await lambda.invoke(params).promise();
      if (result.StatusCode === 202) return response(202, true, 'OK', 'Callback successfully processed.');
      return response(result.StatusCode, false, 'OK', 'Callback failed.');
    } catch (error) {
      console.error(error);
      return response(501, false, 'OK', 'Callback failed.');
    }
  }
  return response(200, false, 'OK', 'Callback successfully processed.');
};
