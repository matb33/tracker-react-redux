# Tracker React Redux

Use [React Redux](https://github.com/reactjs/react-redux) with Meteor [Tracker](http://docs.meteor.com/api/tracker.html). [React Native Meteor](https://github.com/inProgress-team/react-native-meteor) is also supported.

## Installation

```
npm install --save tracker-react-redux
```

## Usage

The main concept introduced by Tracker React Redux is that of *trackers*.

Similarly to how you have `reducers/` and `actions/`, you now have `trackers/`.
Each "tracker" is reponsible for returning a handle with a `stop` method.

If you happen to use the [ducks pattern](https://github.com/erikras/ducks-modular-redux), you can place your related trackers at the bottom of each duck file.

### Example:

Note that not all files referenced throughout the example are displayed.

#### index.js
```
import React from 'react'
import { render } from 'react-dom'
import { Meteor } from 'meteor/meteor'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import * as reducers from '../../ducks'

import App from './containers/App'
import Dashboard from './containers/Dashboard'
import AdminUserList from './containers/WidgetList'
import AdminUserEdit from './containers/WidgetEdit'
import NotFound from './components/NotFound'

reducers.routing = routerReducer

const store = createStore(combineReducers(reducers))
const history = syncHistoryWithStore(browserHistory, store)

const Root = React.createClass({
  render () {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path='/' component={App}>
            <IndexRoute component={Dashboard} />
            <Route path='/widgetlist'>
              <IndexRoute component={WidgetList} />
              <Route path='/widgetedit' component={WidgetEdit} />
              <Route path='/widgetedit/:userId' component={WidgetEdit} />
            </Route>
          </Route>
          <Route path='*' component={NotFound} />
        </Router>
      </Provider>
    )
  }
})

Meteor.startup(() => {
  render(React.createElement(Root), document.getElementById('app'))
})
```

#### ./ducks/index.js
```
export { default as widgets } from './widgets'
```

#### ./ducks/widgets.js
```
import { Meteor } from 'meteor/meteor'
import { Widgets } from './collections'

const SET_WIDGET_LIST = 'app/widgets/SET_WIDGET_LIST'
const SET_WIDGET = 'app/widgets/SET_WIDGET'

// -----------------------------------------------------------------------------

const defaultState = {
  widgetList: null,
  widget: null
}

// reducers

export default function reducer (state = defaultState, action = {}) {
  switch (action.type) {
    case SET_WIDGET_LIST:
      return Object.assign({}, state, { widgetList: action.widgetList })
    case SET_WIDGET:
      return Object.assign({}, state, { widget: action.widget })
    default:
      return state
  }
}

// actions

export function setWidgetList (value) {
  return {
    type: SET_WIDGET_LIST,
    widgetList: value
  }
}

export function setWidget (value) {
  return {
    type: SET_WIDGET,
    widget: value
  }
}

// trackers

export function trackMeteorMemberUsers (dispatch, autorun) {
  let run
  let sub = Meteor.subscribe('widget-list', () => {
    run = autorun(() => {
      let widgetList = Widgets.find().fetch()
      dispatch(setWidgetList(widgetList))
    })
  })

  return {
    stop: () => {
      sub && sub.stop()
      run && run.stop()
    }
  }
}

export function trackWidget (dispatch, autorun, props) {
  let run
  let sub = Meteor.subscribe('widget', props.widgetId, () => {
    run = autorun(() => {
      let widget = props.widgetId && Widgets.findOne({_id: props.widgetId})
      dispatch(setWidget(widget))
    })
  })

  return {
    stop: () => {
      dispatch(setWidget(defaultState.widget))
      sub && sub.stop()
      run && run.stop()
    }
  }
}
```

#### ./containers/WidgetList.js
```
import { connect } from 'tracker-react-redux'
import WidgetListComponent from '../components/WidgetList'
import { trackWidgetList } from '../ducks/meteor'

const tracking = (track, props) => {
  track(trackWidgetList)
}

const mapStateToProps = (state) => {
  return {
    widgetList: state.widgets.widgetList || [],
    isLoading: state.widgets.widgetList === null
  }
}

export default connect(tracking, mapStateToProps)(WidgetListComponent)
```

#### ./components/WidgetList.js
```
import React from 'react'
import Spinner from 'react-spinner'
import { Link } from 'react-router'
import { _ } from 'meteor/underscore'

const Widgets = React.createClass({
  propTypes: {
    widgetList: React.PropTypes.array.isRequired,
    isLoading: React.PropTypes.bool.isRequired
  },

  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.isLoading !== nextProps.isLoading) return true
    if (!_.isEqual(this.props.widgetList, nextProps.widgetList)) return true
    return false
  },

  render () {
    return (
      <div>
        {this.props.isLoading ? <Spinner /> : (
          <table className='table'>
            <thead>
              <tr>
                <th>Widget Name</th>
                <th width='1'></th>
              </tr>
            </thead>
            <tbody>
              {this.props.widgetList.map((widget) => {
                return (
                  <tr key={widget._id}>
                    <td>{widget.name}</td>
                    <td><Link to={'/widgetedit/' + widget._id}>Edit</Link></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        <hr />
        <Link to='/widgetedit'>New Widget</Link>
      </div>
    )
  }
})

export default WidgetList
```

### ./containers/WidgetEdit.js
```
import { connect } from 'tracker-react-redux'
import { Meteor } from 'meteor/meteor'
import WidgetEditComponent from '../components/WidgetEdit'
import { trackWidget, setWidget } from '../ducks/widgets'

const tracking = (track, props) => {
  track(trackWidget, {widgetId: props.params.widgetId})
}

const mapStateToProps = (state) => {
  return {
    widget: state.widgets.widget || {},
    isLoading: state.widgets.widget === null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    commitWidget: (widgetId, name, callback) => {
      let isCreating = !widgetId

      if (isCreating) {
        Meteor.call('createWidget', name, (err, result) => {
          !err && dispatch(setWidget(result))
          callback(err, result)
        })
      } else {
        Meteor.call('updateWidget', widgetId, name, (err, result) => {
          !err && dispatch(setWidget(result))
          callback(err, result)
        })
      }
    },
    deleteWidget: (widgetId, callback) => {
      Meteor.call('deleteWidget', widgetId, (err, result) => {
        callback(err, result)
      })
    }
  }
}

export default connect(tracking, mapStateToProps, mapDispatchToProps)(WidgetEditComponent)
```

### ./components/WidgetEdit.js
```
import React from 'react'
import Spinner from 'react-spinner'
import { browserHistory } from 'react-router'
import { _ } from 'meteor/underscore'

const WidgetEdit = React.createClass({
  propTypes: {
    widget: React.PropTypes.object.isRequired,
    isLoading: React.PropTypes.bool.isRequired,
    commitWidget: React.PropTypes.func.isRequired,
    deleteWidget: React.PropTypes.func.isRequired
  },

  getInitialState () {
    return {
      err: null,
      widgetSame: true,
      committing: false
    }
  },

  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.isLoading !== nextProps.isLoading) return true
    if (this.state.widgetSame !== nextState.widgetSame) return true
    if (this.state.committing !== nextState.committing) return true
    if (!_.isEqual(this.props.widget, nextProps.widget)) return true
    if (!_.isEqual(this.state.err, nextState.err)) return true
    return false
  },

  componentDidUpdate () {
    this.onAnyFieldChange()
  },

  isCreating () {
    return _.isEmpty(this.props.widget)
  },

  onSaveButtonClick () {
    var isCreating = this.isCreating()

    if (!this.state.widgetSame) {
      this.setState({committing: true})
      this.props.commitWidget(
        isCreating ? null : this.props.widget._id,
        this.widgetNameNode.value,
        (err, result) => {
          this.setState({committing: false})
          this.handleCommitCallback(err, result, isCreating)
        }
      )
    }
  },

  onDeleteButtonClick () {
    if (window.confirm('Are you sure?')) {
      this.setState({committing: true})
      this.props.deleteWidget(this.props.widget._id, (err, result) => {
        this.setState({committing: false})
        if (err) {
          this.setState({err: err})
        } else {
          browserHistory.push('/widgetlist')
        }
      })
    }
  },

  onAnyFieldChange () {
    this.setState({
      widgetSame: (
        this.widgetNameNode && (this.widgetNameNode.value === this.props.widget.name)
      )
    })
  },

  allFieldsSame () {
    return (
      this.state.widgetSame
    )
  },

  handleCommitCallback (err, result, wasCreating) {
    if (err) {
      return this.setState({err: err})
    }

    this.onAnyFieldChange()

    if (wasCreating) {
      browserHistory.push('/widgetlist')
    }
  },

  renderErrorMessage () {
    if (this.state.err) {
      return (
        <div>
          <pre>{JSON.stringify(this.state.err)}</pre>
          <button type='button' onClick={() => this.setState({err: null})}>OK</button>
        </div>
      )
    }
  },

  render () {
    const isCreating = this.isCreating()
    const isLoading = this.props.isLoading

    let heading
    let saveButton
    let deleteButton

    let saveButtonDisabled = (this.allFieldsSame() || this.state.committing)
    let deleteButtonDisabled = this.state.committing

    if (isLoading) {
      heading = '\u00a0'
    } else if (isCreating) {
      heading = 'New Widget'
      saveButton = <button type='button' onClick={this.onSaveButtonClick} disabled={saveButtonDisabled}>Create new widget</button>
    } else {
      heading = 'Edit Widget: ' + this.props.widget.name
      saveButton = <button type='button' onClick={this.onSaveButtonClick} disabled={saveButtonDisabled}>Update widget</button>
      deleteButton = <button type='button' onClick={this.onDeleteButtonClick} disabled={deleteButtonDisabled}>Delete widget</button>
    }

    return (
      <div>
        <h1>{heading}</h1>
        <form>
          <div className='form-group'>
            <label>Widget Name:</label>
            {isLoading ? <Spinner /> : (
              <input
                ref={(ref) => (this.widgetNameNode = ref)}
                onKeyUp={this.onAnyFieldChange}
                defaultValue={this.props.widget.name}
                type='text'
              />
            )}
          </div>
          <hr />
          {saveButton} {deleteButton}
        </form>
        {this.renderErrorMessage()}
      </div>
    )
  }
})

export default WidgetEdit
```

## React Native

Special handling is necessary for the [React Native Meteor](https://github.com/inProgress-team/react-native-meteor) library due to how it handles reactivity. The methods exposed by React Native Meteor are not truly reactive. Reactivity is accomplished by invalidating all active `createContainer` and `getMeteorData` functions with a single Dependency, invalidated for any and all DDP traffic received.

We've normalized around this by depending on this same DDP data dependency. The only thing you need to do differently is to add `/native` to then end of your import statement. For example:

```
import { connect } from 'tracker-react-redux/native'
```

## License

MIT