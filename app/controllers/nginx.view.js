/**********************\
  Dependencies
\**********************/

// External libs
const express = require('express');

// Internal libs
const nginxManager = require('app/helpers/nginx-manager');
const sitesManager = require('app/helpers/sites-manager');

/**********************\
  Variables/Constants
\**********************/

const router = express.Router();

/**********************\
  Route definitions
\**********************/

router.get('/sites', sitesView);
router.get('/reload', reloadView);
router.get('/start', startView);
router.get('/stop', stopView);

// Route export
module.exports = router;

/**********************\
  Function definitions
\**********************/

/**
 * Render view for path /nginx/sites
 */
async function sitesView(req, res) {
  try {
    const sitesResult = await sitesManager.getSites();
    const nginxStatus = await nginxManager.status();

    if (sitesResult.error) {
      throw siresResult.error;
    }

    return res.render('nginx/sites', {
      sites: sitesResult.data,
      nginxStatus: nginxStatus,
    });
  } catch (error) {
    return res.render('nginx/sites', {
      error: error,
    });
  }
}

/**
 * Reload nginx
 */
async function reloadView(req, res) {
  try {
    const result = await nginxManager.reload();
    const nginxStatus = await nginxManager.status();

    if (result.error) {
      throw result.error;
    }

    return res.render('nginx/reload', {
      output: result.data,
      nginxStatus: nginxStatus,
    });
  } catch (error) {
    return res.render('nginx/reload', {
      error: error.message,
    });
  }
}

/**
 * Start nginx
 */
async function startView(req, res) {
  try {
    const result = await nginxManager.start();
    const nginxStatus = await nginxManager.status();

    if (result.error) {
      throw result.error;
    }

    return res.render('nginx/start', {
      output: result.data,
      nginxStatus: nginxStatus,
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
async function stopView(req, res) {
  try {
    const result = await nginxManager.stop();
    const nginxStatus = await nginxManager.status();

    if (result.error) {
      throw result.error;
    }

    return res.render('nginx/stop', {
      output: result.data,
      nginxStatus: nginxStatus,
    });
  } catch (error) {
    return res.render('nginx/stop', {
      error: error.message,
    });
  }
}
