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
    // TODO: implement checks for different errors
    const noFileRegExp = new RegExp('(no such file).*\/(.+)');
    const regExpResult = noFileRegExp.exec(error.message);
    if (regExpResult) {
      error.message = `${regExpResult[1]}: ${regExpResult[2]}`;
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
