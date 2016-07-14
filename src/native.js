import connectTrackerReduxNative from './connectTrackerReduxNative'
import createTrackerReduxContainer from './createTrackerReduxContainer'

export { connectTrackerReduxNative }

export default createTrackerReduxContainer.bind(undefined, connectTrackerReduxNative)
