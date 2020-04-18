const fs = require('fs');

// promisifing fs.writeFile
const writeFile = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) reject(err);

      resolve();
    });
  });
};

module.exports = {
  writeFile,
};
