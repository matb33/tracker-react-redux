import connectTrackerReduxNative from './connectTrackerReduxNative'
import createTrackerReduxContainer from './createTrackerReduxContainer'

export default createTrackerReduxContainer.bind(undefined, connectTrackerReduxNative)
