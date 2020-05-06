// var yaml = require('js-yaml');
const req = require('require-yml');
const path = require('path');
const fs = require('fs');


// module.exports = require('require-dir')('./data', {extensions: ['.json',]});   // defaults to '.'
module.exports = req(path.join(__dirname, 'data'));