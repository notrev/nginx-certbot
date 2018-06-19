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
sitesManager.enableSites = enableSites;
sitesManager.disableSites = disableSites;

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

/**
 * Create symbolic link of files from /etc/nginx/sites-available to /etc/nginx/sites-enabled.
 */
async function enableSites(sites = []) {
  try {
    if (!sites) {
      return {
        data: [],
      };
    }

    let filename;
    let result;

    // list the files to get only the existing ones
    result = await shell.ls(sites.map((file) => `${sitesAvailablePath}/${file}`));

    if (result.code !== 0) {
      throw new Error(result.stderr);
    }

    // create a list of objects containing full path fo file and the filename
    sites = [];
    result.forEach((filePath) => {
      filename = filePath.replace(`${sitesAvailablePath}/`, '');
      sites.push({
        filename: filename,
        path: filePath,
      });
    });

    // create symbolic link for each file
    for (const i in sites) {
      result = await shell.ln('-sf', sites[i].path, `${sitesEnabledPath}/${sites[i].filename}`);

      if (result.code !== 0) {
        throw new Error(result.stderr);
      }
    }

    return {
      data: sites.map((site) => site.filename),
    };
  } catch (error) {
    // TODO: implement a check for different errors
    const noFileRegExp = new RegExp('(no such file).*\/(.+)');
    const regExpResult = noFileRegExp.exec(error.message);
    if (regExpResult) {
      error.message = `${regExpResult[1]}: ${regExpResult[2]}`;
    }

    return {
      error: error,
    };
  }
}

/**
 * Remove symbolic link of files from /etc/nginx/sites-available to /etc/nginx/sites-enabled.
 */
async function disableSites(sites = []) {
  try {
    if (!sites) {
      return {
        data: [],
      };
    }

    // removes symbolic link for each file
    for (const i in sites) {
      result = await shell.rm('-f', `${sitesEnabledPath}/${sites[i]}`);

      if (result.code !== 0) {
        throw new Error(result.stderr);
      }
    }

    return {
      data: sites,
    };
  } catch (error) {
    return {
      error: error,
    };
  }
}
