'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTrackerManagerCreator;

var _tracker = require('meteor/tracker');

function createTrackerManagerCreator(store) {
  // Check store for a valid shape
  if (!store.subscribe || !store.dispatch || !store.getState) {
    return false;
  }

  return function () {
    var trackers = [];

    return {
      track: function track(tracker) {
        var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        trackers.push(tracker(store.dispatch, _tracker.Tracker.autorun, props));
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