'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');


// App
const app = express();
var router = require('./routers/router');
const nocache = require('nocache');

// var db = require('./db');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(fileUpload());

app.use(nocache());

// aws ELB healthcheck
router.get('/api/', (req, res) => {
  res.status(200).send({"ELB-HealthChecker/2.0": "Ok"})
});

app.use(router);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);