import connectTrackerRedux from './connectTrackerRedux'
import createTrackerReduxContainer from './createTrackerReduxContainer'

export { connectTrackerRedux }

export default createTrackerReduxContainer.bind(undefined, connectTrackerRedux)
