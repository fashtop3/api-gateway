var express = require('express');
var router = express.Router();
const apiAdapter = require('./apiAdapter');
const isAuthorized = require('../controller/requestAuthenticator');

const BASE_URL = 'http://api_server:5000/';
const api = apiAdapter(BASE_URL);

const routes = [
  {
    url: '/api/v1/registration',
    methods: ['post'],
    middleware: [],
    req: {headers: []},
    res: {headers: []}
  },
  {
    url: '/api/v1/registration/login',
    methods: ['post'],
    middleware: [],
    req: {headers: []},
    res: {headers: []}
  },
  {
    url: '/api/v1/registration/login',
    methods: ['get'],
    middleware: [],
    req: {headers: ["Authorization"]},
    res: {headers: []}
  },
  {
    url: '/api/v1/registration/recover',
    methods: ['post'],
    middleware: [],
    req: {headers: []},
    res: {headers: []}
  },
  {
    url: '/api/v1/registration/resend-activation-link',
    methods: ['post'],
    middleware: [],
    req: {headers: []},
    res: {headers: []}
  },
  {
    url: '/api/v1/registration/verify/:token',
    methods: ['get'],
    middleware: [],
    req: {headers: []},
    res: {headers: []}
  },
];

// todo: add variable to handle headers to and fro

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