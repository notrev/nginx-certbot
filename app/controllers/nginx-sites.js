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
router.get('/:site/content', getSiteContent);
router.post('/enable', enableSites);
router.post('/disable', disableSites);

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
          status: result.data,
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

    if (result.error) {
      throw result.error;
    }

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

    if (result.error) {
      throw result.error;
    }

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
 * Get the content of a specific site file
 *
 * Accepts param: raw, to return a raw response, without JSON. Doesn't need any value
 */
async function getSiteContent(req, res) {
  try {
    const file = req.params.site;
    const result = await nginxSitesManager.getSiteContent(file);

    // XXX: Should result.data be encoded in any way?
    if (req.query.raw !== undefined) {
      return res
        .send(result.data);
    }

    return res
      .send({
        data: {
          status: result.data,
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
