module.exports = async (client, path) => {
  try {
    const mediaId = await client.v1.uploadMedia(path);
    console.log(mediaId);
    const info = await client.v1.mediaInfo(mediaId);
    console.log(info);
    if (info.processing_info.state === 'succeeded') {
      return mediaId;
    }
    throw new Error(`Video upload state: ${info.processing_info.state}`);
  } catch (error) {
    throw new Error(error);
  }
};
