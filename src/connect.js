import { connect } from 'react-redux'

function getDisplayName (WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

function createTrackerReduxContainer (createTrackerManagerCreator, WrappedComponent, trackersFn = null) {
  const displayName = `createTrackerReduxContainer(${getDisplayName(WrappedComponent)})`

  return class TrackerReduxContainer extends WrappedComponent {
    constructor (props, context) {
      super(props, context)

      this.store = props.store || context.store

      if (!this.store) {
        if (typeof console !== 'undefined') {
          console.warn(
            'Could not find "store" in either the context or ' +
            'props of "' + displayName + '". ' +
            'Either wrap the root component in a <Provider>, ' +
            'or explicitly pass "store" as a prop to "' + displayName + '".'
          )
        }
      }
    }
    componentWillMount () {
      super.componentWillMount && super.componentWillMount()

      let createTrackerManager = createTrackerManagerCreator(this.store)

      if (createTrackerManager) {
        this.trackerManager = createTrackerManager()
        trackersFn && trackersFn(this.trackerManager.track, this.props)
      }
    }
    componentWillReceiveProps (newProps) {
      super.componentWillReceiveProps && super.componentWillReceiveProps(newProps)

      if (this.trackerManager) {
        this.trackerManager.dispose()
        trackersFn && trackersFn(this.trackerManager.track, newProps)
      }
    }
    componentWillUnmount () {
      if (this.trackerManager) {
        this.trackerManager.dispose()
      }

      super.componentWillUnmount && super.componentWillUnmount()
    }
  }
}

export default function (createTrackerManagerCreator, trackersFn, mapStateToProps, mapDispatchToProps, mergeProps, options = {}) {
  return function (WrappedComponent) {
    return createTrackerReduxContainer(
      createTrackerManagerCreator,
      connect(mapStateToProps, mapDispatchToProps, mergeProps, options)(WrappedComponent),
      trackersFn
    )
  }
}
