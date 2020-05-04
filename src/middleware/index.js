//load middleware
const defaults = Object.values(require('require-dir')());
const plugins = require('require-dir')('./plugins');

exports.request_middleware = (interceptor) => {
  let _interceptor = [];
  if (!!interceptor && !!interceptor.length) {
    _interceptor = interceptor.filter(p => !!plugins[p]).map(p => plugins[p]);
  }

  return defaults.concat(_interceptor)
}
exports.response_middleware = (interceptor) => {
  let _interceptor = [];
  if (!!interceptor && !!interceptor.length) {
    _interceptor = interceptor.filter(p => !!plugins[p]).map(p => plugins[p]);
  }

  return _interceptor
}