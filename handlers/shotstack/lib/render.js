const axios = require('axios');

const baseUrl = process.env.SHOTSTACK_BASE_URL;
const environment = process.env.SHOTSTACK_ENV;
const webhookUrl = process.env.SHOTSTACK_WEBHOOK_URL;
const apiKey = process.env.SHOTSTACK_API_KEY;

const breakingNewsTemplate = require('../templates/breaking-news.json');
const quoteTemplate = require('../templates/quote.json');

const cleanString = async (string) => {
  let newString = string.replace(/(\r\n|\n|\r)/gm, '<br>');
  newString = newString.replace(/"/g, "'");
  return newString;
};

module.exports = async (tweet) => {
  const text = tweet.text.replace(/@\S+/, '').toLowerCase();
  let template;
  if (text.includes('breaking')) {
    template = breakingNewsTemplate;
  } else if (text.includes('quote')) {
    template = quoteTemplate;
  } else {
    template = breakingNewsTemplate;
  }
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
