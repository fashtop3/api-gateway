//load middleware
const path = require('path');
const defaults = Object.values(require('require-dir')());
const plugins = require('require-dir')(path.join(__dirname, '../data/plugins'), {
  recurse: true,
  // filter: function (fullPath) {
  //   return process.env.NODE_ENV !== 'production' && !fullPath.match(/$dev/);
  // }
});

/**
 * get list of  request interceptor from the resource code.
 * @param interceptor
 * @returns {*[]}
 */
exports.request_middleware = (interceptor) => {
  let _interceptor = [];
  if (!!interceptor && Array.isArray(interceptor)) {
    /**
     * filter through lists of interceptors
     * check if the filename exist with a function exported as a default value
     * then map the function to the interceptor array
     * @type {BigUint64Array}
     * @private
     */
    _interceptor = interceptor.filter(p => !!plugins[p]).map(p => plugins[p]);
  }
  /**
   * filter through lists of interceptors
   * check if the object exists in plugins and map interceptor array to
   * plugins
   * @type {BigUint64Array}
   * @private
   */
  else if (interceptor instanceof Object) {
    try {
      //loop the request_interceptor object
      for (const key in interceptor) {
        if (plugins.hasOwnProperty(key)) {
          _interceptor = interceptor[key]
            .filter(p => !!plugins[key][p])
            .map(p => plugins[key][p])
        }
      }
    } catch (e) {
      console.log(e)
    }
  }


  return _interceptor.concat(defaults)
}

/**
 * get list of  response interceptor from the resource code.
 * @param interceptor
 * @returns {[]}
 */
exports.response_middleware = (interceptor) => {
  let _interceptor = [];
  if (!!interceptor && Array.isArray(interceptor)) {
    /**
     * filter through lists of interceptors
     * check if the filename exist with a function exported as a default value
     * then map the function to the interceptor array
     * @type {BigUint64Array}
     * @private
     */
    _interceptor = interceptor.filter(p => !!plugins[p]).map(p => plugins[p]);
  }

  /**
   * filter through lists of interceptors
   * check if the object exists in plugins and map interceptor array to
   * plugins
   * @type {BigUint64Array}
   * @private
   */
  else if (interceptor instanceof Object) {
    try {
      //loop the request_interceptor object
      for (const key in interceptor) {
        if (plugins.hasOwnProperty(key)) {
          _interceptor = interceptor[key]
            .filter(p => !!plugins[key][p])
            .map(p => plugins[key][p])
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  return _interceptor.concat(defaults)
}