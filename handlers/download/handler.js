const download = require('./lib/download');

module.exports = async (url) => {
  console.log(`Starting Download Task`);
  return new Promise((resolve, reject) => {
    try {
      const file = download.fetch(url);
      resolve(file);
    } catch (error) {
      reject(new Error('Asset Download Failed:', error));
    }
  });
};
