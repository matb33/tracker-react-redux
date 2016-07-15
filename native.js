function interopRequireDefault (obj) {
  return obj && obj.__esModule ? obj : {default: obj}
}

Object.defineProperty(exports, '__esModule', {value: true})

exports.createTrackerManagerCreatorNative = undefined
exports.connect = undefined

var createTrackerManagerCreatorNative = require('./dist/createTrackerManagerCreatorNative')
var createTrackerManagerCreatorNativeInterop = interopRequireDefault(createTrackerManagerCreatorNative)

var connect = require('./dist/connect')
var connectInterop = interopRequireDefault(connect)

exports.createTrackerManagerCreatorNative = createTrackerManagerCreatorNativeInterop.default
exports.default = exports.connect = connectInterop.default.bind(undefined, connectInterop.default)
