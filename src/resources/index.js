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
    if (typeof config[key] == "undefined") {
      throw (`Interpolation error: variable "${key}" not found in the config.js`)
    }
    return config[key]
  });
}

const req_api_file = req({
  targets: path.join(__dirname, '../data/resources'),
  fileToProp: file => file //set the filename as the key pair
})


// console.log(req_api_file)

/**
 * Stringify the api object and load the config file with interpolations
 */
let config_obj = {};
try {
  config_obj = require(path.join(__dirname, '../data/config.js'))
} catch (e) {
  console.log(e)
}
const parsable = interpolate(JSON.stringify(req_api_file), config_obj);
// console.log(data)

// module.exports = require('require-dir')('./data', {extensions: ['.json',]});   // defaults to '.'
module.exports = parsable ? JSON.parse(parsable) : "";