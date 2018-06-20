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
    try {
      const fileContent = fs.readFileSync(path, options);
      resolve(fileContent);
    } catch (error) {
      reject(error);
    }
  });
}
