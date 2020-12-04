const fs = require('fs');

const checkFileExists = (filePath) => {
  return new Promise((resolve) => {
    fs.access(filePath, fs.constants.F_OK, (err) => resolve(!err));
  });
};

module.exports = checkFileExists;
