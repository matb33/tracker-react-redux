import createTrackerManagerCreator from './createTrackerManagerCreator'
import connect from './connect'

export { createTrackerManagerCreator }

export default connect.bind(undefined, createTrackerManagerCreator)
