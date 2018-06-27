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
fileManager.symbolicLink = symbolicLink;
fileManager.unlink = unlink;
fileManager.exists = exists;

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

/**
 * Create symbolic link of path into target
 */
function symbolicLink(path, target, options={}) {
  return new Promise((resolve, reject) => {
    fs.symlink(path, target, (error) => {
      if (error) {
        // if options.force is set, return error only if code is not 'EEXIST'
        if (error.code !== 'EEXIST' || (error.code === 'EEXIST' && !options.force)) {
          return reject(error);
        }

        // if file does not exist, resolve with empty response
        return resolve();
      }

      // if symbolic link was created, resolve with the target as response
      return resolve(target);
    });
  });
}

/**
 * Remove file specified by path
 */
function unlink(path, options={}) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (error) => {
      if (error) {
        // If the error is "file does not exist", ignore it.
        if (error.code !== 'ENOENT') {
          console.log('!!!', error);
          return reject(error);
        }

        // if file does not exist, resolve with empty response
        return resolve();
      }

      // if file was removed, resolve with the path in the response
      return resolve(path);
    });
  });
}

/**
 * Checks if file exists
 */
function exists(path) {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.constants.F_OK, (error) => {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  });
}
