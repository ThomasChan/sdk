'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _factory = require('./factory');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @host[String]: the host domain
 * @routes[Object]: a object contains every route of the sdk, including its URL, method, and callback function
 * @rules[Object]: a object contains rules which append or merged into query params.
 *
 **/
//              ____
//    _________/ / /__
//   / ___/ __  / //_/
//  (__  ) /_/ / ,<
// /____/\__,_/_/|_|
//
// @brief: a sdk factory, build sdks made easy
// @author: [turingou](http://guoyu.me)

var SDK = (function () {
  function SDK(host, routes) {
    (0, _classCallCheck3.default)(this, SDK);
    var rules = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    if (!routes || !host) return;
    if (!_lodash2.default.isObject(routes)) return;

    this.host = host;
    this.routes = routes;
    this.rules = rules;

    if (this.rules) this.init();
  }

  /**
   *
   * Add a new rule to SDK instance
   * @key[String]: the key word of this rule, may be `get`,`post` or `all`
   * @value[Object]: the value of this rule, this very object will be merged in to query params,
   * for instance, `qs` object will be merged into query string. and `form` object will be merged into post form.
   *
   **/

  (0, _createClass3.default)(SDK, [{
    key: 'rule',
    value: function rule(key, value) {
      if (!key || !value) return false;
      if (!this.rules) this.rules = {};

      this.rules[key.toLowerCase()] = value;
      return this;
    }

    /**
     *
     * Init a SDK instance
     * if there's no any available rules provied before ,
     * this init function can be triggered by users and at any time they want.
     *
     **/

  }, {
    key: 'init',
    value: function init() {
      var _this = this;

      var host = this.host;
      var rules = this.rules;
      var routes = this.routes;

      // init build-in lowlevel apis
      ['get', 'post', 'put', 'delete'].forEach(function (method) {
        return _this[method] = (0, _factory.lowLevel)(host, method, rules);
      });

      // init custom apis
      (0, _keys2.default)(routes).forEach(function (key) {
        var route = routes[key];
        var api = {
          url: typeof route === 'string' ? route : route.url
        };['method', 'callback'].forEach(function (item) {
          if (route[item]) api[item] = route[item];
        });

        _this[key] = (0, _factory.highLevel)(host, api, rules);
      });

      return this;
    }
  }]);
  return SDK;
})();

exports.default = SDK;
//# sourceMappingURL=sdk.js.map