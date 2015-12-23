'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

var _url3 = require('./url');

var _url4 = _interopRequireDefault(_url3);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { _bluebird2.default.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

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

var initRequest = (function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(opts, params, middleware) {
    var rules, options, search, response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          rules = opts.rules;
          options = isObject(params) ? params : {};

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

          if (options.json) options.headers = _extends({}, options.headers, {
            'Content-Type': 'application/json'
          });

          (0, _debug2.default)('sdk:request')(options);

          search = Object.keys(options.qs).map(function (key) {
            return key + '=' + obj[key];
          }).join('&');
          _context.prev = 9;
          _context.next = 12;
          return (0, _isomorphicFetch2.default)('' + options.url + search, {
            method: options.method,
            headers: options.headers,
            body: options.body
          });

        case 12:
          response = _context.sent;

          if (!(response.status === 200)) {
            _context.next = 15;
            break;
          }

          return _context.abrupt('return', response.json());

        case 15:
          throw response;

        case 18:
          _context.prev = 18;
          _context.t0 = _context['catch'](9);
          throw _context.t0;

        case 21:
        case 'end':
          return _context.stop();
      }
    }, _callee, this, [[9, 18]]);
  }));

  return function initRequest(_x3, _x4, _x5) {
    return ref.apply(this, arguments);
  };
})();

// return new Promise((Resolve, Reject) => {
//   let req = request[options.method](options.url);

//   if (options.headers)
//     req.set(options.headers)
//   if (options.json)
//     req.accept('json').type('json')
//   if (options.qs)
//     req.query(options.qs)
//   if (options.body)
//     req.send(options.body)

//   req.end((err, res) => {
//     // We need the whole response
//     if (err)
//       return Reject(res)

//     debug('sdk:response:status')(res.status)
//     debug('sdk:response:headers')(res.header)
//     debug('sdk:response:body')(res.body)

//     let code = res.status;
//     let body = res.body || res.text;

//     if (_.isFunction(middleware)) {
//       return middleware(res, body, (customError, customBody) => {
//         if (customError)
//           return Reject(customError)

//         return Resolve({
//           code,
//           response: res,
//           body: customBody || body
//         })
//       })
//     }

//     return Resolve({
//       code,
//       response: res,
//       body
//     })
//   })

//   return req
// })

function isObject(obj) {
  return obj && _lodash2.default.isObject(obj) && !_lodash2.default.isFunction(obj);
}

function isAbsUri(uri) {
  return uri && (uri.indexOf('http') === 0 || uri.indexOf('https') === 0);
}
//# sourceMappingURL=factory.js.map