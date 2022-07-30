const mentions = require('./lib/mentions');
const userDetails = require('./lib/user-details');
const tweetDetails = require('./lib/tweet-details');
const render = require('./lib/render');
const authenticate = require('../../helpers/authenticate');

module.exports.process = async () => {
  const client = await authenticate();
  const results = await mentions.retrieve(client);
  const promises = [];
  if (results.length > 0) {
    const tweetPromises = [];
    for (let i = 0; i < results.length; i += 1) {
      tweetPromises.push(userDetails.retrieve(client, results[i].parent.userId));
      tweetPromises.push(tweetDetails.retrieve(client, results[i].parent.id));
    }

    const details = await Promise.all(tweetPromises);

    const tweetSets = [];
    for (let i = 0; i < details.length; i += 2) {
      tweetSets.push([details[i], details[i + 1]]);
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
    results.map((result) => {
      return promises.push(render(result));
    });
  }
  try {
    const response = await Promise.all(promises);
    console.info(`Rendered ${response.length} video(s).`);
    return response;
  } catch (error) {
    throw new Error(error);
  }
};
