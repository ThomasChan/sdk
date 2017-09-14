'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.templatesettings');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.template');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (route, locals) {
  _lodash2.default.interpolate = /{{([\s\S]+?)}}/g; // cipher
  return (0, _lodash4.default)(route)(locals);
};
//# sourceMappingURL=url.js.map