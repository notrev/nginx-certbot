/**********************\
  Dependencies
\**********************/

// External libs
const shell = require('shelljs');

const fileManager = require('app/helpers/file-manager');

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
sitesManager.getSiteContent = getSiteContent;
sitesManager.updateSiteContent = updateSiteContent;

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
    throw error;
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
    let enabledSites = [];

    // create symbolic link for each file
    const options = { force: true };
    for (const i in sites) {
      // check to prevent directory traversal
      if (sites[i].indexOf('/') != -1) {
        throw new Error('sites cannot contain `/`');
      }

      // check if file exists. If it doesn't, remove it from the list
      try {
        await fileManager.exists(`${sitesAvailablePath}/${sites[i]}`);
      } catch (error) {
        sites[i] = null;
      }
    }

    // filter out all null values
    sites = sites.filter((item) => item !== null);

    // create symbolic link for every existing file
    for (const i in sites) {
      result = await fileManager.symbolicLink(
            `${sitesAvailablePath}/${sites[i]}`, `${sitesEnabledPath}/${sites[i]}`, options);
      enabledSites.push(result);
    }

    // remove the sites that were not successfuly enabled and remove the path from each of them,
    // leaving only the filename
    enabledSites = enabledSites.filter((item) => item !== undefined);
    enabledSites = enabledSites.map((item) => item.replace(/^.*[\\\/]/, ''));

    return {
      data: enabledSites,
    };
  } catch (error) {
    if (error.code === 'EEXIST') {
      const filename = error.path.replace(/^.*[\\\/]/, '');
      error.message = `site already active: ${filename}`;
    }

    throw error;
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

    let disabledSites = [];
    let result;

    // removes symbolic link for each file
    for (const i in sites) {
      // check to prevent directory traversal
      if (sites[i].indexOf('/') != -1) {
        throw new Error('sites cannot contain `/`');
      }
      result = await fileManager.unlink(`${sitesEnabledPath}/${sites[i]}`);
      disabledSites.push(result);
    }

    // remove the sites that were not successfuly disabled and remove the path from each of them,
    // leaving only the filename
    disabledSites = disabledSites.filter((item) => item !== undefined);
    disabledSites = disabledSites.map((item) => item.replace(/^.*[\\\/]/, ''));

    return {
      data: disabledSites,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Reads a specific file from sites-available directory and returns its content.
 * Accepts 'raw' query param
 *
 * If the file does not exist and 'raw' query param is set, return an empty response.
 */
async function getSiteContent(file) {
  try {
    const options = {
      encoding: 'utf8',
    };

    const result = await fileManager.readFile(`${sitesAvailablePath}/${file}`, options);

    return {
      data: result,
    };
  } catch (error) {
    // 'No file' error
    if (error.code === 'ENOENT') {
      error.message = `no such file: ${file}`;
    }

    throw error;
  }
}

/**
 * Saves received content to a file in sites-available directory.
 */
async function updateSiteContent(file, content) {
  try {
    const options = {
      encoding: 'utf8',
    };

    const fileContent = await fileManager.writeFile(
        `${sitesAvailablePath}/${file}`, content, options);

    return;
  } catch (error) {
    throw error;
  }
}
