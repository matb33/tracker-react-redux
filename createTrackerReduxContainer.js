function getDisplayName (WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export default function createTrackerReduxContainer (connectTrackerRedux, WrappedComponent, trackersFn = null) {
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

      let createTrackerRedux = connectTrackerRedux(this.store)

      if (createTrackerRedux) {
        this.trackerRedux = createTrackerRedux()
        trackersFn && trackersFn(this.trackerRedux, this.props)
      }
    }
    componentWillReceiveProps (newProps) {
      super.componentWillReceiveProps && super.componentWillReceiveProps(newProps)

      if (this.trackerRedux) {
        this.trackerRedux.dispose()
        trackersFn && trackersFn(this.trackerRedux, newProps)
      }
    }
    componentWillUnmount () {
      if (this.trackerRedux) {
        this.trackerRedux.dispose()
      }

      super.componentWillUnmount && super.componentWillUnmount()
    }
  }
}
