/**********************\
  Dependencies
\**********************/

// External libs
const shell = require('shelljs');

/**********************\
  Variables/Constants
\**********************/

const sitesManager = {};
const nginxBasePath = '/etc/nginx';
const sitesAvailablePath = `${nginxBasePath}/sites-available`;
const sitesEnabledPath = `${nginxBasePath}/sites-enabled`;

// Module's public functions
sitesManager.getSites = getSites;

// Module export
module.exports = sitesManager;

/**********************\
  Function definitions
\**********************/

/**
 * List files from /etc/nginx/sites-available. If there is a symbolic link for them on
 * /etc/nginx/sites-enabled, sets flag 'isEnabled' as true.
 */
async function getSites() {
  try {
    const sitesAvailable = await shell.ls(sitesAvailablePath);
    const sitesEnabled = await shell.ls(sitesEnabledPath);
    const files = [];

    sitesAvailable.forEach((siteAvailable) => {
      const file = {
        name: siteAvailable,
        isEnabled: false,
      };

      if (sitesEnabled.indexOf(siteAvailable) >= 0) {
        file.isEnabled = true;
      }

      files.push(file);
    });

    return {
      data: files,
    };
  } catch (error) {
    return {
      error: error,
    };
  }
}
