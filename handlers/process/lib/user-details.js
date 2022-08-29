const { format } = require('../../../helpers/emoticons');

module.exports.retrieve = async (client, id) => {
  try {
    const response = await client.v2.user(id, {
      'user.fields': ['id', 'name', 'username', 'profile_image_url'],
    });
    response.data.name = await format(response.data.name, 'name');
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
