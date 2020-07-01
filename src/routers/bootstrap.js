let express = require('express');
let router = express.Router();
const axios = require('axios');
var fs = require('fs');
const https = require('https')

//load middleware
const {request_middleware, response_middleware} = require('../middleware/');

/**
 *
 * @param url
 * @param req
 * @returns {*}
 */
function reverse(url, req) {
  /**
   * do a regex match and for all
   * matches execute the callback
   */
  return url.replace(/(\/:\w+\??)/g, function (m, c) {
    // replace match for : and ? with a space
    // return an object
    c = c.replace(/[/:?]/g, '');
    if (!!req.is_proxy) {
      return req.params[0] ? '/' + req.params[0] : "";
    }
    return req.params[c] ? '/' + req.params[c] : "";
  });
}


/***
 * injects req functions
 * @param target
 * @returns {function(...[*]=)}
 */
function injectTargetRules(target) {
  return function (req, resp, next) {
    req.target = target;
    req.is_proxy = !!target.proxy && target.proxy;
    req.content_handling = !!target.content_handling && target.content_handling
    next();
  }
}

/**
 * Proxy Https TLS error
 * @type {https.Agent}
 */
const agent = new https.Agent({
  rejectUnauthorized: false
});

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
async function proxy(req, res, next) {
  //proxy request adapter axios
  // console.log(req.headers)
  delete req.headers['host'];
  return await axios({
    method: req.is_proxy ? req.method : req.target.http.method,
    url: reverse(req.target.http.endpoint, req),
    data: req.body,
    params: req.query,
    headers: req.headers,
    httpsAgent: agent
  })
    .then(resp => {
      res._intercept = resp
      return next();
    })
    .catch(({response, ...e}) => {
      if (!response) throw e
      return res.status(response.status).send(response.data)
    })
    .catch(e => {
      const err = e.toJSON()
      console.error(err)
      return res.status(502).send({
        endpoint: err.config.url,
        method: err.config.method,
        message: err.code,
        code: 502
      })
    })
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
      return router[method](path, injectTargetRules(target), request_intercept, proxy, response_intercept, function (req, res) {
        res.status(res._intercept.status).send(res._intercept.data)
      })
    }
  }
  //check for recursive call
  if (resource.hasOwnProperty('resources')) {
    return resource.resources.map(obj => bootstrap(obj, path + obj.path))
  }

  //handles resources in subdirectory dept 1
  return Object.values(resource).map(o => bootstrap(o, o.path,))
}


/**
 *
 */
resourceGroup.map(resource => bootstrap(resource, resource.path));

module.exports = router;
