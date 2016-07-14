import { Tracker } from 'meteor/tracker'

export default function connectTrackerRedux (store) {
  // Check store for a valid shape
  if (!store.subscribe || !store.dispatch || !store.getState) {
    return false
  }

  return () => {
    let trackers = []

    return {
      track: (tracker, props = {}) => {
        trackers.push(tracker(store.dispatch, Tracker.autorun, props))
      },
      dispose: () => {
        trackers.forEach((t) => t.stop())
        trackers = []
      }
    }
  }
}
