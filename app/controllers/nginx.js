/**********************\
  Dependencies
\**********************/

// External libs
const express = require('express');

// Internal libs
const nginxSitesController = require('app/controllers/nginx-sites');
const nginxManager = require('app/helpers/nginx-manager');

/**********************\
  Variables/Constants
\**********************/

const router = express.Router();

/**********************\
  Route definitions
\**********************/

router.use('/sites', nginxSitesController);

router.get('/status', getStatus);
router.post('/reload', postReload);
router.post('/start', postStart);
router.post('/stop', postStop);

// Route export
module.exports = router;

/**********************\
  Function definitions
\**********************/

/**
 * Get nginx service status
 */
async function getStatus(req, res) {
  try {
    const result = await nginxManager.status();

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
 * Reload nginx
 */
async function postReload(req, res) {
  try {
    const result = await nginxManager.reload();

    if (result.error) {
      throw result.error;
    }

    return res
      .send({
        data: {
          output: result.data,
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
 * Start nginx
 */
async function postStart(req, res) {
  try {
    const result = await nginxManager.start();

    if (result.error) {
      throw result.error;
    }

    return res
      .send({
        data: {
          output: result.data,
        },
      });
  } catch (error) {
    return res.render('nginx/start', {
      error: error.message,
    });
  }
}

/**
 * Stop nginx
 */
async function postStop(req, res) {
  try {
    const result = await nginxManager.stop();

    if (result.error) {
      throw result.error;
    }

    return res
      .send({
        data: {
          output: result.data,
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
