const express = require('express');

const homeViewController = require('app/controllers/home.view');
const nginxViewController = require('app/controllers/nginx.view');
const nginxController = require('app/controllers/nginx');

const router = express.Router();

router.use('/', homeViewController);
router.use('/nginx', nginxViewController);

router.use('/actions/nginx', nginxController);

module.exports = router;
