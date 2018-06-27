/**********************\
  Dependencies
\**********************/

// External libs
const express = require('express');

// Internal libs
const nginxSitesManager = require('app/helpers/nginx-sites-manager');

/**********************\
  Variables/Constants
\**********************/

const router = express.Router();

/**********************\
  Route definitions
\**********************/

router.get('/', getSites);
router.post('/enable', enableSites);
router.post('/disable', disableSites);
router.get('/:site/content', getSiteContent);
router.post('/:site/content', postSiteContent);

// Route export
module.exports = router;

/**********************\
  Function definitions
\**********************/

/**
 * Get nginx sites
 */
async function getSites(req, res) {
  try {
    const result = await nginxSitesManager.getSites();

    return res
      .send({
        data: {
          sites: result.data,
        },
      });
  } catch (error) {
    return res
      .status(500)
      .send({
        error: true,
        message: error.message,
      });
  }
}

/**
 * Enable nginx sites
 */
async function enableSites(req, res) {
  try {
    const sites = req.body.sites || [];
    const result = await nginxSitesManager.enableSites(sites);

    return res
      .send({
        data: {
          sitesEnabled: result.data,
        },
      });
  } catch (error) {
    return res
      .status(500)
      .send({
        error: true,
        message: error.message,
      });
  }
}

/**
 * Disable nginx sites
 */
async function disableSites(req, res) {
  try {
    const sites = req.body.sites || [];
    const result = await nginxSitesManager.disableSites(sites);

    return res
      .send({
        data: {
          sitesDisabled: result.data,
        },
      });
  } catch (error) {
    return res
      .status(500)
      .send({
        error: true,
        message: error.message,
      });
  }
}

/**
 * Get the content of the specified site file
 *
 * Accepts param: raw, to return a raw response, without JSON. Doesn't need any value
 * If the file does not exist and raw query param is present, return empty response
 */
async function getSiteContent(req, res) {
  try {
    const file = req.params.site;
    const result = await nginxSitesManager.getSiteContent(file);

    if (req.query.raw !== undefined) {
      return res
        .send(result.data);
    }

    return res
      .send({
        data: result.data,
      });
  } catch (error) {
    let response;

    if (req.query.raw === undefined) {
      response = {
        error: true,
        message: error.message,
      };
    }

    return res
      .status(500)
      .send(response);
  }
}

/**
 * Save the received content to a specified site file
 */
async function postSiteContent(req, res) {
  try {
    const file = req.params.site;
    const content = req.body.content;

    const result = await nginxSitesManager.updateSiteContent(file, content);

    // XXX: Should it return anything? File name or content?
    return res.send();
  } catch (error) {
    return res
      .status(500)
      .send({
        error: true,
        message: error.message,
      });
  }
}
