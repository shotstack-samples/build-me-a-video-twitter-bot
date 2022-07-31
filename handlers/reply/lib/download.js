const fs = require('fs');
const path = require('path');
const url = require('url');
const fetch = require('node-fetch');
const { promisify } = require('util');
const stream = require('stream');

module.exports = async (uri) => {
  const filepath = `/tmp/${path.basename(url.parse(uri).pathname)}`;
  const writer = fs.createWriteStream(filepath);
  const finishedDownload = promisify(stream.finished);
  const response = await fetch(uri);

  response.body.pipe(writer);

  try {
    await finishedDownload(writer);
    return writer.path;
  } catch (error) {
    throw new Error(error);
  }
};
