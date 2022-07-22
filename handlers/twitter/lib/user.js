module.exports.retrieve = async (client, id) => {
  try {
    const response = await client.v2.user(id, {
      'user.fields': ['name', 'username', 'profile_image_url'],
    });
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
