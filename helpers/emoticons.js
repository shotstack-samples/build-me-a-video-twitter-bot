const fs = require('fs');
const { parse } = require('twemoji-parser');

module.exports.format = async (text, type) => {
  let string = text;
  const match = parse(text).reverse();
  for (let i = 0; i < match.length; i++) {
    const unicode = match[i].text.codePointAt(0).toString(16);
    const contents = fs.readFileSync(`./assets/72x72/${unicode}.png`, { encoding: 'base64' });
    const fontSize = type === 'text' ? '{{fontSize}}' : 40;
    const img = `<img height="${fontSize}" src="data:image/png;base64, ${contents}"/>`;
    string = string.substring(0, match[i].indices[0]) + img + string.substring(match[i].indices[0] + 2);
  }
  return string;
};
