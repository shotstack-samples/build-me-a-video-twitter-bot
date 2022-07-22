const axios = require('axios');
require('dotenv').config();

const template = require('../templates/quote.json');

const baseUrl = process.env.SHOTSTACK_BASE_URL;
const environment = process.env.SHOTSTACK_ENV;
const webhookUrl = process.env.SHOTSTACK_WEBHOOK_URL;
const apiKey = process.env.SHOTSTACK_API_KEY;

const cleanString = async (string) => {
  // str = str.replace(/(?:\r\n|\r|\n)/g, '<br>');
  return string.replace(/(\r\n|\n|\r)/gm, '<br>');
};

module.exports = async (tweet) => {
  const endpoint = `${baseUrl}/${environment}/render`;
  const profileImageUrl = tweet.parent.profileImageUrl.replace(/normal/, '400x400');

  const merge = [
    {
      find: 'name',
      replace: await cleanString(tweet.parent.name),
    },
    {
      find: 'username',
      replace: await cleanString(tweet.parent.username),
    },
    {
      find: 'text',
      replace: await cleanString(tweet.parent.text),
    },
    {
      find: 'profilePictureUrl',
      replace: profileImageUrl,
    },
  ];

  console.info(merge);
  console.info(tweet);

  template.callback = `${webhookUrl}/${tweet.id}`;
  template.merge = merge;

  try {
    const response = await axios.post(endpoint, template, {
      headers: {
        'Content-Type': 'application/json',
        'user-agent': 'BuildMeAVideo',
        'x-api-key': apiKey,
      },
    });
    console.info(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
