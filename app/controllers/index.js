const express = require('express');

const homeViewController = require('app/controllers/home.view.js');
const nginxViewController = require('app/controllers/nginx.view.js');
const nginxController = require('app/controllers/nginx.js');

const router = express.Router();

router.use('/', homeViewController);
router.use('/nginx', nginxViewController);

router.use('/actions/nginx', nginxController);

module.exports = router;
