function interopRequireDefault (obj) {
  return obj && obj.__esModule ? obj : {default: obj}
}

Object.defineProperty(exports, '__esModule', {value: true})

exports.createTrackerManagerCreatorNative = undefined

var createTrackerManagerCreatorNative = require('./dist/createTrackerManagerCreatorNative')
var createTrackerManagerCreatorNativeInterop = interopRequireDefault(createTrackerManagerCreatorNative)

var connect = require('./dist/connect')
var connectInterop = interopRequireDefault(connect)

exports.createTrackerManagerCreatorNative = createTrackerManagerCreatorNativeInterop.default
exports.default = connectInterop.default.bind(undefined, connectInterop.default)
