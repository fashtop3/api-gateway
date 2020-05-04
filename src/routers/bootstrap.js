var express = require('express');
var router = express.Router();
const axios = require('axios');

//load middleware
const {request_middleware, response_middleware} = require('../middleware/');

/**
 *
 * @param url
 * @param obj
 * @returns {*}
 */
function reverse(url, obj) {
  /**
   * do a regex match and for all
   * matches execute the callback
   */
  return url.replace(/(\/:\w+\??)/g, function (m, c) {
    // replace match for : and ? with a space
    // return an object
    c = c.replace(/[/:?]/g, '');
    return obj[c] ? '/' + obj[c] : "";
  });
}

/**
 *
 * @param target
 * @returns {function(...[*]=)}
 */
function proxy(target) {
  return async (req, res, next) => {
    //proxy request adapter axios
    await axios({
      method: target.http.method,
      url: reverse(target.http.endpoint, req.params),
      data: req.body,
      params: req.query,
      headers: req.headers
    })
      .then(resp => {
        res._intercept = resp
      })
      .catch(err => {
        res.status(err.response.status).send(err.response.data)
      })
    next();
  }
}

/**
 *
 * @type {resourceGroup[]}
 */
const resourceGroup = Object.values(require('../resources/'))

console.log("Registering:...");

/**
 *
 * @param resource
 * @param path
 */
function bootstrap(resource, path,) {
  if (resource.hasOwnProperty('methods')) {
    for (const [method, target] of Object.entries(resource.methods)) {

      console.log(`[${method.toUpperCase()}]`, '->', path)

      /**
       * Load middleware and custom interceptor
       * executes intercepts as registered
       */
      const request_intercept = request_middleware(target.http.request_interceptor);
      const response_intercept = response_middleware(target.http.response_interceptor);

      /**
       * Register gateway routes
       */
      router[method](path, request_intercept, proxy(target), response_intercept, function (req, res) {
        res.status(res._intercept.status).send(res._intercept.data)
      })
    }
  }
  //check for recursive call
  if (resource.hasOwnProperty('resources')) {
    resource.resources.map(obj => bootstrap(obj, path + obj.path))
  }
}

/**
 *
 */
resourceGroup.map(resource => bootstrap(resource, resource.path));

module.exports = router;
