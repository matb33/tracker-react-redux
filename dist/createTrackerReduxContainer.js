'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = createTrackerReduxContainer;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function createTrackerReduxContainer(connectTrackerRedux, WrappedComponent) {
  var trackersFn = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  var displayName = 'createTrackerReduxContainer(' + getDisplayName(WrappedComponent) + ')';

  return function (_WrappedComponent) {
    _inherits(TrackerReduxContainer, _WrappedComponent);

    function TrackerReduxContainer(props, context) {
      _classCallCheck(this, TrackerReduxContainer);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TrackerReduxContainer).call(this, props, context));

      _this.store = props.store || context.store;

      if (!_this.store) {
        if (typeof console !== 'undefined') {
          console.warn('Could not find "store" in either the context or ' + 'props of "' + displayName + '". ' + 'Either wrap the root component in a <Provider>, ' + 'or explicitly pass "store" as a prop to "' + displayName + '".');
        }
      }
      return _this;
    }

    _createClass(TrackerReduxContainer, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        _get(Object.getPrototypeOf(TrackerReduxContainer.prototype), 'componentWillMount', this) && _get(Object.getPrototypeOf(TrackerReduxContainer.prototype), 'componentWillMount', this).call(this);

        var createTrackerRedux = connectTrackerRedux(this.store);

        if (createTrackerRedux) {
          this.trackerRedux = createTrackerRedux();
          trackersFn && trackersFn(this.trackerRedux, this.props);
        }
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(newProps) {
        _get(Object.getPrototypeOf(TrackerReduxContainer.prototype), 'componentWillReceiveProps', this) && _get(Object.getPrototypeOf(TrackerReduxContainer.prototype), 'componentWillReceiveProps', this).call(this, newProps);

        if (this.trackerRedux) {
          this.trackerRedux.dispose();
          trackersFn && trackersFn(this.trackerRedux, newProps);
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (this.trackerRedux) {
          this.trackerRedux.dispose();
        }

        _get(Object.getPrototypeOf(TrackerReduxContainer.prototype), 'componentWillUnmount', this) && _get(Object.getPrototypeOf(TrackerReduxContainer.prototype), 'componentWillUnmount', this).call(this);
      }
    }]);

    return TrackerReduxContainer;
  }(WrappedComponent);
}