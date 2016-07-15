'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTrackerManagerCreator = undefined;

var _createTrackerManagerCreator = require('./createTrackerManagerCreator');

var _createTrackerManagerCreator2 = _interopRequireDefault(_createTrackerManagerCreator);

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createTrackerManagerCreator = _createTrackerManagerCreator2.default;
exports.default = _connect2.default.bind(undefined, _createTrackerManagerCreator2.default);