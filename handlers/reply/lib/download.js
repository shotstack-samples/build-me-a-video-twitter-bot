const fs = require('fs');
const path = require('path');
const axios = require('axios');
const url = require('url');
const { promisify } = require('util');
const stream = require('stream');

module.exports = async (uri) => {
  const filepath = `/tmp/${path.basename(url.parse(uri).pathname)}`;
  const writer = fs.createWriteStream(filepath);
  const finishedDownload = promisify(stream.finished);
  const response = await axios({
    url: uri,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  try {
    await finishedDownload(writer);
    return writer.path;
  } catch (error) {
    throw new Error(error);
  }
};
