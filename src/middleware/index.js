//load middleware
const path = require('path');
const defaults = Object.values(require('require-dir')());
const plugins = require('require-dir')(path.join(__dirname, '../data/plugins'));

exports.request_middleware = (interceptor) => {
  let _interceptor = [];
  if (!!interceptor && !!interceptor.length) {
    _interceptor = interceptor.filter(p => !!plugins[p]).map(p => plugins[p]);
  }

  return _interceptor.concat(defaults)
}
exports.response_middleware = (interceptor) => {
  let _interceptor = [];
  if (!!interceptor && !!interceptor.length) {
    _interceptor = interceptor.filter(p => !!plugins[p]).map(p => plugins[p]);
  }

  return _interceptor
}