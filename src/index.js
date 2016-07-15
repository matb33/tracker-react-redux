import createTrackerManagerCreator from './createTrackerManagerCreator'
import connect from './connect'

const boundConnect = connect.bind(undefined, createTrackerManagerCreator)

export { createTrackerManagerCreator }
export { boundConnect as connect }

export default boundConnect
