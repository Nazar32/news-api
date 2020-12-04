const fs = require('fs');

const getFileCreateTime = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.birthtime);
      }
    });
  });
};

module.exports = getFileCreateTime;
