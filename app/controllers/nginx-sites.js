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
