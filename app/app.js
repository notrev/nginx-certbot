/*************************\
  Dependencies
\*************************/

// External libs
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Internal libs
const controllers = require('app/controllers');

/*************************\
  Variables/Constants
\*************************/

const app = express();

/*************************\
  Application definitions
\*************************/

app.set('view engine', 'pug');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('static'));
app.use(controllers);

// Start application
const listener = app.listen(3000, () =>
    console.log(`nginx+certbot manager started on port ${listener.address().port}`));
