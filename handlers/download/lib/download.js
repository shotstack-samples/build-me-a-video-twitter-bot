const got = require('got');
const fs = require('fs');
const { pipeline } = require('stream');
const mime = require('mime');
const { v4: uuidv4 } = require('uuid');

const downloadAsset = (url) => {
  return new Promise((resolve, reject) => {
    const downloadStream = got.stream(url);

    downloadStream.on('error', (error) => {
      reject(new Error(`An error occurred downloading file ${url}: ${error}}`));
    });

    downloadStream.on('response', async (response) => {
      const extension = mime.getExtension(response.headers['content-type']);
      const fileId = uuidv4();
      const filepath = `/tmp/${fileId}`;
      if (!fs.existsSync(filepath)) {
        try {
          fs.mkdirSync(`${filepath}`, { recursive: true });
        } catch (error) {
          throw new Error(error);
        }
      }
      if (response.headers['content-length'] === '0') {
        reject(new Error(`File ${url} contains no data`));
      }
      try {
        await pipeline(downloadStream, fs.createWriteStream(`${filepath}/${fileId}.${extension}`), () =>
          resolve(`${filepath}/${fileId}.${extension}`)
        );
      } catch (error) {
        reject(error);
      }
    });
  });
};

module.exports.fetch = (url) => {
  return new Promise((resolve, reject) => {
    console.info('Starting Asset Download');
    try {
      const asset = downloadAsset(url);
      console.info('Asset Downloaded');
      resolve(asset);
    } catch (error) {
      console.error('Asset Download Error: ', error);
      reject(error);
    }
  });
};
