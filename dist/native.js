'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _connectTrackerReduxNative = require('./connectTrackerReduxNative');

var _connectTrackerReduxNative2 = _interopRequireDefault(_connectTrackerReduxNative);

var _createTrackerReduxContainer = require('./createTrackerReduxContainer');

var _createTrackerReduxContainer2 = _interopRequireDefault(_createTrackerReduxContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _createTrackerReduxContainer2.default.bind(undefined, _connectTrackerReduxNative2.default);