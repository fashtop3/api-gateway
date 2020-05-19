// var yaml = require('js-yaml');
const req = require('require-yml');
const path = require('path');
const fs = require('fs');

function interpolate(s, config) {
    /**
     * do a regex match and for all
     * matches execute the callback
     */
    return s.replace(/({{\w+}})/g, function (m, c) {
      // replace match for : and ? with a space
      // return an object
      const key = c.replace(/[\{\}]/g, '');
      if(typeof config[key] == "undefined"){
        throw (`Interpolation error: variable "${key}" not found in the config.js`)
      }
      return config[key]
    });
  }

const req_api_file = req(path.join(__dirname, 'data'))


/**
 * Stringify the api object and load the config file with interpolations
 */
const data = interpolate(JSON.stringify(req_api_file), require('/usr/src/data/config.js'));
// console.log(data)

// module.exports = require('require-dir')('./data', {extensions: ['.json',]});   // defaults to '.'
module.exports = JSON.parse(data);