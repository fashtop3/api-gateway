var express = require('express');
var router = express.Router();
const apiAdapter = require('./apiAdapter');
const multipart = require('../middleware/multipart');
const isAuthorized = require('../controller/requestAuthenticator');

const BASE_URL = 'http://api_server:5000/';
const api = apiAdapter(BASE_URL);


const routes = [
  {
    url: '/api/v1/merchants',
    methods: ['get'],
    middleware: [],
    req: {headers: ["Authorization"]},
    res: {headers: []}
  },
  {
    url: '/api/v1/merchants/onboard',
    methods: ['post'],
    middleware: [],
    req: {headers: ["Authorization"]},
    res: {headers: []}
  },
  {
    url: '/api/v1/merchants/:id',
    methods: ['patch'],
    middleware: [],
    req: {headers: ["Authorization"]},
    res: {headers: []}
  },

  {
    url: '/api/v1/merchants/:id/upload_logo',
    methods: ['patch'],
    middleware: [multipart],
    req: {headers: ["Authorization", "Content-Type"]},
    res: {headers: []}
  },

  {
    url: '/api/v1/merchants/:id/upload_banner',
    methods: ['patch'],
    middleware: [multipart],
    req: {headers: ["Authorization", "Content-Type"]},
    res: {headers: []}
  },

  //stay

  {
    url: '/api/v1/stay*?',
    methods: ['get', 'post', 'patch'],
    middleware: [],
    req: {headers: ["Authorization"]},
    res: {headers: []}
  },

  /**
   * concierge
   */
  {
    url: '/api/v1/concierge',
    methods: ['get', 'post'],
    middleware: [],
    req: {headers: ["Authorization"]},
    res: {headers: []}
  },
  {
    url: '/api/v1/concierge/:id',
    methods: ['get', 'patch'],
    middleware: [],
    req: {headers: ["Authorization"]},
    res: {headers: []}
  },
];

routes.forEach((route, index) => {
  route.methods.forEach(method => (
    router[method](route.url, route.middleware, (req, res) => {

      let options = {
        method: method,
        url: req.path,
        data: req.body,
        headers: route.req.headers.reduce((c, h, i) => {
          c[h] = req.headers[h.toLowerCase()];
          return c
        }, {})
      };

      api(options)
        .then(resp => {
          res.status(resp.status).send(resp.data)
        })
        .catch(err => {
          res.status(err.response.status).send(err.response.data)
        })
    })
  ))
});


module.exports = router;