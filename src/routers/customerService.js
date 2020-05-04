var express = require('express');

var router = express.Router();
const apiAdapter = require('./apiAdapter');
const multipart = require('../middleware/multipart');
const BASE_URL = 'http://api_server:5000/';
const api = apiAdapter(BASE_URL);


const routes = [
  {
    url: '/api/v1/customer/*',
    methods: ['patch', 'delete', 'post', 'get'],
    middleware: [multipart],
    req: {headers: ["Authorization", 'Content-Type']},
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
