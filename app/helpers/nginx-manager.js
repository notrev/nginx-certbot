/**********************\
  Dependencies
\**********************/

// External libs
const shell = require('shelljs');

/**********************\
  Variables/Constants
\**********************/

const nginxManager = {};

// Module's public functions
nginxManager.status = status;
nginxManager.start = start;
nginxManager.stop = stop;
nginxManager.reload = reload;

// Module export
module.exports = nginxManager;

/**********************\
  Function definitions
\**********************/

/**
 * Reload nginx
 */
async function status() {
  try {
    const output = shell.exec('service nginx status', { silent: true });

    if (output.stdout.startsWith('nginx is not running')) {
      return {
        data: 'stopped',
      };
    } else if (output.stdout.startsWith('nginx is running')) {
      return {
        data: 'running',
      };
    }

    return {
      data: 'unknown',
    };
  } catch (error) {
    return {
      error: error,
    };
  }
}

/**
 * Start nginx
 */
async function start() {
  try {
    const output = shell.exec('nginx -g "daemon on;"', { silent: true });

    if (output.code != 0) {
      throw new Error(output.stderr);
    }

    return {
      data: output.stdout,
    };
  } catch (error) {
    return {
      error: error,
    };
  }
}

/**
 * Stop nginx
 */
async function stop() {
  try {
    const output = shell.exec('nginx -s stop', { silent: true });

    if (output.code != 0) {
      throw new Error(output.stderr);
    }

    return {
      data: output.stdout,
    };
  } catch (error) {
    return {
      error: error,
    };
  }
}

/**
 * Reload nginx
 */
async function reload() {
  try {
    const output = shell.exec('nginx -s reload', { silent: true });

    if (output.code != 0) {
      throw new Error(output.stderr);
    }

    return {
      data: output.stdout,
    };
  } catch (error) {
    return {
      error: error,
    };
  }
}
