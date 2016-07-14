'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = connectTrackerReduxNative;

var _reactNativeMeteor = require('react-native-meteor');

function connectTrackerReduxNative(store) {
  // Check store for a valid shape
  if (!store.subscribe || !store.dispatch || !store.getState) {
    return false;
  }

  return function () {
    var trackers = [];

    var autorun = function autorun(fn) {
      var dep = new _reactNativeMeteor.Tracker.Dependency();
      var data = (0, _reactNativeMeteor.getData)();
      var onDataChange = function onDataChange() {
        return dep.changed();
      };

      data.onChange(onDataChange);

      var handle = _reactNativeMeteor.Tracker.autorun(function (h) {
        dep.depend();
        fn(h);
      });

      return {
        stop: function stop() {
          data.offChange(onDataChange);
          handle.stop();
        }
      };
    };

    return {
      track: function track(tracker) {
        var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        trackers.push(tracker(store.dispatch, autorun, props));
      },
      dispose: function dispose() {
        trackers.forEach(function (t) {
          return t.stop();
        });
        trackers = [];
      }
    };
  };
}