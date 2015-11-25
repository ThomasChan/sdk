'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lowLevel = lowLevel;
exports.highLevel = highLevel;

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _superagentProxy = require('superagent-proxy');

var _superagentProxy2 = _interopRequireDefault(_superagentProxy);

var _url3 = require('./url');

var _url4 = _interopRequireDefault(_url3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function lowLevel(host, method, rules) {
  return function (url) {
    var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    // Return a Promise/A+
    return initRequest({
      host: host,
      url: url,
      method: method,
      rules: rules
    }, params);
  };
}

function highLevel(host, _ref, rules) {
  var url = _ref.url;
  var method = _ref.method;
  var callback = _ref.callback;

  return function () {
    var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    // Return a Promise/A+
    return initRequest({
      host: host,
      rules: rules,
      url: (0, _url4.default)(url, params),
      method: method ? method.toLowerCase() : 'get'
    }, params, callback);
  };
}

function initRequest(opts, params, middleware) {
  var rules = opts.rules;
  var options = isObject(params) ? params : {};

  if (rules) {
    if (rules.all) options = _lodash2.default.merge(_lodash2.default.cloneDeep(rules.all), options);
    if (rules[opts.method]) options = _lodash2.default.merge(_lodash2.default.cloneDeep(rules[opts.method]), options);

    if (options.headers) {
      Object.keys(options.headers).forEach(function (k) {
        if (typeof options.headers[k] === 'function') options.headers[k] = options.headers[k]();
      });
    }
  }

  options.method = opts.method;
  options.url = isAbsUri(opts.url) ? opts.url : _url2.default.resolve(opts.host, opts.url);

  if (options.json == undefined) options.json = true;

  (0, _debug2.default)('sdk:request')(options);

  return new _bluebird2.default(function (Resolve, Reject) {
    var req = undefined;
    if (options.proxy) {
      (0, _superagentProxy2.default)(_superagent2.default);
      req = _superagent2.default[options.method](options.url);
      req.proxy(options.proxy);
    } else {
      req = _superagent2.default[options.method](options.url);
    }

    if (options.headers) req.set(options.headers);
    if (options.json) req.accept('json').type('json');
    if (options.qs) req.query(options.qs);
    if (options.body) req.send(options.body);

    req.end(function (err, res) {
      // We need the whole response
      if (err) return Reject(res);

      (0, _debug2.default)('sdk:response:status')(res.status);
      (0, _debug2.default)('sdk:response:headers')(res.header);
      (0, _debug2.default)('sdk:response:body')(res.body);

      var code = res.status;
      var body = res.body || res.text;

      if (_lodash2.default.isFunction(middleware)) {
        return middleware(res, body, function (customError, customBody) {
          if (customError) return Reject(customError);

          return Resolve({
            code: code,
            response: res,
            body: customBody || body
          });
        });
      }

      return Resolve({
        code: code,
        response: res,
        body: body
      });
    });

    return req;
  });
}

function isObject(obj) {
  return obj && _lodash2.default.isObject(obj) && !_lodash2.default.isFunction(obj);
}

function isAbsUri(uri) {
  return uri && (uri.indexOf('http') === 0 || uri.indexOf('https') === 0);
}
//# sourceMappingURL=factory.js.map