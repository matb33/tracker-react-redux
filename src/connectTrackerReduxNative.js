import { getData, Tracker } from 'react-native-meteor'

export default function connectTrackerReduxNative (store) {
  // Check store for a valid shape
  if (!store.subscribe || !store.dispatch || !store.getState) {
    return false
  }

  return () => {
    let trackers = []

    let autorun = (fn) => {
      let dep = new Tracker.Dependency()
      let data = getData()
      let onDataChange = () => dep.changed()

      data.onChange(onDataChange)

      let handle = Tracker.autorun((h) => {
        dep.depend()
        fn(h)
      })

      return {
        stop: () => {
          data.offChange(onDataChange)
          handle.stop()
        }
      }
    }

    return {
      track: (tracker, props = {}) => {
        trackers.push(tracker(store.dispatch, autorun, props))
      },
      dispose: () => {
        trackers.forEach((t) => t.stop())
        trackers = []
      }
    }
  }
}
