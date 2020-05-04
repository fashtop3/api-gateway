const express = require('express');
var router = express.Router();

// const hashtagRouter = require('./hashtagService');
// const authRouter = require('../controller/AuthController');

const routeServices = [
  './commonService',
  './authService',
  './hotelService',
  './customerService',
  './conciergeService',
  './restaurantService',
  // 'hashtagService'
]


router.use((req, res, next) => {
  console.log("Called: ", `[${req.method}]`, req.path);
  next()
});

//require('./commonService')
routeServices.forEach(service => router.use(require(service)))

module.exports = router;