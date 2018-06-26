/**********************\
  Dependencies
\**********************/

// External libs
const fs = require('fs');

/**********************\
  Variables/Constants
\**********************/

const fileManager = {};

// Module's public functions
fileManager.readFile = readFile;
fileManager.writeFile = writeFile;

// Module export
module.exports = fileManager;

/**********************\
  Function definitions
\**********************/

/**
 * Read file
 */
function readFile(path, options={}) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, options, (error, fileContent) => {
      if (error) {
        return reject(error);
      }

      return resolve(fileContent);
    });
  });
}

/**
 * Write file
 */
function writeFile(path, data, options={}) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, options, (error) => {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  });
}
