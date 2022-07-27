const fs = require('fs');
const path = require('path');
const axios = require('axios');
const url = require('url');

module.exports.fetch = async (uri) => {
  const filepath = `/tmp/${path.basename(url.parse(uri).pathname)}`;
  const writer = fs.createWriteStream(filepath);
  const response = await axios({
    url: uri,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve(filepath));
    writer.on('error', reject);
  });
};
