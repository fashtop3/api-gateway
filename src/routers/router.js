const express = require('express');
var router = express.Router();

const routeServices = ['./bootstrap',]

router.use((req, res, next) => {
  console.log("Called: ", `[${req.method}]`, req.path);
  next()
});

routeServices.forEach(service => router.use(require(service)))

module.exports = router;