import connectTrackerRedux from './connectTrackerRedux'
import createTrackerReduxContainer from './createTrackerReduxContainer'

export default createTrackerReduxContainer.bind(undefined, connectTrackerRedux)
