'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (route, locals) {
  _lodash2.default.templateSettings.interpolate = /{{([\s\S]+?)}}/g; // cipher
  return _lodash2.default.template(route)(locals);
};
//# sourceMappingURL=url.js.map