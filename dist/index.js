'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _connectTrackerRedux = require('./connectTrackerRedux');

var _connectTrackerRedux2 = _interopRequireDefault(_connectTrackerRedux);

var _createTrackerReduxContainer = require('./createTrackerReduxContainer');

var _createTrackerReduxContainer2 = _interopRequireDefault(_createTrackerReduxContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _createTrackerReduxContainer2.default.bind(undefined, _connectTrackerRedux2.default);