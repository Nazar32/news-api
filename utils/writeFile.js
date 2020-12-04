const fs = require('fs');

const writeFile = (filePath, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, function (err) {
      if (err) {
        return reject(false);
      }
      return resolve(true);
    });
  });
};

module.exports = writeFile;
