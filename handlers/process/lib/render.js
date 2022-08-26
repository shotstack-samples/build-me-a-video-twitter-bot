const fetch = require('node-fetch');

const baseUrl = process.env.SHOTSTACK_BASE_URL;
const environment = process.env.SHOTSTACK_ENV;
const webhookUrl = process.env.SHOTSTACK_WEBHOOK_URL;
const apiKey = process.env.SHOTSTACK_API_KEY;

const breakingNewsTemplate = require('../../../templates/breaking-news.json');
const quoteTemplate = require('../../../templates/quote.json');

const cleanString = async (string) => {
  let newString = string.replace(/(\r\n|\n|\r)/gm, '<br>');
  newString = string.replace(/'/g, '&apos;');
  // newString = newString.replace(/"/g, '&quot;');
  return newString;
};

module.exports = async (tweet) => {
  const tweetText = tweet.text.replace(/@\S+/, '').toLowerCase();
  let template;
  if (tweetText.includes('breaking')) {
    template = breakingNewsTemplate;
  } else if (tweetText.includes('quote')) {
    template = quoteTemplate;
  } else {
    template = breakingNewsTemplate;
  }
  const endpoint = `${baseUrl}/${environment}/render`;
  const profileImageUrl = tweet.parent.profileImageUrl.replace(/normal/, '400x400');

  const text = await cleanString(tweet.parent.text);
  const textLength = text.length;
  let fontSize = '27';

  if (textLength <= 65) fontSize = '53';
  if (textLength > 65 && textLength <= 130) fontSize = '40';
  if (textLength > 130 && textLength <= 195) fontSize = '33';
  if (textLength > 195 && textLength <= 260) fontSize = '29';

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
      replace: text,
    },
    {
      find: 'profilePictureUrl',
      replace: profileImageUrl,
    },
    {
      find: 'fontSize',
      replace: fontSize,
    },
  ];

  console.info(merge);
  console.info(tweet);

  template.callback = `${webhookUrl}/${tweet.id}`;
  template.merge = merge;

  try {
    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify(template),
      headers: {
        'Content-Type': 'application/json',
        'user-agent': 'BuildMeAVideo',
        'x-api-key': apiKey,
      },
    });
    const responseBody = await response.json();
    return responseBody;
  } catch (error) {
    throw new Error(error);
  }
};
