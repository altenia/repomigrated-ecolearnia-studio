require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/*
 * This file is part of the EcoLearnia platform.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes logger class.
 *
 *
 * @author Young Suk Ahn Park
 * @date 6/02/15
 */

'use strict';

var internals = {};

internals.logRegistry = {};

internals.console = global.console = global.console || {};

// From http://stackoverflow.com/questions/3326650/console-is-undefined-error-for-internet-explorer
(function () {
    var method;
    var noop = function noop() {};
    var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
    var length = methods.length;

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!internals.console[method]) {
            internals.console[method] = noop;
        }
    }
})();

internals.level = {
    'trace': 10,
    'debug': 20,
    'info': 30,
    'warn': 40,
    'error': 50,
    'fatal': 60
};

/**
 * @class Log
 *
 * @module common
 *
 * @classdesc
 *  Log class that handles the logging.
 *  Currently it is a thin wrapper around the windows.console
 *
 * @param {string} name - the log name
 * @param {number} level - the level to which
 */
internals.Log = function (name, level) {
    this.name_ = name;
    this.levelThreshold_ = level || internals.level.info;
};

/**
 * Logs to specified level
 *
 * @param {number} level - the log level
 * @param {...} args  - the information to log
 */
internals.Log.prototype.log = function (level /* log parts */) {
    if (arguments.length < 2) {
        return;
    }

    if (typeof level === 'string') {
        level = internals.level[level];
    }

    if (level < this.levelThreshold_) {
        return;
    }

    var logParts = ['"name":"' + this.name_ + '"'];
    logParts.push('"level":' + level);

    for (var argIdx = 1; argIdx < arguments.length; argIdx++) {
        if (typeof arguments[argIdx] === 'object') {
            // @todo - flattend first level properties
            logParts.push(JSON.stringify(arguments[argIdx]));
        } else if (typeof arguments[argIdx] === 'string') {
            logParts.push(arguments[argIdx]);
        }
    }

    var logText = '{' + logParts.join(', ') + '}';
    switch (level) {
        case 10:
            console.log(logText);
            break;
        case 20:
            console.log(logText);
            break;
        case 30:
            console.info(logText);
            break;
        case 40:
            console.warn(logText);
            break;
        case 50:
            console.error(logText);
            break;
        case 60:
            console.error(logText);
            break;
        default:
            console.log(logText);
    }
};

/**
 * Trace log
 */
internals.Log.prototype.trace = function (args) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(internals.level.trace);
    this.log.apply(this, arguments);
};

/**
 * Debug log
 */
internals.Log.prototype.debug = function (args) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(internals.level.debug);
    this.log.apply(this, args);
};

/**
 * Info log
 */
internals.Log.prototype.info = function (args) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(internals.level.info);
    this.log.apply(this, args);
};

/**
 * Warn log
 */
internals.Log.prototype.warn = function (args) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(internals.level.warn);
    this.log.apply(this, args);
};

/**
 * Error log
 */
internals.Log.prototype.error = function (args) {
    var args = Array.prototype.slice.call(arguments);
    arguments.unshift(internals.level.error);
    this.log.apply(this, args);
};

/**
 * fatal
 * @param args
 */
internals.Log.prototype.fatal = function (args) {
    var args = Array.prototype.slice.call(arguments);
    arguments.unshift(internals.level.fatal);
    this.log.apply(this, args);
};

/**
 * Logger factory function
 *
 * @param {string} name - The logger of given name
 * @returns {Log}
 */
internals.getLogger = function (name) {
    if (!(name in internals.logRegistry)) {
        internals.logRegistry[name] = new internals.Log(name);
    }
    return internals.logRegistry[name];
};

module.exports.getLogger = internals.getLogger;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){

/**
 * Polyfil
 * @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
 */
'use strict';

if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

},{}],3:[function(require,module,exports){
/*
 * This file is part of the EcoLearnia platform.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes promise factory function.
 *  The createPromise() function provides abstraction to the promise implementation.
 *
 *  Usage example:
 *  var promise = promiseutils.createPromise(function(resolve, reject) {
 *      resolve(successObj);
 *      ...
 *      reject(errorObj);
 *  }.bind(this));
 *  return promise;
 *
 * @author Young Suk Ahn Park
 * @date 6/02/15
 */

// Declare internals namespace
'use strict';

var internals = {};

var Bluebird = require('bluebird');
internals.createBluebirdPromise = function (func) {
    return new Bluebird(func);
};

/*
var when = require('when');
internals.createWhenPromise = function(func)
{
    return when.promise(func);
};

var Promise = require('promise');
internals.createSimplePromise = function(func)
{
    return new Promise(func);
};
*/

module.exports.createPromise = internals.createBluebirdPromise;

module.exports.props = Bluebird.props;

},{"bluebird":"bluebird"}],4:[function(require,module,exports){
/*
 * This file is part of the EcoLearnia platform.
 *
 * (c) Young Suk Ahn Park <ys.ahnpark@mathnia.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

var Events = require('ampersand-events');

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of PubSub class.
 *
 * @author Young Suk Ahn Park
 * @date 5/13/15
 */

var internals = {};

/**
 * @class SubPub
 *
 * @module interactives/core
 *
 * @classdesc
 *  PubSub, the message bus.
 *  It wraps a third party subpub library.
 *
 * @todo - Implement!
 *
 * @constructor
 */
internals.PubSub = function (settings) {
  // Using Backbone's event
  this.pubSub = Events.createEmitter();
};

/**
 * Add subscription
 *
 * @param {string} topic
 * @param {function} handler
 */
internals.PubSub.prototype.subscribe = function (topic, handler) {
  this.pubSub.on(topic, handler);
};

/**
 * Removes subscription
 *
 * @param {string} topic
 * @param {function} handler
 */
internals.PubSub.prototype.unsubscribe = function (topic, handler) {
  this.pubSub.off(topic, handler);
};

/**
 * Publish message
 *
 * @param {string} topic
 * @param {object} message
 */
internals.PubSub.prototype.publishRaw = function (topic, message) {
  this.pubSub.trigger(topic, message);
};

/**
 * Publish message
 *
 * @param {string} topic
 * @param {string} sourceItemId
 * @param {string} sourceComponent
 * @param {object} payload
 */
internals.PubSub.prototype.publish = function (topic, sourceItemId, sourceComponentId, type, payload) {
  var message = {
    timestamp: new Date(),
    source: {
      itemId: sourceItemId,
      componentId: sourceComponentId
    },
    type: type,
    payload: payload
  };
  this.publishRaw(topic, message);
};

module.exports.PubSub = internals.PubSub;

},{"ampersand-events":20}],5:[function(require,module,exports){
/*
 * This file is part of the EcoLearnia platform.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes utility functions.
 *
 * @author Young Suk Ahn Park
 * @date 5/15/15
 */

'use strict';

var internals = {};

/**
 * endsWith
 * Returns true if the str ends with the suffix, false otherwise.
 *
 * @param {string} str
 * @param {string} suffix
 */
module.exports.endsWith = function (str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

/**
 * startsWith
 * Returns true if the str starts with the prefix, false otherwise.
 *
 * @param {string} str
 * @param {string} prefix
 * @param {number} position
 */
module.exports.startsWith = function (str, prefix, position) {
    position = position || 0;
    return str.lastIndexOf(prefix, position) === position;
};

/**
 * Access an object using dot notation
 * When third parameter is provided, the function behaves as setter, otherwise behaves as getter
 *
 * Sample:
 *   utils.dotAccess(object, 'a.b.c', 'Hello World');
 *   var myval = utils.dotAccess(object, 'a.b.c');
 *   --> myval = 'Hello World'
 * source: http://stackoverflow.com/questions/6393943/convert-javascript-string-in-dot-notation-into-an-object-reference
 *
 * @param {object} obj  - The object to be accessed
 * @param {string} is  - The dot notation string
 * @param {*|undefined}  - if provided, this call is a setting call, otherwise getting call
 *
 * @return {*}   - The value
 */
module.exports.dotAccess = function (obj, is, value) {
    if (typeof is == 'string') return module.exports.dotAccess(obj, is.split('.'), value);else if (is.length == 1 && value !== undefined) return obj[is[0]] = value;else if (is.length == 0) return obj;else return module.exports.dotAccess(obj[is[0]], is.slice(1), value);
};

/**
 * dotPopulate
 */
module.exports.dotPopulate = function (obj, values) {
    for (var property in values) {
        if (values.hasOwnProperty(property)) {
            module['export'].dotAccess(obj, property, values[property]);
        }
    }
};

},{}],6:[function(require,module,exports){
/*
 * This file is part of the EcoLearnia platform.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of ActionBarComponent class.
 *
 * @author Young Suk Ahn Park <ys.ahnpark@mathnia.com>
 * @date 5/13/15
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var React = require('react/addons');
var EliReactComponent = require('./elireactcomponent').EliReactComponent;
var Events = require('../core/events').Events;

var internals = {};

/**
 * @class ActionBarComponent
 *
 * @module interactives/components
 *
 * @classdesc
 *  React based component that represents the action bar.
 *  An action bar is the the interactive which user use to trigger actions
 *  such as submitting, text to speech, requesting hint, navigating to related
 *  learning contents, etc.
 *
 * @todo - Implement!
 */

var ActionBarComponent = (function (_EliReactComponent) {
    function ActionBarComponent(props) {
        _classCallCheck(this, ActionBarComponent);

        _get(Object.getPrototypeOf(ActionBarComponent.prototype), 'constructor', this).call(this, props);
        //this.bind_('handleAction_');

        this.state = {
            submitted: false
        };
    }

    _inherits(ActionBarComponent, _EliReactComponent);

    _createClass(ActionBarComponent, [{
        key: 'handleAction_',
        value: function handleAction_(type, e) {
            // e.preventDefault();
            this.props.itemContext.pubsub.publish('action:' + type, this.itemAssociationId(), this.componentId(), type);
        }
    }, {
        key: 'renderItem_',
        value: function renderItem_(type) {
            var retval = null;
            if (type == 'tts') {
                retval = React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'a',
                        { onClick: this.handleAction_.bind(this, 'tts') },
                        'audio-icon'
                    )
                );
            }
            if (type == 'submit') {
                retval = React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'button',
                        { onClick: this.handleAction_.bind(this, 'submit') },
                        'Submit'
                    )
                );
            }
            if (type == 'reset') {
                retval = React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'a',
                        { onClick: this.handleAction_.bind(this, 'reset') },
                        'Reset'
                    )
                );
            }
            if (type == 'hint') {
                retval = React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'a',
                        { onClick: this.handleAction_.bind(this, 'hint') },
                        'Hint'
                    )
                );
            }
            return retval;
        }
    }, {
        key: 'render',
        value: function render() {
            var actionbarItems = this.props.config.items.map((function (item) {
                return React.createElement(
                    'li',
                    null,
                    this.renderItem_(item)
                );
            }).bind(this));

            // The "eli" prefix in the className stands for EcoLearnia Interactive
            return React.createElement(
                'div',
                { className: 'eli-actionbar' },
                React.createElement(
                    'ul',
                    null,
                    React.createElement(
                        'li',
                        { className: 'eli-actionbar-item' },
                        actionbarItems
                    )
                )
            );
        }
    }]);

    return ActionBarComponent;
})(EliReactComponent);

exports.ActionBarComponent = ActionBarComponent;
;

},{"../core/events":15,"./elireactcomponent":7,"react/addons":"react/addons"}],7:[function(require,module,exports){
/*
 * This file is part of the EcoLearnia platform.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of EliReactComponent abstract class.
 *
 * @author Young Suk Ahn Park
 * @date 5/15/15
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var React = require('react/addons');

var internals = {};

/**
 * @class EliReactComponent
 * @abstract
 *
 * @module interactives/components
 *
 * @classdesc
 *  Abstract class which all React-based EL-I components should extend.
 *
 */

var EliReactComponent = (function (_React$Component) {
  function EliReactComponent(props) {
    _classCallCheck(this, EliReactComponent);

    _get(Object.getPrototypeOf(EliReactComponent.prototype), 'constructor', this).call(this, props);

    this.itemAssociationId_ = props.itemAssociationId;
    this.componentId_ = props.componentId;
  }

  _inherits(EliReactComponent, _React$Component);

  return EliReactComponent;
})(React.Component);

exports.EliReactComponent = EliReactComponent;

/**
 * Binds each of the methods to the this context
 * @see http://www.newmediacampaigns.com/blog/refactoring-react-components-to-es6-classes
 */
EliReactComponent.prototype.bind_ = function () {
  var _this = this;

  for (var _len = arguments.length, methods = Array(_len), _key = 0; _key < _len; _key++) {
    methods[_key] = arguments[_key];
  }

  methods.forEach(function (method) {
    return _this[method] = _this[method].bind(_this);
  });
};

/**
 * Returns the ID of the item that this component pertains
 */
EliReactComponent.prototype.itemAssociationId = function () {
  return this.itemAssociationId_;
};

/**
 * Returns the ID of this component instance
 */
EliReactComponent.prototype.componentId = function () {
  return this.componentId_;
};

/**
 * Returns the kind of this component (react)
 * @returns {string}
 */
EliReactComponent.prototype.componentKind = function () {
  return 'react';
};

EliReactComponent.propTypes = {
  // Component ID
  componentId: React.PropTypes.object.isRequired,
  // Content Runtime Environment's context
  itemContext: React.PropTypes.object.isRequired,
  // Component's settings
  config: React.PropTypes.object.isRequired
};

},{"react/addons":"react/addons"}],8:[function(require,module,exports){
/*
 * This file is part of the EcoLearnia platform.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of EliViewComponent abstract class.
 *
 * @author Young Suk Ahn Park
 * @date 5/15/15
 */

'use strict';

var AmpersandView = require('ampersand-view');

var internals = {};

/**
 * @class EliViewComponent
 * @abstract
 *
 * @module interactives/components
 *
 * @classdesc
 *  Abstract class which all Backbone-based EL-I components should extend.
 *
 */
internals.EliViewComponent = AmpersandView.extend({

  props: {
    componentId: 'string',
    // Content Runtime Environment's context
    itemContext: 'object',
    // Component's settings
    config: 'object'
  },

  /**
   * Returns the type of this component (view)
   * @returns {string}
   */
  componentKind: function componentKind() {
    return 'view';
  }
});

module.exports.EliViewComponent = internals.EliViewComponent;

},{"ampersand-view":51}],9:[function(require,module,exports){
/*
 * This file is part of the EcoLearnia platform.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of FeedbackComponent class.
 *
 * @author Young Suk Ahn Park
 * @date 5/13/15
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var React = require('react/addons');
var EliReactComponent = require('./elireactcomponent').EliReactComponent;
var Events = require('../core/events').Events;

var internals = {};

/**
 * @class FeedbackComponent
 *
 * @module interactives/components
 *
 * @classdesc
 *  React based component that represents the feedback.
 *  The feedback component is where the feedback messages including hints are
 *  displayed upon specific action.
 *
 * @todo - Implement!
 */

var FeedbackComponent = (function (_EliReactComponent) {
    function FeedbackComponent(props) {
        _classCallCheck(this, FeedbackComponent);

        _get(Object.getPrototypeOf(FeedbackComponent.prototype), 'constructor', this).call(this, props);
        this.bind_('handleEvaluatedEvent_');

        this.state = {
            evaluation: {}
        };

        this.props.itemContext.pubsub.subscribe(Events.ANSWER_EVALUATED, this.handleEvaluatedEvent_.bind(this));
    }

    _inherits(FeedbackComponent, _EliReactComponent);

    _createClass(FeedbackComponent, [{
        key: 'handleEvaluatedEvent_',
        value: function handleEvaluatedEvent_(message) {
            if (message.source.itemId === this.itemAssociationId()) {
                this.setState({ evaluation: message.payload });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            // The "eli" prefix in the className stands for EcoLearnia Interactive
            var evalDump = JSON.stringify(this.state.evaluation);
            return React.createElement(
                'div',
                { className: 'eli-feedback' },
                evalDump
            );
        }
    }]);

    return FeedbackComponent;
})(EliReactComponent);

exports.FeedbackComponent = FeedbackComponent;

},{"../core/events":15,"./elireactcomponent":7,"react/addons":"react/addons"}],10:[function(require,module,exports){
/*
 * This file is part of the EcoLearnia platform.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of MultiValueQuestionComponent class.
 *
 * @author Young Suk Ahn Park
 * @date 6/02/15
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var React = require('react/addons');
var EliReactComponent = require('../elireactcomponent').EliReactComponent;
var Events = require('../../core/events').Events;

/**
 * @class QuestionComponent
 *
 * @module interactives/components/questions
 *
 * @classdesc
 *  React based abstract component that represents a question.
 *  A question has one or more input fields where user can enter answer.
 *  Input fields can be of any type, e.g. textbox, slider, dropdown, etc.
 *
 *
 * @todo - Submission handling: keep the state in models
 * @todo - Factor out the presenter: multiselect, multichoice, etc.
 */

var AbstractQuestionComponent = (function (_EliReactComponent) {
    function AbstractQuestionComponent(props) {
        _classCallCheck(this, AbstractQuestionComponent);

        _get(Object.getPrototypeOf(AbstractQuestionComponent.prototype), 'constructor', this).call(this, props);
        this.bind_('handleEvaluatedEvent_');

        this.props.itemContext.pubsub.subscribe(Events.ANSWER_EVALUATED, this.handleEvaluatedEvent_.bind(this));

        this.state = {
            evaluation: {}
        };
    }

    _inherits(AbstractQuestionComponent, _EliReactComponent);

    _createClass(AbstractQuestionComponent, [{
        key: 'handleEvaluatedEvent_',
        value: function handleEvaluatedEvent_(message) {
            if (message.source.itemId === this.itemAssociationId()) {}
        }
    }, {
        key: 'getOptionValue',

        /**
         * returns the option's value of a chosen field
         * @param question
         * @param fieldId
         * @param key
         * @returns {*}
         */
        value: function getOptionValue(question, fieldId, key) {
            var field = question.fields.find(function (element, index) {
                return element.id === fieldId;
            });
            if (!field) {
                return null;
            }
            var option = field.options.find(function (element, index) {
                return element.key === key;
            });
            return option.value;
        }
    }]);

    return AbstractQuestionComponent;
})(EliReactComponent);

exports.AbstractQuestionComponent = AbstractQuestionComponent;

// do something

},{"../../core/events":15,"../elireactcomponent":7,"react/addons":"react/addons"}],11:[function(require,module,exports){
/*
 * This file is part of the EcoLearnia platform.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of MultiValueQuestionComponent class.
 *
 * @author Young Suk Ahn Park
 * @date 5/13/15
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var React = require('react/addons');
var AbstractQuestionComponent = require('./question.jsx').AbstractQuestionComponent;

var internals = {};

/**
 * @class MultiValueQuestionComponent
 *
 * @module interactives/components/questions
 *
 * @classdesc
 *  React based component that represents a generic multiValue question.
 *  A multivalue quesions are those which the question can ask for multiple
 *  values.
 *  Therefore the submission has the structure of
 *  Object.<key: string, value: Object>
 *
 * @todo - Submission handling: keep the state in models
 * @todo - Factor out the presenter: multiselect, multichoice, etc.
 */

var SelectQuestionComponent = (function (_AbstractQuestionComponent) {
    /*
    propTypes: {
        // Content Runtime Environment's context
        itemContext: React.PropTypes.object.isRequired,
        // Content models
        contentModels: React.PropTypes.object.isRequired,
        // Component's settings
        config: React.PropTypes.object.isRequired
    },*/

    function SelectQuestionComponent(props) {
        _classCallCheck(this, SelectQuestionComponent);

        _get(Object.getPrototypeOf(SelectQuestionComponent.prototype), 'constructor', this).call(this, props);

        this.state = {
            submitted: false
        };

        this.bind_('handleChange_');
    }

    _inherits(SelectQuestionComponent, _AbstractQuestionComponent);

    _createClass(SelectQuestionComponent, [{
        key: 'handleChange_',
        value: function handleChange_(fieldId, key, e) {
            var checked = event.target.checked;
            var question = this.props.itemContext.getValue(this.props.config.question);

            if (checked) {
                var value = this.getOptionValue(question, fieldId, key);
                this.props.itemContext.answerModel.addStagedAnswer(fieldId, key, value);
            } else {
                this.props.itemContext.answerModel.removeStagedAnswer(fieldId, key);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            // Returns the object either from the config question value itself
            // Or from the reference to the model.
            var question = this.props.itemContext.getValue(this.props.config.question);

            var optionsSet = [];
            question.fields.forEach((function (element, index) {
                var options = element.options.map((function (option) {
                    return React.createElement(
                        'li',
                        { className: 'eli-question-option' },
                        React.createElement('input', { type: 'checkbox', name: element.id, onChange: this.handleChange_.bind(this, element.id, option.key), value: option.value }),
                        option.value
                    );
                }).bind(this));
                optionsSet.push(React.createElement(
                    'ul',
                    null,
                    options
                ));
            }).bind(this));

            // The "eli" prefix in the className stands for EcoLearnia Interactive
            return React.createElement(
                'div',
                { className: 'eli-question' },
                React.createElement(
                    'span',
                    { className: 'eli-question-prompt' },
                    question.prompt
                ),
                optionsSet
            );
        }
    }]);

    return SelectQuestionComponent;
})(AbstractQuestionComponent);

exports.SelectQuestionComponent = SelectQuestionComponent;

},{"./question.jsx":10,"react/addons":"react/addons"}],12:[function(require,module,exports){
/*
 * This file is part of the EcoLearnia platform.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of TemplateContainerComponent class.
 *
 * @author Young Suk Ahn Park
 * @date 5/13/15
 */
'use strict';

var EliViewComponent = require('./eliviewcomponent').EliViewComponent;

var internals = {};

internals['const'] = {
    // prefix for EcoLearnia Interactive Object, used at the data-hook attributes
    ID_PREFIX: 'elio_'
};

/**
 * @class TemplateContainerComponent
 *
 * @module interactives/components
 *
 * @classdesc
 *  React based component that represents a container component.
 *  Container component is a component that is composed of several other
 *  components.
 *  This particular implementation uses template where {{ <object.id> }} is
 *  replaced by the respective component or model value.
 *
 * @todo - Do validation/sanitization of the HTML tags in the template string.
 */
internals.TemplateContainerComponent = EliViewComponent.extend({

    /**
     * Map of key -> ELI object,
     * where keys are unique key generated by parseTemplate and ELI object is
     * the FQN of the object which could be a object in model or a component.
     *
     * Example:
     * {
     *   'elio_1': '.model.question.prompt',
     *   'elio_2': '.component.mvquestion'
     * }
     * @type {Object.<string, object>}
     */
    elios_: {},

    /*
    template: function(context) {
        return
    },*/

    initialize: function initialize(options) {
        this.itemContext = options.itemContext;
        this.contentModels = options.contentModels;
        this.config = options.config;
        this.template = this.parseTemplate(options.config.template);
    },

    render: function render() {
        this.renderWithTemplate(this);

        // For each of the placeholders (divs with data-hook)
        // Inject the object from the itemContext
        for (var key in this.elios_) {
            var objectFqn = this.elios_[key];
            var objectEl = this.queryByHook(key);
            var object = this.itemContext.resolveObject(objectFqn);

            if (object.type && object.type.prototype) {
                // is a component, render it in the el
                // @todo - Consider checking for object.type.prototype.componentType
                this.itemContext.renderComponent(object, objectEl);
            } else {
                // @todo - Is is OK to just set the textContext with stringified object?
                objectEl.textContent = object.toString();
            }
        }
        return this;
    },

    // Parses a template of format
    // "{{.comonents.mvquestion}} <br /> {{.models.question.prompt}}"
    parseTemplate: function parseTemplate(templateStr) {
        var re = new RegExp('{{\\s*[\\w.]*\\s*}}', 'g');

        var template = []; // Template broken into patterns

        var cursor = 0;
        var idx = 0;

        var match;
        while ((match = re.exec(templateStr)) != null) {
            idx++;
            if (cursor != match.index) {
                // Append the substring that is not part of the match
                template.push(templateStr.substring(cursor, match.index));
            }
            // Replace the matching pattern with a markup
            var elioId = internals['const'].ID_PREFIX + idx.toString();
            template.push('<div data-hook="' + elioId + '"></div>');
            // move forward the cursor to the tail of the matched pattern
            cursor = match.index + match[0].length;
            // index the pattern without the '{{' and '}}', and trim it
            this.elios_[elioId] = match[0].substring(2, match[0].length - 2).trim();
            //console.log("match " + match[0] + " found at " +   match.index);
        }
        // Append the rest of the text
        template.push(templateStr.substring(cursor));

        return template.join('');
    }
});

module.exports.TemplateContainerComponent = internals.TemplateContainerComponent;

},{"./eliviewcomponent":8}],13:[function(require,module,exports){
/*
 * This file is part of the EcoLearnia platform.
 *
 * (c) Young Suk Ahn Park <ys.ahnpark@mathnia.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of SubmissionHandler class.
 *
 * @author Young Suk Ahn Park
 * @date 6/02/15
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ = require('lodash');

var polyfills = require('../../common/polyfills');
var logger = require('../../common/logger');
var Events = require('./events').Events;

/**
 * @class AnswerModel
 *
 * @module interactives/core
 *
 * @classdesc
 *  Object of this class deals with student answer by:
 *  - saving the student answered fields to staging for submission
 *  - invoking the evaluator for the staged answer
 *
 */

var AnswerModel = (function () {
    function AnswerModel(settings) {
        _classCallCheck(this, AnswerModel);

        /**
         * The logger
         */
        this.logger_ = logger.getLogger('AnswerModel');

        this.itemContext = settings.itemContext;

        this.pubsub = settings.itemContext.pubsub;

        /**
         * Object that includes fields staged for submission
         * [
         *  {
         *      fieldId: (string),
         *      answered: { key: (string), value: (string) } | []
         *  }
         * ]
         *
         * @type {Object}
         * @private
         */
        this.staged_ = null;

        /**
         * Array of objects that represents submissions
         * @type {Array<Object>}
         * @private
         */
        this.history_ = null;

        /**
         * Maximum number of allowed attempts
         * @type {number}
         * @private
         */
        this.maxAttempts_ = this.itemContext.content_.policy.maxAttempts || 3;

        // initialize staged_ property by creating empty slots for the fields
        if (settings.definition.question && settings.definition.question.fields) {
            this.staged_ = [];
            settings.definition.question.fields.forEach((function (element, index) {
                this.staged_.push({ fieldId: element.id });
            }).bind(this));

            this.history_ = settings.submissions || [];
        }

        /**
         * For elapsed time (time-on-task) calculation
         * @type {Date}
         * @private
         */
        this.taskStartTime_ = new Date();

        // Subscribe to the submission action event
        this.pubsub.subscribe(Events.ACTION_SUBMIT, this.handleSubmitEvent_.bind(this));

        // Subscribe to the evaluated event
        this.pubsub.subscribe(Events.ANSWER_EVALUATED, this.handleEvaluatedEvent_.bind(this));

        this.logger_.info({
            maxAttempts: this.maxAttempts_,
            taskStartTime: this.taskStartTime_
        }, 'SubmissionHandler constructed');
    }

    _createClass(AnswerModel, [{
        key: 'addStagedAnswer',

        /**
         * Add field answers to staging.
         *
         * The answeredKey is applicable for inputs which has association key,
         * E.g. select.
         *
         * @param fieldId       - the id of the field
         * @param answeredKey   - the key that student answered.
         * @param answeredValue - the value that student answered.
         */
        value: function addStagedAnswer(fieldId, answeredKey, answeredValue) {
            if (this.staged_ === null) {
                throw new Error('Model does not contain a question description');
            }

            var field = this.getStagedField(fieldId);
            // @todo - Make it an array to accomodate multiple answers
            field.answered = {
                key: answeredKey,
                value: answeredValue
            };

            return field;
        }
    }, {
        key: 'removeStagedAnswer',

        /**
         * Remove field answers from staging.
         *
         * @param fieldId
         * @param answeredKey
         * @returns {*}
         */
        value: function removeStagedAnswer(fieldId, answeredKey) {
            if (this.staged_ === null) {
                throw new Error('Model does not contain a question description');
            }

            var field = this.getStagedField(fieldId);
            if (field.answered.key == answeredKey)

                // @todo - Make it an array to accomodate multiple answers
                field.answered = null;

            return field;
        }
    }, {
        key: 'getStagedFields',

        /**
         * Gets the staged fields
         *
         * @returns {Array<{fieldId: (string|number), answeredKey: (string|number), answeredValue: (string|number)
         *
         */
        value: function getStagedFields() {
            return this.staged_;
        }
    }, {
        key: 'getStagedField',
        value: function getStagedField(id) {
            var field = this.staged_.find(function (element, index) {
                return element.fieldId === id;
            });
            return field;
        }
    }, {
        key: 'getNumAttempted',

        /**
         * Number of times the learner has attempted so far
         * @returns {number}
         */
        value: function getNumAttempted() {
            return this.history_.length;
        }
    }, {
        key: 'handleSubmitEvent_',

        /**
         *
         */
        value: function handleSubmitEvent_(message) {
            var itemId = message.source.itemId;

            if (this.getNumAttempted() >= this.maxAttempts_) {
                reject('NoMoreAllowedAttempts');
            }
            var timestamp = new Date();
            var payload = {
                fields: _.clone(this.getStagedFields(), true),
                timeSpent: (timestamp - this.taskStartTime_) * 1000 // in seconds
            };
            this.pubsub.publish(Events.ANSWER_EVALUATE, this.itemContext.getAssociationId(), 'answerModel', 'answer', payload);
        }
    }, {
        key: 'handleEvaluatedEvent_',
        value: function handleEvaluatedEvent_(message) {
            var payload = message.payload;
            var submissionEntry = {
                timestamp: new Date().toISOString(),
                timeSpent: payload.timeSpent,
                score: payload.score,
                fields: payload.fields, // fields with feedback
                feedback: payload.overallFeedback
            };
            this.history_.push(submissionEntry);
            // Reset task start time
            this.taskStartTime_ = new Date();
        }
    }]);

    return AnswerModel;
})();

exports.AnswerModel = AnswerModel;

},{"../../common/logger":1,"../../common/polyfills":2,"./events":15,"lodash":"lodash"}],14:[function(require,module,exports){
/*
 * This file is part of the EcoLearnia platform.
 *
 * (c) Young Suk Ahn Park <ys.ahnpark@mathnia.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of SubmissionHandler class.
 *
 * @author Young Suk Ahn Park
 * @date 6/02/15
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ = require('lodash');

var logger = require('../../common/logger');
var promiseutils = require('../../common/promiseutils');
var Events = require('./events').Events;

/**
 * @typedef {{
 *      fieldId: (number),
 *      answered: {
 *          key: (string | number),
 *          value: (string | number)
 *      }
 *      ?correctness: (number),  Applicable for evaluated response
 *      ?feedback: (string)
 * }} core.AnswerField
 *
 */

/**
 * @typedef {{
 *      timeSpent: (number),
 *      fields: (Array<core.AnswerField>)
 *
 *      ?score: (number),
 *      ?overallFeedback: (string)
 * }} core.AnswerSubmission
 *
 */

/**
 * @class Evaluator
 *
 * @module interactives/core
 *
 * @classdesc
 *  An object of this class is handles the submission data by:
 *  - saving the question field data to staging for submission
 *  - evaluating the submission using remote service
 *  - constraining submission based on policy
 *
 */

var LocalEvaluator = (function () {
    function LocalEvaluator(settings) {
        _classCallCheck(this, LocalEvaluator);

        /**
         * The logger
         */
        this.logger_ = logger.getLogger('Evaluator');

        this.pubsub = settings.pubsub;

        /**
         * Evaluation engines
         * @type {{}}
         * @private
         */
        this.engines_ = {};

        /**
         * evalRule
         * @type {{}}
         * @private
         */
        this.rules_ = {};

        // Subscribe to the submission action event
        this.pubsub.subscribe(Events.ANSWER_EVALUATE, this.handleEvaluateEvent_.bind(this));
    }

    _createClass(LocalEvaluator, [{
        key: 'registerEngine',

        /**
         * Register an evaluator engine
         * @param name
         * @param engine
         */
        value: function registerEngine(engine) {
            this.engines_[engine.name] = engine;
        }
    }, {
        key: 'registerItem',

        /**
         * Register rules per item
         * Applicable for in-memory evaluation (e.g. non remote)
         *
         * @param {string} itemId
         * @param {Object} rule
         */
        value: function registerItem(itemContext) {
            var itemId = itemContext.getAssociationId();
            var rule = itemContext.getContent().evalRule;
            this.rules_[itemId] = rule;
        }
    }, {
        key: 'retrieveRule',

        /**
         * Retrieves a rule
         * @param itemId
         * @returns {Promise}
         */
        value: function retrieveRule(itemId) {
            var promise = promiseutils.createPromise((function (resolve, reject) {
                if (itemId in this.rules_) {
                    resolve(this.rules_[itemId]);
                } else {
                    reject({ error: 'Eval rule for item ' + itemId + ' not found.' });
                }
            }).bind(this));

            return promise;
        }
    }, {
        key: 'evaluate',

        /**
         * Submits the staged for evaluation
         *
         * @param {string} itemId
         * @param {core.AnswerSubmission} payload
         *
         * @return {Promise}
         *      On Success: (core.AnswerSubmission)
         */
        value: function evaluate(itemId, payload) {
            var promise = promiseutils.createPromise((function (resolve, reject) {

                // @todo - make rest call to the evaluatorUrl_
                // For remote call
                var evalArgs = {
                    submissionContext: {
                        itemId: itemId
                    },
                    fields: payload.fields
                };

                // Local evaluation:
                this.retrieveRule(itemId).then((function (rule) {

                    this.evaluateFields_(rule, payload.fields).then((function (result) {
                        // Retuning
                        var returnMessage = {
                            timeSpent: payload.timeSpent,
                            fields: result,
                            score: 0.5, // @todo
                            overallFeedback: '' // @todo
                        };
                        resolve(returnMessage);
                    }).bind(this))['catch'](function (error) {
                        reject(error);
                    });
                }).bind(this))['catch'](function (error) {
                    reject(error);
                })['finally']((function () {
                    this.logger_.info('LocalEvaluator.evaluate():completed');
                }).bind(this));
            }).bind(this));

            return promise;
        }
    }, {
        key: 'evaluateFields_',

        /**
         * Evaluate all fields in the submitted answer
         *
         * @param {Object} rule
         * @param {Object} answer
         *
         * @returns {Promise}
         *      On Succss: (Array<core.AnswerField>)
         */
        value: function evaluateFields_(rule, answer) {
            var promises = {};

            answer.forEach((function (answeredField) {
                var fieldRule = rule.fieldRules[answeredField.fieldId];

                promises[answeredField.fieldId] = this.engines_[fieldRule.engine].evaluate(fieldRule, answeredField.answered);
            }).bind(this));

            var promise = promiseutils.createPromise((function (resolve, reject) {

                promiseutils.props(promises).then((function (result) {
                    var response = [];

                    answer.forEach(function (answeredField) {
                        // To the same answer structure, add  the correctness and feedback properties
                        var responseEntry = _.clone(answeredField, true);

                        responseEntry.correctness = result[answeredField.fieldId];
                        if (responseEntry.correctness) {
                            responseEntry.feedback = 'correct';
                        } else {
                            responseEntry.feedback = 'incorrect';
                        }
                        response.push(responseEntry);
                    }, this);

                    resolve(response);
                }).bind(this))['catch'](function (error) {
                    reject(error);
                });
            }).bind(this));

            return promise;
        }
    }, {
        key: 'handleEvaluateEvent_',

        /**
         * PubSub Event subscription handler
         *
         * @param message
         * @private
         */
        value: function handleEvaluateEvent_(message) {
            var itemId = message.source.itemId;
            this.evaluate(itemId, message.payload).then((function (result) {
                this.pubsub.publish(Events.ANSWER_EVALUATED, itemId, 'evaluator', 'evaluation', result);
                this.logger_.info({ itemId: itemId }, 'Evaluation:published');
            }).bind(this))['catch']((function (error) {
                this.logger_.info({ itemId: itemId, error: error }, 'Evaluation:error');
            }).bind(this));
        }
    }]);

    return LocalEvaluator;
})();

exports.LocalEvaluator = LocalEvaluator;

/** @type core.AnswerSubmission */

},{"../../common/logger":1,"../../common/promiseutils":3,"./events":15,"lodash":"lodash"}],15:[function(require,module,exports){
/*
 * This file is part of the EcoLearnia platform.
 *
 * (c) Young Suk Ahn Park <ys.ahnpark@mathnia.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of Event constants.
 *
 * @author Young Suk Ahn Park
 * @date 6/06/15
 */

'use strict';

var Events = {
  // When user clicks 'submit' button
  ACTION_SUBMIT: 'action:submit',
  // When AnswerModel request evaluation
  ANSWER_EVALUATE: 'answer:evaluate',
  // WHen Evaluator completed evaluation
  ANSWER_EVALUATED: 'answer:evaluated'
};

module.exports.Events = Events;

},{}],16:[function(require,module,exports){
(function (global){
/*
 * This file is part of the EcoLearnia platform.
 *
 * (c) Young Suk Ahn Park <ys.ahnpark@mathnia.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of ItemContext class.
 *
 * @author Young Suk Ahn Park
 * @date 5/13/15
 */

'use strict';

var _ = require('lodash');
var React = require('react/addons');

var utils = require('../../common/utils');
var logger = require('../../common/logger');
var SubPub = require('./../../common/pubsub');

var AnswerModel = require('./answermodel').AnswerModel;

var internals = {};

/**
 * @class ItemContext
 *
 * @module interactives/core
 *
 * @classdesc
 *  Item Context manages the overall lifecycle and interaction of the
 *  components specified in a content item.
 *  Based on the item specification, it creates the components and renders
 *  them as needed.
 *  Besides the components, it also has the references to the subpub for event
 *  delivery.
 *
 *  The object of this class is created using the factory method createItemContext().
 *
 * @constructor
 *
 * @param {object} settings
 *
 */
internals.ItemContext = function (settings) {
    /**
     * The logger
     */
    this.logger_ = logger.getLogger('ItemContext');

    /**
     * PubSub: component than handles events
     */
    this.pubsub = settings.pubsub;

    /**
     * Decorator: Decorates UI components by adding styles.
     * @type {null}
     */
    this.decorator_ = null;

    /**
     * The namespace to look for the components
     */
    this.componentModule_ = global;
    if (settings.componentModule) {
        this.componentModule_ = settings.componentModule;
    } else if (settings.componentNamespace) {
        this.componentModule_ = global[settings.componentNamespace];
        this.logger_.info({ componentNamespace: settings.componentNamespace });
    }

    /**
     * ID used to retrieve the LearnerAssignmentItem, the content instance
     * with associated user/course.
     * The server uses the retrieved LearnerAssignmentItem to evaluate the
     * submission and append the result (activity).
     */
    this.associationId_ = settings.associationId || Math.floor(Math.random() * 1000 + 1).toString();

    /**
     * THe content which this context is operating on
     * @type {Object}
     */
    this.content_ = settings.content; // the content body

    /**
     * AnswerModel: keeps the answers.
     */
    this.answerModel = new AnswerModel({
        itemContext: this,
        definition: this.content_.definition
    });

    /**
     * Map of component id and it's specification (description)
     * @type {Object}
     * @private
     */
    this.componentSpecs_ = {};

    /**
     * Reference to component instances
     * @type {Object} Map where keys are component ids and value are the components instances
     */
    this.componentReferences_ = {};

    // Convert component spec from array to Object map
    // For efficient retrieval
    this.mapifyComponentSpecs_(this.content_);
};

/*** Static methods ***/

/**
 *
 * @param fqn
 * @returns {object}
 *      Format: { domain: <definition|components>, id: (string) }
 */
internals.ItemContext.parseFqn = function (fqn) {
    var retval = {};
    if (fqn) {
        if (fqn[0] === '.') {
            var parts = fqn.split('.');
            retval.domain = parts[0];
            retval.id = parts.shift();
        } else {
            retval.id = fqn;
        }
    }
    return retval;
};

/*** Member methods ***/

/**
 * Gets the item association Id (aka itemId).
 *
 * @param {string} content
 */
internals.ItemContext.prototype.getAssociationId = function () {
    return this.associationId_;
};

/**
 * Gets the content.
 *
 * @param {object} content
 */
internals.ItemContext.prototype.getContent = function () {
    return this.content_;
};

/**
 * Sets the content.
 * Triggers re-rendering.
 *
 * @todo - Trigger re-rendering
 *
 * @param {object} content
 */
internals.ItemContext.prototype.setContent = function (content) {
    this.content_ = content;
};

/**
 * getValue
 *
 * Returns the parameter itself unless it contains a local reference which is
 * a fully qualified name (fqn) of a model object or component object
 *
 * @param {object} param  - the parameter which could be the value itself
 *      or may be an object which contains "_lref" denoting a local fully
 *      qualified name to where the actual value is.
 */
internals.ItemContext.prototype.getValue = function (param) {
    var retval = param;
    // If it contains a local reference, get the object it points to.
    if (param._lref) {
        retval = this.resolveObject(param._lref);
    }
    return retval;
};

/**
 * resolveObject
 *
 * Returns the model object or component object
 *
 * @param {string} fqn  - the Fully Qualified Name of the object
 */
internals.ItemContext.prototype.resolveObject = function (fqn) {
    var retval;
    // if it starts with '.definition' returns the JSON object,
    if (utils.startsWith(fqn, '.definition')) {
        var refPath = fqn.substring('.definition'.length + 1);
        retval = utils.dotAccess(this.content_.definition, refPath);
    }

    // if it starts with '.component' returns the Component object\
    else if (utils.startsWith(fqn, '.component')) {
        var componentId = fqn.substring(12);
        retval = this.getComponent(componentId);
    }
    return retval;
};

/**
 * mapifyComponentSpecs_
 * @private
 *
 * Initializes the componentSpec map. Converts the content.components array into map
 * @param content
 *
 * @return {Object.<string, Object>}
 */
internals.ItemContext.prototype.mapifyComponentSpecs_ = function (content) {
    content.components.forEach((function (element, index, array) {
        if (element.id in this.componentSpecs_) {
            throw new Error('Duplicate component ID');
        }
        this.componentSpecs_[element.id] = element;
    }).bind(this));

    var componentIds = _.keys(this.componentSpecs_);

    this.logger_.debug(componentIds, 'Component Specs mapified.');

    return this.componentSpecs_;
};

/**
 * Builds the components as specified in the spec
 *
 * @param {object} spec  - The specification of the components
 * @param {string} id  - id of the component
 *
 * @return {object}  The component instance (a React element)
 */
internals.ItemContext.prototype.createComponent = function (spec, id) {
    if (!(spec.type in this.componentModule_)) {
        throw new Error('Component ' + spec.type + ' not found in module');
    }
    var componentClass = this.componentModule_[spec.type];

    var componentKind = componentClass.prototype.componentKind();

    var constructorArg = {
        itemAssociationId: this.getAssociationId(),
        componentId: id,
        itemContext: this,
        config: spec.config
    };

    var retval = null;
    if (componentKind === 'react') {
        retval = React.createElement(componentClass, constructorArg);
    } else {
        retval = new componentClass(constructorArg);
    }
    this.logger_.info({ componentKind: componentKind, type: spec.type, id: id }, 'Component created');

    return retval;
};

/**
 * getComponent
 *
 * Returns the component instance.
 * Either returns the existing object in the reference table, or creates
 * one, registers it and returns it.
 *
 * @param [string} id
 *
 * @return {object} The component instance (a React element)
 */
internals.ItemContext.prototype.getComponent = function (id) {
    if (!(id in this.componentReferences_)) {
        if (!(id in this.componentSpecs_)) {
            throw new Error('Component ID not found');
        }
        this.componentReferences_[id] = this.createComponent(this.componentSpecs_[id], id);
    }
    return this.componentReferences_[id];
};

/**
 * renderComponent
 *
 * Renders the component to specific DOM element
 *
 * @param {string} param  - The component or the component id
 * @param {DOM} el  - DOM element to render the component
 * @return {DOM}  - The el
 */
internals.ItemContext.prototype.renderComponent = function (param, el) {
    // We are assuming that if the param is a string, then it is the
    // component id; otherwise is the component itself;
    var component = param;
    if (typeof param === 'string') {
        component = this.getComponent(param);
    }

    // Little hack so I can get the component type from Backbone's view or React.
    // React provides componentKind() method through mixin
    var componentKind = component.componentKind ? component.componentKind() : component.type.prototype.componentKind();

    // @todo - Implement strategy pattern to handle different componentKinds
    if (componentKind === 'react') {
        React.render(component, el);
    } else {
        component.render();
        el.appendChild(component.el);
    }

    return el;
};

/**
 * render
 *
 * Renders the main component on the element
 *
 * @param {DOM} el
 *
 * @returns {DOM}
 */
internals.ItemContext.prototype.render = function (el) {
    if (!this.content_ || !this.content_.components) {
        throw new Error('No component was specified');
    }
    var mainComponentId = this.content_.components[0].id;
    return this.renderComponent(mainComponentId, el);
};

/**
 * createItemContext
 *
 * Factory method to create a ItemContext
 *
 * @return {ItemContext}
 */
internals.createItemContext = function (settings) {
    return new internals.ItemContext(settings);
};

module.exports.ItemContext = internals.ItemContext;

module.exports.createItemContext = internals.createItemContext;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/logger":1,"../../common/utils":5,"./../../common/pubsub":4,"./answermodel":13,"lodash":"lodash","react/addons":"react/addons"}],17:[function(require,module,exports){
/*
 * This file is part of the EcoLearnia platform.
 *
 * (c) Young Suk Ahn Park <ys.ahnpark@mathnia.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes references to dependencies for evaluation.
 *
 * @author Young Suk Ahn Park
 * @date 6/05/15
 */

'use strict';

var MathExpressionEval = require('./mathexpressioneval').MathExpressionEval;
var RegexEval = require('./regexeval').RegexEval;

var internals = {};

internals.registerEvalEngines = function (evaluator) {
  var matheval = new MathExpressionEval();
  evaluator.registerEngine(matheval);
  var regexeval = new RegexEval();
  evaluator.registerEngine(regexeval);
};

module.exports.registerEvalEngines = internals.registerEvalEngines;

},{"./mathexpressioneval":18,"./regexeval":19}],18:[function(require,module,exports){
/*
 * This file is part of the EcoLearnia platform.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

//var math = require('mathjs');

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var promiseutils = require('../../common/promiseutils');

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of MathExpressionEval class.
 *
 * @author Young Suk Ahn Park
 * @date 6/05/15
 */

/**
 * @class MathExpressionEval
 *
 * @module interactives/evaluation
 *
 * @classdesc
 *  Engine that evaluates Math expression.
 *  The internal engine is from http://mathjs.org/
 */

var MathExpressionEval = (function () {
  function MathExpressionEval() {
    _classCallCheck(this, MathExpressionEval);
  }

  _createClass(MathExpressionEval, [{
    key: 'evaluate',

    /**
     *
     * @param params  - Evaluation rule param
     * @param input
     * @returns {boolean}
     */
    value: function evaluate(params, input) {
      var promise = promiseutils.createPromise((function (resolve, reject) {
        if (!input || !input.value) {
          resolve(false);
        }
        var result = math.eval(params.epxression);

        resolve(result.toString() == input.value);
      }).bind(this));

      return promise;
    }
  }]);

  return MathExpressionEval;
})();

exports.MathExpressionEval = MathExpressionEval;
;

MathExpressionEval.prototype.name = 'mathexpression';

},{"../../common/promiseutils":3}],19:[function(require,module,exports){
/*
 * This file is part of the EcoLearnia platform.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var promiseutils = require('../../common/promiseutils');

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of EvalRegex class.
 *
 * @author Young Suk Ahn Park
 * @date 6/05/15
 */

/**
 * @class EvalRegex
 *
 * @module interactives/evaluation
 *
 * @classdesc
 *  Engine that evaluates regex expression.
 *
 */

var RegexEval = (function () {
    function RegexEval() {
        _classCallCheck(this, RegexEval);
    }

    _createClass(RegexEval, [{
        key: 'evaluate',

        /**
         *
         * @param params  - Evaluation rule param
         * @param {Object{key, value}} input
         *
         * @returns {Promise(boolean)}
         */
        value: function evaluate(params, input) {
            var promise = promiseutils.createPromise((function (resolve, reject) {
                if (!input || !input.value) {
                    resolve(false);
                }
                var re = RegExp('^' + params.pattern + '');
                var result = re.test(input.value);
                resolve(result);
            }).bind(this));

            return promise;
        }
    }]);

    return RegexEval;
})();

exports.RegexEval = RegexEval;

RegexEval.prototype.name = 'regex';

},{"../../common/promiseutils":3}],20:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-events"] = window.ampersand["ampersand-events"] || [];  window.ampersand["ampersand-events"].push("1.1.1");}
var runOnce = require('lodash.once');
var uniqueId = require('lodash.uniqueid');
var keys = require('lodash.keys');
var isEmpty = require('lodash.isempty');
var each = require('lodash.foreach');
var bind = require('lodash.bind');
var assign = require('lodash.assign');
var slice = Array.prototype.slice;
var eventSplitter = /\s+/;


var Events = {
    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
        if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
        this._events || (this._events = {});
        var events = this._events[name] || (this._events[name] = []);
        events.push({callback: callback, context: context, ctx: context || this});
        return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
        if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
        var self = this;
        var once = runOnce(function() {
            self.off(name, once);
            callback.apply(this, arguments);
        });
        once._callback = callback;
        return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
        var retain, ev, events, names, i, l, j, k;
        if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
        if (!name && !callback && !context) {
            this._events = void 0;
            return this;
        }
        names = name ? [name] : keys(this._events);
        for (i = 0, l = names.length; i < l; i++) {
            name = names[i];
            if (events = this._events[name]) {
                this._events[name] = retain = [];
                if (callback || context) {
                    for (j = 0, k = events.length; j < k; j++) {
                        ev = events[j];
                        if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                                (context && context !== ev.context)) {
                            retain.push(ev);
                        }
                    }
                }
                if (!retain.length) delete this._events[name];
            }
        }

        return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
        if (!this._events) return this;
        var args = slice.call(arguments, 1);
        if (!eventsApi(this, 'trigger', name, args)) return this;
        var events = this._events[name];
        var allEvents = this._events.all;
        if (events) triggerEvents(events, args);
        if (allEvents) triggerEvents(allEvents, arguments);
        return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
        var listeningTo = this._listeningTo;
        if (!listeningTo) return this;
        var remove = !name && !callback;
        if (!callback && typeof name === 'object') callback = this;
        if (obj) (listeningTo = {})[obj._listenId] = obj;
        for (var id in listeningTo) {
            obj = listeningTo[id];
            obj.off(name, callback, this);
            if (remove || isEmpty(obj._events)) delete this._listeningTo[id];
        }
        return this;
    },

    // extend an object with event capabilities if passed
    // or just return a new one.
    createEmitter: function (obj) {
        return assign(obj || {}, Events);
    }
};

Events.bind = Events.on;
Events.unbind = Events.off;


// Implement fancy features of the Events API such as multiple event
// names `"change blur"` and jQuery-style event maps `{change: action}`
// in terms of the existing API.
var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
        for (var key in name) {
            obj[action].apply(obj, [key, name[key]].concat(rest));
        }
        return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
        var names = name.split(eventSplitter);
        for (var i = 0, l = names.length; i < l; i++) {
            obj[action].apply(obj, [names[i]].concat(rest));
        }
        return false;
    }

    return true;
};

// A difficult-to-believe, but optimized internal dispatch function for
// triggering events. Tries to keep the usual cases speedy.
var triggerEvents = function(events, args) {
    var ev;
    var i = -1;
    var l = events.length;
    var a1 = args[0];
    var a2 = args[1];
    var a3 = args[2];
    switch (args.length) {
        case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
        case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
        case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
        case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
        default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
};

var listenMethods = {
    listenTo: 'on',
    listenToOnce: 'once'
};

// Inversion-of-control versions of `on` and `once`. Tell *this* object to
// listen to an event in another object ... keeping track of what it's
// listening to.
each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback, run) {
        var listeningTo = this._listeningTo || (this._listeningTo = {});
        var id = obj._listenId || (obj._listenId = uniqueId('l'));
        listeningTo[id] = obj;
        if (!callback && typeof name === 'object') callback = this;
        obj[implementation](name, callback, this);
        return this;
    };
});

Events.listenToAndRun = function (obj, name, callback) {
    Events.listenTo.apply(this, arguments);
    if (!callback && typeof name === 'object') callback = this;
    callback.apply(this);
    return this;
};

module.exports = Events;

},{"lodash.assign":21,"lodash.bind":27,"lodash.foreach":33,"lodash.isempty":38,"lodash.keys":43,"lodash.once":47,"lodash.uniqueid":49}],21:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseAssign = require('lodash._baseassign'),
    createAssigner = require('lodash._createassigner');

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object. Subsequent sources overwrite property assignments of previous sources.
 * If `customizer` is provided it is invoked to produce the assigned values.
 * The `customizer` is bound to `thisArg` and invoked with five arguments;
 * (objectValue, sourceValue, key, object, source).
 *
 * @static
 * @memberOf _
 * @alias extend
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @param {Function} [customizer] The function to customize assigning values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
 * // => { 'user': 'fred', 'age': 40 }
 *
 * // using a customizer callback
 * var defaults = _.partialRight(_.assign, function(value, other) {
 *   return typeof value == 'undefined' ? other : value;
 * });
 *
 * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
 * // => { 'user': 'barney', 'age': 36 }
 */
var assign = createAssigner(baseAssign);

module.exports = assign;

},{"lodash._baseassign":22,"lodash._createassigner":24}],22:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseCopy = require('lodash._basecopy'),
    keys = require('lodash.keys');

/**
 * The base implementation of `_.assign` without support for argument juggling,
 * multiple sources, and `this` binding `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {Function} [customizer] The function to customize assigning values.
 * @returns {Object} Returns the destination object.
 */
function baseAssign(object, source, customizer) {
  var props = keys(source);
  if (!customizer) {
    return baseCopy(source, object, props);
  }
  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index],
        value = object[key],
        result = customizer(value, source[key], key, object, source);

    if ((result === result ? (result !== value) : (value === value)) ||
        (typeof value == 'undefined' && !(key in object))) {
      object[key] = result;
    }
  }
  return object;
}

module.exports = baseAssign;

},{"lodash._basecopy":23,"lodash.keys":43}],23:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Copies the properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Array} props The property names to copy.
 * @returns {Object} Returns `object`.
 */
function baseCopy(source, object, props) {
  if (!props) {
    props = object;
    object = {};
  }
  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    object[key] = source[key];
  }
  return object;
}

module.exports = baseCopy;

},{}],24:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var bindCallback = require('lodash._bindcallback'),
    isIterateeCall = require('lodash._isiterateecall');

/**
 * Creates a function that assigns properties of source object(s) to a given
 * destination object.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return function() {
    var args = arguments,
        length = args.length,
        object = args[0];

    if (length < 2 || object == null) {
      return object;
    }
    var customizer = args[length - 2],
        thisArg = args[length - 1],
        guard = args[3];

    if (length > 3 && typeof customizer == 'function') {
      customizer = bindCallback(customizer, thisArg, 5);
      length -= 2;
    } else {
      customizer = (length > 2 && typeof thisArg == 'function') ? thisArg : null;
      length -= (customizer ? 1 : 0);
    }
    if (guard && isIterateeCall(args[1], args[2], guard)) {
      customizer = length == 3 ? null : customizer;
      length = 2;
    }
    var index = 0;
    while (++index < length) {
      var source = args[index];
      if (source) {
        assigner(object, source, customizer);
      }
    }
    return object;
  };
}

module.exports = createAssigner;

},{"lodash._bindcallback":25,"lodash._isiterateecall":26}],25:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * A specialized version of `baseCallback` which only supports `this` binding
 * and specifying the number of arguments to provide to `func`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (typeof thisArg == 'undefined') {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = bindCallback;

},{}],26:[function(require,module,exports){
/**
 * lodash 3.0.5 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = +value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number') {
    var length = object.length,
        prereq = isLength(length) && isIndex(index, length);
  } else {
    prereq = type == 'string' && index in object;
  }
  if (prereq) {
    var other = object[index];
    return value === value ? (value === other) : (other !== other);
  }
  return false;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

module.exports = isIterateeCall;

},{}],27:[function(require,module,exports){
/**
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var createWrapper = require('lodash._createwrapper'),
    replaceHolders = require('lodash._replaceholders'),
    restParam = require('lodash.restparam');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    PARTIAL_FLAG = 32;

/**
 * Creates a function that invokes `func` with the `this` binding of `thisArg`
 * and prepends any additional `_.bind` arguments to those provided to the
 * bound function.
 *
 * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
 * may be used as a placeholder for partially applied arguments.
 *
 * **Note:** Unlike native `Function#bind` this method does not set the `length`
 * property of bound functions.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {...*} [partials] The arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * var greet = function(greeting, punctuation) {
 *   return greeting + ' ' + this.user + punctuation;
 * };
 *
 * var object = { 'user': 'fred' };
 *
 * var bound = _.bind(greet, object, 'hi');
 * bound('!');
 * // => 'hi fred!'
 *
 * // using placeholders
 * var bound = _.bind(greet, object, _, '!');
 * bound('hi');
 * // => 'hi fred!'
 */
var bind = restParam(function(func, thisArg, partials) {
  var bitmask = BIND_FLAG;
  if (partials.length) {
    var holders = replaceHolders(partials, bind.placeholder);
    bitmask |= PARTIAL_FLAG;
  }
  return createWrapper(func, bitmask, thisArg, partials, holders);
});

// Assign default placeholders.
bind.placeholder = {};

module.exports = bind;

},{"lodash._createwrapper":28,"lodash._replaceholders":31,"lodash.restparam":32}],28:[function(require,module,exports){
(function (global){
/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var arrayCopy = require('lodash._arraycopy'),
    baseCreate = require('lodash._basecreate'),
    replaceHolders = require('lodash._replaceholders');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_BOUND_FLAG = 4,
    CURRY_FLAG = 8,
    CURRY_RIGHT_FLAG = 16,
    PARTIAL_FLAG = 32,
    PARTIAL_RIGHT_FLAG = 64,
    ARY_FLAG = 128;

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * Creates an array that is the composition of partially applied arguments,
 * placeholders, and provided arguments into a single array of arguments.
 *
 * @private
 * @param {Array|Object} args The provided arguments.
 * @param {Array} partials The arguments to prepend to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgs(args, partials, holders) {
  var holdersLength = holders.length,
      argsIndex = -1,
      argsLength = nativeMax(args.length - holdersLength, 0),
      leftIndex = -1,
      leftLength = partials.length,
      result = Array(argsLength + leftLength);

  while (++leftIndex < leftLength) {
    result[leftIndex] = partials[leftIndex];
  }
  while (++argsIndex < holdersLength) {
    result[holders[argsIndex]] = args[argsIndex];
  }
  while (argsLength--) {
    result[leftIndex++] = args[argsIndex++];
  }
  return result;
}

/**
 * This function is like `composeArgs` except that the arguments composition
 * is tailored for `_.partialRight`.
 *
 * @private
 * @param {Array|Object} args The provided arguments.
 * @param {Array} partials The arguments to append to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgsRight(args, partials, holders) {
  var holdersIndex = -1,
      holdersLength = holders.length,
      argsIndex = -1,
      argsLength = nativeMax(args.length - holdersLength, 0),
      rightIndex = -1,
      rightLength = partials.length,
      result = Array(argsLength + rightLength);

  while (++argsIndex < argsLength) {
    result[argsIndex] = args[argsIndex];
  }
  var pad = argsIndex;
  while (++rightIndex < rightLength) {
    result[pad + rightIndex] = partials[rightIndex];
  }
  while (++holdersIndex < holdersLength) {
    result[pad + holders[holdersIndex]] = args[argsIndex++];
  }
  return result;
}

/**
 * Creates a function that wraps `func` and invokes it with the `this`
 * binding of `thisArg`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @returns {Function} Returns the new bound function.
 */
function createBindWrapper(func, thisArg) {
  var Ctor = createCtorWrapper(func);

  function wrapper() {
    var fn = (this && this !== global && this instanceof wrapper) ? Ctor : func;
    return fn.apply(thisArg, arguments);
  }
  return wrapper;
}

/**
 * Creates a function that produces an instance of `Ctor` regardless of
 * whether it was invoked as part of a `new` expression or by `call` or `apply`.
 *
 * @private
 * @param {Function} Ctor The constructor to wrap.
 * @returns {Function} Returns the new wrapped function.
 */
function createCtorWrapper(Ctor) {
  return function() {
    var thisBinding = baseCreate(Ctor.prototype),
        result = Ctor.apply(thisBinding, arguments);

    // Mimic the constructor's `return` behavior.
    // See https://es5.github.io/#x13.2.2 for more details.
    return isObject(result) ? result : thisBinding;
  };
}

/**
 * Creates a function that wraps `func` and invokes it with optional `this`
 * binding of, partial application, and currying.
 *
 * @private
 * @param {Function|string} func The function or method name to reference.
 * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
 * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & ARY_FLAG,
      isBind = bitmask & BIND_FLAG,
      isBindKey = bitmask & BIND_KEY_FLAG,
      isCurry = bitmask & CURRY_FLAG,
      isCurryBound = bitmask & CURRY_BOUND_FLAG,
      isCurryRight = bitmask & CURRY_RIGHT_FLAG;

  var Ctor = !isBindKey && createCtorWrapper(func),
      key = func;

  function wrapper() {
    // Avoid `arguments` object use disqualifying optimizations by
    // converting it to an array before providing it to other functions.
    var length = arguments.length,
        index = length,
        args = Array(length);

    while (index--) {
      args[index] = arguments[index];
    }
    if (partials) {
      args = composeArgs(args, partials, holders);
    }
    if (partialsRight) {
      args = composeArgsRight(args, partialsRight, holdersRight);
    }
    if (isCurry || isCurryRight) {
      var placeholder = wrapper.placeholder,
          argsHolders = replaceHolders(args, placeholder);

      length -= argsHolders.length;
      if (length < arity) {
        var newArgPos = argPos ? arrayCopy(argPos) : null,
            newArity = nativeMax(arity - length, 0),
            newsHolders = isCurry ? argsHolders : null,
            newHoldersRight = isCurry ? null : argsHolders,
            newPartials = isCurry ? args : null,
            newPartialsRight = isCurry ? null : args;

        bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
        bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

        if (!isCurryBound) {
          bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
        }
        var result = createHybridWrapper(func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, newArity);

        result.placeholder = placeholder;
        return result;
      }
    }
    var thisBinding = isBind ? thisArg : this;
    if (isBindKey) {
      func = thisBinding[key];
    }
    if (argPos) {
      args = reorder(args, argPos);
    }
    if (isAry && ary < args.length) {
      args.length = ary;
    }
    var fn = (this && this !== global && this instanceof wrapper) ? (Ctor || createCtorWrapper(func)) : func;
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}

/**
 * Creates a function that wraps `func` and invokes it with the optional `this`
 * binding of `thisArg` and the `partials` prepended to those provided to
 * the wrapper.
 *
 * @private
 * @param {Function} func The function to partially apply arguments to.
 * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} partials The arguments to prepend to those provided to the new function.
 * @returns {Function} Returns the new bound function.
 */
function createPartialWrapper(func, bitmask, thisArg, partials) {
  var isBind = bitmask & BIND_FLAG,
      Ctor = createCtorWrapper(func);

  function wrapper() {
    // Avoid `arguments` object use disqualifying optimizations by
    // converting it to an array before providing it `func`.
    var argsIndex = -1,
        argsLength = arguments.length,
        leftIndex = -1,
        leftLength = partials.length,
        args = Array(argsLength + leftLength);

    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }
    var fn = (this && this !== global && this instanceof wrapper) ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, args);
  }
  return wrapper;
}

/**
 * Creates a function that either curries or invokes `func` with optional
 * `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to reference.
 * @param {number} bitmask The bitmask of flags.
 *  The bitmask may be composed of the following flags:
 *     1 - `_.bind`
 *     2 - `_.bindKey`
 *     4 - `_.curry` or `_.curryRight` of a bound function
 *     8 - `_.curry`
 *    16 - `_.curryRight`
 *    32 - `_.partial`
 *    64 - `_.partialRight`
 *   128 - `_.rearg`
 *   256 - `_.ary`
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to be partially applied.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & BIND_KEY_FLAG;
  if (!isBindKey && typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
    partials = holders = null;
  }
  length -= (holders ? holders.length : 0);
  if (bitmask & PARTIAL_RIGHT_FLAG) {
    var partialsRight = partials,
        holdersRight = holders;

    partials = holders = null;
  }
  var newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];

  newData[9] = arity == null
    ? (isBindKey ? 0 : func.length)
    : (nativeMax(arity - length, 0) || 0);

  if (bitmask == BIND_FLAG) {
    var result = createBindWrapper(newData[0], newData[2]);
  } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !newData[4].length) {
    result = createPartialWrapper.apply(undefined, newData);
  } else {
    result = createHybridWrapper.apply(undefined, newData);
  }
  return result;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = +value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Reorder `array` according to the specified indexes where the element at
 * the first index is assigned as the first element, the element at
 * the second index is assigned as the second element, and so on.
 *
 * @private
 * @param {Array} array The array to reorder.
 * @param {Array} indexes The arranged array indexes.
 * @returns {Array} Returns `array`.
 */
function reorder(array, indexes) {
  var arrLength = array.length,
      length = nativeMin(indexes.length, arrLength),
      oldArray = arrayCopy(array);

  while (length--) {
    var index = indexes[length];
    array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
  }
  return array;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

module.exports = createWrapper;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"lodash._arraycopy":29,"lodash._basecreate":30,"lodash._replaceholders":31}],29:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function arrayCopy(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = arrayCopy;

},{}],30:[function(require,module,exports){
(function (global){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function Object() {}
  return function(prototype) {
    if (isObject(prototype)) {
      Object.prototype = prototype;
      var result = new Object;
      Object.prototype = null;
    }
    return result || global.Object();
  };
}());

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

module.exports = baseCreate;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],31:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/**
 * Replaces all `placeholder` elements in `array` with an internal placeholder
 * and returns an array of their indexes.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {*} placeholder The placeholder to replace.
 * @returns {Array} Returns the new array of placeholder indexes.
 */
function replaceHolders(array, placeholder) {
  var index = -1,
      length = array.length,
      resIndex = -1,
      result = [];

  while (++index < length) {
    if (array[index] === placeholder) {
      array[index] = PLACEHOLDER;
      result[++resIndex] = index;
    }
  }
  return result;
}

module.exports = replaceHolders;

},{}],32:[function(require,module,exports){
/**
 * lodash 3.6.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as an array.
 *
 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.restParam(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function restParam(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(typeof start == 'undefined' ? (func.length - 1) : (+start || 0), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        rest = Array(length);

    while (++index < length) {
      rest[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, rest);
      case 1: return func.call(this, args[0], rest);
      case 2: return func.call(this, args[0], args[1], rest);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = rest;
    return func.apply(this, otherArgs);
  };
}

module.exports = restParam;

},{}],33:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var arrayEach = require('lodash._arrayeach'),
    baseEach = require('lodash._baseeach'),
    bindCallback = require('lodash._bindcallback'),
    isArray = require('lodash.isarray');

/**
 * Creates a function for `_.forEach` or `_.forEachRight`.
 *
 * @private
 * @param {Function} arrayFunc The function to iterate over an array.
 * @param {Function} eachFunc The function to iterate over a collection.
 * @returns {Function} Returns the new each function.
 */
function createForEach(arrayFunc, eachFunc) {
  return function(collection, iteratee, thisArg) {
    return (typeof iteratee == 'function' && typeof thisArg == 'undefined' && isArray(collection))
      ? arrayFunc(collection, iteratee)
      : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
  };
}

/**
 * Iterates over elements of `collection` invoking `iteratee` for each element.
 * The `iteratee` is bound to `thisArg` and invoked with three arguments:
 * (value, index|key, collection). Iterator functions may exit iteration early
 * by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a `length` property
 * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
 * may be used for object iteration.
 *
 * @static
 * @memberOf _
 * @alias each
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [thisArg] The `this` binding of `iteratee`.
 * @returns {Array|Object|string} Returns `collection`.
 * @example
 *
 * _([1, 2]).forEach(function(n) {
 *   console.log(n);
 * }).value();
 * // => logs each value from left to right and returns the array
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
 *   console.log(n, key);
 * });
 * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
 */
var forEach = createForEach(arrayEach, baseEach);

module.exports = forEach;

},{"lodash._arrayeach":34,"lodash._baseeach":35,"lodash._bindcallback":36,"lodash.isarray":37}],34:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * A specialized version of `_.forEach` for arrays without support for callback
 * shorthands or `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],35:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var keys = require('lodash.keys');

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * The base implementation of `_.forEach` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object|string} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

/**
 * The base implementation of `baseForIn` and `baseForOwn` which iterates
 * over `object` properties returned by `keysFunc` invoking `iteratee` for
 * each property. Iterator functions may exit iteration early by explicitly
 * returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `_.forOwn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return baseFor(object, iteratee, keys);
}

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    var length = collection ? collection.length : 0;
    if (!isLength(length)) {
      return eachFunc(collection, iteratee);
    }
    var index = fromRight ? length : -1,
        iterable = toObject(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

/**
 * Creates a base function for `_.forIn` or `_.forInRight`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var iterable = toObject(object),
        props = keysFunc(object),
        length = props.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      var key = props[index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Converts `value` to an object if it is not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

module.exports = baseEach;

},{"lodash.keys":43}],36:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],37:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var arrayTag = '[object Array]',
    funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Used to match `RegExp` [special characters](http://www.regular-expressions.info/characters.html#special).
 * In addition to special characters the forward slash is escaped to allow for
 * easier `eval` use and `Function` compilation.
 */
var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
    reHasRegExpChars = RegExp(reRegExpChars.source);

/**
 * Converts `value` to a string if it is not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  return value == null ? '' : (value + '');
}

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reNative = RegExp('^' +
  escapeRegExp(objToString)
  .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (objToString.call(value) == funcTag) {
    return reNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reHostCtor.test(value);
}

/**
 * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
 * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escapeRegExp('[lodash](https://lodash.com/)');
 * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
 */
function escapeRegExp(string) {
  string = baseToString(string);
  return (string && reHasRegExpChars.test(string))
    ? string.replace(reRegExpChars, '\\$&')
    : string;
}

module.exports = isArray;

},{}],38:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isArguments = require('lodash.isarguments'),
    isArray = require('lodash.isarray'),
    isFunction = require('lodash.isfunction'),
    isString = require('lodash.isstring'),
    keys = require('lodash.keys');

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is empty. A value is considered empty unless it is an
 * `arguments` object, array, string, or jQuery-like collection with a length
 * greater than `0` or an object with own enumerable properties.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {Array|Object|string} value The value to inspect.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  var length = value.length;
  if (isLength(length) && (isArray(value) || isString(value) || isArguments(value) ||
      (isObjectLike(value) && isFunction(value.splice)))) {
    return !length;
  }
  return !keys(value).length;
}

module.exports = isEmpty;

},{"lodash.isarguments":39,"lodash.isarray":40,"lodash.isfunction":41,"lodash.isstring":42,"lodash.keys":43}],39:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  var length = isObjectLike(value) ? value.length : undefined;
  return isLength(length) && objToString.call(value) == argsTag;
}

module.exports = isArguments;

},{}],40:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],41:[function(require,module,exports){
(function (global){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Used to match `RegExp` [special characters](http://www.regular-expressions.info/characters.html#special).
 * In addition to special characters the forward slash is escaped to allow for
 * easier `eval` use and `Function` compilation.
 */
var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
    reHasRegExpChars = RegExp(reRegExpChars.source);

/**
 * The base implementation of `_.isFunction` without support for environments
 * with incorrect `typeof` results.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 */
function baseIsFunction(value) {
  // Avoid a Chakra JIT bug in compatibility modes of IE 11.
  // See https://github.com/jashkenas/underscore/issues/1621 for more details.
  return typeof value == 'function' || false;
}

/**
 * Converts `value` to a string if it is not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  return value == null ? '' : (value + '');
}

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reNative = RegExp('^' +
  escapeRegExp(objToString)
  .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Native method references. */
var Uint8Array = isNative(Uint8Array = global.Uint8Array) && Uint8Array;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
var isFunction = !(baseIsFunction(/x/) || (Uint8Array && !baseIsFunction(Uint8Array))) ? baseIsFunction : function(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return objToString.call(value) == funcTag;
};

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (objToString.call(value) == funcTag) {
    return reNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reHostCtor.test(value);
}

/**
 * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
 * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escapeRegExp('[lodash](https://lodash.com/)');
 * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
 */
function escapeRegExp(string) {
  string = baseToString(string);
  return (string && reHasRegExpChars.test(string))
    ? string.replace(reRegExpChars, '\\$&')
    : string;
}

module.exports = isFunction;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],42:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var stringTag = '[object String]';

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
}

module.exports = isString;

},{}],43:[function(require,module,exports){
/**
 * lodash 3.0.5 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isArguments = require('lodash.isarguments'),
    isArray = require('lodash.isarray'),
    isNative = require('lodash.isnative');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * An object environment feature flags.
 *
 * @static
 * @memberOf _
 * @type Object
 */
var support = {};

(function(x) {

  /**
   * Detect if `arguments` object indexes are non-enumerable.
   *
   * In Firefox < 4, IE < 9, PhantomJS, and Safari < 5.1 `arguments` object
   * indexes are non-enumerable. Chrome < 25 and Node.js < 0.11.0 treat
   * `arguments` object indexes as non-enumerable and fail `hasOwnProperty`
   * checks for indexes that exceed their function's formal parameters with
   * associated values of `0`.
   *
   * @memberOf _.support
   * @type boolean
   */
  try {
    support.nonEnumArgs = !propertyIsEnumerable.call(arguments, 1);
  } catch(e) {
    support.nonEnumArgs = true;
  }
}(0, 0));

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = +value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * A fallback implementation of `Object.keys` which creates an array of the
 * own enumerable property names of `object`.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns the array of property names.
 */
function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = length && isLength(length) &&
    (isArray(object) || (support.nonEnumArgs && isArguments(object)));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  if (object) {
    var Ctor = object.constructor,
        length = object.length;
  }
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && (length && isLength(length)))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || (support.nonEnumArgs && isArguments(object))) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keys;

},{"lodash.isarguments":44,"lodash.isarray":45,"lodash.isnative":46}],44:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],45:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],46:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Used to match `RegExp` [special characters](http://www.regular-expressions.info/characters.html#special).
 * In addition to special characters the forward slash is escaped to allow for
 * easier `eval` use and `Function` compilation.
 */
var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
    reHasRegExpChars = RegExp(reRegExpChars.source);

/**
 * Converts `value` to a string if it is not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  return value == null ? '' : (value + '');
}

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reNative = RegExp('^' +
  escapeRegExp(objToString)
  .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (objToString.call(value) == funcTag) {
    return reNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reHostCtor.test(value);
}

/**
 * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
 * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escapeRegExp('[lodash](https://lodash.com/)');
 * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
 */
function escapeRegExp(string) {
  string = baseToString(string);
  return (string && reHasRegExpChars.test(string))
    ? string.replace(reRegExpChars, '\\$&')
    : string;
}

module.exports = isNative;

},{}],47:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var before = require('lodash.before');

/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls
 * to the function return the value of the first call. The `func` is invoked
 * with the `this` binding of the created function.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Function
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var initialize = _.once(createApplication);
 * initialize();
 * initialize();
 * // `initialize` invokes `createApplication` once
 */
function once(func) {
  return before(func, 2);
}

module.exports = once;

},{"lodash.before":48}],48:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that invokes `func`, with the `this` binding and arguments
 * of the created function, while it is called less than `n` times. Subsequent
 * calls to the created function return the result of the last `func` invocation.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {number} n The number of calls at which `func` is no longer invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * jQuery('#add').on('click', _.before(5, addContactToList));
 * // => allows adding up to 4 contacts to the list
 */
function before(n, func) {
  var result;
  if (typeof func != 'function') {
    if (typeof n == 'function') {
      var temp = n;
      n = func;
      func = temp;
    } else {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
  }
  return function() {
    if (--n > 0) {
      result = func.apply(this, arguments);
    } else {
      func = null;
    }
    return result;
  };
}

module.exports = before;

},{}],49:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseToString = require('lodash._basetostring');

/** Used to generate unique IDs. */
var idCounter = 0;

/**
 * Generates a unique ID. If `prefix` is provided the ID is appended to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {string} [prefix] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  var id = ++idCounter;
  return baseToString(prefix) + id;
}

module.exports = uniqueId;

},{"lodash._basetostring":50}],50:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Converts `value` to a string if it is not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  return value == null ? '' : (value + '');
}

module.exports = baseToString;

},{}],51:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-view"] = window.ampersand["ampersand-view"] || [];  window.ampersand["ampersand-view"].push("7.3.0");}
var State = require('ampersand-state');
var CollectionView = require('ampersand-collection-view');
var domify = require('domify');
var uniqueId = require("lodash.uniqueid");
var pick = require("lodash.pick");
var assign = require("lodash.assign");
var forEach = require("lodash.foreach");
var result = require("lodash.result");
var last = require("lodash.last");
var isString = require("lodash.isstring");
var bind = require("lodash.bind");
var flatten = require("lodash.flatten");
var invoke = require("lodash.invoke");
var events = require('events-mixin');
var matches = require('matches-selector');
var bindings = require('ampersand-dom-bindings');
var getPath = require('get-object-path');


function View(attrs) {
    this.cid = uniqueId('view');
    attrs || (attrs = {});
    var parent = attrs.parent;
    delete attrs.parent;
    BaseState.call(this, attrs, {init: false, parent: parent});
    this.on('change:el', this._handleElementChange, this);
    this._parsedBindings = bindings(this.bindings, this);
    this._initializeBindings();
    if (attrs.el && !this.autoRender) {
        this._handleElementChange();
    }
    this._initializeSubviews();
    this.template = attrs.template || this.template;
    this.initialize.apply(this, arguments);
    this.set(pick(attrs, viewOptions));
    if (this.autoRender && this.template) {
        this.render();
    }
}

var BaseState = State.extend({
    dataTypes: {
        element: {
            set: function (newVal) {
                return {
                    val: newVal,
                    type: newVal instanceof Element ? 'element' : typeof newVal
                };
            },
            compare: function (el1, el2) {
                return el1 === el2;
            }
        },
        collection: {
            set: function (newVal) {
                return {
                    val: newVal,
                    type: newVal && newVal.isCollection ? 'collection' : typeof newVal
                };
            },
            compare: function (currentVal, newVal) {
                return currentVal === newVal;
            }
        }
    },
    props: {
        model: 'state',
        el: 'element',
        collection: 'collection'
    },
    derived: {
        rendered: {
            deps: ['el'],
            fn: function () {
                return !!this.el;
            }
        },
        hasData: {
            deps: ['model'],
            fn: function () {
                return !!this.model;
            }
        }
    }
});

// Cached regex to split keys for `delegate`.
var delegateEventSplitter = /^(\S+)\s*(.*)$/;

// List of view options to be merged as properties.
var viewOptions = ['model', 'collection', 'el'];

View.prototype = Object.create(BaseState.prototype);

// Set up all inheritable properties and methods.
assign(View.prototype, {
    // ## query
    // Get an single element based on CSS selector scoped to this.el
    // if you pass an empty string it return `this.el`.
    // If you pass an element we just return it back.
    // This lets us use `get` to handle cases where users
    // can pass a selector or an already selected element.
    query: function (selector) {
        if (!selector) return this.el;
        if (typeof selector === 'string') {
            if (matches(this.el, selector)) return this.el;
            return this.el.querySelector(selector) || undefined;
        }
        return selector;
    },

    // ## queryAll
    // Returns an array of elements based on CSS selector scoped to this.el
    // if you pass an empty string it return `this.el`. Also includes root
    // element.
    queryAll: function (selector) {
        var res = [];
        if (!this.el) return res;
        if (selector === '') return [this.el];
        if (matches(this.el, selector)) res.push(this.el);
        return res.concat(Array.prototype.slice.call(this.el.querySelectorAll(selector)));
    },

    // ## queryByHook
    // Convenience method for fetching element by it's `data-hook` attribute.
    // Also tries to match against root element.
    // Also supports matching 'one' of several space separated hooks.
    queryByHook: function (hook) {
        return this.query('[data-hook~="' + hook + '"]');
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function () {},

    // **render** is the core function that your view can override, its job is
    // to populate its element (`this.el`), with the appropriate HTML.
    render: function () {
        this.renderWithTemplate(this);
        return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable events listeners.
    remove: function () {
        var parsedBindings = this._parsedBindings;
        if (this.el && this.el.parentNode) this.el.parentNode.removeChild(this.el);
        if (this._subviews) invoke(flatten(this._subviews), 'remove');
        this.stopListening();
        // TODO: Not sure if this is actually necessary.
        // Just trying to de-reference this potentially large
        // amount of generated functions to avoid memory leaks.
        forEach(parsedBindings, function (properties, modelName) {
            forEach(properties, function (value, key) {
                delete parsedBindings[modelName][key];
            });
            delete parsedBindings[modelName];
        });
        this.trigger('remove', this);
        return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    _handleElementChange: function (element, delegate) {
        if (this.eventManager) this.eventManager.unbind();
        this.eventManager = events(this.el, this);
        this.delegateEvents();
        this._applyBindingsForKey();
        return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function (e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function (events) {
        if (!(events || (events = result(this, 'events')))) return this;
        this.undelegateEvents();
        for (var key in events) {
            this.eventManager.bind(key, events[key]);
        }
        return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function () {
        this.eventManager.unbind();
        return this;
    },

    // ## registerSubview
    // Pass it a view. This can be anything with a `remove` method
    registerSubview: function (view) {
        // Storage for our subviews.
        this._subviews || (this._subviews = []);
        this._subviews.push(view);
        // If view has an 'el' it's a single view not
        // an array of views registered by renderCollection
        // so we store a reference to the parent view.
        if (view.el) view.parent = this;
        return view;
    },

    // ## renderSubview
    // Pass it a view instance and a container element
    // to render it in. It's `remove` method will be called
    // when the parent view is destroyed.
    renderSubview: function (view, container) {
        if (typeof container === 'string') {
            container = this.query(container);
        }
        this.registerSubview(view);
        view.render();
        (container || this.el).appendChild(view.el);
        return view;
    },

    _applyBindingsForKey: function (name) {
        if (!this.el) return;
        var fns = this._parsedBindings.getGrouped(name);
        var item;
        for (item in fns) {
            fns[item].forEach(function (fn) {
                fn(this.el, getPath(this, item), last(item.split('.')));
            }, this);
        }
    },

    _initializeBindings: function () {
        if (!this.bindings) return;
        this.on('all', function (eventName) {
            if (eventName.slice(0, 7) === 'change:') {
                this._applyBindingsForKey(eventName.split(':')[1]);
            }
        }, this);
    },

    // ## _initializeSubviews
    // this is called at setup and grabs declared subviews
    _initializeSubviews: function () {
        if (!this.subviews) return;
        for (var item in this.subviews) {
            this._parseSubview(this.subviews[item], item);
        }
    },

    // ## _parseSubview
    // helper for parsing out the subview declaration and registering
    // the `waitFor` if need be.
    _parseSubview: function (subview, name) {
        var self = this;
        var opts = {
            selector: subview.container || '[data-hook="' + subview.hook + '"]',
            waitFor: subview.waitFor || '',
            prepareView: subview.prepareView || function (el) {
                return new subview.constructor({
                    el: el,
                    parent: self
                });
            }
        };
        function action() {
            var el, subview;
            // if not rendered or we can't find our element, stop here.
            if (!this.el || !(el = this.query(opts.selector))) return;
            if (!opts.waitFor || getPath(this, opts.waitFor)) {
                subview = this[name] = opts.prepareView.call(this, el);
                subview.render();
                this.registerSubview(subview);
                this.off('change', action);
            }
        }
        // we listen for main `change` items
        this.on('change', action, this);
    },


    // Shortcut for doing everything we need to do to
    // render and fully replace current root element.
    // Either define a `template` property of your view
    // or pass in a template directly.
    // The template can either be a string or a function.
    // If it's a function it will be passed the `context`
    // argument.
    renderWithTemplate: function (context, templateArg) {
        var template = templateArg || this.template;
        if (!template) throw new Error('Template string or function needed.');
        var newDom = isString(template) ? template : template.call(this, context || this);
        if (isString(newDom)) newDom = domify(newDom);
        var parent = this.el && this.el.parentNode;
        if (parent) parent.replaceChild(newDom, this.el);
        if (newDom.nodeName === '#document-fragment') throw new Error('Views can only have one root element.');
        this.el = newDom;
        return this;
    },

    // ## cacheElements
    // This is a shortcut for adding reference to specific elements within your view for
    // access later. This avoids excessive DOM queries and makes it easier to update
    // your view if your template changes.
    //
    // In your `render` method. Use it like so:
    //
    //     render: function () {
    //       this.basicRender();
    //       this.cacheElements({
    //         pages: '#pages',
    //         chat: '#teamChat',
    //         nav: 'nav#views ul',
    //         me: '#me',
    //         cheatSheet: '#cheatSheet',
    //         omniBox: '#awesomeSauce'
    //       });
    //     }
    //
    // Then later you can access elements by reference like so: `this.pages`, or `this.chat`.
    cacheElements: function (hash) {
        for (var item in hash) {
            this[item] = this.query(hash[item]);
        }
        return this;
    },

    // ## listenToAndRun
    // Shortcut for registering a listener for a model
    // and also triggering it right away.
    listenToAndRun: function (object, events, handler) {
        var bound = bind(handler, this);
        this.listenTo(object, events, bound);
        bound();
    },

    // ## animateRemove
    // Placeholder for if you want to do something special when they're removed.
    // For example fade it out, etc.
    // Any override here should call `.remove()` when done.
    animateRemove: function () {
        this.remove();
    },

    // ## renderCollection
    // Method for rendering a collections with individual views.
    // Just pass it the collection, and the view to use for the items in the
    // collection. The collectionView is returned.
    renderCollection: function (collection, ViewClass, container, opts) {
        var containerEl = (typeof container === 'string') ? this.query(container) : container;
        var config = assign({
            collection: collection,
            el: containerEl || this.el,
            view: ViewClass,
            parent: this,
            viewOptions: {
                parent: this
            }
        }, opts);
        var collectionView = new CollectionView(config);
        collectionView.render();
        return this.registerSubview(collectionView);
    }
});

View.extend = BaseState.extend;
module.exports = View;

},{"ampersand-collection-view":52,"ampersand-dom-bindings":87,"ampersand-state":90,"domify":154,"events-mixin":155,"get-object-path":160,"lodash.assign":161,"lodash.bind":171,"lodash.flatten":177,"lodash.foreach":182,"lodash.invoke":190,"lodash.isstring":197,"lodash.last":198,"lodash.pick":199,"lodash.result":211,"lodash.uniqueid":213,"matches-selector":215}],52:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-collection-view"] = window.ampersand["ampersand-collection-view"] || [];  window.ampersand["ampersand-collection-view"].push("1.4.0");}
var assign = require('lodash.assign');
var invoke = require('lodash.invoke');
var pick = require('lodash.pick');
var find = require('lodash.find');
var difference = require('lodash.difference');
var Events = require('ampersand-events');
var ampExtend = require('ampersand-class-extend');

// options
var options = ['collection', 'el', 'viewOptions', 'view', 'emptyView', 'filter', 'reverse', 'parent'];


function CollectionView(spec) {
    if (!spec) {
        throw new ReferenceError('Collection view missing required parameters: collection, el');
    }
    if (!spec.collection) {
        throw new ReferenceError('Collection view requires a collection');
    }
    if (!spec.el && !this.insertSelf) {
        throw new ReferenceError('Collection view requires an el');
    }
    assign(this, pick(spec, options));
    this.views = [];
    this.listenTo(this.collection, 'add', this._addViewForModel);
    this.listenTo(this.collection, 'remove', this._removeViewForModel);
    this.listenTo(this.collection, 'sort', this._rerenderAll);
    this.listenTo(this.collection, 'refresh reset', this._reset);
}

assign(CollectionView.prototype, Events, {
    // for view contract compliance
    render: function () {
        this._renderAll();
        return this;
    },
    remove: function () {
        invoke(this.views, 'remove');
        this.stopListening();
    },
    _getViewByModel: function (model) {
        return find(this.views, function (view) {
            return model === view.model;
        });
    },
    _createViewForModel: function (model, renderOpts) {
        var defaultViewOptions = {model: model, collection: this.collection, parent: this};
        var view = new this.view(assign(defaultViewOptions, this.viewOptions));
        this.views.push(view);
        view.renderedByParentView = true;
        view.render(renderOpts);
        return view;
    },
    _getOrCreateByModel: function (model, renderOpts) {
        return this._getViewByModel(model) || this._createViewForModel(model, renderOpts);
    },
    _addViewForModel: function (model, collection, options) {
        var matches = this.filter ? this.filter(model) : true;
        if (!matches) {
            return;
        }
        if (this.renderedEmptyView) {
            this.renderedEmptyView.remove();
            delete this.renderedEmptyView;
        }
        var view = this._getOrCreateByModel(model, {containerEl: this.el});
        if (options && options.rerender) {
            this._insertView(view);
        } else {
            this._insertViewAtIndex(view);
        }
    },
    _insertViewAtIndex: function (view) {
        if (!view.insertSelf) {
            var pos = this.collection.indexOf(view.model);
            var modelToInsertBefore, viewToInsertBefore;

            if (this.reverse) {
                modelToInsertBefore = this.collection.at(pos - 1);
            } else {
                modelToInsertBefore = this.collection.at(pos + 1);
            }

            viewToInsertBefore = this._getViewByModel(modelToInsertBefore);

            // FIX IE bug (https://developer.mozilla.org/en-US/docs/Web/API/Node.insertBefore)
            // "In Internet Explorer an undefined value as referenceElement will throw errors, while in rest of the modern browsers, this works fine."
            if(viewToInsertBefore) {
                this.el.insertBefore(view.el, viewToInsertBefore && viewToInsertBefore.el);
            } else {
                this.el.appendChild(view.el);
            }
        }
    },
    _insertView: function (view) {
        if (!view.insertSelf) {
            if (this.reverse && this.el.firstChild) {
                this.el.insertBefore(view.el, this.el.firstChild);
            } else {
                this.el.appendChild(view.el);
            }
        }
    },
    _removeViewForModel: function (model) {
        var view = this._getViewByModel(model);
        if (!view) {
            return;
        }
        var index = this.views.indexOf(view);
        if (index !== -1) {
            // remove it if we found it calling animateRemove
            // to give user option of gracefully destroying.
            view = this.views.splice(index, 1)[0];
            this._removeView(view);
            if (this.views.length === 0) {
                this._renderEmptyView();
            }
        }
    },
    _removeView: function (view) {
        if (view.animateRemove) {
            view.animateRemove();
        } else {
            view.remove();
        }
    },
    _renderAll: function () {
        this.collection.each(this._addViewForModel, this);
        if (this.views.length === 0) {
            this._renderEmptyView();
        }
    },
    _rerenderAll: function (collection, options) {
        options = options || {};
        this.collection.each(function (model) {
            this._addViewForModel(model, this, assign(options, {rerender: true}));
        }, this);
    },
    _renderEmptyView: function() {
        if (this.emptyView && !this.renderedEmptyView) {
            var view = this.renderedEmptyView = new this.emptyView({parent: this});
            this.el.appendChild(view.render().el);
        }
    },
    _reset: function () {
        var newViews = this.collection.map(this._getOrCreateByModel, this);

        //Remove existing views from the ui
        var toRemove = difference(this.views, newViews);
        toRemove.forEach(this._removeView, this);

        //Rerender the full list with the new views
        this.views = newViews;
        this._rerenderAll();
        if (this.views.length === 0) {
            this._renderEmptyView();
        }
    }
});

CollectionView.extend = ampExtend;

module.exports = CollectionView;

},{"ampersand-class-extend":53,"ampersand-events":54,"lodash.assign":161,"lodash.difference":65,"lodash.find":75,"lodash.invoke":190,"lodash.pick":199}],53:[function(require,module,exports){
var assign = require('lodash.assign');

/// Following code is largely pasted from Backbone.js

// Helper function to correctly set up the prototype chain, for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
var extend = function(protoProps) {
    var parent = this;
    var child;
    var args = [].slice.call(arguments);

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
    } else {
        child = function () {
            return parent.apply(this, arguments);
        };
    }

    // Add static properties to the constructor function from parent
    assign(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    // Mix in all prototype properties to the subclass if supplied.
    if (protoProps) {
        args.unshift(child.prototype);
        assign.apply(null, args);
    }

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
};

// Expose the extend function
module.exports = extend;

},{"lodash.assign":161}],54:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20,"lodash.assign":161,"lodash.bind":171,"lodash.foreach":182,"lodash.isempty":55,"lodash.keys":59,"lodash.once":63,"lodash.uniqueid":213}],55:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"dup":38,"lodash.isarguments":56,"lodash.isarray":57,"lodash.isfunction":58,"lodash.isstring":197,"lodash.keys":59}],56:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],57:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],58:[function(require,module,exports){
(function (global){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Used to match `RegExp` [special characters](http://www.regular-expressions.info/characters.html#special).
 * In addition to special characters the forward slash is escaped to allow for
 * easier `eval` use and `Function` compilation.
 */
var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
    reHasRegExpChars = RegExp(reRegExpChars.source);

/**
 * The base implementation of `_.isFunction` without support for environments
 * with incorrect `typeof` results.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 */
function baseIsFunction(value) {
  // Avoid a Chakra JIT bug in compatibility modes of IE 11.
  // See https://github.com/jashkenas/underscore/issues/1621 for more details.
  return typeof value == 'function' || false;
}

/**
 * Converts `value` to a string if it is not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  return value == null ? '' : (value + '');
}

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reNative = RegExp('^' +
  escapeRegExp(objToString)
  .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Native method references. */
var Uint8Array = isNative(Uint8Array = global.Uint8Array) && Uint8Array;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
var isFunction = !(baseIsFunction(/x/) || (Uint8Array && !baseIsFunction(Uint8Array))) ? baseIsFunction : function(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return objToString.call(value) == funcTag;
};

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (objToString.call(value) == funcTag) {
    return reNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reHostCtor.test(value);
}

/**
 * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
 * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escapeRegExp('[lodash](https://lodash.com/)');
 * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
 */
function escapeRegExp(string) {
  string = baseToString(string);
  return (string && reHasRegExpChars.test(string))
    ? string.replace(reRegExpChars, '\\$&')
    : string;
}

module.exports = isFunction;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],59:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43,"lodash.isarguments":60,"lodash.isarray":61,"lodash.isnative":62}],60:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],61:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],62:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],63:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47,"lodash.before":64}],64:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"dup":48}],65:[function(require,module,exports){
/**
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseDifference = require('lodash._basedifference'),
    baseFlatten = require('lodash._baseflatten'),
    isArguments = require('lodash.isarguments'),
    isArray = require('lodash.isarray'),
    restParam = require('lodash.restparam');

/**
 * Creates an array excluding all values of the provided arrays using
 * `SameValueZero` for equality comparisons.
 *
 * **Note:** [`SameValueZero`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
 * comparisons are like strict equality comparisons, e.g. `===`, except that
 * `NaN` matches `NaN`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The arrays of values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.difference([1, 2, 3], [4, 2]);
 * // => [1, 3]
 */
var difference = restParam(function(array, values) {
  return (isArray(array) || isArguments(array))
    ? baseDifference(array, baseFlatten(values, false, true))
    : [];
});

module.exports = difference;

},{"lodash._basedifference":66,"lodash._baseflatten":71,"lodash.isarguments":72,"lodash.isarray":73,"lodash.restparam":74}],66:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseIndexOf = require('lodash._baseindexof'),
    cacheIndexOf = require('lodash._cacheindexof'),
    createCache = require('lodash._createcache');

/**
 * The base implementation of `_.difference` which accepts a single array
 * of values to exclude.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values) {
  var length = array ? array.length : 0,
      result = [];

  if (!length) {
    return result;
  }
  var index = -1,
      indexOf = baseIndexOf,
      isCommon = true,
      cache = (isCommon && values.length >= 200) ? createCache(values) : null,
      valuesLength = values.length;

  if (cache) {
    indexOf = cacheIndexOf;
    isCommon = false;
    values = cache;
  }
  outer:
  while (++index < length) {
    var value = array[index];

    if (isCommon && value === value) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === value) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (indexOf(values, value, 0) < 0) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseDifference;

},{"lodash._baseindexof":67,"lodash._cacheindexof":68,"lodash._createcache":69}],67:[function(require,module,exports){
/**
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `_.indexOf` without support for binary searches.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return indexOfNaN(array, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * Gets the index at which the first occurrence of `NaN` is found in `array`.
 * If `fromRight` is provided elements of `array` are iterated from right to left.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched `NaN`, else `-1`.
 */
function indexOfNaN(array, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 0 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    var other = array[index];
    if (other !== other) {
      return index;
    }
  }
  return -1;
}

module.exports = baseIndexOf;

},{}],68:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is in `cache` mimicking the return signature of
 * `_.indexOf` by returning `0` if the value is found, else `-1`.
 *
 * @private
 * @param {Object} cache The cache to search.
 * @param {*} value The value to search for.
 * @returns {number} Returns `0` if `value` is found, else `-1`.
 */
function cacheIndexOf(cache, value) {
  var data = cache.data,
      result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

  return result ? 0 : -1;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

module.exports = cacheIndexOf;

},{}],69:[function(require,module,exports){
(function (global){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isNative = require('lodash.isnative');

/** Native method references. */
var Set = isNative(Set = global.Set) && Set;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate;

/**
 *
 * Creates a cache object to store unique values.
 *
 * @private
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var length = values ? values.length : 0;

  this.data = { 'hash': nativeCreate(null), 'set': new Set };
  while (length--) {
    this.push(values[length]);
  }
}

/**
 * Adds `value` to the cache.
 *
 * @private
 * @name push
 * @memberOf SetCache
 * @param {*} value The value to cache.
 */
function cachePush(value) {
  var data = this.data;
  if (typeof value == 'string' || isObject(value)) {
    data.set.add(value);
  } else {
    data.hash[value] = true;
  }
}

/**
 * Creates a `Set` cache object to optimize linear searches of large arrays.
 *
 * @private
 * @param {Array} [values] The values to cache.
 * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
 */
var createCache = !(nativeCreate && Set) ? constant(null) : function(values) {
  return new SetCache(values);
};

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var getter = _.constant(object);
 *
 * getter() === object;
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

// Add functions to the `Set` cache.
SetCache.prototype.push = cachePush;

module.exports = createCache;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"lodash.isnative":70}],70:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],71:[function(require,module,exports){
/**
 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isArguments = require('lodash.isarguments'),
    isArray = require('lodash.isarray');

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * The base implementation of `_.flatten` with added support for restricting
 * flattening and specifying the start index.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {boolean} isDeep Specify a deep flatten.
 * @param {boolean} isStrict Restrict flattening to arrays and `arguments` objects.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, isDeep, isStrict) {
  var index = -1,
      length = array.length,
      resIndex = -1,
      result = [];

  while (++index < length) {
    var value = array[index];

    if (isObjectLike(value) && isLength(value.length) && (isArray(value) || isArguments(value))) {
      if (isDeep) {
        // Recursively flatten arrays (susceptible to call stack limits).
        value = baseFlatten(value, isDeep, isStrict);
      }
      var valIndex = -1,
          valLength = value.length;

      result.length += valLength;
      while (++valIndex < valLength) {
        result[++resIndex] = value[valIndex];
      }
    } else if (!isStrict) {
      result[++resIndex] = value;
    }
  }
  return result;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = baseFlatten;

},{"lodash.isarguments":72,"lodash.isarray":73}],72:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],73:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],74:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],75:[function(require,module,exports){
/**
 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseCallback = require('lodash._basecallback'),
    baseEach = require('lodash._baseeach'),
    baseFind = require('lodash._basefind'),
    baseFindIndex = require('lodash._basefindindex'),
    isArray = require('lodash.isarray'),
    keys = require('lodash.keys');

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new find function.
 */
function createFind(eachFunc, fromRight) {
  return function(collection, predicate, thisArg) {
    predicate = baseCallback(predicate, thisArg, 3);
    if (isArray(collection)) {
      var index = baseFindIndex(collection, predicate, fromRight);
      return index > -1 ? collection[index] : undefined;
    }
    return baseFind(collection, predicate, eachFunc);
  }
}

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is bound to `thisArg` and
 * invoked with three arguments: (value, index|key, collection).
 *
 * If a property name is provided for `predicate` the created `_.property`
 * style callback returns the property value of the given element.
 *
 * If a value is also provided for `thisArg` the created `_.matchesProperty`
 * style callback returns `true` for elements that have a matching property
 * value, else `false`.
 *
 * If an object is provided for `predicate` the created `_.matches` style
 * callback returns `true` for elements that have the properties of the given
 * object, else `false`.
 *
 * @static
 * @memberOf _
 * @alias detect
 * @category Collection
 * @param {Array|Object|string} collection The collection to search.
 * @param {Function|Object|string} [predicate=_.identity] The function invoked
 *  per iteration.
 * @param {*} [thisArg] The `this` binding of `predicate`.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.result(_.find(users, function(chr) {
 *   return chr.age < 40;
 * }), 'user');
 * // => 'barney'
 *
 * // using the `_.matches` callback shorthand
 * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
 * // => 'pebbles'
 *
 * // using the `_.matchesProperty` callback shorthand
 * _.result(_.find(users, 'active', false), 'user');
 * // => 'fred'
 *
 * // using the `_.property` callback shorthand
 * _.result(_.find(users, 'active'), 'user');
 * // => 'barney'
 */
var find = createFind(baseEach);

module.exports = find;

},{"lodash._basecallback":76,"lodash._baseeach":80,"lodash._basefind":81,"lodash._basefindindex":82,"lodash.isarray":83,"lodash.keys":84}],76:[function(require,module,exports){
/**
 * lodash 3.1.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseIsEqual = require('lodash._baseisequal'),
    bindCallback = require('lodash._bindcallback'),
    keys = require('lodash.keys');

/**
 * The base implementation of `_.callback` which supports specifying the
 * number of arguments to provide to `func`.
 *
 * @private
 * @param {*} [func=_.identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function baseCallback(func, thisArg, argCount) {
  var type = typeof func;
  if (type == 'function') {
    return typeof thisArg == 'undefined'
      ? func
      : bindCallback(func, thisArg, argCount);
  }
  if (func == null) {
    return identity;
  }
  if (type == 'object') {
    return baseMatches(func);
  }
  return typeof thisArg == 'undefined'
    ? baseProperty(func + '')
    : baseMatchesProperty(func + '', thisArg);
}

/**
 * The base implementation of `_.isMatch` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Array} props The source property names to match.
 * @param {Array} values The source values to match.
 * @param {Array} strictCompareFlags Strict comparison flags for source values.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, props, values, strictCompareFlags, customizer) {
  var index = -1,
      length = props.length,
      noCustomizer = !customizer;

  while (++index < length) {
    if ((noCustomizer && strictCompareFlags[index])
          ? values[index] !== object[props[index]]
          : !(props[index] in object)
        ) {
      return false;
    }
  }
  index = -1;
  while (++index < length) {
    var key = props[index],
        objValue = object[key],
        srcValue = values[index];

    if (noCustomizer && strictCompareFlags[index]) {
      var result = typeof objValue != 'undefined' || (key in object);
    } else {
      result = customizer ? customizer(objValue, srcValue, key) : undefined;
      if (typeof result == 'undefined') {
        result = baseIsEqual(srcValue, objValue, customizer, true);
      }
    }
    if (!result) {
      return false;
    }
  }
  return true;
}

/**
 * The base implementation of `_.matches` which does not clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new function.
 */
function baseMatches(source) {
  var props = keys(source),
      length = props.length;

  if (!length) {
    return constant(true);
  }
  if (length == 1) {
    var key = props[0],
        value = source[key];

    if (isStrictComparable(value)) {
      return function(object) {
        return object != null && object[key] === value &&
          (typeof value != 'undefined' || (key in toObject(object)));
      };
    }
  }
  var values = Array(length),
      strictCompareFlags = Array(length);

  while (length--) {
    value = source[props[length]];
    values[length] = value;
    strictCompareFlags[length] = isStrictComparable(value);
  }
  return function(object) {
    return object != null && baseIsMatch(toObject(object), props, values, strictCompareFlags);
  };
}

/**
 * The base implementation of `_.matchesProperty` which does not coerce `key`
 * to a string.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} value The value to compare.
 * @returns {Function} Returns the new function.
 */
function baseMatchesProperty(key, value) {
  if (isStrictComparable(value)) {
    return function(object) {
      return object != null && object[key] === value &&
        (typeof value != 'undefined' || (key in toObject(object)));
    };
  }
  return function(object) {
    return object != null && baseIsEqual(value, object[key], null, true);
  };
}

/**
 * The base implementation of `_.property` which does not coerce `key` to a string.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && (value === 0 ? ((1 / value) > 0) : !isObject(value));
}

/**
 * Converts `value` to an object if it is not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var getter = _.constant(object);
 *
 * getter() === object;
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = baseCallback;

},{"lodash._baseisequal":77,"lodash._bindcallback":79,"lodash.keys":84}],77:[function(require,module,exports){
/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isArray = require('lodash.isarray'),
    isTypedArray = require('lodash.istypedarray'),
    keys = require('lodash.keys');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    stringTag = '[object String]';

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * The base implementation of `_.isEqual` without support for `this` binding
 * `customizer` functions.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
  // Exit early for identical values.
  if (value === other) {
    // Treat `+0` vs. `-0` as not equal.
    return value !== 0 || (1 / value == 1 / other);
  }
  var valType = typeof value,
      othType = typeof other;

  // Exit early for unlike primitive values.
  if ((valType != 'function' && valType != 'object' && othType != 'function' && othType != 'object') ||
      value == null || other == null) {
    // Return `false` unless both values are `NaN`.
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = objToString.call(object);
    if (objTag == argsTag) {
      objTag = objectTag;
    } else if (objTag != objectTag) {
      objIsArr = isTypedArray(object);
    }
  }
  if (!othIsArr) {
    othTag = objToString.call(other);
    if (othTag == argsTag) {
      othTag = objectTag;
    } else if (othTag != objectTag) {
      othIsArr = isTypedArray(other);
    }
  }
  var objIsObj = (objTag == objectTag || (isLoose && objTag == funcTag)),
      othIsObj = (othTag == objectTag || (isLoose && othTag == funcTag)),
      isSameTag = objTag == othTag;

  if (isSameTag && !(objIsArr || objIsObj)) {
    return equalByTag(object, other, objTag);
  }
  if (isLoose) {
    if (!isSameTag && !(objIsObj && othIsObj)) {
      return false;
    }
  } else {
    var valWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (valWrapped || othWrapped) {
      return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
    }
    if (!isSameTag) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  // For more information on detecting circular references see https://es5.github.io/#JO.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == object) {
      return stackB[length] == other;
    }
  }
  // Add `object` and `other` to the stack of traversed objects.
  stackA.push(object);
  stackB.push(other);

  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

  stackA.pop();
  stackB.pop();

  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing arrays.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var index = -1,
      arrLength = array.length,
      othLength = other.length,
      result = true;

  if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
    return false;
  }
  // Deep compare the contents, ignoring non-numeric properties.
  while (result && ++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    result = undefined;
    if (customizer) {
      result = isLoose
        ? customizer(othValue, arrValue, index)
        : customizer(arrValue, othValue, index);
    }
    if (typeof result == 'undefined') {
      // Recursively compare arrays (susceptible to call stack limits).
      if (isLoose) {
        var othIndex = othLength;
        while (othIndex--) {
          othValue = other[othIndex];
          result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
          if (result) {
            break;
          }
        }
      } else {
        result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
      }
    }
  }
  return !!result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} value The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag) {
  switch (tag) {
    case boolTag:
    case dateTag:
      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
      return +object == +other;

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case numberTag:
      // Treat `NaN` vs. `NaN` as equal.
      return (object != +object)
        ? other != +other
        // But, treat `-0` vs. `+0` as not equal.
        : (object == 0 ? ((1 / object) == (1 / other)) : object == +other);

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings primitives and string
      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
      return object == (other + '');
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isLoose) {
    return false;
  }
  var skipCtor = isLoose,
      index = -1;

  while (++index < objLength) {
    var key = objProps[index],
        result = isLoose ? key in other : hasOwnProperty.call(other, key);

    if (result) {
      var objValue = object[key],
          othValue = other[key];

      result = undefined;
      if (customizer) {
        result = isLoose
          ? customizer(othValue, objValue, key)
          : customizer(objValue, othValue, key);
      }
      if (typeof result == 'undefined') {
        // Recursively compare objects (susceptible to call stack limits).
        result = (objValue && objValue === othValue) || equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB);
      }
    }
    if (!result) {
      return false;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (!skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      return false;
    }
  }
  return true;
}

module.exports = baseIsEqual;

},{"lodash.isarray":83,"lodash.istypedarray":78,"lodash.keys":84}],78:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dateTag] = typedArrayTags[errorTag] =
typedArrayTags[funcTag] = typedArrayTags[mapTag] =
typedArrayTags[numberTag] = typedArrayTags[objectTag] =
typedArrayTags[regexpTag] = typedArrayTags[setTag] =
typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
function isTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
}

module.exports = isTypedArray;

},{}],79:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],80:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35,"lodash.keys":84}],81:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
 * without support for callback shorthands and `this` binding, which iterates
 * over `collection` using the provided `eachFunc`.
 *
 * @private
 * @param {Array|Object|string} collection The collection to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @param {boolean} [retKey] Specify returning the key of the found element
 *  instead of the element itself.
 * @returns {*} Returns the found element or its key, else `undefined`.
 */
function baseFind(collection, predicate, eachFunc, retKey) {
  var result;
  eachFunc(collection, function(value, key, collection) {
    if (predicate(value, key, collection)) {
      result = retKey ? key : value;
      return false;
    }
  });
  return result;
}

module.exports = baseFind;

},{}],82:[function(require,module,exports){
/**
 * lodash 3.6.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for callback shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromRight) {
  var length = array.length,
      index = fromRight ? length : -1;

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;

},{}],83:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],84:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43,"lodash.isarguments":85,"lodash.isarray":83,"lodash.isnative":86}],85:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],86:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],87:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-dom-bindings"] = window.ampersand["ampersand-dom-bindings"] || [];  window.ampersand["ampersand-dom-bindings"].push("3.5.0");}
var Store = require('key-tree-store');
var dom = require('ampersand-dom');
var matchesSelector = require('matches-selector');


// returns a key-tree-store of functions
// that can be applied to any element/model.

// all resulting functions should be called
// like func(el, value, lastKeyName)
module.exports = function (bindings, context) {
    var store = new Store();
    var key, current;

    for (key in bindings) {
        current = bindings[key];
        if (typeof current === 'string') {
            store.add(key, getBindingFunc({
                type: 'text',
                selector: current
            }));
        } else if (current.forEach) {
            current.forEach(function (binding) {
                store.add(key, getBindingFunc(binding, context));
            });
        } else {
            store.add(key, getBindingFunc(current, context));
        }
    }

    return store;
};


var slice = Array.prototype.slice;

function getMatches(el, selector) {
    if (selector === '') return [el];
    var matches = [];
    if (matchesSelector(el, selector)) matches.push(el);
    return matches.concat(slice.call(el.querySelectorAll(selector)));
}

function setAttributes(el, attrs) {
    for (var name in attrs) {
        dom.setAttribute(el, name, attrs[name]);
    }
}

function removeAttributes(el, attrs) {
    for (var name in attrs) {
        dom.removeAttribute(el, name);
    }
}

function makeArray(val) {
    return Array.isArray(val) ? val : [val];
}

function getBindingFunc(binding, context) {
    var type = binding.type || 'text';
    var isCustomBinding = typeof type === 'function';
    var selector = (function () {
        if (typeof binding.selector === 'string') {
            return binding.selector;
        } else if (binding.hook) {
            return '[data-hook~="' + binding.hook + '"]';
        } else {
            return '';
        }
    })();
    var yes = binding.yes;
    var no = binding.no;
    var hasYesNo = !!(yes || no);

    // storage variable for previous if relevant
    var previousValue;

    if (isCustomBinding) {
        return function (el, value) {
            getMatches(el, selector).forEach(function (match) {
                type.call(context, match, value, previousValue);
            });
            previousValue = value;
        };
    } else if (type === 'text') {
        return function (el, value) {
            getMatches(el, selector).forEach(function (match) {
                dom.text(match, value);
            });
        };
    } else if (type === 'class') {
        return function (el, value) {
            getMatches(el, selector).forEach(function (match) {
                dom.switchClass(match, previousValue, value);
            });
            previousValue = value;
        };
    } else if (type === 'attribute') {
        if (!binding.name) throw Error('attribute bindings must have a "name"');
        return function (el, value) {
            var names = makeArray(binding.name);
            getMatches(el, selector).forEach(function (match) {
                names.forEach(function (name) {
                    dom.setAttribute(match, name, value);
                });
            });
            previousValue = value;
        };
    } else if (type === 'value') {
        return function (el, value) {
            getMatches(el, selector).forEach(function (match) {
                if (!value && value !== 0) value = '';
                // only apply bindings if element is not currently focused
                if (document.activeElement !== match) match.value = value;
            });
            previousValue = value;
        };
    } else if (type === 'booleanClass') {
        // if there's a `no` case this is actually a switch
        if (hasYesNo) {
            yes = makeArray(yes || '');
            no = makeArray(no || '');
            return function (el, value) {
                var prevClass = value ? no : yes;
                var newClass = value ? yes : no;
                getMatches(el, selector).forEach(function (match) {
                    prevClass.forEach(function (pc) {
                        dom.removeClass(match, pc);
                    });
                    newClass.forEach(function (nc) {
                        dom.addClass(match, nc);
                    });
                });
            };
        } else {
            return function (el, value, keyName) {
                var name = makeArray(binding.name || keyName);
                getMatches(el, selector).forEach(function (match) {
                    name.forEach(function (className) {
                        dom[value ? 'addClass' : 'removeClass'](match, className);
                    });
                });
            };
        }
    } else if (type === 'booleanAttribute') {
        // if there are `yes` and `no` selectors, this swaps between them
        if (hasYesNo) {
            yes = makeArray(yes || '');
            no = makeArray(no || '');
            return function (el, value) {
                var prevAttribute = value ? no : yes;
                var newAttribute = value ? yes : no;
                getMatches(el, selector).forEach(function (match) {
                    prevAttribute.forEach(function (pa) {
                        if (pa) {
                            dom.removeAttribute(match, pa);
                        }
                    });
                    newAttribute.forEach(function (na) {
                        if (na) {
                            dom.addAttribute(match, na);
                        }
                    });
                });
            };
        } else {
            return function (el, value, keyName) {
                var name = makeArray(binding.name || keyName);
                getMatches(el, selector).forEach(function (match) {
                    name.forEach(function (attr) {
                        dom[value ? 'addAttribute' : 'removeAttribute'](match, attr);
                    });
                });
            };
        }
    } else if (type === 'toggle') {
        var mode = (binding.mode || 'display');
        // this doesn't require a selector since we can pass yes/no selectors
        if (hasYesNo) {
            return function (el, value) {
                getMatches(el, yes).forEach(function (match) {
                    dom[value ? 'show' : 'hide'](match, mode);
                });
                getMatches(el, no).forEach(function (match) {
                    dom[value ? 'hide' : 'show'](match, mode);
                });
            };
        } else {
            return function (el, value) {
                getMatches(el, selector).forEach(function (match) {
                    dom[value ? 'show' : 'hide'](match, mode);
                });
            };
        }
    } else if (type === 'switch') {
        if (!binding.cases) throw Error('switch bindings must have "cases"');
        return function (el, value) {
            for (var item in binding.cases) {
                getMatches(el, binding.cases[item]).forEach(function (match) {
                    dom[value === item ? 'show' : 'hide'](match);
                });
            }
        };
    } else if (type === 'innerHTML') {
        return function (el, value) {
            getMatches(el, selector).forEach(function (match) {
                dom.html(match, value);
            });
        };
    } else if (type === 'switchClass') {
        if (!binding.cases) throw Error('switchClass bindings must have "cases"');
        return function (el, value, keyName) {
            var name = makeArray(binding.name || keyName);
            for (var item in binding.cases) {
                getMatches(el, binding.cases[item]).forEach(function (match) {
                    name.forEach(function (className) {
                        dom[value === item ? 'addClass' : 'removeClass'](match, className);
                    });
                });
            }
        };
    } else if (type === 'switchAttribute') {
        if (!binding.cases) throw Error('switchAttribute bindings must have "cases"');
        return function (el, value, keyName) {
            getMatches(el, selector).forEach(function (match) {
                if (previousValue) {
                    removeAttributes(match, previousValue);
                }

                if (value in binding.cases) {
                    var attrs = binding.cases[value];
                    if (typeof attrs === 'string') {
                        attrs = {};
                        attrs[binding.name || keyName] = binding.cases[value];
                    }
                    setAttributes(match, attrs);

                    previousValue = attrs;
                }
            });
        };
    } else {
        throw new Error('no such binding type: ' + type);
    }
}

},{"ampersand-dom":88,"key-tree-store":89,"matches-selector":215}],88:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-dom"] = window.ampersand["ampersand-dom"] || [];  window.ampersand["ampersand-dom"].push("1.4.0");}
var dom = module.exports = {
    text: function (el, val) {
        el.textContent = getString(val);
    },
    // optimize if we have classList
    addClass: function (el, cls) {
        cls = getString(cls);
        if (!cls) return;
        if (Array.isArray(cls)) {
            cls.forEach(function(c) {
                dom.addClass(el, c);
            });
        } else if (el.classList) {
            el.classList.add(cls);
        } else {
            if (!hasClass(el, cls)) {
                if (el.classList) {
                    el.classList.add(cls);
                } else {
                    el.className += ' ' + cls;
                }
            }
        }
    },
    removeClass: function (el, cls) {
        if (Array.isArray(cls)) {
            cls.forEach(function(c) {
                dom.removeClass(el, c);
            });
        } else if (el.classList) {
            cls = getString(cls);
            if (cls) el.classList.remove(cls);
        } else {
            // may be faster to not edit unless we know we have it?
            el.className = el.className.replace(new RegExp('(^|\\b)' + cls.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    },
    hasClass: hasClass,
    switchClass: function (el, prevCls, newCls) {
        if (prevCls) this.removeClass(el, prevCls);
        this.addClass(el, newCls);
    },
    // makes sure attribute (with no content) is added
    // if exists it will be cleared of content
    addAttribute: function (el, attr) {
        // setting to empty string does same
        el.setAttribute(attr, '');
        // Some browsers won't update UI for boolean attributes unless you
        // set it directly. So we do both
        if (hasBooleanProperty(el, attr)) el[attr] = true;
    },
    // completely removes attribute
    removeAttribute: function (el, attr) {
        el.removeAttribute(attr);
        if (hasBooleanProperty(el, attr)) el[attr] = false;
    },
    // sets attribute to string value given, clearing any current value
    setAttribute: function (el, attr, value) {
        el.setAttribute(attr, getString(value));
    },
    getAttribute: function (el, attr) {
        return el.getAttribute(attr);
    },
    hasAttribute: function (el, attr) {
        return el.hasAttribute(attr);
    },
    hide: function (el, mode) {
        if (!mode) mode = 'display';
        if (!isHidden(el)) {
            storeDisplayStyle(el, mode);
            hide(el, mode);
        }
    },
    // show element
    show: function (el, mode) {
        if (!mode) mode = 'display';
        show(el, mode);
    },
    html: function (el, content) {
        el.innerHTML = content;
    }
};

// helpers
function getString(val) {
    if (!val && val !== 0) {
        return '';
    } else {
        return val;
    }
}

function hasClass(el, cls) {
    if (el.classList) {
        return el.classList.contains(cls);
    } else {
        return new RegExp('(^| )' + cls + '( |$)', 'gi').test(el.className);
    }
}

function hasBooleanProperty(el, prop) {
    var val = el[prop];
    return prop in el && (val === true || val === false);
}

function isHidden (el) {
    return dom.getAttribute(el, 'data-anddom-hidden') === 'true';
}

function storeDisplayStyle (el, mode) {
    dom.setAttribute(el, 'data-anddom-' + mode, el.style[mode]);
}

function show (el, mode) {
    el.style[mode] = dom.getAttribute(el, 'data-anddom-' + mode) || '';
    dom.removeAttribute(el, 'data-anddom-hidden');
}

function hide (el, mode) {
    dom.setAttribute(el, 'data-anddom-hidden', 'true');
    el.style[mode] = (mode === 'visibility' ? 'hidden' : 'none');
}

},{}],89:[function(require,module,exports){
var slice = Array.prototype.slice;

// our constructor
function KeyTreeStore() {
    this.storage = {};
}

// add an object to the store
KeyTreeStore.prototype.add = function (keypath, obj) {
    var arr = this.storage[keypath] || (this.storage[keypath] = []);
    arr.push(obj);
};

// remove an object
KeyTreeStore.prototype.remove = function (obj) {
    var path, arr;
    for (path in this.storage) {
        arr = this.storage[path];
        arr.some(function (item, index) {
            if (item === obj) {
                arr.splice(index, 1);
                return true;
            }
        });
    }
};

// get array of all all relevant functions, without keys
KeyTreeStore.prototype.get = function (keypath) {
    var res = [];
    var key;

    for (key in this.storage) {
        if (!keypath || keypath === key || key.indexOf(keypath + '.') === 0) {
            res = res.concat(this.storage[key]);
        }
    }

    return res;
};

// get all results that match keypath but still grouped by key
KeyTreeStore.prototype.getGrouped = function (keypath) {
    var res = {};
    var key;

    for (key in this.storage) {
        if (!keypath || keypath === key || key.indexOf(keypath + '.') === 0) {
            res[key] = slice.call(this.storage[key]);
        }
    }

    return res;
};

// get all results that match keypath but still grouped by key
KeyTreeStore.prototype.getAll = function (keypath) {
    var res = {};
    var key;

    for (key in this.storage) {
        if (keypath === key || key.indexOf(keypath + '.') === 0) {
            res[key] = slice.call(this.storage[key]);
        }
    }

    return res;
};

// run all matches with optional context
KeyTreeStore.prototype.run = function (keypath, context) {
    var args = slice.call(arguments, 2);
    this.get(keypath).forEach(function (fn) {
        fn.apply(context || this, args);
    });
};



module.exports = KeyTreeStore;

},{}],90:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-state"] = window.ampersand["ampersand-state"] || [];  window.ampersand["ampersand-state"].push("4.5.2");}
var uniqueId = require('lodash.uniqueid');
var assign = require('lodash.assign');
var omit = require('lodash.omit');
var escape = require('lodash.escape');
var forEach = require('lodash.foreach');
var includes = require('lodash.includes');
var isString = require('lodash.isstring');
var isObject = require('lodash.isobject');
var isArray = require('lodash.isarray');
var isDate = require('lodash.isdate');
var isUndefined = require('lodash.isundefined');
var isFunction = require('lodash.isfunction');
var isNull = require('lodash.isnull');
var isEmpty = require('lodash.isempty');
var isEqual = require('lodash.isequal');
var clone = require('lodash.clone');
var has = require('lodash.has');
var result = require('lodash.result');
var keys = require('lodash.keys');
var bind = require('lodash.bind');
var defaults = require('lodash.defaults');
var union = require('lodash.union');
var Events = require('ampersand-events');
var KeyTree = require('key-tree-store');
var arrayNext = require('array-next');
var changeRE = /^change:/;

function Base(attrs, options) {
    options || (options = {});
    this.cid || (this.cid = uniqueId('state'));
    this._events = {};
    this._values = {};
    this._definition = Object.create(this._definition);
    if (options.parse) attrs = this.parse(attrs, options);
    this.parent = options.parent;
    this.collection = options.collection;
    this._keyTree = new KeyTree();
    this._initCollections();
    this._initChildren();
    this._cache = {};
    this._previousAttributes = {};
    if (attrs) this.set(attrs, assign({silent: true, initial: true}, options));
    this._changed = {};
    if (this._derived) this._initDerived();
    if (options.init !== false) this.initialize.apply(this, arguments);
}


assign(Base.prototype, Events, {
    // can be allow, ignore, reject
    extraProperties: 'ignore',

    idAttribute: 'id',

    namespaceAttribute: 'namespace',

    typeAttribute: 'modelType',

    // Stubbed out to be overwritten
    initialize: function () {
        return this;
    },

    // Get ID of model per configuration.
    // Should *always* be how ID is determined by other code.
    getId: function () {
        return this[this.idAttribute];
    },

    // Get namespace of model per configuration.
    // Should *always* be how namespace is determined by other code.
    getNamespace: function () {
        return this[this.namespaceAttribute];
    },

    // Get type of model per configuration.
    // Should *always* be how type is determined by other code.
    getType: function () {
        return this[this.typeAttribute];
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function () {
        return this.getId() == null;
    },

    // get HTML-escaped value of attribute
    escape: function (attr) {
        return escape(this.get(attr));
    },

    // Check if the model is currently in a valid state.
    isValid: function (options) {
        return this._validate({}, assign(options || {}, { validate: true }));
    },

    // Parse can be used remap/restructure/rename incoming properties
    // before they are applied to attributes.
    parse: function (resp, options) {
        //jshint unused:false
        return resp;
    },

    // Serialize is the inverse of `parse` it lets you massage data
    // on the way out. Before, sending to server, for example.
    serialize: function () {
        var res = this.getAttributes({props: true}, true);
        forEach(this._children, function (value, key) {
            res[key] = this[key].serialize();
        }, this);
        forEach(this._collections, function (value, key) {
            res[key] = this[key].serialize();
        }, this);
        return res;
    },

    // Main set method used by generated setters/getters and can
    // be used directly if you need to pass options or set multiple
    // properties at once.
    set: function (key, value, options) {
        var self = this;
        var extraProperties = this.extraProperties;
        var changing, changes, newType, newVal, def, cast, err, attr,
            attrs, dataType, silent, unset, currentVal, initial, hasChanged, isEqual;

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (isObject(key) || key === null) {
            attrs = key;
            options = value;
        } else {
            attrs = {};
            attrs[key] = value;
        }

        options = options || {};

        if (!this._validate(attrs, options)) return false;

        // Extract attributes and options.
        unset = options.unset;
        silent = options.silent;
        initial = options.initial;

        changes = [];
        changing = this._changing;
        this._changing = true;

        // if not already changing, store previous
        if (!changing) {
            this._previousAttributes = this.attributes;
            this._changed = {};
        }

        // For each `set` attribute...
        for (attr in attrs) {
            newVal = attrs[attr];
            newType = typeof newVal;
            currentVal = this._values[attr];
            def = this._definition[attr];


            if (!def) {
                // if this is a child model or collection
                if (this._children[attr] || this._collections[attr]) {
                    this[attr].set(newVal, options);
                    continue;
                } else if (extraProperties === 'ignore') {
                    continue;
                } else if (extraProperties === 'reject') {
                    throw new TypeError('No "' + attr + '" property defined on ' + (this.type || 'this') + ' model and extraProperties not set to "ignore" or "allow"');
                } else if (extraProperties === 'allow') {
                    def = this._createPropertyDefinition(attr, 'any');
                } else if (extraProperties) {
                    throw new TypeError('Invalid value for extraProperties: "' + extraProperties + '"');
                }
            }

            isEqual = this._getCompareForType(def.type);
            dataType = this._dataTypes[def.type];

            // check type if we have one
            if (dataType && dataType.set) {
                cast = dataType.set(newVal);
                newVal = cast.val;
                newType = cast.type;
            }

            // If we've defined a test, run it
            if (def.test) {
                err = def.test.call(this, newVal, newType);
                if (err) {
                    throw new TypeError('Property \'' + attr + '\' failed validation with error: ' + err);
                }
            }

            // If we are required but undefined, throw error.
            // If we are null and are not allowing null, throw error
            // If we have a defined type and the new type doesn't match, and we are not null, throw error.

            if (isUndefined(newVal) && def.required) {
                throw new TypeError('Required property \'' + attr + '\' must be of type ' + def.type + '. Tried to set ' + newVal);
            }
            if (isNull(newVal) && def.required && !def.allowNull) {
                throw new TypeError('Property \'' + attr + '\' must be of type ' + def.type + ' (cannot be null). Tried to set ' + newVal);
            }
            if ((def.type && def.type !== 'any' && def.type !== newType) && !isNull(newVal) && !isUndefined(newVal)) {
                throw new TypeError('Property \'' + attr + '\' must be of type ' + def.type + '. Tried to set ' + newVal);
            }
            if (def.values && !includes(def.values, newVal)) {
                throw new TypeError('Property \'' + attr + '\' must be one of values: ' + def.values.join(', ') + '. Tried to set ' + newVal);
            }

            hasChanged = !isEqual(currentVal, newVal, attr);

            // enforce `setOnce` for properties if set
            if (def.setOnce && currentVal !== undefined && hasChanged && !initial) {
                throw new TypeError('Property \'' + attr + '\' can only be set once.');
            }

            // keep track of changed attributes
            // and push to changes array
            if (hasChanged) {
                changes.push({prev: currentVal, val: newVal, key: attr});
                self._changed[attr] = newVal;
            } else {
                delete self._changed[attr];
            }
        }

        // actually update our values
        forEach(changes, function (change) {
            self._previousAttributes[change.key] = change.prev;
            if (unset) {
                delete self._values[change.key];
            } else {
                self._values[change.key] = change.val;
            }
        });

        if (!silent && changes.length) self._pending = true;
        if (!silent) {
            forEach(changes, function (change) {
                self.trigger('change:' + change.key, self, change.val, options);
            });
        }

        // You might be wondering why there's a `while` loop here. Changes can
        // be recursively nested within `"change"` events.
        if (changing) return this;
        if (!silent) {
            while (this._pending) {
                this._pending = false;
                this.trigger('change', this, options);
            }
        }
        this._pending = false;
        this._changing = false;
        return this;
    },

    get: function (attr) {
        return this[attr];
    },

    // Toggle boolean properties or properties that have a `values`
    // array in its definition.
    toggle: function (property) {
        var def = this._definition[property];
        if (def.type === 'boolean') {
            // if it's a bool, just flip it
            this[property] = !this[property];
        } else if (def && def.values) {
            // If it's a property with an array of values
            // skip to the next one looping back if at end.
            this[property] = arrayNext(def.values, this[property]);
        } else {
            throw new TypeError('Can only toggle properties that are type `boolean` or have `values` array.');
        }
        return this;
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function () {
        return clone(this._previousAttributes);
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function (attr) {
        if (attr == null) return !isEmpty(this._changed);
        return has(this._changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function (diff) {
        if (!diff) return this.hasChanged() ? clone(this._changed) : false;
        var val, changed = false;
        var old = this._changing ? this._previousAttributes : this.attributes;
        var def, isEqual;
        for (var attr in diff) {
            def = this._definition[attr];
            if (!def) continue;
            isEqual = this._getCompareForType(def.type);
            if (isEqual(old[attr], (val = diff[attr]))) continue;
            (changed || (changed = {}))[attr] = val;
        }
        return changed;
    },

    toJSON: function () {
        return this.serialize();
    },

    unset: function (attrs, options) {
        attrs = Array.isArray(attrs) ? attrs : [attrs];
        forEach(attrs, function (key) {
            var def = this._definition[key];
            var val;
            if (def.required) {
                val = result(def, 'default');
                return this.set(key, val, options);
            } else {
                return this.set(key, val, assign({}, options, {unset: true}));
            }
        }, this);
    },

    clear: function (options) {
        var self = this;
        forEach(keys(this.attributes), function (key) {
            self.unset(key, options);
        });
        return this;
    },

    previous: function (attr) {
        if (attr == null || !Object.keys(this._previousAttributes).length) return null;
        return this._previousAttributes[attr];
    },

    // Get default values for a certain type
    _getDefaultForType: function (type) {
        var dataType = this._dataTypes[type];
        return dataType && dataType.default;
    },

    // Determine which comparison algorithm to use for comparing a property
    _getCompareForType: function (type) {
        var dataType = this._dataTypes[type];
        if (dataType && dataType.compare) return bind(dataType.compare, this);
        return isEqual;
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function (attrs, options) {
        if (!options.validate || !this.validate) return true;
        attrs = assign({}, this.attributes, attrs);
        var error = this.validationError = this.validate(attrs, options) || null;
        if (!error) return true;
        this.trigger('invalid', this, error, assign(options || {}, {validationError: error}));
        return false;
    },

    _createPropertyDefinition: function (name, desc, isSession) {
        return createPropertyDefinition(this, name, desc, isSession);
    },

    // just makes friendlier errors when trying to define a new model
    // only used when setting up original property definitions
    _ensureValidType: function (type) {
        return includes(['string', 'number', 'boolean', 'array', 'object', 'date', 'any'].concat(keys(this._dataTypes)), type) ? type : undefined;
    },

    getAttributes: function (options, raw) {
        options || (options = {});
        defaults(options, {
            session: false,
            props: false,
            derived: false
        });
        var res = {};
        var val, item, def;
        for (item in this._definition) {
            def = this._definition[item];
            if ((options.session && def.session) || (options.props && !def.session)) {
                val = (raw) ? this._values[item] : this[item];
                if (typeof val === 'undefined') val = result(def, 'default');
                if (typeof val !== 'undefined') res[item] = val;
            }
        }
        if (options.derived) {
            for (item in this._derived) res[item] = this[item];
        }
        return res;
    },

    _initDerived: function () {
        var self = this;

        forEach(this._derived, function (value, name) {
            var def = self._derived[name];
            def.deps = def.depList;

            var update = function (options) {
                options = options || {};

                var newVal = def.fn.call(self);

                if (self._cache[name] !== newVal || !def.cache) {
                    if (def.cache) {
                        self._previousAttributes[name] = self._cache[name];
                    }
                    self._cache[name] = newVal;
                    self.trigger('change:' + name, self, self._cache[name]);
                }
            };

            def.deps.forEach(function (propString) {
                self._keyTree.add(propString, update);
            });
        });

        this.on('all', function (eventName) {
            if (changeRE.test(eventName)) {
                self._keyTree.get(eventName.split(':')[1]).forEach(function (fn) {
                    fn();
                });
            }
        }, this);
    },

    _getDerivedProperty: function (name, flushCache) {
        // is this a derived property that is cached
        if (this._derived[name].cache) {
            //set if this is the first time, or flushCache is set
            if (flushCache || !this._cache.hasOwnProperty(name)) {
                this._cache[name] = this._derived[name].fn.apply(this);
            }
            return this._cache[name];
        } else {
            return this._derived[name].fn.apply(this);
        }
    },

    _initCollections: function () {
        var coll;
        if (!this._collections) return;
        for (coll in this._collections) {
            this[coll] = new this._collections[coll](null, {parent: this});
        }
    },

    _initChildren: function () {
        var child;
        if (!this._children) return;
        for (child in this._children) {
            this[child] = new this._children[child]({}, {parent: this});
            this.listenTo(this[child], 'all', this._getEventBubblingHandler(child));
        }
    },

    // Returns a bound handler for doing event bubbling while
    // adding a name to the change string.
    _getEventBubblingHandler: function (propertyName) {
        return bind(function (name, model, newValue) {
            if (changeRE.test(name)) {
                this.trigger('change:' + propertyName + '.' + name.split(':')[1], model, newValue);
            } else if (name === 'change') {
                this.trigger('change', this);
            }
        }, this);
    },

    // Check that all required attributes are present
    _verifyRequired: function () {
        var attrs = this.attributes; // should include session
        for (var def in this._definition) {
            if (this._definition[def].required && typeof attrs[def] === 'undefined') {
                return false;
            }
        }
        return true;
    }
});

// getter for attributes
Object.defineProperties(Base.prototype, {
    attributes: {
        get: function () {
            return this.getAttributes({props: true, session: true});
        }
    },
    all: {
        get: function () {
            return this.getAttributes({
                session: true,
                props: true,
                derived: true
            });
        }
    },
    isState: {
        get: function () { return true; },
        set: function () { }
    }
});

// helper for creating/storing property definitions and creating
// appropriate getters/setters
function createPropertyDefinition(object, name, desc, isSession) {
    var def = object._definition[name] = {};
    var type, descArray;

    if (isString(desc)) {
        // grab our type if all we've got is a string
        type = object._ensureValidType(desc);
        if (type) def.type = type;
    } else {

        //Transform array of ['type', required, default] to object form
        if (isArray(desc)) {
            descArray = desc;
            desc = {
                type: descArray[0],
                required: descArray[1],
                default: descArray[2]
            };
        }

        type = object._ensureValidType(desc.type);
        if (type) def.type = type;

        if (desc.required) def.required = true;

        if (desc.default && typeof desc.default === 'object') {
            throw new TypeError('The default value for ' + name + ' cannot be an object/array, must be a value or a function which returns a value/object/array');
        }
        def.default = desc.default;

        def.allowNull = desc.allowNull ? desc.allowNull : false;
        if (desc.setOnce) def.setOnce = true;
        if (def.required && isUndefined(def.default) && !def.setOnce) def.default = object._getDefaultForType(type);
        def.test = desc.test;
        def.values = desc.values;
    }
    if (isSession) def.session = true;

    // define a getter/setter on the prototype
    // but they get/set on the instance
    Object.defineProperty(object, name, {
        set: function (val) {
            this.set(name, val);
        },
        get: function () {
            var value = this._values[name];
            var typeDef = this._dataTypes[def.type];
            if (typeof value !== 'undefined') {
                if (typeDef && typeDef.get) {
                    value = typeDef.get(value);
                }
                return value;
            }
            value = result(def, 'default');
            this._values[name] = value;
            return value;
        }
    });

    return def;
}

// helper for creating derived property definitions
function createDerivedProperty(modelProto, name, definition) {
    var def = modelProto._derived[name] = {
        fn: isFunction(definition) ? definition : definition.fn,
        cache: (definition.cache !== false),
        depList: definition.deps || []
    };

    // add to our shared dependency list
    forEach(def.depList, function (dep) {
        modelProto._deps[dep] = union(modelProto._deps[dep] || [], [name]);
    });

    // defined a top-level getter for derived names
    Object.defineProperty(modelProto, name, {
        get: function () {
            return this._getDerivedProperty(name);
        },
        set: function () {
            throw new TypeError('"' + name + '" is a derived property, it can\'t be set directly.');
        }
    });
}

var dataTypes = {
    string: {
        default: function () {
            return '';
        }
    },
    date: {
        set: function (newVal) {
            var newType;
            if (newVal == null) {
                newType = typeof null;
            } else if (!isDate(newVal)) {
                try {
                    var dateVal = new Date(newVal).valueOf();
                    if (isNaN(dateVal)) {
                        // If the newVal cant be parsed, then try parseInt first
                        dateVal = new Date(parseInt(newVal, 10)).valueOf();
                        if (isNaN(dateVal)) throw TypeError;
                    }
                    newVal = dateVal;
                    newType = 'date';
                } catch (e) {
                    newType = typeof newVal;
                }
            } else {
                newType = 'date';
                newVal = newVal.valueOf();
            }

            return {
                val: newVal,
                type: newType
            };
        },
        get: function (val) {
            if (val == null) { return val; }
            return new Date(val);
        },
        default: function () {
            return new Date();
        }
    },
    array: {
        set: function (newVal) {
            return {
                val: newVal,
                type: isArray(newVal) ? 'array' : typeof newVal
            };
        },
        default: function () {
            return [];
        }
    },
    object: {
        set: function (newVal) {
            var newType = typeof newVal;
            // we have to have a way of supporting "missing" objects.
            // Null is an object, but setting a value to undefined
            // should work too, IMO. We just override it, in that case.
            if (newType !== 'object' && isUndefined(newVal)) {
                newVal = null;
                newType = 'object';
            }
            return {
                val: newVal,
                type: newType
            };
        },
        default: function () {
            return {};
        }
    },
    // the `state` data type is a bit special in that setting it should
    // also bubble events
    state: {
        set: function (newVal) {
            var isInstance = newVal instanceof Base || (newVal && newVal.isState);
            if (isInstance) {
                return {
                    val: newVal,
                    type: 'state'
                };
            } else {
                return {
                    val: newVal,
                    type: typeof newVal
                };
            }
        },
        compare: function (currentVal, newVal, attributeName) {
            var isSame = currentVal === newVal;

            // if this has changed we want to also handle
            // event propagation
            if (!isSame) {
                if (currentVal) {
                    this.stopListening(currentVal);
                }

                if (newVal != null) {
                    this.listenTo(newVal, 'all', this._getEventBubblingHandler(attributeName));
                }
            }

            return isSame;
        }
    }
};

// the extend method used to extend prototypes, maintain inheritance chains for instanceof
// and allow for additions to the model definitions.
function extend(protoProps) {
    var parent = this;
    var child;
    var args = [].slice.call(arguments);

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
    } else {
        child = function () {
            return parent.apply(this, arguments);
        };
    }

    // Add static properties to the constructor function from parent
    assign(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function () { this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    // set prototype level objects
    child.prototype._derived =  assign({}, parent.prototype._derived);
    child.prototype._deps = assign({}, parent.prototype._deps);
    child.prototype._definition = assign({}, parent.prototype._definition);
    child.prototype._collections = assign({}, parent.prototype._collections);
    child.prototype._children = assign({}, parent.prototype._children);
    child.prototype._dataTypes = assign({}, parent.prototype._dataTypes || dataTypes);

    // Mix in all prototype properties to the subclass if supplied.
    if (protoProps) {
        var omitFromExtend = [
            'dataTypes', 'props', 'session', 'derived', 'collections', 'children'
        ];
        args.forEach(function processArg(def) {
            if (def.dataTypes) {
                forEach(def.dataTypes, function (def, name) {
                    child.prototype._dataTypes[name] = def;
                });
            }
            if (def.props) {
                forEach(def.props, function (def, name) {
                    createPropertyDefinition(child.prototype, name, def);
                });
            }
            if (def.session) {
                forEach(def.session, function (def, name) {
                    createPropertyDefinition(child.prototype, name, def, true);
                });
            }
            if (def.derived) {
                forEach(def.derived, function (def, name) {
                    createDerivedProperty(child.prototype, name, def);
                });
            }
            if (def.collections) {
                forEach(def.collections, function (constructor, name) {
                    child.prototype._collections[name] = constructor;
                });
            }
            if (def.children) {
                forEach(def.children, function (constructor, name) {
                    child.prototype._children[name] = constructor;
                });
            }
            assign(child.prototype, omit(def, omitFromExtend));
        });
    }

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
}

Base.extend = extend;

// Our main exports
module.exports = Base;

},{"ampersand-events":91,"array-next":94,"key-tree-store":95,"lodash.assign":161,"lodash.bind":171,"lodash.clone":96,"lodash.defaults":105,"lodash.escape":107,"lodash.foreach":182,"lodash.has":109,"lodash.includes":110,"lodash.isarray":114,"lodash.isdate":115,"lodash.isempty":116,"lodash.isequal":118,"lodash.isfunction":122,"lodash.isnull":123,"lodash.isobject":124,"lodash.isstring":197,"lodash.isundefined":125,"lodash.keys":126,"lodash.omit":129,"lodash.result":211,"lodash.union":145,"lodash.uniqueid":213}],91:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20,"lodash.assign":161,"lodash.bind":171,"lodash.foreach":182,"lodash.isempty":116,"lodash.keys":126,"lodash.once":92,"lodash.uniqueid":213}],92:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47,"lodash.before":93}],93:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"dup":48}],94:[function(require,module,exports){
module.exports = function arrayNext(array, currentItem) {
    var len = array.length;
    var newIndex = array.indexOf(currentItem) + 1;
    if (newIndex > (len - 1)) newIndex = 0;
    return array[newIndex];
};

},{}],95:[function(require,module,exports){
arguments[4][89][0].apply(exports,arguments)
},{"dup":89}],96:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseClone = require('lodash._baseclone'),
    bindCallback = require('lodash._bindcallback'),
    isIterateeCall = require('lodash._isiterateecall');

/**
 * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
 * otherwise they are assigned by reference. If `customizer` is provided it is
 * invoked to produce the cloned values. If `customizer` returns `undefined`
 * cloning is handled by the method instead. The `customizer` is bound to
 * `thisArg` and invoked with two argument; (value [, index|key, object]).
 *
 * **Note:** This method is loosely based on the structured clone algorithm.
 * The enumerable properties of `arguments` objects and objects created by
 * constructors other than `Object` are cloned to plain `Object` objects. An
 * empty object is returned for uncloneable values such as functions, DOM nodes,
 * Maps, Sets, and WeakMaps. See the [HTML5 specification](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {Function} [customizer] The function to customize cloning values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {*} Returns the cloned value.
 * @example
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * var shallow = _.clone(users);
 * shallow[0] === users[0];
 * // => true
 *
 * var deep = _.clone(users, true);
 * deep[0] === users[0];
 * // => false
 *
 * // using a customizer callback
 * var el = _.clone(document.body, function(value) {
 *   if (_.isElement(value)) {
 *     return value.cloneNode(false);
 *   }
 * });
 *
 * el === document.body
 * // => false
 * el.nodeName
 * // => BODY
 * el.childNodes.length;
 * // => 0
 */
function clone(value, isDeep, customizer, thisArg) {
  if (isDeep && typeof isDeep != 'boolean' && isIterateeCall(value, isDeep, customizer)) {
    isDeep = false;
  }
  else if (typeof isDeep == 'function') {
    thisArg = customizer;
    customizer = isDeep;
    isDeep = false;
  }
  customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 1);
  return baseClone(value, isDeep, customizer);
}

module.exports = clone;

},{"lodash._baseclone":97,"lodash._bindcallback":103,"lodash._isiterateecall":104}],97:[function(require,module,exports){
(function (global){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var arrayCopy = require('lodash._arraycopy'),
    arrayEach = require('lodash._arrayeach'),
    baseCopy = require('lodash._basecopy'),
    baseFor = require('lodash._basefor'),
    isArray = require('lodash.isarray'),
    isNative = require('lodash.isnative'),
    keys = require('lodash.keys');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
cloneableTags[dateTag] = cloneableTags[float32Tag] =
cloneableTags[float64Tag] = cloneableTags[int8Tag] =
cloneableTags[int16Tag] = cloneableTags[int32Tag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[stringTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[mapTag] = cloneableTags[setTag] =
cloneableTags[weakMapTag] = false;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Native method references. */
var ArrayBuffer = isNative(ArrayBuffer = global.ArrayBuffer) && ArrayBuffer,
    bufferSlice = isNative(bufferSlice = ArrayBuffer && new ArrayBuffer(0).slice) && bufferSlice,
    floor = Math.floor,
    Uint8Array = isNative(Uint8Array = global.Uint8Array) && Uint8Array;

/** Used to clone array buffers. */
var Float64Array = (function() {
  // Safari 5 errors when using an array buffer to initialize a typed array
  // where the array buffer's `byteLength` is not a multiple of the typed
  // array's `BYTES_PER_ELEMENT`.
  try {
    var func = isNative(func = global.Float64Array) && func,
        result = new func(new ArrayBuffer(10), 0, 1) && func;
  } catch(e) {}
  return result;
}());

/** Used as the size, in bytes, of each `Float64Array` element. */
var FLOAT64_BYTES_PER_ELEMENT = Float64Array ? Float64Array.BYTES_PER_ELEMENT : 0;

/**
 * The base implementation of `_.clone` without support for argument juggling
 * and `this` binding `customizer` functions.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {Function} [customizer] The function to customize cloning values.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The object `value` belongs to.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates clones with source counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object) : customizer(value);
  }
  if (typeof result != 'undefined') {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return arrayCopy(value, result);
    }
  } else {
    var tag = objToString.call(value),
        isFunc = tag == funcTag;

    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return baseCopy(value, result, keys(value));
      }
    } else {
      return cloneableTags[tag]
        ? initCloneByTag(value, tag, isDeep)
        : (object ? value : {});
    }
  }
  // Check for circular references and return corresponding clone.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == value) {
      return stackB[length];
    }
  }
  // Add the source value to the stack of traversed objects and associate it with its clone.
  stackA.push(value);
  stackB.push(result);

  // Recursively populate clone (susceptible to call stack limits).
  (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
    result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
  });
  return result;
}

/**
 * The base implementation of `_.forOwn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return baseFor(object, iteratee, keys);
}

/**
 * Creates a clone of the given array buffer.
 *
 * @private
 * @param {ArrayBuffer} buffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function bufferClone(buffer) {
  return bufferSlice.call(buffer, 0);
}
if (!bufferSlice) {
  // PhantomJS has `ArrayBuffer` and `Uint8Array` but not `Float64Array`.
  bufferClone = !(ArrayBuffer && Uint8Array) ? constant(null) : function(buffer) {
    var byteLength = buffer.byteLength,
        floatLength = Float64Array ? floor(byteLength / FLOAT64_BYTES_PER_ELEMENT) : 0,
        offset = floatLength * FLOAT64_BYTES_PER_ELEMENT,
        result = new ArrayBuffer(byteLength);

    if (floatLength) {
      var view = new Float64Array(result, 0, floatLength);
      view.set(new Float64Array(buffer, 0, floatLength));
    }
    if (byteLength != offset) {
      view = new Uint8Array(result, offset);
      view.set(new Uint8Array(buffer, offset));
    }
    return result;
  };
}

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add array properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  var Ctor = object.constructor;
  if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
    Ctor = Object;
  }
  return new Ctor;
}

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return bufferClone(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      var buffer = object.buffer;
      return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      var result = new Ctor(object.source, reFlags.exec(object));
      result.lastIndex = object.lastIndex;
  }
  return result;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var getter = _.constant(object);
 *
 * getter() === object;
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = baseClone;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"lodash._arraycopy":98,"lodash._arrayeach":99,"lodash._basecopy":100,"lodash._basefor":101,"lodash.isarray":114,"lodash.isnative":102,"lodash.keys":126}],98:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],99:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],100:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],101:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `baseForIn` and `baseForOwn` which iterates
 * over `object` properties returned by `keysFunc` invoking `iteratee` for
 * each property. Iterator functions may exit iteration early by explicitly
 * returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * Creates a base function for `_.forIn` or `_.forInRight`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var iterable = toObject(object),
        props = keysFunc(object),
        length = props.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      var key = props[index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * Converts `value` to an object if it is not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

module.exports = baseFor;

},{}],102:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],103:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],104:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],105:[function(require,module,exports){
/**
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var assign = require('lodash.assign'),
    restParam = require('lodash.restparam');

/**
 * Used by `_.defaults` to customize its `_.assign` use.
 *
 * @private
 * @param {*} objectValue The destination object property value.
 * @param {*} sourceValue The source object property value.
 * @returns {*} Returns the value to assign to the destination object.
 */
function assignDefaults(objectValue, sourceValue) {
  return typeof objectValue == 'undefined' ? sourceValue : objectValue;
}

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object for all destination properties that resolve to `undefined`. Once a
 * property is set, additional values of the same property are ignored.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
 * // => { 'user': 'barney', 'age': 36 }
 */
var defaults = restParam(function(args) {
  var object = args[0];
  if (object == null) {
    return object;
  }
  args.push(assignDefaults);
  return assign.apply(undefined, args);
});

module.exports = defaults;

},{"lodash.assign":161,"lodash.restparam":106}],106:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],107:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseToString = require('lodash._basetostring');

/** Used to match HTML entities and HTML characters. */
var reUnescapedHtml = /[&<>"'`]/g,
    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

/** Used to map characters to HTML entities. */
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;'
};

/**
 * Used by `_.escape` to convert characters to HTML entities.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
function escapeHtmlChar(chr) {
  return htmlEscapes[chr];
}

/**
 * Converts the characters "&", "<", ">", '"', "'", and '`', in `string` to
 * their corresponding HTML entities.
 *
 * **Note:** No other characters are escaped. To escape additional characters
 * use a third-party library like [_he_](https://mths.be/he).
 *
 * Though the ">" character is escaped for symmetry, characters like
 * ">" and "/" don't require escaping in HTML and have no special meaning
 * unless they're part of a tag or unquoted attribute value.
 * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
 * (under "semi-related fun fact") for more details.
 *
 * Backticks are escaped because in Internet Explorer < 9, they can break out
 * of attribute values or HTML comments. See [#102](https://html5sec.org/#102),
 * [#108](https://html5sec.org/#108), and [#133](https://html5sec.org/#133) of
 * the [HTML5 Security Cheatsheet](https://html5sec.org/) for more details.
 *
 * When working with HTML you should always quote attribute values to reduce
 * XSS vectors. See [Ryan Grove's article](http://wonko.com/post/html-escaping)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escape('fred, barney, & pebbles');
 * // => 'fred, barney, &amp; pebbles'
 */
function escape(string) {
  // Reset `lastIndex` because in IE < 9 `String#replace` does not.
  string = baseToString(string);
  return (string && reHasUnescapedHtml.test(string))
    ? string.replace(reUnescapedHtml, escapeHtmlChar)
    : string;
}

module.exports = escape;

},{"lodash._basetostring":108}],108:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"dup":50}],109:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if `key` exists as a direct property of `object` instead of an
 * inherited property.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to inspect.
 * @param {string} key The key to check.
 * @returns {boolean} Returns `true` if `key` is a direct property, else `false`.
 * @example
 *
 * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
 * // => true
 */
function has(object, key) {
  return object ? hasOwnProperty.call(object, key) : false;
}

module.exports = has;

},{}],110:[function(require,module,exports){
/**
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseIndexOf = require('lodash._baseindexof'),
    baseValues = require('lodash._basevalues'),
    isIterateeCall = require('lodash._isiterateecall'),
    isArray = require('lodash.isarray'),
    isString = require('lodash.isstring'),
    keys = require('lodash.keys');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is in `collection` using `SameValueZero` for equality
 * comparisons. If `fromIndex` is negative, it is used as the offset from
 * the end of `collection`.
 *
 * **Note:** [`SameValueZero`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
 * comparisons are like strict equality comparisons, e.g. `===`, except that
 * `NaN` matches `NaN`.
 *
 * @static
 * @memberOf _
 * @alias contains, include
 * @category Collection
 * @param {Array|Object|string} collection The collection to search.
 * @param {*} target The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
 * @returns {boolean} Returns `true` if a matching element is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
 * // => true
 *
 * _.includes('pebbles', 'eb');
 * // => true
 */
function includes(collection, target, fromIndex, guard) {
  var length = collection ? collection.length : 0;
  if (!isLength(length)) {
    collection = values(collection);
    length = collection.length;
  }
  if (!length) {
    return false;
  }
  if (typeof fromIndex != 'number' || (guard && isIterateeCall(target, fromIndex, guard))) {
    fromIndex = 0;
  } else {
    fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : (fromIndex || 0);
  }
  return (typeof collection == 'string' || !isArray(collection) && isString(collection))
    ? (fromIndex < length && collection.indexOf(target, fromIndex) > -1)
    : (baseIndexOf(collection, target, fromIndex) > -1);
}

/**
 * Creates an array of the own enumerable property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return baseValues(object, keys(object));
}

module.exports = includes;

},{"lodash._baseindexof":111,"lodash._basevalues":112,"lodash._isiterateecall":113,"lodash.isarray":114,"lodash.isstring":197,"lodash.keys":126}],111:[function(require,module,exports){
arguments[4][67][0].apply(exports,arguments)
},{"dup":67}],112:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * returned by `keysFunc`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  var index = -1,
      length = props.length,
      result = Array(length);

  while (++index < length) {
    result[index] = object[props[index]];
  }
  return result;
}

module.exports = baseValues;

},{}],113:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],114:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],115:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var dateTag = '[object Date]';

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Date` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isDate(new Date);
 * // => true
 *
 * _.isDate('Mon April 23 2012');
 * // => false
 */
function isDate(value) {
  return isObjectLike(value) && objToString.call(value) == dateTag;
}

module.exports = isDate;

},{}],116:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"dup":38,"lodash.isarguments":117,"lodash.isarray":114,"lodash.isfunction":122,"lodash.isstring":197,"lodash.keys":126}],117:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],118:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseIsEqual = require('lodash._baseisequal'),
    bindCallback = require('lodash._bindcallback');

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && (value === 0 ? ((1 / value) > 0) : !isObject(value));
}

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent. If `customizer` is provided it is invoked to compare values.
 * If `customizer` returns `undefined` comparisons are handled by the method
 * instead. The `customizer` is bound to `thisArg` and invoked with three
 * arguments: (value, other [, index|key]).
 *
 * **Note:** This method supports comparing arrays, booleans, `Date` objects,
 * numbers, `Object` objects, regexes, and strings. Objects are compared by
 * their own, not inherited, enumerable properties. Functions and DOM nodes
 * are **not** supported. Provide a customizer function to extend support
 * for comparing other values.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var other = { 'user': 'fred' };
 *
 * object == other;
 * // => false
 *
 * _.isEqual(object, other);
 * // => true
 *
 * // using a customizer callback
 * var array = ['hello', 'goodbye'];
 * var other = ['hi', 'goodbye'];
 *
 * _.isEqual(array, other, function(value, other) {
 *   if (_.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/)) {
 *     return true;
 *   }
 * });
 * // => true
 */
function isEqual(value, other, customizer, thisArg) {
  customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 3);
  if (!customizer && isStrictComparable(value) && isStrictComparable(other)) {
    return value === other;
  }
  var result = customizer ? customizer(value, other) : undefined;
  return typeof result == 'undefined' ? baseIsEqual(value, other, customizer) : !!result;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

module.exports = isEqual;

},{"lodash._baseisequal":119,"lodash._bindcallback":121}],119:[function(require,module,exports){
arguments[4][77][0].apply(exports,arguments)
},{"dup":77,"lodash.isarray":114,"lodash.istypedarray":120,"lodash.keys":126}],120:[function(require,module,exports){
arguments[4][78][0].apply(exports,arguments)
},{"dup":78}],121:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],122:[function(require,module,exports){
(function (global){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Used to match `RegExp` [special characters](http://www.regular-expressions.info/characters.html#special).
 * In addition to special characters the forward slash is escaped to allow for
 * easier `eval` use and `Function` compilation.
 */
var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
    reHasRegExpChars = RegExp(reRegExpChars.source);

/**
 * The base implementation of `_.isFunction` without support for environments
 * with incorrect `typeof` results.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 */
function baseIsFunction(value) {
  // Avoid a Chakra JIT bug in compatibility modes of IE 11.
  // See https://github.com/jashkenas/underscore/issues/1621 for more details.
  return typeof value == 'function' || false;
}

/**
 * Converts `value` to a string if it is not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  return value == null ? '' : (value + '');
}

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reNative = RegExp('^' +
  escapeRegExp(objToString)
  .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Native method references. */
var Uint8Array = isNative(Uint8Array = global.Uint8Array) && Uint8Array;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
var isFunction = !(baseIsFunction(/x/) || (Uint8Array && !baseIsFunction(Uint8Array))) ? baseIsFunction : function(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return objToString.call(value) == funcTag;
};

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (objToString.call(value) == funcTag) {
    return reNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reHostCtor.test(value);
}

/**
 * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
 * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escapeRegExp('[lodash](https://lodash.com/)');
 * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
 */
function escapeRegExp(string) {
  string = baseToString(string);
  return (string && reHasRegExpChars.test(string))
    ? string.replace(reRegExpChars, '\\$&')
    : string;
}

module.exports = isFunction;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],123:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is `null`.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
 * @example
 *
 * _.isNull(null);
 * // => true
 *
 * _.isNull(void 0);
 * // => false
 */
function isNull(value) {
  return value === null;
}

module.exports = isNull;

},{}],124:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

module.exports = isObject;

},{}],125:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return typeof value == 'undefined';
}

module.exports = isUndefined;

},{}],126:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43,"lodash.isarguments":127,"lodash.isarray":114,"lodash.isnative":128}],127:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],128:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],129:[function(require,module,exports){
/**
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var arrayMap = require('lodash._arraymap'),
    baseDifference = require('lodash._basedifference'),
    baseFlatten = require('lodash._baseflatten'),
    bindCallback = require('lodash._bindcallback'),
    pickByArray = require('lodash._pickbyarray'),
    pickByCallback = require('lodash._pickbycallback'),
    keysIn = require('lodash.keysin'),
    restParam = require('lodash.restparam');

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable properties of `object` that are not omitted.
 * Property names may be specified as individual arguments or as arrays of
 * property names. If `predicate` is provided it is invoked for each property
 * of `object` omitting the properties `predicate` returns truthy for. The
 * predicate is bound to `thisArg` and invoked with three arguments:
 * (value, key, object).
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {Function|...(string|string[])} [predicate] The function invoked per
 *  iteration or property names to omit, specified as individual property
 *  names or arrays of property names.
 * @param {*} [thisArg] The `this` binding of `predicate`.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'user': 'fred', 'age': 40 };
 *
 * _.omit(object, 'age');
 * // => { 'user': 'fred' }
 *
 * _.omit(object, _.isNumber);
 * // => { 'user': 'fred' }
 */
var omit = restParam(function(object, props) {
  if (object == null) {
    return {};
  }
  if (typeof props[0] != 'function') {
    var props = arrayMap(baseFlatten(props), String);
    return pickByArray(object, baseDifference(keysIn(object), props));
  }
  var predicate = bindCallback(props[0], props[1], 3);
  return pickByCallback(object, function(value, key, object) {
    return !predicate(value, key, object);
  });
});

module.exports = omit;

},{"lodash._arraymap":130,"lodash._basedifference":131,"lodash._baseflatten":136,"lodash._bindcallback":138,"lodash._pickbyarray":139,"lodash._pickbycallback":140,"lodash.keysin":142,"lodash.restparam":144}],130:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * A specialized version of `_.map` for arrays without support for callback
 * shorthands or `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],131:[function(require,module,exports){
arguments[4][66][0].apply(exports,arguments)
},{"dup":66,"lodash._baseindexof":132,"lodash._cacheindexof":133,"lodash._createcache":134}],132:[function(require,module,exports){
arguments[4][67][0].apply(exports,arguments)
},{"dup":67}],133:[function(require,module,exports){
arguments[4][68][0].apply(exports,arguments)
},{"dup":68}],134:[function(require,module,exports){
(function (global){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isNative = require('lodash.isnative');

/** Native method references. */
var Set = isNative(Set = global.Set) && Set;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate;

/**
 *
 * Creates a cache object to store unique values.
 *
 * @private
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var length = values ? values.length : 0;

  this.data = { 'hash': nativeCreate(null), 'set': new Set };
  while (length--) {
    this.push(values[length]);
  }
}

/**
 * Adds `value` to the cache.
 *
 * @private
 * @name push
 * @memberOf SetCache
 * @param {*} value The value to cache.
 */
function cachePush(value) {
  var data = this.data;
  if (typeof value == 'string' || isObject(value)) {
    data.set.add(value);
  } else {
    data.hash[value] = true;
  }
}

/**
 * Creates a `Set` cache object to optimize linear searches of large arrays.
 *
 * @private
 * @param {Array} [values] The values to cache.
 * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
 */
var createCache = !(nativeCreate && Set) ? constant(null) : function(values) {
  return new SetCache(values);
};

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var getter = _.constant(object);
 *
 * getter() === object;
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

// Add functions to the `Set` cache.
SetCache.prototype.push = cachePush;

module.exports = createCache;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"lodash.isnative":135}],135:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],136:[function(require,module,exports){
arguments[4][71][0].apply(exports,arguments)
},{"dup":71,"lodash.isarguments":137,"lodash.isarray":114}],137:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],138:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],139:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * A specialized version of `_.pick` that picks `object` properties specified
 * by the `props` array.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} props The property names to pick.
 * @returns {Object} Returns the new object.
 */
function pickByArray(object, props) {
  object = toObject(object);

  var index = -1,
      length = props.length,
      result = {};

  while (++index < length) {
    var key = props[index];
    if (key in object) {
      result[key] = object[key];
    }
  }
  return result;
}

/**
 * Converts `value` to an object if it is not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

module.exports = pickByArray;

},{}],140:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseFor = require('lodash._basefor'),
    keysIn = require('lodash.keysin');

/**
 * The base implementation of `_.forIn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForIn(object, iteratee) {
  return baseFor(object, iteratee, keysIn);
}

/**
 * A specialized version of `_.pick` that picks `object` properties `predicate`
 * returns truthy for.
 *
 * @private
 * @param {Object} object The source object.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Object} Returns the new object.
 */
function pickByCallback(object, predicate) {
  var result = {};
  baseForIn(object, function(value, key, object) {
    if (predicate(value, key, object)) {
      result[key] = value;
    }
  });
  return result;
}

module.exports = pickByCallback;

},{"lodash._basefor":141,"lodash.keysin":142}],141:[function(require,module,exports){
arguments[4][101][0].apply(exports,arguments)
},{"dup":101}],142:[function(require,module,exports){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isArguments = require('lodash.isarguments'),
    isArray = require('lodash.isarray');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * An object environment feature flags.
 *
 * @static
 * @memberOf _
 * @type Object
 */
var support = {};

(function(x) {

  /**
   * Detect if `arguments` object indexes are non-enumerable.
   *
   * In Firefox < 4, IE < 9, PhantomJS, and Safari < 5.1 `arguments` object
   * indexes are non-enumerable. Chrome < 25 and Node.js < 0.11.0 treat
   * `arguments` object indexes as non-enumerable and fail `hasOwnProperty`
   * checks for indexes that exceed their function's formal parameters with
   * associated values of `0`.
   *
   * @memberOf _.support
   * @type boolean
   */
  try {
    support.nonEnumArgs = !propertyIsEnumerable.call(arguments, 1);
  } catch(e) {
    support.nonEnumArgs = true;
  }
}(0, 0));

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = +value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || (support.nonEnumArgs && isArguments(object))) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"lodash.isarguments":143,"lodash.isarray":114}],143:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],144:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],145:[function(require,module,exports){
/**
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseFlatten = require('lodash._baseflatten'),
    baseUniq = require('lodash._baseuniq'),
    restParam = require('lodash.restparam');

/**
 * Creates an array of unique values, in order, of the provided arrays using
 * `SameValueZero` for equality comparisons.
 *
 * **Note:** [`SameValueZero`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
 * comparisons are like strict equality comparisons, e.g. `===`, except that
 * `NaN` matches `NaN`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.union([1, 2], [4, 2], [2, 1]);
 * // => [1, 2, 4]
 */
var union = restParam(function(arrays) {
  return baseUniq(baseFlatten(arrays, false, true));
});

module.exports = union;

},{"lodash._baseflatten":146,"lodash._baseuniq":148,"lodash.restparam":153}],146:[function(require,module,exports){
arguments[4][71][0].apply(exports,arguments)
},{"dup":71,"lodash.isarguments":147,"lodash.isarray":114}],147:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],148:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseIndexOf = require('lodash._baseindexof'),
    cacheIndexOf = require('lodash._cacheindexof'),
    createCache = require('lodash._createcache');

/**
 * The base implementation of `_.uniq` without support for callback shorthands
 * and `this` binding.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The function invoked per iteration.
 * @returns {Array} Returns the new duplicate-value-free array.
 */
function baseUniq(array, iteratee) {
  var index = -1,
      indexOf = baseIndexOf,
      length = array.length,
      isCommon = true,
      isLarge = isCommon && length >= 200,
      seen = isLarge ? createCache() : null,
      result = [];

  if (seen) {
    indexOf = cacheIndexOf;
    isCommon = false;
  } else {
    isLarge = false;
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value, index, array) : value;

    if (isCommon && value === value) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (indexOf(seen, computed, 0) < 0) {
      if (iteratee || isLarge) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseUniq;

},{"lodash._baseindexof":149,"lodash._cacheindexof":150,"lodash._createcache":151}],149:[function(require,module,exports){
arguments[4][67][0].apply(exports,arguments)
},{"dup":67}],150:[function(require,module,exports){
arguments[4][68][0].apply(exports,arguments)
},{"dup":68}],151:[function(require,module,exports){
(function (global){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isNative = require('lodash.isnative');

/** Native method references. */
var Set = isNative(Set = global.Set) && Set;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate;

/**
 *
 * Creates a cache object to store unique values.
 *
 * @private
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var length = values ? values.length : 0;

  this.data = { 'hash': nativeCreate(null), 'set': new Set };
  while (length--) {
    this.push(values[length]);
  }
}

/**
 * Adds `value` to the cache.
 *
 * @private
 * @name push
 * @memberOf SetCache
 * @param {*} value The value to cache.
 */
function cachePush(value) {
  var data = this.data;
  if (typeof value == 'string' || isObject(value)) {
    data.set.add(value);
  } else {
    data.hash[value] = true;
  }
}

/**
 * Creates a `Set` cache object to optimize linear searches of large arrays.
 *
 * @private
 * @param {Array} [values] The values to cache.
 * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
 */
var createCache = !(nativeCreate && Set) ? constant(null) : function(values) {
  return new SetCache(values);
};

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var getter = _.constant(object);
 *
 * getter() === object;
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

// Add functions to the `Set` cache.
SetCache.prototype.push = cachePush;

module.exports = createCache;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"lodash.isnative":152}],152:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],153:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],154:[function(require,module,exports){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Tests for browser support.
 */

var div = document.createElement('div');
// Setup
div.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
// Make sure that link elements get serialized correctly by innerHTML
// This requires a wrapper element in IE
var innerHTMLBug = !div.getElementsByTagName('link').length;
div = undefined;

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.polyline =
map.ellipse =
map.polygon =
map.circle =
map.text =
map.line =
map.path =
map.rect =
map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

},{}],155:[function(require,module,exports){

/**
 * Module dependencies.
 */

var events = require('component-event');
var delegate = require('delegate-events');
var forceCaptureEvents = ['focus', 'blur'];

/**
 * Expose `Events`.
 */

module.exports = Events;

/**
 * Initialize an `Events` with the given
 * `el` object which events will be bound to,
 * and the `obj` which will receive method calls.
 *
 * @param {Object} el
 * @param {Object} obj
 * @api public
 */

function Events(el, obj) {
  if (!(this instanceof Events)) return new Events(el, obj);
  if (!el) throw new Error('element required');
  if (!obj) throw new Error('object required');
  this.el = el;
  this.obj = obj;
  this._events = {};
}

/**
 * Subscription helper.
 */

Events.prototype.sub = function(event, method, cb){
  this._events[event] = this._events[event] || {};
  this._events[event][method] = cb;
};

/**
 * Bind to `event` with optional `method` name.
 * When `method` is undefined it becomes `event`
 * with the "on" prefix.
 *
 * Examples:
 *
 *  Direct event handling:
 *
 *    events.bind('click') // implies "onclick"
 *    events.bind('click', 'remove')
 *    events.bind('click', 'sort', 'asc')
 *
 *  Delegated event handling:
 *
 *    events.bind('click li > a')
 *    events.bind('click li > a', 'remove')
 *    events.bind('click a.sort-ascending', 'sort', 'asc')
 *    events.bind('click a.sort-descending', 'sort', 'desc')
 *
 * @param {String} event
 * @param {String|function} [method]
 * @return {Function} callback
 * @api public
 */

Events.prototype.bind = function(event, method){
  var e = parse(event);
  var el = this.el;
  var obj = this.obj;
  var name = e.name;
  var method = method || 'on' + name;
  var args = [].slice.call(arguments, 2);

  // callback
  function cb(){
    var a = [].slice.call(arguments).concat(args);

    if (typeof method === 'function') {
        method.apply(obj, a);    
        return;
    }
    
    if (!obj[method]) {
        throw new Error(method + ' method is not defined');
    } else {
        obj[method].apply(obj, a);
    }
  }

  // bind
  if (e.selector) {
    cb = delegate.bind(el, e.selector, name, cb);
  } else {
    events.bind(el, name, cb);
  }

  // subscription for unbinding
  this.sub(name, method, cb);

  return cb;
};

/**
 * Unbind a single binding, all bindings for `event`,
 * or all bindings within the manager.
 *
 * Examples:
 *
 *  Unbind direct handlers:
 *
 *     events.unbind('click', 'remove')
 *     events.unbind('click')
 *     events.unbind()
 *
 * Unbind delegate handlers:
 *
 *     events.unbind('click', 'remove')
 *     events.unbind('click')
 *     events.unbind()
 *
 * @param {String|Function} [event]
 * @param {String|Function} [method]
 * @api public
 */

Events.prototype.unbind = function(event, method){
  if (0 == arguments.length) return this.unbindAll();
  if (1 == arguments.length) return this.unbindAllOf(event);

  // no bindings for this event
  var bindings = this._events[event];
  var capture = (forceCaptureEvents.indexOf(event) !== -1);
  if (!bindings) return;

  // no bindings for this method
  var cb = bindings[method];
  if (!cb) return;

  events.unbind(this.el, event, cb, capture);
};

/**
 * Unbind all events.
 *
 * @api private
 */

Events.prototype.unbindAll = function(){
  for (var event in this._events) {
    this.unbindAllOf(event);
  }
};

/**
 * Unbind all events for `event`.
 *
 * @param {String} event
 * @api private
 */

Events.prototype.unbindAllOf = function(event){
  var bindings = this._events[event];
  if (!bindings) return;

  for (var method in bindings) {
    this.unbind(event, method);
  }
};

/**
 * Parse `event`.
 *
 * @param {String} event
 * @return {Object}
 * @api private
 */

function parse(event) {
  var parts = event.split(/ +/);
  return {
    name: parts.shift(),
    selector: parts.join(' ')
  }
}

},{"component-event":156,"delegate-events":157}],156:[function(require,module,exports){
var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  el[bind](prefix + type, fn, capture || false);
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  el[unbind](prefix + type, fn, capture || false);
  return fn;
};
},{}],157:[function(require,module,exports){
/**
 * Module dependencies.
 */

var closest = require('closest')
  , event = require('event');

/**
 * Delegate event `type` to `selector`
 * and invoke `fn(e)`. A callback function
 * is returned which may be passed to `.unbind()`.
 *
 * @param {Element} el
 * @param {String} selector
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

// Some events don't bubble, so we want to bind to the capture phase instead
// when delegating.
var forceCaptureEvents = ['focus', 'blur'];

exports.bind = function(el, selector, type, fn, capture){
  if (forceCaptureEvents.indexOf(type) !== -1) capture = true;

  return event.bind(el, type, function(e){
    var target = e.target || e.srcElement;
    e.delegateTarget = closest(target, selector, true, el);
    if (e.delegateTarget) fn.call(el, e);
  }, capture);
};

/**
 * Unbind event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  if (forceCaptureEvents.indexOf(type) !== -1) capture = true;

  event.unbind(el, type, fn, capture);
};

},{"closest":158,"event":156}],158:[function(require,module,exports){
var matches = require('matches-selector')

module.exports = function (element, selector, checkYoSelf) {
  var parent = checkYoSelf ? element : element.parentNode

  while (parent && parent !== document) {
    if (matches(parent, selector)) return parent;
    parent = parent.parentNode
  }
}

},{"matches-selector":159}],159:[function(require,module,exports){

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}
},{}],160:[function(require,module,exports){
module.exports = get;

function get (context, path) {
  if (path.indexOf('.') == -1 && path.indexOf('[') == -1) {
    return context[path];
  }

  var crumbs = path.split(/\.|\[|\]/g);
  var i = -1;
  var len = crumbs.length;
  var result;

  while (++i < len) {
    if (i == 0) result = context;
    if (!crumbs[i]) continue;
    if (result == undefined) break;
    result = result[crumbs[i]];
  }

  return result;
}

},{}],161:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21,"lodash._baseassign":162,"lodash._createassigner":168}],162:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22,"lodash._basecopy":163,"lodash.keys":164}],163:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],164:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43,"lodash.isarguments":165,"lodash.isarray":166,"lodash.isnative":167}],165:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],166:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],167:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],168:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24,"lodash._bindcallback":169,"lodash._isiterateecall":170}],169:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],170:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],171:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27,"lodash._createwrapper":172,"lodash._replaceholders":175,"lodash.restparam":176}],172:[function(require,module,exports){
(function (global){
/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var arrayCopy = require('lodash._arraycopy'),
    baseCreate = require('lodash._basecreate'),
    replaceHolders = require('lodash._replaceholders');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_BOUND_FLAG = 4,
    CURRY_FLAG = 8,
    CURRY_RIGHT_FLAG = 16,
    PARTIAL_FLAG = 32,
    PARTIAL_RIGHT_FLAG = 64,
    ARY_FLAG = 128;

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * Creates an array that is the composition of partially applied arguments,
 * placeholders, and provided arguments into a single array of arguments.
 *
 * @private
 * @param {Array|Object} args The provided arguments.
 * @param {Array} partials The arguments to prepend to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgs(args, partials, holders) {
  var holdersLength = holders.length,
      argsIndex = -1,
      argsLength = nativeMax(args.length - holdersLength, 0),
      leftIndex = -1,
      leftLength = partials.length,
      result = Array(argsLength + leftLength);

  while (++leftIndex < leftLength) {
    result[leftIndex] = partials[leftIndex];
  }
  while (++argsIndex < holdersLength) {
    result[holders[argsIndex]] = args[argsIndex];
  }
  while (argsLength--) {
    result[leftIndex++] = args[argsIndex++];
  }
  return result;
}

/**
 * This function is like `composeArgs` except that the arguments composition
 * is tailored for `_.partialRight`.
 *
 * @private
 * @param {Array|Object} args The provided arguments.
 * @param {Array} partials The arguments to append to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgsRight(args, partials, holders) {
  var holdersIndex = -1,
      holdersLength = holders.length,
      argsIndex = -1,
      argsLength = nativeMax(args.length - holdersLength, 0),
      rightIndex = -1,
      rightLength = partials.length,
      result = Array(argsLength + rightLength);

  while (++argsIndex < argsLength) {
    result[argsIndex] = args[argsIndex];
  }
  var pad = argsIndex;
  while (++rightIndex < rightLength) {
    result[pad + rightIndex] = partials[rightIndex];
  }
  while (++holdersIndex < holdersLength) {
    result[pad + holders[holdersIndex]] = args[argsIndex++];
  }
  return result;
}

/**
 * Creates a function that wraps `func` and invokes it with the `this`
 * binding of `thisArg`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @returns {Function} Returns the new bound function.
 */
function createBindWrapper(func, thisArg) {
  var Ctor = createCtorWrapper(func);

  function wrapper() {
    var fn = (this && this !== global && this instanceof wrapper) ? Ctor : func;
    return fn.apply(thisArg, arguments);
  }
  return wrapper;
}

/**
 * Creates a function that produces an instance of `Ctor` regardless of
 * whether it was invoked as part of a `new` expression or by `call` or `apply`.
 *
 * @private
 * @param {Function} Ctor The constructor to wrap.
 * @returns {Function} Returns the new wrapped function.
 */
function createCtorWrapper(Ctor) {
  return function() {
    var thisBinding = baseCreate(Ctor.prototype),
        result = Ctor.apply(thisBinding, arguments);

    // Mimic the constructor's `return` behavior.
    // See https://es5.github.io/#x13.2.2 for more details.
    return isObject(result) ? result : thisBinding;
  };
}

/**
 * Creates a function that wraps `func` and invokes it with optional `this`
 * binding of, partial application, and currying.
 *
 * @private
 * @param {Function|string} func The function or method name to reference.
 * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
 * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & ARY_FLAG,
      isBind = bitmask & BIND_FLAG,
      isBindKey = bitmask & BIND_KEY_FLAG,
      isCurry = bitmask & CURRY_FLAG,
      isCurryBound = bitmask & CURRY_BOUND_FLAG,
      isCurryRight = bitmask & CURRY_RIGHT_FLAG;

  var Ctor = !isBindKey && createCtorWrapper(func),
      key = func;

  function wrapper() {
    // Avoid `arguments` object use disqualifying optimizations by
    // converting it to an array before providing it to other functions.
    var length = arguments.length,
        index = length,
        args = Array(length);

    while (index--) {
      args[index] = arguments[index];
    }
    if (partials) {
      args = composeArgs(args, partials, holders);
    }
    if (partialsRight) {
      args = composeArgsRight(args, partialsRight, holdersRight);
    }
    if (isCurry || isCurryRight) {
      var placeholder = wrapper.placeholder,
          argsHolders = replaceHolders(args, placeholder);

      length -= argsHolders.length;
      if (length < arity) {
        var newArgPos = argPos ? arrayCopy(argPos) : null,
            newArity = nativeMax(arity - length, 0),
            newsHolders = isCurry ? argsHolders : null,
            newHoldersRight = isCurry ? null : argsHolders,
            newPartials = isCurry ? args : null,
            newPartialsRight = isCurry ? null : args;

        bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
        bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

        if (!isCurryBound) {
          bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
        }
        var result = createHybridWrapper(func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, newArity);

        result.placeholder = placeholder;
        return result;
      }
    }
    var thisBinding = isBind ? thisArg : this;
    if (isBindKey) {
      func = thisBinding[key];
    }
    if (argPos) {
      args = reorder(args, argPos);
    }
    if (isAry && ary < args.length) {
      args.length = ary;
    }
    var fn = (this && this !== global && this instanceof wrapper) ? (Ctor || createCtorWrapper(func)) : func;
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}

/**
 * Creates a function that wraps `func` and invokes it with the optional `this`
 * binding of `thisArg` and the `partials` prepended to those provided to
 * the wrapper.
 *
 * @private
 * @param {Function} func The function to partially apply arguments to.
 * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} partials The arguments to prepend to those provided to the new function.
 * @returns {Function} Returns the new bound function.
 */
function createPartialWrapper(func, bitmask, thisArg, partials) {
  var isBind = bitmask & BIND_FLAG,
      Ctor = createCtorWrapper(func);

  function wrapper() {
    // Avoid `arguments` object use disqualifying optimizations by
    // converting it to an array before providing it `func`.
    var argsIndex = -1,
        argsLength = arguments.length,
        leftIndex = -1,
        leftLength = partials.length,
        args = Array(argsLength + leftLength);

    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }
    var fn = (this && this !== global && this instanceof wrapper) ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, args);
  }
  return wrapper;
}

/**
 * Creates a function that either curries or invokes `func` with optional
 * `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to reference.
 * @param {number} bitmask The bitmask of flags.
 *  The bitmask may be composed of the following flags:
 *     1 - `_.bind`
 *     2 - `_.bindKey`
 *     4 - `_.curry` or `_.curryRight` of a bound function
 *     8 - `_.curry`
 *    16 - `_.curryRight`
 *    32 - `_.partial`
 *    64 - `_.partialRight`
 *   128 - `_.rearg`
 *   256 - `_.ary`
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to be partially applied.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & BIND_KEY_FLAG;
  if (!isBindKey && typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
    partials = holders = null;
  }
  length -= (holders ? holders.length : 0);
  if (bitmask & PARTIAL_RIGHT_FLAG) {
    var partialsRight = partials,
        holdersRight = holders;

    partials = holders = null;
  }
  var newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];

  newData[9] = arity == null
    ? (isBindKey ? 0 : func.length)
    : (nativeMax(arity - length, 0) || 0);

  if (bitmask == BIND_FLAG) {
    var result = createBindWrapper(newData[0], newData[2]);
  } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !newData[4].length) {
    result = createPartialWrapper.apply(undefined, newData);
  } else {
    result = createHybridWrapper.apply(undefined, newData);
  }
  return result;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = +value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Reorder `array` according to the specified indexes where the element at
 * the first index is assigned as the first element, the element at
 * the second index is assigned as the second element, and so on.
 *
 * @private
 * @param {Array} array The array to reorder.
 * @param {Array} indexes The arranged array indexes.
 * @returns {Array} Returns `array`.
 */
function reorder(array, indexes) {
  var arrLength = array.length,
      length = nativeMin(indexes.length, arrLength),
      oldArray = arrayCopy(array);

  while (length--) {
    var index = indexes[length];
    array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
  }
  return array;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

module.exports = createWrapper;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"lodash._arraycopy":173,"lodash._basecreate":174,"lodash._replaceholders":175}],173:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],174:[function(require,module,exports){
(function (global){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function Object() {}
  return function(prototype) {
    if (isObject(prototype)) {
      Object.prototype = prototype;
      var result = new Object;
      Object.prototype = null;
    }
    return result || global.Object();
  };
}());

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

module.exports = baseCreate;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],175:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],176:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],177:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseFlatten = require('lodash._baseflatten'),
    isIterateeCall = require('lodash._isiterateecall');

/**
 * Flattens a nested array. If `isDeep` is `true` the array is recursively
 * flattened, otherwise it is only flattened a single level.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to flatten.
 * @param {boolean} [isDeep] Specify a deep flatten.
 * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, 3, [4]]]);
 * // => [1, 2, 3, [4]]
 *
 * // using `isDeep`
 * _.flatten([1, [2, 3, [4]]], true);
 * // => [1, 2, 3, 4]
 */
function flatten(array, isDeep, guard) {
  var length = array ? array.length : 0;
  if (guard && isIterateeCall(array, isDeep, guard)) {
    isDeep = false;
  }
  return length ? baseFlatten(array, isDeep) : [];
}

module.exports = flatten;

},{"lodash._baseflatten":178,"lodash._isiterateecall":181}],178:[function(require,module,exports){
arguments[4][71][0].apply(exports,arguments)
},{"dup":71,"lodash.isarguments":179,"lodash.isarray":180}],179:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],180:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],181:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],182:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33,"lodash._arrayeach":183,"lodash._baseeach":184,"lodash._bindcallback":188,"lodash.isarray":189}],183:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],184:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35,"lodash.keys":185}],185:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43,"lodash.isarguments":186,"lodash.isarray":189,"lodash.isnative":187}],186:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],187:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],188:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],189:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],190:[function(require,module,exports){
/**
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseEach = require('lodash._baseeach'),
    restParam = require('lodash.restparam');

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Invokes the method named by `methodName` on each element in `collection`,
 * returning an array of the results of each invoked method. Any additional
 * arguments are provided to each invoked method. If `methodName` is a function
 * it is invoked for, and `this` bound to, each element in `collection`.
 *
 * @static
 * @memberOf _
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|string} methodName The name of the method to invoke or
 *  the function invoked per iteration.
 * @param {...*} [args] The arguments to invoke the method with.
 * @returns {Array} Returns the array of results.
 * @example
 *
 * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
 * // => [[1, 5, 7], [1, 2, 3]]
 *
 * _.invoke([123, 456], String.prototype.split, '');
 * // => [['1', '2', '3'], ['4', '5', '6']]
 */
var invoke = restParam(function(collection, methodName, args) {
  var index = -1,
      isFunc = typeof methodName == 'function',
      length = collection ? collection.length : 0,
      result = isLength(length) ? Array(length) : [];

  baseEach(collection, function(value) {
    var func = isFunc ? methodName : (value != null && value[methodName]);
    result[++index] = func ? func.apply(value, args) : undefined;
  });
  return result;
});

module.exports = invoke;

},{"lodash._baseeach":191,"lodash.restparam":196}],191:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35,"lodash.keys":192}],192:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43,"lodash.isarguments":193,"lodash.isarray":194,"lodash.isnative":195}],193:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],194:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],195:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],196:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],197:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"dup":42}],198:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
}

module.exports = last;

},{}],199:[function(require,module,exports){
/**
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseFlatten = require('lodash._baseflatten'),
    bindCallback = require('lodash._bindcallback'),
    pickByArray = require('lodash._pickbyarray'),
    pickByCallback = require('lodash._pickbycallback'),
    restParam = require('lodash.restparam');

/**
 * Creates an object composed of the picked `object` properties. Property
 * names may be specified as individual arguments or as arrays of property
 * names. If `predicate` is provided it is invoked for each property of `object`
 * picking the properties `predicate` returns truthy for. The predicate is
 * bound to `thisArg` and invoked with three arguments: (value, key, object).
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {Function|...(string|string[])} [predicate] The function invoked per
 *  iteration or property names to pick, specified as individual property
 *  names or arrays of property names.
 * @param {*} [thisArg] The `this` binding of `predicate`.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'user': 'fred', 'age': 40 };
 *
 * _.pick(object, 'user');
 * // => { 'user': 'fred' }
 *
 * _.pick(object, _.isString);
 * // => { 'user': 'fred' }
 */
var pick = restParam(function(object, props) {
  if (object == null) {
    return {};
  }
  return typeof props[0] == 'function'
    ? pickByCallback(object, bindCallback(props[0], props[1], 3))
    : pickByArray(object, baseFlatten(props));
});

module.exports = pick;

},{"lodash._baseflatten":200,"lodash._bindcallback":203,"lodash._pickbyarray":204,"lodash._pickbycallback":205,"lodash.restparam":210}],200:[function(require,module,exports){
arguments[4][71][0].apply(exports,arguments)
},{"dup":71,"lodash.isarguments":201,"lodash.isarray":202}],201:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],202:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],203:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],204:[function(require,module,exports){
arguments[4][139][0].apply(exports,arguments)
},{"dup":139}],205:[function(require,module,exports){
arguments[4][140][0].apply(exports,arguments)
},{"dup":140,"lodash._basefor":206,"lodash.keysin":207}],206:[function(require,module,exports){
arguments[4][101][0].apply(exports,arguments)
},{"dup":101}],207:[function(require,module,exports){
arguments[4][142][0].apply(exports,arguments)
},{"dup":142,"lodash.isarguments":208,"lodash.isarray":209}],208:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],209:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],210:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],211:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isFunction = require('lodash.isfunction');

/**
 * Resolves the value of property `key` on `object`. If the value of `key` is
 * a function it is invoked with the `this` binding of `object` and its result
 * is returned, else the property value is returned. If the property value is
 * `undefined` the `defaultValue` is used in its place.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to resolve.
 * @param {*} [defaultValue] The value returned if the property value
 *  resolves to `undefined`.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'user': 'fred', 'age': _.constant(40) };
 *
 * _.result(object, 'user');
 * // => 'fred'
 *
 * _.result(object, 'age');
 * // => 40
 *
 * _.result(object, 'status', 'busy');
 * // => 'busy'
 *
 * _.result(object, 'status', _.constant('busy'));
 * // => 'busy'
 */
function result(object, key, defaultValue) {
  var value = object == null ? undefined : object[key];
  if (typeof value == 'undefined') {
    value = defaultValue;
  }
  return isFunction(value) ? value.call(object) : value;
}

module.exports = result;

},{"lodash.isfunction":212}],212:[function(require,module,exports){
(function (global){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Used to match `RegExp` [special characters](http://www.regular-expressions.info/characters.html#special).
 * In addition to special characters the forward slash is escaped to allow for
 * easier `eval` use and `Function` compilation.
 */
var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
    reHasRegExpChars = RegExp(reRegExpChars.source);

/**
 * The base implementation of `_.isFunction` without support for environments
 * with incorrect `typeof` results.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 */
function baseIsFunction(value) {
  // Avoid a Chakra JIT bug in compatibility modes of IE 11.
  // See https://github.com/jashkenas/underscore/issues/1621 for more details.
  return typeof value == 'function' || false;
}

/**
 * Converts `value` to a string if it is not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  return value == null ? '' : (value + '');
}

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reNative = RegExp('^' +
  escapeRegExp(objToString)
  .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Native method references. */
var Uint8Array = isNative(Uint8Array = global.Uint8Array) && Uint8Array;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
var isFunction = !(baseIsFunction(/x/) || (Uint8Array && !baseIsFunction(Uint8Array))) ? baseIsFunction : function(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return objToString.call(value) == funcTag;
};

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (objToString.call(value) == funcTag) {
    return reNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reHostCtor.test(value);
}

/**
 * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
 * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escapeRegExp('[lodash](https://lodash.com/)');
 * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
 */
function escapeRegExp(string) {
  string = baseToString(string);
  return (string && reHasRegExpChars.test(string))
    ? string.replace(reRegExpChars, '\\$&')
    : string;
}

module.exports = isFunction;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],213:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"dup":49,"lodash._basetostring":214}],214:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"dup":50}],215:[function(require,module,exports){
'use strict';

var proto = Element.prototype;
var vendor = proto.matches
  || proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] == el) return true;
  }
  return false;
}
},{}],"interactives":[function(require,module,exports){
/*
 * This file is part of the EcoLearnia platform.
 *
 * (c) Young Suk Ahn Park <ys.ahnpark@mathnia.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes references to all interactive components and core dependencies.
 *
 * @author Young Suk Ahn Park
 * @date 5/14/15
 */

'use strict';

var itemcontext = require('./core/itemcontext');
var PubSub = require('./../common/pubsub').PubSub;

// Interactive Components.
var ActionBar = require('./components/actionbar.jsx').ActionBarComponent;
var Feedback = require('./components/feedback.jsx').FeedbackComponent;
var SelectQuestion = require('./components/questions/selectquestion.jsx').SelectQuestionComponent;
var TemplateContainerComponent = require('./components/templatecontainer').TemplateContainerComponent;

// @note - this can be externalized to another js bundle
var LocalEvaluator = require('./core/evaluator').LocalEvaluator;
module.exports.LocalEvaluator = LocalEvaluator;
var evaluation = require('./evaluation/evaluation');
module.exports.evaluation = evaluation;

module.exports.PubSub = PubSub;
module.exports.createItemContext = itemcontext.createItemContext;

// The interactive components must be exported, otherwise the CoreContext will
// not be able to instantiate.
module.exports.SelectQuestion = SelectQuestion;
module.exports.TemplateContainer = TemplateContainerComponent;
module.exports.ActionBar = ActionBar;
module.exports.Feedback = Feedback;

},{"./../common/pubsub":4,"./components/actionbar.jsx":6,"./components/feedback.jsx":9,"./components/questions/selectquestion.jsx":11,"./components/templatecontainer":12,"./core/evaluator":14,"./core/itemcontext":16,"./evaluation/evaluation":17}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveXNhaG4vd29ya3NwYWNlL2VkdXRlY2gvZWNvbGVhcm5pYS1zdHVkaW8vY2xpZW50L2NvbW1vbi9sb2dnZXIuanMiLCIvVXNlcnMveXNhaG4vd29ya3NwYWNlL2VkdXRlY2gvZWNvbGVhcm5pYS1zdHVkaW8vY2xpZW50L2NvbW1vbi9wb2x5ZmlsbHMuanMiLCIvVXNlcnMveXNhaG4vd29ya3NwYWNlL2VkdXRlY2gvZWNvbGVhcm5pYS1zdHVkaW8vY2xpZW50L2NvbW1vbi9wcm9taXNldXRpbHMuanMiLCIvVXNlcnMveXNhaG4vd29ya3NwYWNlL2VkdXRlY2gvZWNvbGVhcm5pYS1zdHVkaW8vY2xpZW50L2NvbW1vbi9wdWJzdWIuanMiLCIvVXNlcnMveXNhaG4vd29ya3NwYWNlL2VkdXRlY2gvZWNvbGVhcm5pYS1zdHVkaW8vY2xpZW50L2NvbW1vbi91dGlscy5qcyIsIi9Vc2Vycy95c2Fobi93b3Jrc3BhY2UvZWR1dGVjaC9lY29sZWFybmlhLXN0dWRpby9jbGllbnQvaW50ZXJhY3RpdmVzL2NvbXBvbmVudHMvYWN0aW9uYmFyLmpzeCIsIi9Vc2Vycy95c2Fobi93b3Jrc3BhY2UvZWR1dGVjaC9lY29sZWFybmlhLXN0dWRpby9jbGllbnQvaW50ZXJhY3RpdmVzL2NvbXBvbmVudHMvZWxpcmVhY3Rjb21wb25lbnQuanMiLCIvVXNlcnMveXNhaG4vd29ya3NwYWNlL2VkdXRlY2gvZWNvbGVhcm5pYS1zdHVkaW8vY2xpZW50L2ludGVyYWN0aXZlcy9jb21wb25lbnRzL2VsaXZpZXdjb21wb25lbnQuanMiLCIvVXNlcnMveXNhaG4vd29ya3NwYWNlL2VkdXRlY2gvZWNvbGVhcm5pYS1zdHVkaW8vY2xpZW50L2ludGVyYWN0aXZlcy9jb21wb25lbnRzL2ZlZWRiYWNrLmpzeCIsIi9Vc2Vycy95c2Fobi93b3Jrc3BhY2UvZWR1dGVjaC9lY29sZWFybmlhLXN0dWRpby9jbGllbnQvaW50ZXJhY3RpdmVzL2NvbXBvbmVudHMvcXVlc3Rpb25zL3F1ZXN0aW9uLmpzeCIsIi9Vc2Vycy95c2Fobi93b3Jrc3BhY2UvZWR1dGVjaC9lY29sZWFybmlhLXN0dWRpby9jbGllbnQvaW50ZXJhY3RpdmVzL2NvbXBvbmVudHMvcXVlc3Rpb25zL3NlbGVjdHF1ZXN0aW9uLmpzeCIsIi9Vc2Vycy95c2Fobi93b3Jrc3BhY2UvZWR1dGVjaC9lY29sZWFybmlhLXN0dWRpby9jbGllbnQvaW50ZXJhY3RpdmVzL2NvbXBvbmVudHMvdGVtcGxhdGVjb250YWluZXIuanMiLCIvVXNlcnMveXNhaG4vd29ya3NwYWNlL2VkdXRlY2gvZWNvbGVhcm5pYS1zdHVkaW8vY2xpZW50L2ludGVyYWN0aXZlcy9jb3JlL2Fuc3dlcm1vZGVsLmpzIiwiL1VzZXJzL3lzYWhuL3dvcmtzcGFjZS9lZHV0ZWNoL2Vjb2xlYXJuaWEtc3R1ZGlvL2NsaWVudC9pbnRlcmFjdGl2ZXMvY29yZS9ldmFsdWF0b3IuanMiLCIvVXNlcnMveXNhaG4vd29ya3NwYWNlL2VkdXRlY2gvZWNvbGVhcm5pYS1zdHVkaW8vY2xpZW50L2ludGVyYWN0aXZlcy9jb3JlL2V2ZW50cy5qcyIsIi9Vc2Vycy95c2Fobi93b3Jrc3BhY2UvZWR1dGVjaC9lY29sZWFybmlhLXN0dWRpby9jbGllbnQvaW50ZXJhY3RpdmVzL2NvcmUvaXRlbWNvbnRleHQuanMiLCIvVXNlcnMveXNhaG4vd29ya3NwYWNlL2VkdXRlY2gvZWNvbGVhcm5pYS1zdHVkaW8vY2xpZW50L2ludGVyYWN0aXZlcy9ldmFsdWF0aW9uL2V2YWx1YXRpb24uanMiLCIvVXNlcnMveXNhaG4vd29ya3NwYWNlL2VkdXRlY2gvZWNvbGVhcm5pYS1zdHVkaW8vY2xpZW50L2ludGVyYWN0aXZlcy9ldmFsdWF0aW9uL21hdGhleHByZXNzaW9uZXZhbC5qcyIsIi9Vc2Vycy95c2Fobi93b3Jrc3BhY2UvZWR1dGVjaC9lY29sZWFybmlhLXN0dWRpby9jbGllbnQvaW50ZXJhY3RpdmVzL2V2YWx1YXRpb24vcmVnZXhldmFsLmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1ldmVudHMvYW1wZXJzYW5kLWV2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtZXZlbnRzL25vZGVfbW9kdWxlcy9sb2Rhc2guYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1ldmVudHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtZXZlbnRzL25vZGVfbW9kdWxlcy9sb2Rhc2guYXNzaWduL25vZGVfbW9kdWxlcy9sb2Rhc2guX2Jhc2Vhc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZWNvcHkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLWV2ZW50cy9ub2RlX21vZHVsZXMvbG9kYXNoLmFzc2lnbi9ub2RlX21vZHVsZXMvbG9kYXNoLl9jcmVhdGVhc3NpZ25lci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtZXZlbnRzL25vZGVfbW9kdWxlcy9sb2Rhc2guYXNzaWduL25vZGVfbW9kdWxlcy9sb2Rhc2guX2NyZWF0ZWFzc2lnbmVyL25vZGVfbW9kdWxlcy9sb2Rhc2guX2JpbmRjYWxsYmFjay9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtZXZlbnRzL25vZGVfbW9kdWxlcy9sb2Rhc2guYXNzaWduL25vZGVfbW9kdWxlcy9sb2Rhc2guX2NyZWF0ZWFzc2lnbmVyL25vZGVfbW9kdWxlcy9sb2Rhc2guX2lzaXRlcmF0ZWVjYWxsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1ldmVudHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5iaW5kL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1ldmVudHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5iaW5kL25vZGVfbW9kdWxlcy9sb2Rhc2guX2NyZWF0ZXdyYXBwZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLWV2ZW50cy9ub2RlX21vZHVsZXMvbG9kYXNoLmJpbmQvbm9kZV9tb2R1bGVzL2xvZGFzaC5fY3JlYXRld3JhcHBlci9ub2RlX21vZHVsZXMvbG9kYXNoLl9hcnJheWNvcHkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLWV2ZW50cy9ub2RlX21vZHVsZXMvbG9kYXNoLmJpbmQvbm9kZV9tb2R1bGVzL2xvZGFzaC5fY3JlYXRld3JhcHBlci9ub2RlX21vZHVsZXMvbG9kYXNoLl9iYXNlY3JlYXRlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1ldmVudHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5iaW5kL25vZGVfbW9kdWxlcy9sb2Rhc2guX3JlcGxhY2Vob2xkZXJzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1ldmVudHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5iaW5kL25vZGVfbW9kdWxlcy9sb2Rhc2gucmVzdHBhcmFtL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1ldmVudHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5mb3JlYWNoL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1ldmVudHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5mb3JlYWNoL25vZGVfbW9kdWxlcy9sb2Rhc2guX2FycmF5ZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtZXZlbnRzL25vZGVfbW9kdWxlcy9sb2Rhc2guZm9yZWFjaC9ub2RlX21vZHVsZXMvbG9kYXNoLl9iYXNlZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtZXZlbnRzL25vZGVfbW9kdWxlcy9sb2Rhc2guZm9yZWFjaC9ub2RlX21vZHVsZXMvbG9kYXNoLmlzYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLWV2ZW50cy9ub2RlX21vZHVsZXMvbG9kYXNoLmlzZW1wdHkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLWV2ZW50cy9ub2RlX21vZHVsZXMvbG9kYXNoLmlzZW1wdHkvbm9kZV9tb2R1bGVzL2xvZGFzaC5pc2FyZ3VtZW50cy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtZXZlbnRzL25vZGVfbW9kdWxlcy9sb2Rhc2guaXNlbXB0eS9ub2RlX21vZHVsZXMvbG9kYXNoLmlzZnVuY3Rpb24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLWV2ZW50cy9ub2RlX21vZHVsZXMvbG9kYXNoLmlzZW1wdHkvbm9kZV9tb2R1bGVzL2xvZGFzaC5pc3N0cmluZy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtZXZlbnRzL25vZGVfbW9kdWxlcy9sb2Rhc2gua2V5cy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtZXZlbnRzL25vZGVfbW9kdWxlcy9sb2Rhc2gua2V5cy9ub2RlX21vZHVsZXMvbG9kYXNoLmlzbmF0aXZlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1ldmVudHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5vbmNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1ldmVudHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5vbmNlL25vZGVfbW9kdWxlcy9sb2Rhc2guYmVmb3JlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1ldmVudHMvbm9kZV9tb2R1bGVzL2xvZGFzaC51bmlxdWVpZC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtZXZlbnRzL25vZGVfbW9kdWxlcy9sb2Rhc2gudW5pcXVlaWQvbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZXRvc3RyaW5nL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC12aWV3L2FtcGVyc2FuZC12aWV3LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC12aWV3L25vZGVfbW9kdWxlcy9hbXBlcnNhbmQtY29sbGVjdGlvbi12aWV3L2FtcGVyc2FuZC1jb2xsZWN0aW9uLXZpZXcuanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLXZpZXcvbm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1jb2xsZWN0aW9uLXZpZXcvbm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1jbGFzcy1leHRlbmQvYW1wZXJzYW5kLWNsYXNzLWV4dGVuZC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvYW1wZXJzYW5kLWNvbGxlY3Rpb24tdmlldy9ub2RlX21vZHVsZXMvYW1wZXJzYW5kLWV2ZW50cy9ub2RlX21vZHVsZXMvbG9kYXNoLmlzZW1wdHkvbm9kZV9tb2R1bGVzL2xvZGFzaC5pc2Z1bmN0aW9uL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC12aWV3L25vZGVfbW9kdWxlcy9hbXBlcnNhbmQtY29sbGVjdGlvbi12aWV3L25vZGVfbW9kdWxlcy9sb2Rhc2guZGlmZmVyZW5jZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvYW1wZXJzYW5kLWNvbGxlY3Rpb24tdmlldy9ub2RlX21vZHVsZXMvbG9kYXNoLmRpZmZlcmVuY2Uvbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZWRpZmZlcmVuY2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLXZpZXcvbm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1jb2xsZWN0aW9uLXZpZXcvbm9kZV9tb2R1bGVzL2xvZGFzaC5kaWZmZXJlbmNlL25vZGVfbW9kdWxlcy9sb2Rhc2guX2Jhc2VkaWZmZXJlbmNlL25vZGVfbW9kdWxlcy9sb2Rhc2guX2Jhc2VpbmRleG9mL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC12aWV3L25vZGVfbW9kdWxlcy9hbXBlcnNhbmQtY29sbGVjdGlvbi12aWV3L25vZGVfbW9kdWxlcy9sb2Rhc2guZGlmZmVyZW5jZS9ub2RlX21vZHVsZXMvbG9kYXNoLl9iYXNlZGlmZmVyZW5jZS9ub2RlX21vZHVsZXMvbG9kYXNoLl9jYWNoZWluZGV4b2YvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLXZpZXcvbm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1jb2xsZWN0aW9uLXZpZXcvbm9kZV9tb2R1bGVzL2xvZGFzaC5kaWZmZXJlbmNlL25vZGVfbW9kdWxlcy9sb2Rhc2guX2Jhc2VkaWZmZXJlbmNlL25vZGVfbW9kdWxlcy9sb2Rhc2guX2NyZWF0ZWNhY2hlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC12aWV3L25vZGVfbW9kdWxlcy9hbXBlcnNhbmQtY29sbGVjdGlvbi12aWV3L25vZGVfbW9kdWxlcy9sb2Rhc2guZGlmZmVyZW5jZS9ub2RlX21vZHVsZXMvbG9kYXNoLl9iYXNlZmxhdHRlbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvYW1wZXJzYW5kLWNvbGxlY3Rpb24tdmlldy9ub2RlX21vZHVsZXMvbG9kYXNoLmZpbmQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLXZpZXcvbm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1jb2xsZWN0aW9uLXZpZXcvbm9kZV9tb2R1bGVzL2xvZGFzaC5maW5kL25vZGVfbW9kdWxlcy9sb2Rhc2guX2Jhc2VjYWxsYmFjay9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvYW1wZXJzYW5kLWNvbGxlY3Rpb24tdmlldy9ub2RlX21vZHVsZXMvbG9kYXNoLmZpbmQvbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZWNhbGxiYWNrL25vZGVfbW9kdWxlcy9sb2Rhc2guX2Jhc2Vpc2VxdWFsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC12aWV3L25vZGVfbW9kdWxlcy9hbXBlcnNhbmQtY29sbGVjdGlvbi12aWV3L25vZGVfbW9kdWxlcy9sb2Rhc2guZmluZC9ub2RlX21vZHVsZXMvbG9kYXNoLl9iYXNlY2FsbGJhY2svbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZWlzZXF1YWwvbm9kZV9tb2R1bGVzL2xvZGFzaC5pc3R5cGVkYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLXZpZXcvbm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1jb2xsZWN0aW9uLXZpZXcvbm9kZV9tb2R1bGVzL2xvZGFzaC5maW5kL25vZGVfbW9kdWxlcy9sb2Rhc2guX2Jhc2VmaW5kL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC12aWV3L25vZGVfbW9kdWxlcy9hbXBlcnNhbmQtY29sbGVjdGlvbi12aWV3L25vZGVfbW9kdWxlcy9sb2Rhc2guZmluZC9ub2RlX21vZHVsZXMvbG9kYXNoLl9iYXNlZmluZGluZGV4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC12aWV3L25vZGVfbW9kdWxlcy9hbXBlcnNhbmQtZG9tLWJpbmRpbmdzL2FtcGVyc2FuZC1kb20tYmluZGluZ3MuanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLXZpZXcvbm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1kb20tYmluZGluZ3Mvbm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1kb20vYW1wZXJzYW5kLWRvbS5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvYW1wZXJzYW5kLWRvbS1iaW5kaW5ncy9ub2RlX21vZHVsZXMva2V5LXRyZWUtc3RvcmUva2V5LXRyZWUtc3RvcmUuanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLXZpZXcvbm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1zdGF0ZS9hbXBlcnNhbmQtc3RhdGUuanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLXZpZXcvbm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1zdGF0ZS9ub2RlX21vZHVsZXMvYXJyYXktbmV4dC9hcnJheS1uZXh0LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC12aWV3L25vZGVfbW9kdWxlcy9hbXBlcnNhbmQtc3RhdGUvbm9kZV9tb2R1bGVzL2xvZGFzaC5jbG9uZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvYW1wZXJzYW5kLXN0YXRlL25vZGVfbW9kdWxlcy9sb2Rhc2guY2xvbmUvbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZWNsb25lL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC12aWV3L25vZGVfbW9kdWxlcy9hbXBlcnNhbmQtc3RhdGUvbm9kZV9tb2R1bGVzL2xvZGFzaC5jbG9uZS9ub2RlX21vZHVsZXMvbG9kYXNoLl9iYXNlY2xvbmUvbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZWZvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvYW1wZXJzYW5kLXN0YXRlL25vZGVfbW9kdWxlcy9sb2Rhc2guZGVmYXVsdHMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLXZpZXcvbm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1zdGF0ZS9ub2RlX21vZHVsZXMvbG9kYXNoLmVzY2FwZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvYW1wZXJzYW5kLXN0YXRlL25vZGVfbW9kdWxlcy9sb2Rhc2guaGFzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC12aWV3L25vZGVfbW9kdWxlcy9hbXBlcnNhbmQtc3RhdGUvbm9kZV9tb2R1bGVzL2xvZGFzaC5pbmNsdWRlcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvYW1wZXJzYW5kLXN0YXRlL25vZGVfbW9kdWxlcy9sb2Rhc2guaW5jbHVkZXMvbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZXZhbHVlcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvYW1wZXJzYW5kLXN0YXRlL25vZGVfbW9kdWxlcy9sb2Rhc2guaXNkYXRlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC12aWV3L25vZGVfbW9kdWxlcy9hbXBlcnNhbmQtc3RhdGUvbm9kZV9tb2R1bGVzL2xvZGFzaC5pc2VxdWFsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC12aWV3L25vZGVfbW9kdWxlcy9hbXBlcnNhbmQtc3RhdGUvbm9kZV9tb2R1bGVzL2xvZGFzaC5pc2Z1bmN0aW9uL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC12aWV3L25vZGVfbW9kdWxlcy9hbXBlcnNhbmQtc3RhdGUvbm9kZV9tb2R1bGVzL2xvZGFzaC5pc251bGwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLXZpZXcvbm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1zdGF0ZS9ub2RlX21vZHVsZXMvbG9kYXNoLmlzb2JqZWN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC12aWV3L25vZGVfbW9kdWxlcy9hbXBlcnNhbmQtc3RhdGUvbm9kZV9tb2R1bGVzL2xvZGFzaC5pc3VuZGVmaW5lZC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvYW1wZXJzYW5kLXN0YXRlL25vZGVfbW9kdWxlcy9sb2Rhc2gub21pdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvYW1wZXJzYW5kLXN0YXRlL25vZGVfbW9kdWxlcy9sb2Rhc2gub21pdC9ub2RlX21vZHVsZXMvbG9kYXNoLl9hcnJheW1hcC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvYW1wZXJzYW5kLXN0YXRlL25vZGVfbW9kdWxlcy9sb2Rhc2gub21pdC9ub2RlX21vZHVsZXMvbG9kYXNoLl9iYXNlZGlmZmVyZW5jZS9ub2RlX21vZHVsZXMvbG9kYXNoLl9jcmVhdGVjYWNoZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvYW1wZXJzYW5kLXN0YXRlL25vZGVfbW9kdWxlcy9sb2Rhc2gub21pdC9ub2RlX21vZHVsZXMvbG9kYXNoLl9waWNrYnlhcnJheS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvYW1wZXJzYW5kLXN0YXRlL25vZGVfbW9kdWxlcy9sb2Rhc2gub21pdC9ub2RlX21vZHVsZXMvbG9kYXNoLl9waWNrYnljYWxsYmFjay9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvYW1wZXJzYW5kLXN0YXRlL25vZGVfbW9kdWxlcy9sb2Rhc2gub21pdC9ub2RlX21vZHVsZXMvbG9kYXNoLmtleXNpbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvYW1wZXJzYW5kLXN0YXRlL25vZGVfbW9kdWxlcy9sb2Rhc2gudW5pb24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLXZpZXcvbm9kZV9tb2R1bGVzL2FtcGVyc2FuZC1zdGF0ZS9ub2RlX21vZHVsZXMvbG9kYXNoLnVuaW9uL25vZGVfbW9kdWxlcy9sb2Rhc2guX2Jhc2V1bmlxL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC12aWV3L25vZGVfbW9kdWxlcy9hbXBlcnNhbmQtc3RhdGUvbm9kZV9tb2R1bGVzL2xvZGFzaC51bmlvbi9ub2RlX21vZHVsZXMvbG9kYXNoLl9iYXNldW5pcS9ub2RlX21vZHVsZXMvbG9kYXNoLl9jcmVhdGVjYWNoZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvZG9taWZ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC12aWV3L25vZGVfbW9kdWxlcy9ldmVudHMtbWl4aW4vaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLXZpZXcvbm9kZV9tb2R1bGVzL2V2ZW50cy1taXhpbi9ub2RlX21vZHVsZXMvY29tcG9uZW50LWV2ZW50L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC12aWV3L25vZGVfbW9kdWxlcy9ldmVudHMtbWl4aW4vbm9kZV9tb2R1bGVzL2RlbGVnYXRlLWV2ZW50cy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvZXZlbnRzLW1peGluL25vZGVfbW9kdWxlcy9kZWxlZ2F0ZS1ldmVudHMvbm9kZV9tb2R1bGVzL2Nsb3Nlc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLXZpZXcvbm9kZV9tb2R1bGVzL2V2ZW50cy1taXhpbi9ub2RlX21vZHVsZXMvZGVsZWdhdGUtZXZlbnRzL25vZGVfbW9kdWxlcy9jbG9zZXN0L25vZGVfbW9kdWxlcy9tYXRjaGVzLXNlbGVjdG9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC12aWV3L25vZGVfbW9kdWxlcy9nZXQtb2JqZWN0LXBhdGgvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLXZpZXcvbm9kZV9tb2R1bGVzL2xvZGFzaC5iaW5kL25vZGVfbW9kdWxlcy9sb2Rhc2guX2NyZWF0ZXdyYXBwZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLXZpZXcvbm9kZV9tb2R1bGVzL2xvZGFzaC5iaW5kL25vZGVfbW9kdWxlcy9sb2Rhc2guX2NyZWF0ZXdyYXBwZXIvbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZWNyZWF0ZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvbG9kYXNoLmZsYXR0ZW4vaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLXZpZXcvbm9kZV9tb2R1bGVzL2xvZGFzaC5pbnZva2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLXZpZXcvbm9kZV9tb2R1bGVzL2xvZGFzaC5sYXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FtcGVyc2FuZC12aWV3L25vZGVfbW9kdWxlcy9sb2Rhc2gucGljay9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvbG9kYXNoLnJlc3VsdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbXBlcnNhbmQtdmlldy9ub2RlX21vZHVsZXMvbG9kYXNoLnJlc3VsdC9ub2RlX21vZHVsZXMvbG9kYXNoLmlzZnVuY3Rpb24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvYW1wZXJzYW5kLXZpZXcvbm9kZV9tb2R1bGVzL21hdGNoZXMtc2VsZWN0b3IvaW5kZXguanMiLCIvVXNlcnMveXNhaG4vd29ya3NwYWNlL2VkdXRlY2gvZWNvbGVhcm5pYS1zdHVkaW8vY2xpZW50L2ludGVyYWN0aXZlcy9pbnRlcmFjdGl2ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNrQkEsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDOztBQUVuQixTQUFTLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzs7QUFFM0IsU0FBUyxDQUFDLE9BQU8sR0FBSSxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksRUFBRSxBQUFDLENBQUM7OztBQUc1RCxBQUFDLENBQUEsWUFBVztBQUNSLFFBQUksTUFBTSxDQUFDO0FBQ1gsUUFBSSxJQUFJLEdBQUcsU0FBUCxJQUFJLEdBQWUsRUFBRSxDQUFDO0FBQzFCLFFBQUksT0FBTyxHQUFHLENBQ1YsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUM3RCxXQUFXLEVBQUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUNqRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxPQUFP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QUFDLElBQUksQ0FBQyxDQUFDO0FBQ25DLFFBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztDQUM5QixDQUFDOzs7OztBQUtGLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxVQUFTLElBQUksRUFBRTtBQUMxQyxRQUFJLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakQsUUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25DLFFBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztDQUM5QixDQUFDOzs7OztBQUtGLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxVQUFTLElBQUksRUFBRTtBQUMzQyxRQUFJLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakQsYUFBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pDLFFBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztDQUM5QixDQUFDOzs7Ozs7QUFNRixTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsVUFBUyxJQUFJLEVBQUU7QUFDM0MsUUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pELGFBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QyxRQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMzWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzVKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ3pPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDM0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDOXhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDdlVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDbEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNSQSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNoRCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxNQUFNLENBQUM7OztBQUdsRCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQztBQUN6RSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQztBQUN0RSxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsMkNBQTJDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQztBQUNsRyxJQUFJLDBCQUEwQixHQUFHLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLDBCQUEwQixDQUFDOzs7QUFHdEcsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsY0FBYyxDQUFDO0FBQ2hFLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztBQUMvQyxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUNwRCxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7O0FBRXZDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUMvQixNQUFNLENBQUMsT0FBTyxDQUFDLGlCQUFpQixHQUFHLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQzs7OztBQUlqRSxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7QUFDL0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRywwQkFBMEIsQ0FBQztBQUM5RCxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDckMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgRWNvTGVhcm5pYSBwbGF0Zm9ybS5cbiAqXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKi9cblxuLyoqXG4gKiBFY29MZWFybmlhIHYwLjAuMVxuICpcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqICBUaGlzIGZpbGUgaW5jbHVkZXMgbG9nZ2VyIGNsYXNzLlxuICpcbiAqXG4gKiBAYXV0aG9yIFlvdW5nIFN1ayBBaG4gUGFya1xuICogQGRhdGUgNi8wMi8xNVxuICovXG5cbnZhciBpbnRlcm5hbHMgPSB7fTtcblxuaW50ZXJuYWxzLmxvZ1JlZ2lzdHJ5ID0ge307XG5cbmludGVybmFscy5jb25zb2xlID0gKGdsb2JhbC5jb25zb2xlID0gZ2xvYmFsLmNvbnNvbGUgfHwge30pO1xuXG4vLyBGcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzMyNjY1MC9jb25zb2xlLWlzLXVuZGVmaW5lZC1lcnJvci1mb3ItaW50ZXJuZXQtZXhwbG9yZXJcbihmdW5jdGlvbigpIHtcbiAgICB2YXIgbWV0aG9kO1xuICAgIHZhciBub29wID0gZnVuY3Rpb24gKCkge307XG4gICAgdmFyIG1ldGhvZHMgPSBbXG4gICAgICAgICdhc3NlcnQnLCAnY2xlYXInLCAnY291bnQnLCAnZGVidWcnLCAnZGlyJywgJ2RpcnhtbCcsICdlcnJvcicsXG4gICAgICAgICdleGNlcHRpb24nLCAnZ3JvdXAnLCAnZ3JvdXBDb2xsYXBzZWQnLCAnZ3JvdXBFbmQnLCAnaW5mbycsICdsb2cnLFxuICAgICAgICAnbWFya1RpbWVsaW5lJywgJ3Byb2ZpbGUnLCAncHJvZmlsZUVuZCcsICd0YWJsZScsICd0aW1lJywgJ3RpbWVFbmQnLFxuICAgICAgICAndGltZVN0YW1wJywgJ3RyYWNlJywgJ3dhcm4nXG4gICAgXTtcbiAgICB2YXIgbGVuZ3RoID0gbWV0aG9kcy5sZW5ndGg7XG5cbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgbWV0aG9kID0gbWV0aG9kc1tsZW5ndGhdO1xuXG4gICAgICAgIC8vIE9ubHkgc3R1YiB1bmRlZmluZWQgbWV0aG9kcy5cbiAgICAgICAgaWYgKCFpbnRlcm5hbHMuY29uc29sZVttZXRob2RdKSB7XG4gICAgICAgICAgICBpbnRlcm5hbHMuY29uc29sZVttZXRob2RdID0gbm9vcDtcbiAgICAgICAgfVxuICAgIH1cbn0oKSk7XG5cbmludGVybmFscy5sZXZlbCA9IHtcbiAgICAndHJhY2UnOiAxMCxcbiAgICAnZGVidWcnOiAyMCxcbiAgICAnaW5mbyc6IDMwLFxuICAgICd3YXJuJzogNDAsXG4gICAgJ2Vycm9yJzogNTAsXG4gICAgJ2ZhdGFsJzogNjBcbn07XG5cbi8qKlxuICogQGNsYXNzIExvZ1xuICpcbiAqIEBtb2R1bGUgY29tbW9uXG4gKlxuICogQGNsYXNzZGVzY1xuICogIExvZyBjbGFzcyB0aGF0IGhhbmRsZXMgdGhlIGxvZ2dpbmcuXG4gKiAgQ3VycmVudGx5IGl0IGlzIGEgdGhpbiB3cmFwcGVyIGFyb3VuZCB0aGUgd2luZG93cy5jb25zb2xlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0aGUgbG9nIG5hbWVcbiAqIEBwYXJhbSB7bnVtYmVyfSBsZXZlbCAtIHRoZSBsZXZlbCB0byB3aGljaFxuICovXG5pbnRlcm5hbHMuTG9nID0gZnVuY3Rpb24obmFtZSwgbGV2ZWwpIHtcbiAgICB0aGlzLm5hbWVfID0gbmFtZTtcbiAgICB0aGlzLmxldmVsVGhyZXNob2xkXyA9IGxldmVsIHx8IGludGVybmFscy5sZXZlbC5pbmZvO1xufTtcblxuLyoqXG4gKiBMb2dzIHRvIHNwZWNpZmllZCBsZXZlbFxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBsZXZlbCAtIHRoZSBsb2cgbGV2ZWxcbiAqIEBwYXJhbSB7Li4ufSBhcmdzICAtIHRoZSBpbmZvcm1hdGlvbiB0byBsb2dcbiAqL1xuaW50ZXJuYWxzLkxvZy5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24obGV2ZWwgLyogbG9nIHBhcnRzICovKVxue1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMilcbiAgICB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGxldmVsID09PSAnc3RyaW5nJylcbiAgICB7XG4gICAgICAgIGxldmVsID0gaW50ZXJuYWxzLmxldmVsW2xldmVsXTtcbiAgICB9XG5cbiAgICBpZiAobGV2ZWwgPCB0aGlzLmxldmVsVGhyZXNob2xkXylcbiAgICB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbG9nUGFydHMgPSBbJ1wibmFtZVwiOlwiJyArIHRoaXMubmFtZV8gKyAnXCInXTtcbiAgICBsb2dQYXJ0cy5wdXNoKCdcImxldmVsXCI6JyArIGxldmVsKTtcblxuICAgIGZvciAodmFyIGFyZ0lkeCA9IDE7IGFyZ0lkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGFyZ0lkeCsrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzW2FyZ0lkeF0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAvLyBAdG9kbyAtIGZsYXR0ZW5kIGZpcnN0IGxldmVsIHByb3BlcnRpZXNcbiAgICAgICAgICAgIGxvZ1BhcnRzLnB1c2goSlNPTi5zdHJpbmdpZnkoYXJndW1lbnRzW2FyZ0lkeF0pKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJndW1lbnRzW2FyZ0lkeF0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBsb2dQYXJ0cy5wdXNoKGFyZ3VtZW50c1thcmdJZHhdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsb2dUZXh0ID0gJ3snICsgbG9nUGFydHMuam9pbignLCAnKSArICd9JztcbiAgICBzd2l0Y2ggKGxldmVsKSB7XG4gICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhsb2dUZXh0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDIwOlxuICAgICAgICAgICAgY29uc29sZS5sb2cobG9nVGV4dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzMDpcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhsb2dUZXh0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgICAgY29uc29sZS53YXJuKGxvZ1RleHQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNTA6XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGxvZ1RleHQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNjA6XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGxvZ1RleHQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhsb2dUZXh0KTtcbiAgICB9XG59O1xuXG4vKipcbiAqIFRyYWNlIGxvZ1xuICovXG5pbnRlcm5hbHMuTG9nLnByb3RvdHlwZS50cmFjZSA9IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgYXJncy51bnNoaWZ0KGludGVybmFscy5sZXZlbC50cmFjZSk7XG4gICAgdGhpcy5sb2cuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5cbi8qKlxuICogRGVidWcgbG9nXG4gKi9cbmludGVybmFscy5Mb2cucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24oYXJncykge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBhcmdzLnVuc2hpZnQoaW50ZXJuYWxzLmxldmVsLmRlYnVnKTtcbiAgICB0aGlzLmxvZy5hcHBseSh0aGlzLCBhcmdzKTtcbn07XG5cbi8qKlxuICogSW5mbyBsb2dcbiAqL1xuaW50ZXJuYWxzLkxvZy5wcm90b3R5cGUuaW5mbyA9IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgYXJncy51bnNoaWZ0KGludGVybmFscy5sZXZlbC5pbmZvKTtcbiAgICB0aGlzLmxvZy5hcHBseSh0aGlzLCBhcmdzKTtcbn07XG5cbi8qKlxuICogV2FybiBsb2dcbiAqL1xuaW50ZXJuYWxzLkxvZy5wcm90b3R5cGUud2FybiA9IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgYXJncy51bnNoaWZ0KGludGVybmFscy5sZXZlbC53YXJuKTtcbiAgICB0aGlzLmxvZy5hcHBseSh0aGlzLCBhcmdzKTtcbn07XG5cbi8qKlxuICogRXJyb3IgbG9nXG4gKi9cbmludGVybmFscy5Mb2cucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24oYXJncykge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBhcmd1bWVudHMudW5zaGlmdChpbnRlcm5hbHMubGV2ZWwuZXJyb3IpO1xuICAgIHRoaXMubG9nLmFwcGx5KHRoaXMsIGFyZ3MpO1xufTtcblxuLyoqXG4gKiBmYXRhbFxuICogQHBhcmFtIGFyZ3NcbiAqL1xuaW50ZXJuYWxzLkxvZy5wcm90b3R5cGUuZmF0YWwgPSBmdW5jdGlvbihhcmdzKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIGFyZ3VtZW50cy51bnNoaWZ0KGludGVybmFscy5sZXZlbC5mYXRhbCk7XG4gICAgdGhpcy5sb2cuYXBwbHkodGhpcywgYXJncyk7XG59O1xuXG4vKipcbiAqIExvZ2dlciBmYWN0b3J5IGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbG9nZ2VyIG9mIGdpdmVuIG5hbWVcbiAqIEByZXR1cm5zIHtMb2d9XG4gKi9cbmludGVybmFscy5nZXRMb2dnZXIgPSBmdW5jdGlvbihuYW1lKVxue1xuICAgIGlmICggIShuYW1lIGluIGludGVybmFscy5sb2dSZWdpc3RyeSkpXG4gICAge1xuICAgICAgICBpbnRlcm5hbHMubG9nUmVnaXN0cnlbbmFtZV0gPSBuZXcgaW50ZXJuYWxzLkxvZyhuYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIGludGVybmFscy5sb2dSZWdpc3RyeVtuYW1lXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmdldExvZ2dlciA9IGludGVybmFscy5nZXRMb2dnZXI7IiwiXG4vKipcbiAqIFBvbHlmaWxcbiAqIEBzZWU6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2ZpbmRcbiAqL1xuaWYgKCFBcnJheS5wcm90b3R5cGUuZmluZCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24ocHJlZGljYXRlKSB7XG4gICAgICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FycmF5LnByb3RvdHlwZS5maW5kIGNhbGxlZCBvbiBudWxsIG9yIHVuZGVmaW5lZCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgcHJlZGljYXRlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdwcmVkaWNhdGUgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxpc3QgPSBPYmplY3QodGhpcyk7XG4gICAgICAgIHZhciBsZW5ndGggPSBsaXN0Lmxlbmd0aCA+Pj4gMDtcbiAgICAgICAgdmFyIHRoaXNBcmcgPSBhcmd1bWVudHNbMV07XG4gICAgICAgIHZhciB2YWx1ZTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGxpc3RbaV07XG4gICAgICAgICAgICBpZiAocHJlZGljYXRlLmNhbGwodGhpc0FyZywgdmFsdWUsIGksIGxpc3QpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfTtcbn0iLCIvKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIEVjb0xlYXJuaWEgcGxhdGZvcm0uXG4gKlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICovXG5cbi8qKlxuICogRWNvTGVhcm5pYSB2MC4wLjFcbiAqXG4gKiBAZmlsZW92ZXJ2aWV3XG4gKiAgVGhpcyBmaWxlIGluY2x1ZGVzIHByb21pc2UgZmFjdG9yeSBmdW5jdGlvbi5cbiAqICBUaGUgY3JlYXRlUHJvbWlzZSgpIGZ1bmN0aW9uIHByb3ZpZGVzIGFic3RyYWN0aW9uIHRvIHRoZSBwcm9taXNlIGltcGxlbWVudGF0aW9uLlxuICpcbiAqICBVc2FnZSBleGFtcGxlOlxuICogIHZhciBwcm9taXNlID0gcHJvbWlzZXV0aWxzLmNyZWF0ZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gKiAgICAgIHJlc29sdmUoc3VjY2Vzc09iaik7XG4gKiAgICAgIC4uLlxuICogICAgICByZWplY3QoZXJyb3JPYmopO1xuICogIH0uYmluZCh0aGlzKSk7XG4gKiAgcmV0dXJuIHByb21pc2U7XG4gKlxuICogQGF1dGhvciBZb3VuZyBTdWsgQWhuIFBhcmtcbiAqIEBkYXRlIDYvMDIvMTVcbiAqL1xuXG4vLyBEZWNsYXJlIGludGVybmFscyBuYW1lc3BhY2VcbnZhciBpbnRlcm5hbHMgPSB7fTtcblxudmFyIEJsdWViaXJkID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbmludGVybmFscy5jcmVhdGVCbHVlYmlyZFByb21pc2UgPSBmdW5jdGlvbihmdW5jKVxue1xuICAgIHJldHVybiBuZXcgQmx1ZWJpcmQoZnVuYyk7XG59O1xuXG4vKlxudmFyIHdoZW4gPSByZXF1aXJlKCd3aGVuJyk7XG5pbnRlcm5hbHMuY3JlYXRlV2hlblByb21pc2UgPSBmdW5jdGlvbihmdW5jKVxue1xuICAgIHJldHVybiB3aGVuLnByb21pc2UoZnVuYyk7XG59O1xuXG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJ3Byb21pc2UnKTtcbmludGVybmFscy5jcmVhdGVTaW1wbGVQcm9taXNlID0gZnVuY3Rpb24oZnVuYylcbntcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuYyk7XG59O1xuKi9cblxubW9kdWxlLmV4cG9ydHMuY3JlYXRlUHJvbWlzZSA9IGludGVybmFscy5jcmVhdGVCbHVlYmlyZFByb21pc2U7XG5cbm1vZHVsZS5leHBvcnRzLnByb3BzID0gQmx1ZWJpcmQucHJvcHM7IiwiLypcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBFY29MZWFybmlhIHBsYXRmb3JtLlxuICpcbiAqIChjKSBZb3VuZyBTdWsgQWhuIFBhcmsgPHlzLmFobnBhcmtAbWF0aG5pYS5jb20+XG4gKlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICovXG5cbnZhciBFdmVudHMgPSByZXF1aXJlKCdhbXBlcnNhbmQtZXZlbnRzJyk7XG5cbi8qKlxuICogRWNvTGVhcm5pYSB2MC4wLjFcbiAqXG4gKiBAZmlsZW92ZXJ2aWV3XG4gKiAgVGhpcyBmaWxlIGluY2x1ZGVzIHRoZSBkZWZpbml0aW9uIG9mIFB1YlN1YiBjbGFzcy5cbiAqXG4gKiBAYXV0aG9yIFlvdW5nIFN1ayBBaG4gUGFya1xuICogQGRhdGUgNS8xMy8xNVxuICovXG5cbnZhciBpbnRlcm5hbHMgPSB7fTtcblxuLyoqXG4gKiBAY2xhc3MgU3ViUHViXG4gKlxuICogQG1vZHVsZSBpbnRlcmFjdGl2ZXMvY29yZVxuICpcbiAqIEBjbGFzc2Rlc2NcbiAqICBQdWJTdWIsIHRoZSBtZXNzYWdlIGJ1cy5cbiAqICBJdCB3cmFwcyBhIHRoaXJkIHBhcnR5IHN1YnB1YiBsaWJyYXJ5LlxuICpcbiAqIEB0b2RvIC0gSW1wbGVtZW50IVxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5pbnRlcm5hbHMuUHViU3ViID0gZnVuY3Rpb24oc2V0dGluZ3MpXG57XG4gICAgLy8gVXNpbmcgQmFja2JvbmUncyBldmVudFxuICAgIHRoaXMucHViU3ViID0gRXZlbnRzLmNyZWF0ZUVtaXR0ZXIoKTtcbn07XG5cblxuLyoqXG4gKiBBZGQgc3Vic2NyaXB0aW9uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRvcGljXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBoYW5kbGVyXG4gKi9cbmludGVybmFscy5QdWJTdWIucHJvdG90eXBlLnN1YnNjcmliZSA9IGZ1bmN0aW9uKHRvcGljLCBoYW5kbGVyKVxue1xuICAgIHRoaXMucHViU3ViLm9uKHRvcGljLCBoYW5kbGVyKTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIHN1YnNjcmlwdGlvblxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY1xuICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlclxuICovXG5pbnRlcm5hbHMuUHViU3ViLnByb3RvdHlwZS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uKHRvcGljLCBoYW5kbGVyKVxue1xuICAgIHRoaXMucHViU3ViLm9mZih0b3BpYywgaGFuZGxlcik7XG59O1xuXG4vKipcbiAqIFB1Ymxpc2ggbWVzc2FnZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY1xuICogQHBhcmFtIHtvYmplY3R9IG1lc3NhZ2VcbiAqL1xuaW50ZXJuYWxzLlB1YlN1Yi5wcm90b3R5cGUucHVibGlzaFJhdyA9IGZ1bmN0aW9uKHRvcGljLCBtZXNzYWdlKVxue1xuICAgIHRoaXMucHViU3ViLnRyaWdnZXIodG9waWMsIG1lc3NhZ2UpO1xufTtcblxuLyoqXG4gKiBQdWJsaXNoIG1lc3NhZ2VcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdG9waWNcbiAqIEBwYXJhbSB7c3RyaW5nfSBzb3VyY2VJdGVtSWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBzb3VyY2VDb21wb25lbnRcbiAqIEBwYXJhbSB7b2JqZWN0fSBwYXlsb2FkXG4gKi9cbmludGVybmFscy5QdWJTdWIucHJvdG90eXBlLnB1Ymxpc2ggPSBmdW5jdGlvbih0b3BpYywgc291cmNlSXRlbUlkLCBzb3VyY2VDb21wb25lbnRJZCwgdHlwZSwgcGF5bG9hZCkge1xuICAgIHZhciBtZXNzYWdlID0ge1xuICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCksXG4gICAgICAgIHNvdXJjZToge1xuICAgICAgICAgICAgaXRlbUlkOiBzb3VyY2VJdGVtSWQsXG4gICAgICAgICAgICBjb21wb25lbnRJZDogc291cmNlQ29tcG9uZW50SWRcbiAgICAgICAgfSxcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgcGF5bG9hZDogcGF5bG9hZFxuICAgIH07XG4gICAgdGhpcy5wdWJsaXNoUmF3KHRvcGljLCBtZXNzYWdlKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLlB1YlN1YiA9IGludGVybmFscy5QdWJTdWI7IiwiLypcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBFY29MZWFybmlhIHBsYXRmb3JtLlxuICpcbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqL1xuXG4vKipcbiAqIEVjb0xlYXJuaWEgdjAuMC4xXG4gKlxuICogQGZpbGVvdmVydmlld1xuICogIFRoaXMgZmlsZSBpbmNsdWRlcyB1dGlsaXR5IGZ1bmN0aW9ucy5cbiAqXG4gKiBAYXV0aG9yIFlvdW5nIFN1ayBBaG4gUGFya1xuICogQGRhdGUgNS8xNS8xNVxuICovXG5cbnZhciBpbnRlcm5hbHMgPSB7fTtcblxuLyoqXG4gKiBlbmRzV2l0aFxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBzdHIgZW5kcyB3aXRoIHRoZSBzdWZmaXgsIGZhbHNlIG90aGVyd2lzZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3VmZml4XG4gKi9cbm1vZHVsZS5leHBvcnRzLmVuZHNXaXRoID0gZnVuY3Rpb24gKHN0ciwgc3VmZml4KVxue1xuICAgIHJldHVybiBzdHIuaW5kZXhPZihzdWZmaXgsIHN0ci5sZW5ndGggLSBzdWZmaXgubGVuZ3RoKSAhPT0gLTE7XG59O1xuXG5cbi8qKlxuICogc3RhcnRzV2l0aFxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBzdHIgc3RhcnRzIHdpdGggdGhlIHByZWZpeCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcmVmaXhcbiAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvblxuICovXG5tb2R1bGUuZXhwb3J0cy5zdGFydHNXaXRoID0gZnVuY3Rpb24gKHN0ciwgcHJlZml4LCBwb3NpdGlvbilcbntcbiAgICBwb3NpdGlvbiA9IHBvc2l0aW9uIHx8IDA7XG4gICAgcmV0dXJuIHN0ci5sYXN0SW5kZXhPZihwcmVmaXgsIHBvc2l0aW9uKSA9PT0gcG9zaXRpb247XG59O1xuXG5cbi8qKlxuICogQWNjZXNzIGFuIG9iamVjdCB1c2luZyBkb3Qgbm90YXRpb25cbiAqIFdoZW4gdGhpcmQgcGFyYW1ldGVyIGlzIHByb3ZpZGVkLCB0aGUgZnVuY3Rpb24gYmVoYXZlcyBhcyBzZXR0ZXIsIG90aGVyd2lzZSBiZWhhdmVzIGFzIGdldHRlclxuICpcbiAqIFNhbXBsZTpcbiAqICAgdXRpbHMuZG90QWNjZXNzKG9iamVjdCwgJ2EuYi5jJywgJ0hlbGxvIFdvcmxkJyk7XG4gKiAgIHZhciBteXZhbCA9IHV0aWxzLmRvdEFjY2VzcyhvYmplY3QsICdhLmIuYycpO1xuICogICAtLT4gbXl2YWwgPSAnSGVsbG8gV29ybGQnXG4gKiBzb3VyY2U6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjM5Mzk0My9jb252ZXJ0LWphdmFzY3JpcHQtc3RyaW5nLWluLWRvdC1ub3RhdGlvbi1pbnRvLWFuLW9iamVjdC1yZWZlcmVuY2VcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqICAtIFRoZSBvYmplY3QgdG8gYmUgYWNjZXNzZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBpcyAgLSBUaGUgZG90IG5vdGF0aW9uIHN0cmluZ1xuICogQHBhcmFtIHsqfHVuZGVmaW5lZH0gIC0gaWYgcHJvdmlkZWQsIHRoaXMgY2FsbCBpcyBhIHNldHRpbmcgY2FsbCwgb3RoZXJ3aXNlIGdldHRpbmcgY2FsbFxuICpcbiAqIEByZXR1cm4geyp9ICAgLSBUaGUgdmFsdWVcbiAqL1xubW9kdWxlLmV4cG9ydHMuZG90QWNjZXNzID0gZnVuY3Rpb24gKG9iaiwgaXMsIHZhbHVlKVxue1xuICAgIGlmICh0eXBlb2YgaXMgPT0gJ3N0cmluZycpXG4gICAgICAgIHJldHVybiBtb2R1bGUuZXhwb3J0cy5kb3RBY2Nlc3Mob2JqLCBpcy5zcGxpdCgnLicpLCB2YWx1ZSk7XG4gICAgZWxzZSBpZiAoaXMubGVuZ3RoID09IDEgJiYgdmFsdWUgIT09dW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gb2JqW2lzWzBdXSA9IHZhbHVlO1xuICAgIGVsc2UgaWYgKGlzLmxlbmd0aCA9PSAwKVxuICAgICAgICByZXR1cm4gb2JqO1xuICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIG1vZHVsZS5leHBvcnRzLmRvdEFjY2VzcyhvYmpbaXNbMF1dLCBpcy5zbGljZSgxKSwgdmFsdWUpO1xufTtcblxuXG4vKipcbiAqIGRvdFBvcHVsYXRlXG4gKi9cbm1vZHVsZS5leHBvcnRzLmRvdFBvcHVsYXRlID0gZnVuY3Rpb24gKG9iaiwgdmFsdWVzKVxue1xuICAgIGZvciAodmFyIHByb3BlcnR5IGluIHZhbHVlcykge1xuICAgICAgICBpZiAodmFsdWVzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgbW9kdWxlLmV4cG9ydC5kb3RBY2Nlc3Mob2JqLCBwcm9wZXJ0eSwgdmFsdWVzW3Byb3BlcnR5XSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwiLypcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBFY29MZWFybmlhIHBsYXRmb3JtLlxuICpcbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqL1xuXG4vKipcbiAqIEVjb0xlYXJuaWEgdjAuMC4xXG4gKlxuICogQGZpbGVvdmVydmlld1xuICogIFRoaXMgZmlsZSBpbmNsdWRlcyB0aGUgZGVmaW5pdGlvbiBvZiBBY3Rpb25CYXJDb21wb25lbnQgY2xhc3MuXG4gKlxuICogQGF1dGhvciBZb3VuZyBTdWsgQWhuIFBhcmsgPHlzLmFobnBhcmtAbWF0aG5pYS5jb20+XG4gKiBAZGF0ZSA1LzEzLzE1XG4gKi9cblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG52YXIgRWxpUmVhY3RDb21wb25lbnQgPSByZXF1aXJlKCcuL2VsaXJlYWN0Y29tcG9uZW50JykuRWxpUmVhY3RDb21wb25lbnQ7XG52YXIgRXZlbnRzID0gcmVxdWlyZSgnLi4vY29yZS9ldmVudHMnKS5FdmVudHM7XG5cblxudmFyIGludGVybmFscyA9IHt9O1xuXG4vKipcbiAqIEBjbGFzcyBBY3Rpb25CYXJDb21wb25lbnRcbiAqXG4gKiBAbW9kdWxlIGludGVyYWN0aXZlcy9jb21wb25lbnRzXG4gKlxuICogQGNsYXNzZGVzY1xuICogIFJlYWN0IGJhc2VkIGNvbXBvbmVudCB0aGF0IHJlcHJlc2VudHMgdGhlIGFjdGlvbiBiYXIuXG4gKiAgQW4gYWN0aW9uIGJhciBpcyB0aGUgdGhlIGludGVyYWN0aXZlIHdoaWNoIHVzZXIgdXNlIHRvIHRyaWdnZXIgYWN0aW9uc1xuICogIHN1Y2ggYXMgc3VibWl0dGluZywgdGV4dCB0byBzcGVlY2gsIHJlcXVlc3RpbmcgaGludCwgbmF2aWdhdGluZyB0byByZWxhdGVkXG4gKiAgbGVhcm5pbmcgY29udGVudHMsIGV0Yy5cbiAqXG4gKiBAdG9kbyAtIEltcGxlbWVudCFcbiAqL1xuZXhwb3J0IGNsYXNzIEFjdGlvbkJhckNvbXBvbmVudCBleHRlbmRzIEVsaVJlYWN0Q29tcG9uZW50XG57XG4gICAgY29uc3RydWN0b3IocHJvcHMpXG4gICAge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIC8vdGhpcy5iaW5kXygnaGFuZGxlQWN0aW9uXycpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBzdWJtaXR0ZWQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVBY3Rpb25fKHR5cGUsIGUpXG4gICAge1xuICAgICAgICAvLyBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMucHJvcHMuaXRlbUNvbnRleHQucHVic3ViLnB1Ymxpc2goXG4gICAgICAgICAgICAnYWN0aW9uOicgKyB0eXBlLFxuICAgICAgICAgICAgdGhpcy5pdGVtQXNzb2NpYXRpb25JZCgpLFxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRJZCgpLFxuICAgICAgICAgICAgdHlwZSk7XG4gICAgfVxuXG4gICAgcmVuZGVySXRlbV8odHlwZSlcbiAgICB7XG4gICAgICAgIHZhciByZXR2YWwgPSBudWxsO1xuICAgICAgICBpZiAodHlwZSA9PSAndHRzJykge1xuICAgICAgICAgICAgcmV0dmFsID0gPGRpdj48YSBvbkNsaWNrPXt0aGlzLmhhbmRsZUFjdGlvbl8uYmluZCh0aGlzLCAndHRzJyl9ID5hdWRpby1pY29uPC9hPjwvZGl2PlxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlID09ICdzdWJtaXQnKSB7XG4gICAgICAgICAgICByZXR2YWwgPSA8ZGl2PjxidXR0b24gb25DbGljaz17dGhpcy5oYW5kbGVBY3Rpb25fLmJpbmQodGhpcywgJ3N1Ym1pdCcpfSA+U3VibWl0PC9idXR0b24+PC9kaXY+XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGUgPT0gJ3Jlc2V0Jykge1xuICAgICAgICAgICAgcmV0dmFsID0gPGRpdj48YSBvbkNsaWNrPXt0aGlzLmhhbmRsZUFjdGlvbl8uYmluZCh0aGlzLCAncmVzZXQnKX0gPlJlc2V0PC9hPjwvZGl2PlxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlID09ICdoaW50Jykge1xuICAgICAgICAgICAgcmV0dmFsID0gPGRpdj48YSBvbkNsaWNrPXt0aGlzLmhhbmRsZUFjdGlvbl8uYmluZCh0aGlzLCAnaGludCcpfSA+SGludDwvYT48L2Rpdj5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0dmFsO1xuICAgIH1cblxuICAgIHJlbmRlcigpXG4gICAge1xuICAgIFx0dmFyIGFjdGlvbmJhckl0ZW1zID0gdGhpcy5wcm9wcy5jb25maWcuaXRlbXMubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGxpPnt0aGlzLnJlbmRlckl0ZW1fKGl0ZW0pfTwvbGk+XG4gICAgICAgICAgICApXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cblx0XHQvLyBUaGUgXCJlbGlcIiBwcmVmaXggaW4gdGhlIGNsYXNzTmFtZSBzdGFuZHMgZm9yIEVjb0xlYXJuaWEgSW50ZXJhY3RpdmVcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZWxpLWFjdGlvbmJhclwiPlxuICAgICAgICAgICAgICAgIDx1bCA+XG5cdCAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwiZWxpLWFjdGlvbmJhci1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7YWN0aW9uYmFySXRlbXN9XG5cdCAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59O1xuIiwiLypcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBFY29MZWFybmlhIHBsYXRmb3JtLlxuICpcbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqL1xuXG4vKipcbiAqIEVjb0xlYXJuaWEgdjAuMC4xXG4gKlxuICogQGZpbGVvdmVydmlld1xuICogIFRoaXMgZmlsZSBpbmNsdWRlcyB0aGUgZGVmaW5pdGlvbiBvZiBFbGlSZWFjdENvbXBvbmVudCBhYnN0cmFjdCBjbGFzcy5cbiAqXG4gKiBAYXV0aG9yIFlvdW5nIFN1ayBBaG4gUGFya1xuICogQGRhdGUgNS8xNS8xNVxuICovXG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xuXG52YXIgaW50ZXJuYWxzID0ge307XG5cbi8qKlxuICogQGNsYXNzIEVsaVJlYWN0Q29tcG9uZW50XG4gKiBAYWJzdHJhY3RcbiAqXG4gKiBAbW9kdWxlIGludGVyYWN0aXZlcy9jb21wb25lbnRzXG4gKlxuICogQGNsYXNzZGVzY1xuICogIEFic3RyYWN0IGNsYXNzIHdoaWNoIGFsbCBSZWFjdC1iYXNlZCBFTC1JIGNvbXBvbmVudHMgc2hvdWxkIGV4dGVuZC5cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBFbGlSZWFjdENvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudFxue1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKVxuICAgIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuXG4gICAgICAgIHRoaXMuaXRlbUFzc29jaWF0aW9uSWRfID0gcHJvcHMuaXRlbUFzc29jaWF0aW9uSWQ7XG4gICAgICAgIHRoaXMuY29tcG9uZW50SWRfID0gcHJvcHMuY29tcG9uZW50SWQ7XG4gICAgfVxuXG59XG5cbi8qKlxuICogQmluZHMgZWFjaCBvZiB0aGUgbWV0aG9kcyB0byB0aGUgdGhpcyBjb250ZXh0XG4gKiBAc2VlIGh0dHA6Ly93d3cubmV3bWVkaWFjYW1wYWlnbnMuY29tL2Jsb2cvcmVmYWN0b3JpbmctcmVhY3QtY29tcG9uZW50cy10by1lczYtY2xhc3Nlc1xuICovXG5FbGlSZWFjdENvbXBvbmVudC5wcm90b3R5cGUuYmluZF8gPSBmdW5jdGlvbiguLi5tZXRob2RzKVxue1xuICAgIG1ldGhvZHMuZm9yRWFjaCggKG1ldGhvZCkgPT4gdGhpc1ttZXRob2RdID0gdGhpc1ttZXRob2RdLmJpbmQodGhpcykgKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgSUQgb2YgdGhlIGl0ZW0gdGhhdCB0aGlzIGNvbXBvbmVudCBwZXJ0YWluc1xuICovXG5FbGlSZWFjdENvbXBvbmVudC5wcm90b3R5cGUuaXRlbUFzc29jaWF0aW9uSWQgPSBmdW5jdGlvbigpXG57XG4gICAgcmV0dXJuIHRoaXMuaXRlbUFzc29jaWF0aW9uSWRfO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBJRCBvZiB0aGlzIGNvbXBvbmVudCBpbnN0YW5jZVxuICovXG5FbGlSZWFjdENvbXBvbmVudC5wcm90b3R5cGUuY29tcG9uZW50SWQgPSBmdW5jdGlvbigpXG57XG4gICAgcmV0dXJuIHRoaXMuY29tcG9uZW50SWRfO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBraW5kIG9mIHRoaXMgY29tcG9uZW50IChyZWFjdClcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbkVsaVJlYWN0Q29tcG9uZW50LnByb3RvdHlwZS5jb21wb25lbnRLaW5kID0gZnVuY3Rpb24oKVxue1xuICAgIHJldHVybiAncmVhY3QnO1xufTtcblxuRWxpUmVhY3RDb21wb25lbnQucHJvcFR5cGVzID0ge1xuICAgIC8vIENvbXBvbmVudCBJRFxuICAgIGNvbXBvbmVudElkOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgLy8gQ29udGVudCBSdW50aW1lIEVudmlyb25tZW50J3MgY29udGV4dFxuICAgIGl0ZW1Db250ZXh0OiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgLy8gQ29tcG9uZW50J3Mgc2V0dGluZ3NcbiAgICBjb25maWc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuIiwiLypcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBFY29MZWFybmlhIHBsYXRmb3JtLlxuICpcbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqL1xuXG4vKipcbiAqIEVjb0xlYXJuaWEgdjAuMC4xXG4gKlxuICogQGZpbGVvdmVydmlld1xuICogIFRoaXMgZmlsZSBpbmNsdWRlcyB0aGUgZGVmaW5pdGlvbiBvZiBFbGlWaWV3Q29tcG9uZW50IGFic3RyYWN0IGNsYXNzLlxuICpcbiAqIEBhdXRob3IgWW91bmcgU3VrIEFobiBQYXJrXG4gKiBAZGF0ZSA1LzE1LzE1XG4gKi9cblxudmFyIEFtcGVyc2FuZFZpZXcgPSByZXF1aXJlICgnYW1wZXJzYW5kLXZpZXcnKTtcblxudmFyIGludGVybmFscyA9IHt9O1xuXG4vKipcbiAqIEBjbGFzcyBFbGlWaWV3Q29tcG9uZW50XG4gKiBAYWJzdHJhY3RcbiAqXG4gKiBAbW9kdWxlIGludGVyYWN0aXZlcy9jb21wb25lbnRzXG4gKlxuICogQGNsYXNzZGVzY1xuICogIEFic3RyYWN0IGNsYXNzIHdoaWNoIGFsbCBCYWNrYm9uZS1iYXNlZCBFTC1JIGNvbXBvbmVudHMgc2hvdWxkIGV4dGVuZC5cbiAqXG4gKi9cbmludGVybmFscy5FbGlWaWV3Q29tcG9uZW50ID0gQW1wZXJzYW5kVmlldy5leHRlbmQoe1xuXG4gICAgcHJvcHM6IHtcbiAgICAgICAgY29tcG9uZW50SWQ6ICdzdHJpbmcnLFxuICAgICAgICAvLyBDb250ZW50IFJ1bnRpbWUgRW52aXJvbm1lbnQncyBjb250ZXh0XG4gICAgICAgIGl0ZW1Db250ZXh0OiAnb2JqZWN0JyxcbiAgICAgICAgLy8gQ29tcG9uZW50J3Mgc2V0dGluZ3NcbiAgICAgICAgY29uZmlnOiAnb2JqZWN0J1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB0eXBlIG9mIHRoaXMgY29tcG9uZW50ICh2aWV3KVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgY29tcG9uZW50S2luZDogZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgcmV0dXJuICd2aWV3JztcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMuRWxpVmlld0NvbXBvbmVudCA9IGludGVybmFscy5FbGlWaWV3Q29tcG9uZW50O1xuIiwiLypcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBFY29MZWFybmlhIHBsYXRmb3JtLlxuICpcbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqL1xuXG4vKipcbiAqIEVjb0xlYXJuaWEgdjAuMC4xXG4gKlxuICogQGZpbGVvdmVydmlld1xuICogIFRoaXMgZmlsZSBpbmNsdWRlcyB0aGUgZGVmaW5pdGlvbiBvZiBGZWVkYmFja0NvbXBvbmVudCBjbGFzcy5cbiAqXG4gKiBAYXV0aG9yIFlvdW5nIFN1ayBBaG4gUGFya1xuICogQGRhdGUgNS8xMy8xNVxuICovXG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xudmFyIEVsaVJlYWN0Q29tcG9uZW50ID0gcmVxdWlyZSgnLi9lbGlyZWFjdGNvbXBvbmVudCcpLkVsaVJlYWN0Q29tcG9uZW50O1xudmFyIEV2ZW50cyA9IHJlcXVpcmUoJy4uL2NvcmUvZXZlbnRzJykuRXZlbnRzO1xuXG52YXIgaW50ZXJuYWxzID0ge307XG5cbi8qKlxuICogQGNsYXNzIEZlZWRiYWNrQ29tcG9uZW50XG4gKlxuICogQG1vZHVsZSBpbnRlcmFjdGl2ZXMvY29tcG9uZW50c1xuICpcbiAqIEBjbGFzc2Rlc2NcbiAqICBSZWFjdCBiYXNlZCBjb21wb25lbnQgdGhhdCByZXByZXNlbnRzIHRoZSBmZWVkYmFjay5cbiAqICBUaGUgZmVlZGJhY2sgY29tcG9uZW50IGlzIHdoZXJlIHRoZSBmZWVkYmFjayBtZXNzYWdlcyBpbmNsdWRpbmcgaGludHMgYXJlXG4gKiAgZGlzcGxheWVkIHVwb24gc3BlY2lmaWMgYWN0aW9uLlxuICpcbiAqIEB0b2RvIC0gSW1wbGVtZW50IVxuICovXG5leHBvcnQgY2xhc3MgRmVlZGJhY2tDb21wb25lbnQgZXh0ZW5kcyBFbGlSZWFjdENvbXBvbmVudFxue1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKVxuICAgIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLmJpbmRfKCdoYW5kbGVFdmFsdWF0ZWRFdmVudF8nKTtcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgZXZhbHVhdGlvbjoge31cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnByb3BzLml0ZW1Db250ZXh0LnB1YnN1Yi5zdWJzY3JpYmUoXG4gICAgICAgICAgICBFdmVudHMuQU5TV0VSX0VWQUxVQVRFRCxcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRXZhbHVhdGVkRXZlbnRfLmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBoYW5kbGVFdmFsdWF0ZWRFdmVudF8obWVzc2FnZSlcbiAgICB7XG4gICAgICAgIGlmKG1lc3NhZ2Uuc291cmNlLml0ZW1JZCA9PT0gdGhpcy5pdGVtQXNzb2NpYXRpb25JZCgpKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtldmFsdWF0aW9uOiBtZXNzYWdlLnBheWxvYWR9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlcigpXG4gICAge1xuICAgICAgICAvLyBUaGUgXCJlbGlcIiBwcmVmaXggaW4gdGhlIGNsYXNzTmFtZSBzdGFuZHMgZm9yIEVjb0xlYXJuaWEgSW50ZXJhY3RpdmVcbiAgICAgICAgdmFyIGV2YWxEdW1wID0gSlNPTi5zdHJpbmdpZnkodGhpcy5zdGF0ZS5ldmFsdWF0aW9uKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZWxpLWZlZWRiYWNrXCI+XG4gICAgICAgICAgICAgICAge2V2YWxEdW1wfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiLypcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBFY29MZWFybmlhIHBsYXRmb3JtLlxuICpcbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqL1xuXG4vKipcbiAqIEVjb0xlYXJuaWEgdjAuMC4xXG4gKlxuICogQGZpbGVvdmVydmlld1xuICogIFRoaXMgZmlsZSBpbmNsdWRlcyB0aGUgZGVmaW5pdGlvbiBvZiBNdWx0aVZhbHVlUXVlc3Rpb25Db21wb25lbnQgY2xhc3MuXG4gKlxuICogQGF1dGhvciBZb3VuZyBTdWsgQWhuIFBhcmtcbiAqIEBkYXRlIDYvMDIvMTVcbiAqL1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG52YXIgRWxpUmVhY3RDb21wb25lbnQgPSByZXF1aXJlKCcuLi9lbGlyZWFjdGNvbXBvbmVudCcpLkVsaVJlYWN0Q29tcG9uZW50O1xudmFyIEV2ZW50cyA9IHJlcXVpcmUoJy4uLy4uL2NvcmUvZXZlbnRzJykuRXZlbnRzO1xuXG4vKipcbiAqIEBjbGFzcyBRdWVzdGlvbkNvbXBvbmVudFxuICpcbiAqIEBtb2R1bGUgaW50ZXJhY3RpdmVzL2NvbXBvbmVudHMvcXVlc3Rpb25zXG4gKlxuICogQGNsYXNzZGVzY1xuICogIFJlYWN0IGJhc2VkIGFic3RyYWN0IGNvbXBvbmVudCB0aGF0IHJlcHJlc2VudHMgYSBxdWVzdGlvbi5cbiAqICBBIHF1ZXN0aW9uIGhhcyBvbmUgb3IgbW9yZSBpbnB1dCBmaWVsZHMgd2hlcmUgdXNlciBjYW4gZW50ZXIgYW5zd2VyLlxuICogIElucHV0IGZpZWxkcyBjYW4gYmUgb2YgYW55IHR5cGUsIGUuZy4gdGV4dGJveCwgc2xpZGVyLCBkcm9wZG93biwgZXRjLlxuICpcbiAqXG4gKiBAdG9kbyAtIFN1Ym1pc3Npb24gaGFuZGxpbmc6IGtlZXAgdGhlIHN0YXRlIGluIG1vZGVsc1xuICogQHRvZG8gLSBGYWN0b3Igb3V0IHRoZSBwcmVzZW50ZXI6IG11bHRpc2VsZWN0LCBtdWx0aWNob2ljZSwgZXRjLlxuICovXG5leHBvcnQgY2xhc3MgQWJzdHJhY3RRdWVzdGlvbkNvbXBvbmVudCBleHRlbmRzIEVsaVJlYWN0Q29tcG9uZW50XG57XG4gICAgY29uc3RydWN0b3IocHJvcHMpXG4gICAge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuYmluZF8oJ2hhbmRsZUV2YWx1YXRlZEV2ZW50XycpO1xuXG4gICAgICAgIHRoaXMucHJvcHMuaXRlbUNvbnRleHQucHVic3ViLnN1YnNjcmliZShcbiAgICAgICAgICAgIEV2ZW50cy5BTlNXRVJfRVZBTFVBVEVELFxuICAgICAgICAgICAgdGhpcy5oYW5kbGVFdmFsdWF0ZWRFdmVudF8uYmluZCh0aGlzKVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBldmFsdWF0aW9uOiB7fVxuICAgICAgICB9O1xuXG4gICAgfVxuXG4gICAgaGFuZGxlRXZhbHVhdGVkRXZlbnRfKG1lc3NhZ2UpXG4gICAge1xuICAgICAgICBpZihtZXNzYWdlLnNvdXJjZS5pdGVtSWQgPT09IHRoaXMuaXRlbUFzc29jaWF0aW9uSWQoKSlcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gZG8gc29tZXRoaW5nXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBvcHRpb24ncyB2YWx1ZSBvZiBhIGNob3NlbiBmaWVsZFxuICAgICAqIEBwYXJhbSBxdWVzdGlvblxuICAgICAqIEBwYXJhbSBmaWVsZElkXG4gICAgICogQHBhcmFtIGtleVxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGdldE9wdGlvblZhbHVlKHF1ZXN0aW9uLCBmaWVsZElkLCBrZXkpXG4gICAge1xuICAgICAgICB2YXIgZmllbGQgPSBxdWVzdGlvbi5maWVsZHMuZmluZCggZnVuY3Rpb24oZWxlbWVudCwgaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiAoZWxlbWVudC5pZCA9PT0gZmllbGRJZCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb3B0aW9uID0gZmllbGQub3B0aW9ucy5maW5kKCBmdW5jdGlvbihlbGVtZW50LCBpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIChlbGVtZW50LmtleSA9PT0ga2V5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvcHRpb24udmFsdWU7XG4gICAgfVxufVxuIiwiLypcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBFY29MZWFybmlhIHBsYXRmb3JtLlxuICpcbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqL1xuXG4vKipcbiAqIEVjb0xlYXJuaWEgdjAuMC4xXG4gKlxuICogQGZpbGVvdmVydmlld1xuICogIFRoaXMgZmlsZSBpbmNsdWRlcyB0aGUgZGVmaW5pdGlvbiBvZiBNdWx0aVZhbHVlUXVlc3Rpb25Db21wb25lbnQgY2xhc3MuXG4gKlxuICogQGF1dGhvciBZb3VuZyBTdWsgQWhuIFBhcmtcbiAqIEBkYXRlIDUvMTMvMTVcbiAqL1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG52YXIgQWJzdHJhY3RRdWVzdGlvbkNvbXBvbmVudCA9IHJlcXVpcmUoJy4vcXVlc3Rpb24uanN4JykuQWJzdHJhY3RRdWVzdGlvbkNvbXBvbmVudDtcblxudmFyIGludGVybmFscyA9IHt9O1xuXG4vKipcbiAqIEBjbGFzcyBNdWx0aVZhbHVlUXVlc3Rpb25Db21wb25lbnRcbiAqXG4gKiBAbW9kdWxlIGludGVyYWN0aXZlcy9jb21wb25lbnRzL3F1ZXN0aW9uc1xuICpcbiAqIEBjbGFzc2Rlc2NcbiAqICBSZWFjdCBiYXNlZCBjb21wb25lbnQgdGhhdCByZXByZXNlbnRzIGEgZ2VuZXJpYyBtdWx0aVZhbHVlIHF1ZXN0aW9uLlxuICogIEEgbXVsdGl2YWx1ZSBxdWVzaW9ucyBhcmUgdGhvc2Ugd2hpY2ggdGhlIHF1ZXN0aW9uIGNhbiBhc2sgZm9yIG11bHRpcGxlXG4gKiAgdmFsdWVzLlxuICogIFRoZXJlZm9yZSB0aGUgc3VibWlzc2lvbiBoYXMgdGhlIHN0cnVjdHVyZSBvZlxuICogIE9iamVjdC48a2V5OiBzdHJpbmcsIHZhbHVlOiBPYmplY3Q+XG4gKlxuICogQHRvZG8gLSBTdWJtaXNzaW9uIGhhbmRsaW5nOiBrZWVwIHRoZSBzdGF0ZSBpbiBtb2RlbHNcbiAqIEB0b2RvIC0gRmFjdG9yIG91dCB0aGUgcHJlc2VudGVyOiBtdWx0aXNlbGVjdCwgbXVsdGljaG9pY2UsIGV0Yy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNlbGVjdFF1ZXN0aW9uQ29tcG9uZW50IGV4dGVuZHMgQWJzdHJhY3RRdWVzdGlvbkNvbXBvbmVudFxue1xuICAgIC8qXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIC8vIENvbnRlbnQgUnVudGltZSBFbnZpcm9ubWVudCdzIGNvbnRleHRcbiAgICAgICAgaXRlbUNvbnRleHQ6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgICAgLy8gQ29udGVudCBtb2RlbHNcbiAgICAgICAgY29udGVudE1vZGVsczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgICAvLyBDb21wb25lbnQncyBzZXR0aW5nc1xuICAgICAgICBjb25maWc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxuICAgIH0sKi9cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcylcbiAgICB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgc3VibWl0dGVkOiBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5iaW5kXygnaGFuZGxlQ2hhbmdlXycpO1xuICAgIH1cblxuICAgIGhhbmRsZUNoYW5nZV8oZmllbGRJZCwga2V5LCBlKVxuICAgIHtcbiAgICAgICAgdmFyIGNoZWNrZWQgPSBldmVudC50YXJnZXQuY2hlY2tlZDtcbiAgICAgICAgdmFyIHF1ZXN0aW9uID0gdGhpcy5wcm9wcy5pdGVtQ29udGV4dC5nZXRWYWx1ZSh0aGlzLnByb3BzLmNvbmZpZy5xdWVzdGlvbik7XG5cbiAgICAgICAgaWYgKGNoZWNrZWQpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0T3B0aW9uVmFsdWUocXVlc3Rpb24sIGZpZWxkSWQsIGtleSk7XG4gICAgICAgICAgICB0aGlzLnByb3BzLml0ZW1Db250ZXh0LmFuc3dlck1vZGVsLmFkZFN0YWdlZEFuc3dlcihmaWVsZElkLCBrZXksIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuaXRlbUNvbnRleHQuYW5zd2VyTW9kZWwucmVtb3ZlU3RhZ2VkQW5zd2VyKGZpZWxkSWQsIGtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXIoKVxuICAgIHtcbiAgICAgICAgLy8gUmV0dXJucyB0aGUgb2JqZWN0IGVpdGhlciBmcm9tIHRoZSBjb25maWcgcXVlc3Rpb24gdmFsdWUgaXRzZWxmXG4gICAgICAgIC8vIE9yIGZyb20gdGhlIHJlZmVyZW5jZSB0byB0aGUgbW9kZWwuXG4gICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMucHJvcHMuaXRlbUNvbnRleHQuZ2V0VmFsdWUodGhpcy5wcm9wcy5jb25maWcucXVlc3Rpb24pO1xuXG4gICAgICAgIHZhciBvcHRpb25zU2V0ID0gW107XG4gICAgICAgIHF1ZXN0aW9uLmZpZWxkcy5mb3JFYWNoKCBmdW5jdGlvbihlbGVtZW50LCBpbmRleCl7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IGVsZW1lbnQub3B0aW9ucy5tYXAoZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImVsaS1xdWVzdGlvbi1vcHRpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPXtlbGVtZW50LmlkfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VfLmJpbmQodGhpcywgZWxlbWVudC5pZCwgb3B0aW9uLmtleSl9IHZhbHVlPXtvcHRpb24udmFsdWV9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICB7b3B0aW9uLnZhbHVlfVxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICBvcHRpb25zU2V0LnB1c2goXG4gICAgICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICAgICAgICB7b3B0aW9uc31cbiAgICAgICAgICAgICAgICA8L3VsPik7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cblxuICAgICAgICAvLyBUaGUgXCJlbGlcIiBwcmVmaXggaW4gdGhlIGNsYXNzTmFtZSBzdGFuZHMgZm9yIEVjb0xlYXJuaWEgSW50ZXJhY3RpdmVcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZWxpLXF1ZXN0aW9uXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZWxpLXF1ZXN0aW9uLXByb21wdFwiPntxdWVzdGlvbi5wcm9tcHR9PC9zcGFuPlxuICAgICAgICAgICAgICAgIHtvcHRpb25zU2V0fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiLypcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBFY29MZWFybmlhIHBsYXRmb3JtLlxuICpcbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqL1xuXG4vKipcbiAqIEVjb0xlYXJuaWEgdjAuMC4xXG4gKlxuICogQGZpbGVvdmVydmlld1xuICogIFRoaXMgZmlsZSBpbmNsdWRlcyB0aGUgZGVmaW5pdGlvbiBvZiBUZW1wbGF0ZUNvbnRhaW5lckNvbXBvbmVudCBjbGFzcy5cbiAqXG4gKiBAYXV0aG9yIFlvdW5nIFN1ayBBaG4gUGFya1xuICogQGRhdGUgNS8xMy8xNVxuICovXG52YXIgRWxpVmlld0NvbXBvbmVudCA9IHJlcXVpcmUoJy4vZWxpdmlld2NvbXBvbmVudCcpLkVsaVZpZXdDb21wb25lbnQ7XG5cbnZhciBpbnRlcm5hbHMgPSB7fTtcblxuaW50ZXJuYWxzLmNvbnN0ID0ge1xuICAgIC8vIHByZWZpeCBmb3IgRWNvTGVhcm5pYSBJbnRlcmFjdGl2ZSBPYmplY3QsIHVzZWQgYXQgdGhlIGRhdGEtaG9vayBhdHRyaWJ1dGVzXG4gICAgSURfUFJFRklYOiAnZWxpb18nXG59O1xuXG4vKipcbiAqIEBjbGFzcyBUZW1wbGF0ZUNvbnRhaW5lckNvbXBvbmVudFxuICpcbiAqIEBtb2R1bGUgaW50ZXJhY3RpdmVzL2NvbXBvbmVudHNcbiAqXG4gKiBAY2xhc3NkZXNjXG4gKiAgUmVhY3QgYmFzZWQgY29tcG9uZW50IHRoYXQgcmVwcmVzZW50cyBhIGNvbnRhaW5lciBjb21wb25lbnQuXG4gKiAgQ29udGFpbmVyIGNvbXBvbmVudCBpcyBhIGNvbXBvbmVudCB0aGF0IGlzIGNvbXBvc2VkIG9mIHNldmVyYWwgb3RoZXJcbiAqICBjb21wb25lbnRzLlxuICogIFRoaXMgcGFydGljdWxhciBpbXBsZW1lbnRhdGlvbiB1c2VzIHRlbXBsYXRlIHdoZXJlIHt7IDxvYmplY3QuaWQ+IH19IGlzXG4gKiAgcmVwbGFjZWQgYnkgdGhlIHJlc3BlY3RpdmUgY29tcG9uZW50IG9yIG1vZGVsIHZhbHVlLlxuICpcbiAqIEB0b2RvIC0gRG8gdmFsaWRhdGlvbi9zYW5pdGl6YXRpb24gb2YgdGhlIEhUTUwgdGFncyBpbiB0aGUgdGVtcGxhdGUgc3RyaW5nLlxuICovXG5pbnRlcm5hbHMuVGVtcGxhdGVDb250YWluZXJDb21wb25lbnQgPSBFbGlWaWV3Q29tcG9uZW50LmV4dGVuZCh7XG5cbiAgICAvKipcbiAgICAgKiBNYXAgb2Yga2V5IC0+IEVMSSBvYmplY3QsXG4gICAgICogd2hlcmUga2V5cyBhcmUgdW5pcXVlIGtleSBnZW5lcmF0ZWQgYnkgcGFyc2VUZW1wbGF0ZSBhbmQgRUxJIG9iamVjdCBpc1xuICAgICAqIHRoZSBGUU4gb2YgdGhlIG9iamVjdCB3aGljaCBjb3VsZCBiZSBhIG9iamVjdCBpbiBtb2RlbCBvciBhIGNvbXBvbmVudC5cbiAgICAgKlxuICAgICAqIEV4YW1wbGU6XG4gICAgICoge1xuICAgICAqICAgJ2VsaW9fMSc6ICcubW9kZWwucXVlc3Rpb24ucHJvbXB0JyxcbiAgICAgKiAgICdlbGlvXzInOiAnLmNvbXBvbmVudC5tdnF1ZXN0aW9uJ1xuICAgICAqIH1cbiAgICAgKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsIG9iamVjdD59XG4gICAgICovXG4gICAgZWxpb3NfOiB7fSxcblxuICAgIC8qXG4gICAgdGVtcGxhdGU6IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgfSwqL1xuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucylcbiAgICB7XG4gICAgICAgIHRoaXMuaXRlbUNvbnRleHQgPSBvcHRpb25zLml0ZW1Db250ZXh0O1xuICAgICAgICB0aGlzLmNvbnRlbnRNb2RlbHMgPSBvcHRpb25zLmNvbnRlbnRNb2RlbHM7XG4gICAgICAgIHRoaXMuY29uZmlnID0gb3B0aW9ucy5jb25maWc7XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSB0aGlzLnBhcnNlVGVtcGxhdGUob3B0aW9ucy5jb25maWcudGVtcGxhdGUpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIHRoaXMucmVuZGVyV2l0aFRlbXBsYXRlKHRoaXMpO1xuXG4gICAgICAgIC8vIEZvciBlYWNoIG9mIHRoZSBwbGFjZWhvbGRlcnMgKGRpdnMgd2l0aCBkYXRhLWhvb2spXG4gICAgICAgIC8vIEluamVjdCB0aGUgb2JqZWN0IGZyb20gdGhlIGl0ZW1Db250ZXh0XG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmVsaW9zXykge1xuICAgICAgICAgICAgdmFyIG9iamVjdEZxbiA9IHRoaXMuZWxpb3NfW2tleV07XG4gICAgICAgICAgICB2YXIgb2JqZWN0RWwgPSB0aGlzLnF1ZXJ5QnlIb29rKGtleSk7XG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gdGhpcy5pdGVtQ29udGV4dC5yZXNvbHZlT2JqZWN0KG9iamVjdEZxbik7XG5cbiAgICAgICAgICAgIGlmIChvYmplY3QudHlwZSAmJiBvYmplY3QudHlwZS5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgICAgICAvLyBpcyBhIGNvbXBvbmVudCwgcmVuZGVyIGl0IGluIHRoZSBlbFxuICAgICAgICAgICAgICAgIC8vIEB0b2RvIC0gQ29uc2lkZXIgY2hlY2tpbmcgZm9yIG9iamVjdC50eXBlLnByb3RvdHlwZS5jb21wb25lbnRUeXBlXG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtQ29udGV4dC5yZW5kZXJDb21wb25lbnQob2JqZWN0LCBvYmplY3RFbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEB0b2RvIC0gSXMgaXMgT0sgdG8ganVzdCBzZXQgdGhlIHRleHRDb250ZXh0IHdpdGggc3RyaW5naWZpZWQgb2JqZWN0P1xuICAgICAgICAgICAgICAgIG9iamVjdEVsLnRleHRDb250ZW50ID0gb2JqZWN0LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vIFBhcnNlcyBhIHRlbXBsYXRlIG9mIGZvcm1hdFxuICAgIC8vIFwie3suY29tb25lbnRzLm12cXVlc3Rpb259fSA8YnIgLz4ge3subW9kZWxzLnF1ZXN0aW9uLnByb21wdH19XCJcbiAgICBwYXJzZVRlbXBsYXRlOiBmdW5jdGlvbiAodGVtcGxhdGVTdHIpXG4gICAge1xuICAgICAgICB2YXIgcmUgPSBuZXcgUmVnRXhwKCd7e1xcXFxzKltcXFxcdy5dKlxcXFxzKn19JywgJ2cnKTtcblxuICAgICAgICB2YXIgdGVtcGxhdGUgPSBbXTsgLy8gVGVtcGxhdGUgYnJva2VuIGludG8gcGF0dGVybnNcblxuICAgICAgICB2YXIgY3Vyc29yID0gMDtcbiAgICAgICAgdmFyIGlkeCA9IDA7XG5cbiAgICAgICAgdmFyIG1hdGNoO1xuICAgICAgICB3aGlsZSAoKG1hdGNoID0gcmUuZXhlYyh0ZW1wbGF0ZVN0cikpICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlkeCsrO1xuICAgICAgICAgICAgaWYgKGN1cnNvciAhPSBtYXRjaC5pbmRleCkge1xuICAgICAgICAgICAgICAgIC8vIEFwcGVuZCB0aGUgc3Vic3RyaW5nIHRoYXQgaXMgbm90IHBhcnQgb2YgdGhlIG1hdGNoXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUucHVzaCh0ZW1wbGF0ZVN0ci5zdWJzdHJpbmcoY3Vyc29yLCBtYXRjaC5pbmRleCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUmVwbGFjZSB0aGUgbWF0Y2hpbmcgcGF0dGVybiB3aXRoIGEgbWFya3VwXG4gICAgICAgICAgICB2YXIgZWxpb0lkID0gaW50ZXJuYWxzLmNvbnN0LklEX1BSRUZJWCArIGlkeC50b1N0cmluZygpO1xuICAgICAgICAgICAgdGVtcGxhdGUucHVzaCgnPGRpdiBkYXRhLWhvb2s9XCInICsgZWxpb0lkICsgJ1wiPjwvZGl2PicpO1xuICAgICAgICAgICAgLy8gbW92ZSBmb3J3YXJkIHRoZSBjdXJzb3IgdG8gdGhlIHRhaWwgb2YgdGhlIG1hdGNoZWQgcGF0dGVyblxuICAgICAgICAgICAgY3Vyc29yID0gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGg7XG4gICAgICAgICAgICAvLyBpbmRleCB0aGUgcGF0dGVybiB3aXRob3V0IHRoZSAne3snIGFuZCAnfX0nLCBhbmQgdHJpbSBpdFxuICAgICAgICAgICAgdGhpcy5lbGlvc19bZWxpb0lkXSA9IG1hdGNoWzBdLnN1YnN0cmluZygyLCBtYXRjaFswXS5sZW5ndGggLSAyKS50cmltKCk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwibWF0Y2ggXCIgKyBtYXRjaFswXSArIFwiIGZvdW5kIGF0IFwiICsgICBtYXRjaC5pbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQXBwZW5kIHRoZSByZXN0IG9mIHRoZSB0ZXh0XG4gICAgICAgIHRlbXBsYXRlLnB1c2godGVtcGxhdGVTdHIuc3Vic3RyaW5nKGN1cnNvcikpO1xuXG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZS5qb2luKCcnKTtcbiAgICB9XG59KTtcblxuXG5tb2R1bGUuZXhwb3J0cy5UZW1wbGF0ZUNvbnRhaW5lckNvbXBvbmVudCA9IGludGVybmFscy5UZW1wbGF0ZUNvbnRhaW5lckNvbXBvbmVudDsiLCIvKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIEVjb0xlYXJuaWEgcGxhdGZvcm0uXG4gKlxuICogKGMpIFlvdW5nIFN1ayBBaG4gUGFyayA8eXMuYWhucGFya0BtYXRobmlhLmNvbT5cbiAqXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKi9cblxuLyoqXG4gKiBFY29MZWFybmlhIHYwLjAuMVxuICpcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqICBUaGlzIGZpbGUgaW5jbHVkZXMgdGhlIGRlZmluaXRpb24gb2YgU3VibWlzc2lvbkhhbmRsZXIgY2xhc3MuXG4gKlxuICogQGF1dGhvciBZb3VuZyBTdWsgQWhuIFBhcmtcbiAqIEBkYXRlIDYvMDIvMTVcbiAqL1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgcG9seWZpbGxzID0gcmVxdWlyZSgnLi4vLi4vY29tbW9uL3BvbHlmaWxscycpO1xudmFyIGxvZ2dlciA9IHJlcXVpcmUoJy4uLy4uL2NvbW1vbi9sb2dnZXInKTtcbnZhciBFdmVudHMgPSByZXF1aXJlKCcuL2V2ZW50cycpLkV2ZW50cztcblxuXG4vKipcbiAqIEBjbGFzcyBBbnN3ZXJNb2RlbFxuICpcbiAqIEBtb2R1bGUgaW50ZXJhY3RpdmVzL2NvcmVcbiAqXG4gKiBAY2xhc3NkZXNjXG4gKiAgT2JqZWN0IG9mIHRoaXMgY2xhc3MgZGVhbHMgd2l0aCBzdHVkZW50IGFuc3dlciBieTpcbiAqICAtIHNhdmluZyB0aGUgc3R1ZGVudCBhbnN3ZXJlZCBmaWVsZHMgdG8gc3RhZ2luZyBmb3Igc3VibWlzc2lvblxuICogIC0gaW52b2tpbmcgdGhlIGV2YWx1YXRvciBmb3IgdGhlIHN0YWdlZCBhbnN3ZXJcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBBbnN3ZXJNb2RlbFxue1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzKVxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBsb2dnZXJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubG9nZ2VyXyA9IGxvZ2dlci5nZXRMb2dnZXIoJ0Fuc3dlck1vZGVsJyk7XG5cbiAgICAgICAgdGhpcy5pdGVtQ29udGV4dCA9IHNldHRpbmdzLml0ZW1Db250ZXh0O1xuXG4gICAgICAgIHRoaXMucHVic3ViID0gc2V0dGluZ3MuaXRlbUNvbnRleHQucHVic3ViO1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9iamVjdCB0aGF0IGluY2x1ZGVzIGZpZWxkcyBzdGFnZWQgZm9yIHN1Ym1pc3Npb25cbiAgICAgICAgICogW1xuICAgICAgICAgKiAge1xuICAgICAgICAgKiAgICAgIGZpZWxkSWQ6IChzdHJpbmcpLFxuICAgICAgICAgKiAgICAgIGFuc3dlcmVkOiB7IGtleTogKHN0cmluZyksIHZhbHVlOiAoc3RyaW5nKSB9IHwgW11cbiAgICAgICAgICogIH1cbiAgICAgICAgICogXVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zdGFnZWRfID0gbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQXJyYXkgb2Ygb2JqZWN0cyB0aGF0IHJlcHJlc2VudHMgc3VibWlzc2lvbnNcbiAgICAgICAgICogQHR5cGUge0FycmF5PE9iamVjdD59XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmhpc3RvcnlfID0gbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTWF4aW11bSBudW1iZXIgb2YgYWxsb3dlZCBhdHRlbXB0c1xuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5tYXhBdHRlbXB0c18gPSB0aGlzLml0ZW1Db250ZXh0LmNvbnRlbnRfLnBvbGljeS5tYXhBdHRlbXB0cyB8fCAzO1xuXG4gICAgICAgIC8vIGluaXRpYWxpemUgc3RhZ2VkXyBwcm9wZXJ0eSBieSBjcmVhdGluZyBlbXB0eSBzbG90cyBmb3IgdGhlIGZpZWxkc1xuICAgICAgICBpZiAoc2V0dGluZ3MuZGVmaW5pdGlvbi5xdWVzdGlvbiAmJiBzZXR0aW5ncy5kZWZpbml0aW9uLnF1ZXN0aW9uLmZpZWxkcylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5zdGFnZWRfID0gW107XG4gICAgICAgICAgICBzZXR0aW5ncy5kZWZpbml0aW9uLnF1ZXN0aW9uLmZpZWxkcy5mb3JFYWNoKCBmdW5jdGlvbihlbGVtZW50LCBpbmRleCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhZ2VkXy5wdXNoKCB7IGZpZWxkSWQ6IGVsZW1lbnQuaWQgfSApO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5oaXN0b3J5XyA9IHNldHRpbmdzLnN1Ym1pc3Npb25zIHx8IFtdO1xuICAgICAgICB9XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogRm9yIGVsYXBzZWQgdGltZSAodGltZS1vbi10YXNrKSBjYWxjdWxhdGlvblxuICAgICAgICAgKiBAdHlwZSB7RGF0ZX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudGFza1N0YXJ0VGltZV8gPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgIC8vIFN1YnNjcmliZSB0byB0aGUgc3VibWlzc2lvbiBhY3Rpb24gZXZlbnRcbiAgICAgICAgdGhpcy5wdWJzdWIuc3Vic2NyaWJlKEV2ZW50cy5BQ1RJT05fU1VCTUlULFxuICAgICAgICAgICAgdGhpcy5oYW5kbGVTdWJtaXRFdmVudF8uYmluZCh0aGlzKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIFN1YnNjcmliZSB0byB0aGUgZXZhbHVhdGVkIGV2ZW50XG4gICAgICAgIHRoaXMucHVic3ViLnN1YnNjcmliZShFdmVudHMuQU5TV0VSX0VWQUxVQVRFRCxcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRXZhbHVhdGVkRXZlbnRfLmJpbmQodGhpcylcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmxvZ2dlcl8uaW5mbyhcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBtYXhBdHRlbXB0czogdGhpcy5tYXhBdHRlbXB0c18sXG4gICAgICAgICAgICAgICAgdGFza1N0YXJ0VGltZTogdGhpcy50YXNrU3RhcnRUaW1lX1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdTdWJtaXNzaW9uSGFuZGxlciBjb25zdHJ1Y3RlZCdcbiAgICAgICAgKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEFkZCBmaWVsZCBhbnN3ZXJzIHRvIHN0YWdpbmcuXG4gICAgICpcbiAgICAgKiBUaGUgYW5zd2VyZWRLZXkgaXMgYXBwbGljYWJsZSBmb3IgaW5wdXRzIHdoaWNoIGhhcyBhc3NvY2lhdGlvbiBrZXksXG4gICAgICogRS5nLiBzZWxlY3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZmllbGRJZCAgICAgICAtIHRoZSBpZCBvZiB0aGUgZmllbGRcbiAgICAgKiBAcGFyYW0gYW5zd2VyZWRLZXkgICAtIHRoZSBrZXkgdGhhdCBzdHVkZW50IGFuc3dlcmVkLlxuICAgICAqIEBwYXJhbSBhbnN3ZXJlZFZhbHVlIC0gdGhlIHZhbHVlIHRoYXQgc3R1ZGVudCBhbnN3ZXJlZC5cbiAgICAgKi9cbiAgICBhZGRTdGFnZWRBbnN3ZXIoZmllbGRJZCwgYW5zd2VyZWRLZXksIGFuc3dlcmVkVmFsdWUpXG4gICAge1xuICAgICAgICBpZiAodGhpcy5zdGFnZWRfID09PSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01vZGVsIGRvZXMgbm90IGNvbnRhaW4gYSBxdWVzdGlvbiBkZXNjcmlwdGlvbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpZWxkID0gdGhpcy5nZXRTdGFnZWRGaWVsZChmaWVsZElkKTtcbiAgICAgICAgLy8gQHRvZG8gLSBNYWtlIGl0IGFuIGFycmF5IHRvIGFjY29tb2RhdGUgbXVsdGlwbGUgYW5zd2Vyc1xuICAgICAgICBmaWVsZC5hbnN3ZXJlZCA9IHtcbiAgICAgICAgICAgIGtleTogYW5zd2VyZWRLZXksXG4gICAgICAgICAgICB2YWx1ZTogYW5zd2VyZWRWYWx1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBmaWVsZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgZmllbGQgYW5zd2VycyBmcm9tIHN0YWdpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZmllbGRJZFxuICAgICAqIEBwYXJhbSBhbnN3ZXJlZEtleVxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIHJlbW92ZVN0YWdlZEFuc3dlcihmaWVsZElkLCBhbnN3ZXJlZEtleSlcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLnN0YWdlZF8gPT09IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTW9kZWwgZG9lcyBub3QgY29udGFpbiBhIHF1ZXN0aW9uIGRlc2NyaXB0aW9uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmllbGQgPSB0aGlzLmdldFN0YWdlZEZpZWxkKGZpZWxkSWQpO1xuICAgICAgICBpZiAoZmllbGQuYW5zd2VyZWQua2V5ID09IGFuc3dlcmVkS2V5KVxuXG4gICAgICAgIC8vIEB0b2RvIC0gTWFrZSBpdCBhbiBhcnJheSB0byBhY2NvbW9kYXRlIG11bHRpcGxlIGFuc3dlcnNcbiAgICAgICAgZmllbGQuYW5zd2VyZWQgPSBudWxsO1xuXG4gICAgICAgIHJldHVybiBmaWVsZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBzdGFnZWQgZmllbGRzXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7QXJyYXk8e2ZpZWxkSWQ6IChzdHJpbmd8bnVtYmVyKSwgYW5zd2VyZWRLZXk6IChzdHJpbmd8bnVtYmVyKSwgYW5zd2VyZWRWYWx1ZTogKHN0cmluZ3xudW1iZXIpXG4gICAgICpcbiAgICAgKi9cbiAgICBnZXRTdGFnZWRGaWVsZHMoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhZ2VkXztcbiAgICB9XG5cbiAgICBnZXRTdGFnZWRGaWVsZChpZClcbiAgICB7XG4gICAgICAgIHZhciBmaWVsZCA9IHRoaXMuc3RhZ2VkXy5maW5kKCBmdW5jdGlvbihlbGVtZW50LCBpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIChlbGVtZW50LmZpZWxkSWQgPT09IGlkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmaWVsZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBOdW1iZXIgb2YgdGltZXMgdGhlIGxlYXJuZXIgaGFzIGF0dGVtcHRlZCBzbyBmYXJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldE51bUF0dGVtcHRlZCgpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5oaXN0b3J5Xy5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBoYW5kbGVTdWJtaXRFdmVudF8obWVzc2FnZSlcbiAgICB7XG4gICAgICAgIHZhciBpdGVtSWQgPSBtZXNzYWdlLnNvdXJjZS5pdGVtSWQ7XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0TnVtQXR0ZW1wdGVkKCkgPj0gdGhpcy5tYXhBdHRlbXB0c18pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJlamVjdCgnTm9Nb3JlQWxsb3dlZEF0dGVtcHRzJyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRpbWVzdGFtcCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHZhciBwYXlsb2FkID0ge1xuICAgICAgICAgICAgZmllbGRzOiBfLmNsb25lKHRoaXMuZ2V0U3RhZ2VkRmllbGRzKCksIHRydWUpLFxuICAgICAgICAgICAgdGltZVNwZW50OiAodGltZXN0YW1wIC0gdGhpcy50YXNrU3RhcnRUaW1lXykgKiAxMDAwIC8vIGluIHNlY29uZHNcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5wdWJzdWIucHVibGlzaChcbiAgICAgICAgICAgIEV2ZW50cy5BTlNXRVJfRVZBTFVBVEUsXG4gICAgICAgICAgICB0aGlzLml0ZW1Db250ZXh0LmdldEFzc29jaWF0aW9uSWQoKSxcbiAgICAgICAgICAgICdhbnN3ZXJNb2RlbCcsXG4gICAgICAgICAgICAnYW5zd2VyJyxcbiAgICAgICAgICAgIHBheWxvYWRcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgaGFuZGxlRXZhbHVhdGVkRXZlbnRfKG1lc3NhZ2UpXG4gICAge1xuICAgICAgICB2YXIgcGF5bG9hZCA9IG1lc3NhZ2UucGF5bG9hZDtcbiAgICAgICAgdmFyIHN1Ym1pc3Npb25FbnRyeSA9IHtcbiAgICAgICAgICAgIHRpbWVzdGFtcDogKG5ldyBEYXRlKCkpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICB0aW1lU3BlbnQ6IHBheWxvYWQudGltZVNwZW50LFxuICAgICAgICAgICAgc2NvcmU6IHBheWxvYWQuc2NvcmUsXG4gICAgICAgICAgICBmaWVsZHM6IHBheWxvYWQuZmllbGRzLCAvLyBmaWVsZHMgd2l0aCBmZWVkYmFja1xuICAgICAgICAgICAgZmVlZGJhY2s6IHBheWxvYWQub3ZlcmFsbEZlZWRiYWNrXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaGlzdG9yeV8ucHVzaChzdWJtaXNzaW9uRW50cnkpO1xuICAgICAgICAvLyBSZXNldCB0YXNrIHN0YXJ0IHRpbWVcbiAgICAgICAgdGhpcy50YXNrU3RhcnRUaW1lXyA9IG5ldyBEYXRlKCk7XG4gICAgfVxufSIsIi8qXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgRWNvTGVhcm5pYSBwbGF0Zm9ybS5cbiAqXG4gKiAoYykgWW91bmcgU3VrIEFobiBQYXJrIDx5cy5haG5wYXJrQG1hdGhuaWEuY29tPlxuICpcbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqL1xuXG4vKipcbiAqIEVjb0xlYXJuaWEgdjAuMC4xXG4gKlxuICogQGZpbGVvdmVydmlld1xuICogIFRoaXMgZmlsZSBpbmNsdWRlcyB0aGUgZGVmaW5pdGlvbiBvZiBTdWJtaXNzaW9uSGFuZGxlciBjbGFzcy5cbiAqXG4gKiBAYXV0aG9yIFlvdW5nIFN1ayBBaG4gUGFya1xuICogQGRhdGUgNi8wMi8xNVxuICovXG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnZhciBsb2dnZXIgPSByZXF1aXJlKCcuLi8uLi9jb21tb24vbG9nZ2VyJyk7XG52YXIgcHJvbWlzZXV0aWxzID0gcmVxdWlyZSgnLi4vLi4vY29tbW9uL3Byb21pc2V1dGlscycpO1xudmFyIEV2ZW50cyA9IHJlcXVpcmUoJy4vZXZlbnRzJykuRXZlbnRzO1xuXG4vKipcbiAqIEB0eXBlZGVmIHt7XG4gKiAgICAgIGZpZWxkSWQ6IChudW1iZXIpLFxuICogICAgICBhbnN3ZXJlZDoge1xuICogICAgICAgICAga2V5OiAoc3RyaW5nIHwgbnVtYmVyKSxcbiAqICAgICAgICAgIHZhbHVlOiAoc3RyaW5nIHwgbnVtYmVyKVxuICogICAgICB9XG4gKiAgICAgID9jb3JyZWN0bmVzczogKG51bWJlciksICBBcHBsaWNhYmxlIGZvciBldmFsdWF0ZWQgcmVzcG9uc2VcbiAqICAgICAgP2ZlZWRiYWNrOiAoc3RyaW5nKVxuICogfX0gY29yZS5BbnN3ZXJGaWVsZFxuICpcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHt7XG4gKiAgICAgIHRpbWVTcGVudDogKG51bWJlciksXG4gKiAgICAgIGZpZWxkczogKEFycmF5PGNvcmUuQW5zd2VyRmllbGQ+KVxuICpcbiAqICAgICAgP3Njb3JlOiAobnVtYmVyKSxcbiAqICAgICAgP292ZXJhbGxGZWVkYmFjazogKHN0cmluZylcbiAqIH19IGNvcmUuQW5zd2VyU3VibWlzc2lvblxuICpcbiAqL1xuXG5cbi8qKlxuICogQGNsYXNzIEV2YWx1YXRvclxuICpcbiAqIEBtb2R1bGUgaW50ZXJhY3RpdmVzL2NvcmVcbiAqXG4gKiBAY2xhc3NkZXNjXG4gKiAgQW4gb2JqZWN0IG9mIHRoaXMgY2xhc3MgaXMgaGFuZGxlcyB0aGUgc3VibWlzc2lvbiBkYXRhIGJ5OlxuICogIC0gc2F2aW5nIHRoZSBxdWVzdGlvbiBmaWVsZCBkYXRhIHRvIHN0YWdpbmcgZm9yIHN1Ym1pc3Npb25cbiAqICAtIGV2YWx1YXRpbmcgdGhlIHN1Ym1pc3Npb24gdXNpbmcgcmVtb3RlIHNlcnZpY2VcbiAqICAtIGNvbnN0cmFpbmluZyBzdWJtaXNzaW9uIGJhc2VkIG9uIHBvbGljeVxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsRXZhbHVhdG9yXG57XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MpXG4gICAge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGxvZ2dlclxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5sb2dnZXJfID0gbG9nZ2VyLmdldExvZ2dlcignRXZhbHVhdG9yJyk7XG5cbiAgICAgICAgdGhpcy5wdWJzdWIgPSBzZXR0aW5ncy5wdWJzdWI7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEV2YWx1YXRpb24gZW5naW5lc1xuICAgICAgICAgKiBAdHlwZSB7e319XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmVuZ2luZXNfID0ge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGV2YWxSdWxlXG4gICAgICAgICAqIEB0eXBlIHt7fX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucnVsZXNfID0ge307XG5cbiAgICAgICAgLy8gU3Vic2NyaWJlIHRvIHRoZSBzdWJtaXNzaW9uIGFjdGlvbiBldmVudFxuICAgICAgICB0aGlzLnB1YnN1Yi5zdWJzY3JpYmUoRXZlbnRzLkFOU1dFUl9FVkFMVUFURSxcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRXZhbHVhdGVFdmVudF8uYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGFuIGV2YWx1YXRvciBlbmdpbmVcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEBwYXJhbSBlbmdpbmVcbiAgICAgKi9cbiAgICByZWdpc3RlckVuZ2luZShlbmdpbmUpXG4gICAge1xuICAgICAgICB0aGlzLmVuZ2luZXNfW2VuZ2luZS5uYW1lXSA9IGVuZ2luZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBydWxlcyBwZXIgaXRlbVxuICAgICAqIEFwcGxpY2FibGUgZm9yIGluLW1lbW9yeSBldmFsdWF0aW9uIChlLmcuIG5vbiByZW1vdGUpXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaXRlbUlkXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJ1bGVcbiAgICAgKi9cbiAgICByZWdpc3Rlckl0ZW0oaXRlbUNvbnRleHQpXG4gICAge1xuICAgICAgICB2YXIgaXRlbUlkID0gaXRlbUNvbnRleHQuZ2V0QXNzb2NpYXRpb25JZCgpO1xuICAgICAgICB2YXIgcnVsZSA9IGl0ZW1Db250ZXh0LmdldENvbnRlbnQoKS5ldmFsUnVsZTtcbiAgICAgICAgdGhpcy5ydWxlc19baXRlbUlkXSA9IHJ1bGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIGEgcnVsZVxuICAgICAqIEBwYXJhbSBpdGVtSWRcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgKi9cbiAgICByZXRyaWV2ZVJ1bGUoaXRlbUlkKVxuICAgIHtcbiAgICAgICAgdmFyIHByb21pc2UgPSBwcm9taXNldXRpbHMuY3JlYXRlUHJvbWlzZSggZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBpZiAoaXRlbUlkIGluIHRoaXMucnVsZXNfKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5ydWxlc19baXRlbUlkXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlamVjdCh7ZXJyb3I6J0V2YWwgcnVsZSBmb3IgaXRlbSAnICsgaXRlbUlkICsgJyBub3QgZm91bmQuJ30pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBTdWJtaXRzIHRoZSBzdGFnZWQgZm9yIGV2YWx1YXRpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpdGVtSWRcbiAgICAgKiBAcGFyYW0ge2NvcmUuQW5zd2VyU3VibWlzc2lvbn0gcGF5bG9hZFxuICAgICAqXG4gICAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICAgKiAgICAgIE9uIFN1Y2Nlc3M6IChjb3JlLkFuc3dlclN1Ym1pc3Npb24pXG4gICAgICovXG4gICAgZXZhbHVhdGUoaXRlbUlkLCBwYXlsb2FkKVxuICAgIHtcbiAgICAgICAgdmFyIHByb21pc2UgPSBwcm9taXNldXRpbHMuY3JlYXRlUHJvbWlzZSggZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgICAgICAgIC8vIEB0b2RvIC0gbWFrZSByZXN0IGNhbGwgdG8gdGhlIGV2YWx1YXRvclVybF9cbiAgICAgICAgICAgIC8vIEZvciByZW1vdGUgY2FsbFxuICAgICAgICAgICAgdmFyIGV2YWxBcmdzID0ge1xuICAgICAgICAgICAgICAgIHN1Ym1pc3Npb25Db250ZXh0OiB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1JZDogaXRlbUlkXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmaWVsZHM6IHBheWxvYWQuZmllbGRzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBMb2NhbCBldmFsdWF0aW9uOlxuICAgICAgICAgICAgdGhpcy5yZXRyaWV2ZVJ1bGUoaXRlbUlkKVxuICAgICAgICAgICAgICAgIC50aGVuKCBmdW5jdGlvbihydWxlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmFsdWF0ZUZpZWxkc18ocnVsZSwgcGF5bG9hZC5maWVsZHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbiggZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmV0dW5pbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmV0dXJuTWVzc2FnZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZVNwZW50OiBwYXlsb2FkLnRpbWVTcGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzOiByZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlOiAuNSwgLy8gQHRvZG9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmFsbEZlZWRiYWNrOiAnJyAvLyBAdG9kb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJldHVybk1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpXG4gICAgICAgICAgICAgICAgLmNhdGNoKCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlcl8uaW5mbyhcbiAgICAgICAgICAgICAgICAgICAgICAgICdMb2NhbEV2YWx1YXRvci5ldmFsdWF0ZSgpOmNvbXBsZXRlZCdcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZhbHVhdGUgYWxsIGZpZWxkcyBpbiB0aGUgc3VibWl0dGVkIGFuc3dlclxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJ1bGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYW5zd2VyXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgKiAgICAgIE9uIFN1Y2NzczogKEFycmF5PGNvcmUuQW5zd2VyRmllbGQ+KVxuICAgICAqL1xuICAgIGV2YWx1YXRlRmllbGRzXyhydWxlLCBhbnN3ZXIpXG4gICAge1xuICAgICAgICB2YXIgcHJvbWlzZXMgPSB7fTtcblxuICAgICAgICBhbnN3ZXIuZm9yRWFjaCggZnVuY3Rpb24oYW5zd2VyZWRGaWVsZCkge1xuICAgICAgICAgICAgdmFyIGZpZWxkUnVsZSA9IHJ1bGUuZmllbGRSdWxlc1thbnN3ZXJlZEZpZWxkLmZpZWxkSWRdO1xuXG4gICAgICAgICAgICBwcm9taXNlc1thbnN3ZXJlZEZpZWxkLmZpZWxkSWRdID0gdGhpcy5lbmdpbmVzX1tmaWVsZFJ1bGUuZW5naW5lXS5ldmFsdWF0ZShmaWVsZFJ1bGUsIGFuc3dlcmVkRmllbGQuYW5zd2VyZWQpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgIHZhciBwcm9taXNlID0gcHJvbWlzZXV0aWxzLmNyZWF0ZVByb21pc2UoIGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgICAgICAgICBwcm9taXNldXRpbHMucHJvcHMocHJvbWlzZXMpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICBhbnN3ZXIuZm9yRWFjaCggZnVuY3Rpb24oYW5zd2VyZWRGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVG8gdGhlIHNhbWUgYW5zd2VyIHN0cnVjdHVyZSwgYWRkICB0aGUgY29ycmVjdG5lc3MgYW5kIGZlZWRiYWNrIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZUVudHJ5ID0gXy5jbG9uZShhbnN3ZXJlZEZpZWxkLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VFbnRyeS5jb3JyZWN0bmVzcyA9IHJlc3VsdFthbnN3ZXJlZEZpZWxkLmZpZWxkSWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlRW50cnkuY29ycmVjdG5lc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZUVudHJ5LmZlZWRiYWNrID0gJ2NvcnJlY3QnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZUVudHJ5LmZlZWRiYWNrID0gJ2luY29ycmVjdCc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5wdXNoKHJlc3BvbnNlRW50cnkpO1xuICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBQdWJTdWIgRXZlbnQgc3Vic2NyaXB0aW9uIGhhbmRsZXJcbiAgICAgKlxuICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBoYW5kbGVFdmFsdWF0ZUV2ZW50XyhtZXNzYWdlKVxuICAgIHtcbiAgICAgICAgdmFyIGl0ZW1JZCA9IG1lc3NhZ2Uuc291cmNlLml0ZW1JZDtcbiAgICAgICAgdGhpcy5ldmFsdWF0ZShpdGVtSWQsIG1lc3NhZ2UucGF5bG9hZClcbiAgICAgICAgICAgIC50aGVuKCBmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHRoaXMucHVic3ViLnB1Ymxpc2goXG4gICAgICAgICAgICAgICAgICAgIEV2ZW50cy5BTlNXRVJfRVZBTFVBVEVELFxuICAgICAgICAgICAgICAgICAgICBpdGVtSWQsXG4gICAgICAgICAgICAgICAgICAgICdldmFsdWF0b3InLFxuICAgICAgICAgICAgICAgICAgICAnZXZhbHVhdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIC8qKiBAdHlwZSBjb3JlLkFuc3dlclN1Ym1pc3Npb24gKi8gKHJlc3VsdClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyXy5pbmZvKHtpdGVtSWQ6IGl0ZW1JZH0sICdFdmFsdWF0aW9uOnB1Ymxpc2hlZCcpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKVxuICAgICAgICAgICAgLmNhdGNoKCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlcl8uaW5mbyh7aXRlbUlkOiBpdGVtSWQsIGVycm9yOiBlcnJvcn0sICdFdmFsdWF0aW9uOmVycm9yJyk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cbn1cbiIsIi8qXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgRWNvTGVhcm5pYSBwbGF0Zm9ybS5cbiAqXG4gKiAoYykgWW91bmcgU3VrIEFobiBQYXJrIDx5cy5haG5wYXJrQG1hdGhuaWEuY29tPlxuICpcbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqL1xuXG4vKipcbiAqIEVjb0xlYXJuaWEgdjAuMC4xXG4gKlxuICogQGZpbGVvdmVydmlld1xuICogIFRoaXMgZmlsZSBpbmNsdWRlcyB0aGUgZGVmaW5pdGlvbiBvZiBFdmVudCBjb25zdGFudHMuXG4gKlxuICogQGF1dGhvciBZb3VuZyBTdWsgQWhuIFBhcmtcbiAqIEBkYXRlIDYvMDYvMTVcbiAqL1xuXG52YXIgRXZlbnRzID0ge1xuICAgIC8vIFdoZW4gdXNlciBjbGlja3MgJ3N1Ym1pdCcgYnV0dG9uXG4gICAgQUNUSU9OX1NVQk1JVDogJ2FjdGlvbjpzdWJtaXQnLFxuICAgIC8vIFdoZW4gQW5zd2VyTW9kZWwgcmVxdWVzdCBldmFsdWF0aW9uXG4gICAgQU5TV0VSX0VWQUxVQVRFOiAnYW5zd2VyOmV2YWx1YXRlJyxcbiAgICAvLyBXSGVuIEV2YWx1YXRvciBjb21wbGV0ZWQgZXZhbHVhdGlvblxuICAgIEFOU1dFUl9FVkFMVUFURUQ6ICdhbnN3ZXI6ZXZhbHVhdGVkJ1xufTtcblxubW9kdWxlLmV4cG9ydHMuRXZlbnRzID0gRXZlbnRzOyIsIi8qXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgRWNvTGVhcm5pYSBwbGF0Zm9ybS5cbiAqXG4gKiAoYykgWW91bmcgU3VrIEFobiBQYXJrIDx5cy5haG5wYXJrQG1hdGhuaWEuY29tPlxuICpcbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqL1xuXG4vKipcbiAqIEVjb0xlYXJuaWEgdjAuMC4xXG4gKlxuICogQGZpbGVvdmVydmlld1xuICogIFRoaXMgZmlsZSBpbmNsdWRlcyB0aGUgZGVmaW5pdGlvbiBvZiBJdGVtQ29udGV4dCBjbGFzcy5cbiAqXG4gKiBAYXV0aG9yIFlvdW5nIFN1ayBBaG4gUGFya1xuICogQGRhdGUgNS8xMy8xNVxuICovXG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vLi4vY29tbW9uL3V0aWxzJyk7XG52YXIgbG9nZ2VyID0gcmVxdWlyZSgnLi4vLi4vY29tbW9uL2xvZ2dlcicpO1xudmFyIFN1YlB1YiA9IHJlcXVpcmUoJy4vLi4vLi4vY29tbW9uL3B1YnN1YicpO1xuXG52YXIgQW5zd2VyTW9kZWwgPSByZXF1aXJlKCcuL2Fuc3dlcm1vZGVsJykuQW5zd2VyTW9kZWw7XG5cblxudmFyIGludGVybmFscyA9IHt9O1xuXG5cbi8qKlxuICogQGNsYXNzIEl0ZW1Db250ZXh0XG4gKlxuICogQG1vZHVsZSBpbnRlcmFjdGl2ZXMvY29yZVxuICpcbiAqIEBjbGFzc2Rlc2NcbiAqICBJdGVtIENvbnRleHQgbWFuYWdlcyB0aGUgb3ZlcmFsbCBsaWZlY3ljbGUgYW5kIGludGVyYWN0aW9uIG9mIHRoZVxuICogIGNvbXBvbmVudHMgc3BlY2lmaWVkIGluIGEgY29udGVudCBpdGVtLlxuICogIEJhc2VkIG9uIHRoZSBpdGVtIHNwZWNpZmljYXRpb24sIGl0IGNyZWF0ZXMgdGhlIGNvbXBvbmVudHMgYW5kIHJlbmRlcnNcbiAqICB0aGVtIGFzIG5lZWRlZC5cbiAqICBCZXNpZGVzIHRoZSBjb21wb25lbnRzLCBpdCBhbHNvIGhhcyB0aGUgcmVmZXJlbmNlcyB0byB0aGUgc3VicHViIGZvciBldmVudFxuICogIGRlbGl2ZXJ5LlxuICpcbiAqICBUaGUgb2JqZWN0IG9mIHRoaXMgY2xhc3MgaXMgY3JlYXRlZCB1c2luZyB0aGUgZmFjdG9yeSBtZXRob2QgY3JlYXRlSXRlbUNvbnRleHQoKS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NcbiAqXG4gKi9cbmludGVybmFscy5JdGVtQ29udGV4dCA9IGZ1bmN0aW9uKHNldHRpbmdzKVxue1xuICAgIC8qKlxuICAgICAqIFRoZSBsb2dnZXJcbiAgICAgKi9cbiAgICB0aGlzLmxvZ2dlcl8gPSBsb2dnZXIuZ2V0TG9nZ2VyKCdJdGVtQ29udGV4dCcpO1xuXG4gICAgLyoqXG4gICAgICogUHViU3ViOiBjb21wb25lbnQgdGhhbiBoYW5kbGVzIGV2ZW50c1xuICAgICAqL1xuICAgIHRoaXMucHVic3ViID0gc2V0dGluZ3MucHVic3ViO1xuXG4gICAgLyoqXG4gICAgICogRGVjb3JhdG9yOiBEZWNvcmF0ZXMgVUkgY29tcG9uZW50cyBieSBhZGRpbmcgc3R5bGVzLlxuICAgICAqIEB0eXBlIHtudWxsfVxuICAgICAqL1xuICAgIHRoaXMuZGVjb3JhdG9yXyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZXNwYWNlIHRvIGxvb2sgZm9yIHRoZSBjb21wb25lbnRzXG4gICAgICovXG4gICAgdGhpcy5jb21wb25lbnRNb2R1bGVfID0gZ2xvYmFsO1xuICAgIGlmIChzZXR0aW5ncy5jb21wb25lbnRNb2R1bGUpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnRNb2R1bGVfID0gc2V0dGluZ3MuY29tcG9uZW50TW9kdWxlO1xuICAgIH1cbiAgICBlbHNlIGlmIChzZXR0aW5ncy5jb21wb25lbnROYW1lc3BhY2UpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnRNb2R1bGVfID0gZ2xvYmFsW3NldHRpbmdzLmNvbXBvbmVudE5hbWVzcGFjZV07XG4gICAgICAgIHRoaXMubG9nZ2VyXy5pbmZvKHsgY29tcG9uZW50TmFtZXNwYWNlOiBzZXR0aW5ncy5jb21wb25lbnROYW1lc3BhY2V9ICk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBJRCB1c2VkIHRvIHJldHJpZXZlIHRoZSBMZWFybmVyQXNzaWdubWVudEl0ZW0sIHRoZSBjb250ZW50IGluc3RhbmNlXG4gICAgICogd2l0aCBhc3NvY2lhdGVkIHVzZXIvY291cnNlLlxuICAgICAqIFRoZSBzZXJ2ZXIgdXNlcyB0aGUgcmV0cmlldmVkIExlYXJuZXJBc3NpZ25tZW50SXRlbSB0byBldmFsdWF0ZSB0aGVcbiAgICAgKiBzdWJtaXNzaW9uIGFuZCBhcHBlbmQgdGhlIHJlc3VsdCAoYWN0aXZpdHkpLlxuICAgICAqL1xuICAgIHRoaXMuYXNzb2NpYXRpb25JZF8gPSBzZXR0aW5ncy5hc3NvY2lhdGlvbklkIHx8IChNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMTAwMCkgKyAxKSkudG9TdHJpbmcoKTtcblxuICAgIC8qKlxuICAgICAqIFRIZSBjb250ZW50IHdoaWNoIHRoaXMgY29udGV4dCBpcyBvcGVyYXRpbmcgb25cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuY29udGVudF8gPSBzZXR0aW5ncy5jb250ZW50OyAvLyB0aGUgY29udGVudCBib2R5XG5cbiAgICAvKipcbiAgICAgKiBBbnN3ZXJNb2RlbDoga2VlcHMgdGhlIGFuc3dlcnMuXG4gICAgICovXG4gICAgdGhpcy5hbnN3ZXJNb2RlbCA9IG5ldyBBbnN3ZXJNb2RlbCh7XG4gICAgICAgIGl0ZW1Db250ZXh0OiB0aGlzLFxuICAgICAgICBkZWZpbml0aW9uOiB0aGlzLmNvbnRlbnRfLmRlZmluaXRpb25cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIE1hcCBvZiBjb21wb25lbnQgaWQgYW5kIGl0J3Mgc3BlY2lmaWNhdGlvbiAoZGVzY3JpcHRpb24pXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuY29tcG9uZW50U3BlY3NfID0ge307XG5cbiAgICAvKipcbiAgICAgKiBSZWZlcmVuY2UgdG8gY29tcG9uZW50IGluc3RhbmNlc1xuICAgICAqIEB0eXBlIHtPYmplY3R9IE1hcCB3aGVyZSBrZXlzIGFyZSBjb21wb25lbnQgaWRzIGFuZCB2YWx1ZSBhcmUgdGhlIGNvbXBvbmVudHMgaW5zdGFuY2VzXG4gICAgICovXG4gICAgdGhpcy5jb21wb25lbnRSZWZlcmVuY2VzXyA9IHt9O1xuXG4gICAgLy8gQ29udmVydCBjb21wb25lbnQgc3BlYyBmcm9tIGFycmF5IHRvIE9iamVjdCBtYXBcbiAgICAvLyBGb3IgZWZmaWNpZW50IHJldHJpZXZhbFxuICAgIHRoaXMubWFwaWZ5Q29tcG9uZW50U3BlY3NfKHRoaXMuY29udGVudF8pO1xufTtcblxuLyoqKiBTdGF0aWMgbWV0aG9kcyAqKiovXG5cbi8qKlxuICpcbiAqIEBwYXJhbSBmcW5cbiAqIEByZXR1cm5zIHtvYmplY3R9XG4gKiAgICAgIEZvcm1hdDogeyBkb21haW46IDxkZWZpbml0aW9ufGNvbXBvbmVudHM+LCBpZDogKHN0cmluZykgfVxuICovXG5pbnRlcm5hbHMuSXRlbUNvbnRleHQucGFyc2VGcW4gPSBmdW5jdGlvbihmcW4pXG57XG4gICAgdmFyIHJldHZhbCA9IHt9O1xuICAgIGlmIChmcW4pIHtcbiAgICAgICAgaWYgKGZxblswXSA9PT0gJy4nKSB7XG4gICAgICAgICAgICB2YXIgcGFydHMgPSBmcW4uc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIHJldHZhbC5kb21haW4gPSBwYXJ0c1swXTtcbiAgICAgICAgICAgIHJldHZhbC5pZCA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR2YWwuaWQgPSBmcW47XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldHZhbDtcbn07XG5cbi8qKiogTWVtYmVyIG1ldGhvZHMgKioqL1xuXG4vKipcbiAqIEdldHMgdGhlIGl0ZW0gYXNzb2NpYXRpb24gSWQgKGFrYSBpdGVtSWQpLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50XG4gKi9cbmludGVybmFscy5JdGVtQ29udGV4dC5wcm90b3R5cGUuZ2V0QXNzb2NpYXRpb25JZCA9IGZ1bmN0aW9uKClcbntcbiAgICByZXR1cm4gdGhpcy5hc3NvY2lhdGlvbklkXztcbn07XG5cblxuLyoqXG4gKiBHZXRzIHRoZSBjb250ZW50LlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb250ZW50XG4gKi9cbmludGVybmFscy5JdGVtQ29udGV4dC5wcm90b3R5cGUuZ2V0Q29udGVudCA9IGZ1bmN0aW9uKClcbntcbiAgICByZXR1cm4gdGhpcy5jb250ZW50Xztcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgY29udGVudC5cbiAqIFRyaWdnZXJzIHJlLXJlbmRlcmluZy5cbiAqXG4gKiBAdG9kbyAtIFRyaWdnZXIgcmUtcmVuZGVyaW5nXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbnRlbnRcbiAqL1xuaW50ZXJuYWxzLkl0ZW1Db250ZXh0LnByb3RvdHlwZS5zZXRDb250ZW50ID0gZnVuY3Rpb24oY29udGVudClcbntcbiAgICB0aGlzLmNvbnRlbnRfID0gY29udGVudDtcbn07XG5cbi8qKlxuICogZ2V0VmFsdWVcbiAqXG4gKiBSZXR1cm5zIHRoZSBwYXJhbWV0ZXIgaXRzZWxmIHVubGVzcyBpdCBjb250YWlucyBhIGxvY2FsIHJlZmVyZW5jZSB3aGljaCBpc1xuICogYSBmdWxseSBxdWFsaWZpZWQgbmFtZSAoZnFuKSBvZiBhIG1vZGVsIG9iamVjdCBvciBjb21wb25lbnQgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHBhcmFtICAtIHRoZSBwYXJhbWV0ZXIgd2hpY2ggY291bGQgYmUgdGhlIHZhbHVlIGl0c2VsZlxuICogICAgICBvciBtYXkgYmUgYW4gb2JqZWN0IHdoaWNoIGNvbnRhaW5zIFwiX2xyZWZcIiBkZW5vdGluZyBhIGxvY2FsIGZ1bGx5XG4gKiAgICAgIHF1YWxpZmllZCBuYW1lIHRvIHdoZXJlIHRoZSBhY3R1YWwgdmFsdWUgaXMuXG4gKi9cbmludGVybmFscy5JdGVtQ29udGV4dC5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbihwYXJhbSlcbntcbiAgICB2YXIgcmV0dmFsID0gcGFyYW07XG4gICAgLy8gSWYgaXQgY29udGFpbnMgYSBsb2NhbCByZWZlcmVuY2UsIGdldCB0aGUgb2JqZWN0IGl0IHBvaW50cyB0by5cbiAgICBpZiAocGFyYW0uX2xyZWYpXG4gICAge1xuICAgICAgICByZXR2YWwgPSB0aGlzLnJlc29sdmVPYmplY3QocGFyYW0uX2xyZWYpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0dmFsO1xufTtcblxuLyoqXG4gKiByZXNvbHZlT2JqZWN0XG4gKlxuICogUmV0dXJucyB0aGUgbW9kZWwgb2JqZWN0IG9yIGNvbXBvbmVudCBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZnFuICAtIHRoZSBGdWxseSBRdWFsaWZpZWQgTmFtZSBvZiB0aGUgb2JqZWN0XG4gKi9cbmludGVybmFscy5JdGVtQ29udGV4dC5wcm90b3R5cGUucmVzb2x2ZU9iamVjdCA9IGZ1bmN0aW9uKGZxbilcbntcbiAgICB2YXIgcmV0dmFsO1xuICAgIC8vIGlmIGl0IHN0YXJ0cyB3aXRoICcuZGVmaW5pdGlvbicgcmV0dXJucyB0aGUgSlNPTiBvYmplY3QsXG4gICAgaWYgKHV0aWxzLnN0YXJ0c1dpdGgoZnFuLCAnLmRlZmluaXRpb24nKSlcbiAgICB7XG4gICAgICAgIHZhciByZWZQYXRoID0gZnFuLnN1YnN0cmluZygnLmRlZmluaXRpb24nLmxlbmd0aCArIDEpO1xuICAgICAgICByZXR2YWwgPSB1dGlscy5kb3RBY2Nlc3ModGhpcy5jb250ZW50Xy5kZWZpbml0aW9uLCByZWZQYXRoKTtcbiAgICB9XG5cbiAgICAvLyBpZiBpdCBzdGFydHMgd2l0aCAnLmNvbXBvbmVudCcgcmV0dXJucyB0aGUgQ29tcG9uZW50IG9iamVjdFxcXG4gICAgZWxzZSBpZiAodXRpbHMuc3RhcnRzV2l0aChmcW4sICcuY29tcG9uZW50JykpXG4gICAge1xuICAgICAgICB2YXIgY29tcG9uZW50SWQgPSBmcW4uc3Vic3RyaW5nKDEyKTtcbiAgICAgICAgcmV0dmFsID0gdGhpcy5nZXRDb21wb25lbnQoY29tcG9uZW50SWQpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0dmFsO1xufTtcblxuXG4vKipcbiAqIG1hcGlmeUNvbXBvbmVudFNwZWNzX1xuICogQHByaXZhdGVcbiAqXG4gKiBJbml0aWFsaXplcyB0aGUgY29tcG9uZW50U3BlYyBtYXAuIENvbnZlcnRzIHRoZSBjb250ZW50LmNvbXBvbmVudHMgYXJyYXkgaW50byBtYXBcbiAqIEBwYXJhbSBjb250ZW50XG4gKlxuICogQHJldHVybiB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdD59XG4gKi9cbmludGVybmFscy5JdGVtQ29udGV4dC5wcm90b3R5cGUubWFwaWZ5Q29tcG9uZW50U3BlY3NfID0gZnVuY3Rpb24oY29udGVudClcbntcbiAgICBjb250ZW50LmNvbXBvbmVudHMuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50LCBpbmRleCwgYXJyYXkpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuaWQgaW4gdGhpcy5jb21wb25lbnRTcGVjc18pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRHVwbGljYXRlIGNvbXBvbmVudCBJRCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29tcG9uZW50U3BlY3NfW2VsZW1lbnQuaWRdID0gZWxlbWVudDtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgdmFyIGNvbXBvbmVudElkcyA9IF8ua2V5cyh0aGlzLmNvbXBvbmVudFNwZWNzXyk7XG5cbiAgICB0aGlzLmxvZ2dlcl8uZGVidWcoY29tcG9uZW50SWRzLCAnQ29tcG9uZW50IFNwZWNzIG1hcGlmaWVkLicpO1xuXG4gICAgcmV0dXJuIHRoaXMuY29tcG9uZW50U3BlY3NfO1xufTtcblxuLyoqXG4gKiBCdWlsZHMgdGhlIGNvbXBvbmVudHMgYXMgc3BlY2lmaWVkIGluIHRoZSBzcGVjXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHNwZWMgIC0gVGhlIHNwZWNpZmljYXRpb24gb2YgdGhlIGNvbXBvbmVudHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBpZCAgLSBpZCBvZiB0aGUgY29tcG9uZW50XG4gKlxuICogQHJldHVybiB7b2JqZWN0fSAgVGhlIGNvbXBvbmVudCBpbnN0YW5jZSAoYSBSZWFjdCBlbGVtZW50KVxuICovXG5pbnRlcm5hbHMuSXRlbUNvbnRleHQucHJvdG90eXBlLmNyZWF0ZUNvbXBvbmVudCA9IGZ1bmN0aW9uKHNwZWMsIGlkKVxue1xuICAgIGlmICghKHNwZWMudHlwZSBpbiB0aGlzLmNvbXBvbmVudE1vZHVsZV8pKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ29tcG9uZW50ICcgKyBzcGVjLnR5cGUgKyAnIG5vdCBmb3VuZCBpbiBtb2R1bGUnKTtcbiAgICB9XG4gICAgdmFyIGNvbXBvbmVudENsYXNzID0gdGhpcy5jb21wb25lbnRNb2R1bGVfW3NwZWMudHlwZV07XG5cbiAgICB2YXIgY29tcG9uZW50S2luZCA9IGNvbXBvbmVudENsYXNzLnByb3RvdHlwZS5jb21wb25lbnRLaW5kKCk7XG5cbiAgICB2YXIgY29uc3RydWN0b3JBcmcgPSB7XG4gICAgICAgIGl0ZW1Bc3NvY2lhdGlvbklkOiB0aGlzLmdldEFzc29jaWF0aW9uSWQoKSxcbiAgICAgICAgY29tcG9uZW50SWQ6IGlkLFxuICAgICAgICBpdGVtQ29udGV4dDogdGhpcyxcbiAgICAgICAgY29uZmlnOiBzcGVjLmNvbmZpZ1xuICAgIH07XG5cbiAgICB2YXIgcmV0dmFsID0gbnVsbDtcbiAgICBpZiAoY29tcG9uZW50S2luZCA9PT0gJ3JlYWN0Jykge1xuICAgICAgICByZXR2YWwgPSBSZWFjdC5jcmVhdGVFbGVtZW50KGNvbXBvbmVudENsYXNzLCBjb25zdHJ1Y3RvckFyZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dmFsID0gbmV3IGNvbXBvbmVudENsYXNzKGNvbnN0cnVjdG9yQXJnKTtcbiAgICB9XG4gICAgdGhpcy5sb2dnZXJfLmluZm8oXG4gICAgICAgIHsgY29tcG9uZW50S2luZDogY29tcG9uZW50S2luZCwgdHlwZTogc3BlYy50eXBlLCBpZDogaWR9LFxuICAgICAgICAnQ29tcG9uZW50IGNyZWF0ZWQnXG4gICAgKTtcblxuICAgIHJldHVybiByZXR2YWw7XG59O1xuXG4vKipcbiAqIGdldENvbXBvbmVudFxuICpcbiAqIFJldHVybnMgdGhlIGNvbXBvbmVudCBpbnN0YW5jZS5cbiAqIEVpdGhlciByZXR1cm5zIHRoZSBleGlzdGluZyBvYmplY3QgaW4gdGhlIHJlZmVyZW5jZSB0YWJsZSwgb3IgY3JlYXRlc1xuICogb25lLCByZWdpc3RlcnMgaXQgYW5kIHJldHVybnMgaXQuXG4gKlxuICogQHBhcmFtIFtzdHJpbmd9IGlkXG4gKlxuICogQHJldHVybiB7b2JqZWN0fSBUaGUgY29tcG9uZW50IGluc3RhbmNlIChhIFJlYWN0IGVsZW1lbnQpXG4gKi9cbmludGVybmFscy5JdGVtQ29udGV4dC5wcm90b3R5cGUuZ2V0Q29tcG9uZW50ID0gZnVuY3Rpb24oaWQpIHtcbiAgICBpZiAoIShpZCBpbiB0aGlzLmNvbXBvbmVudFJlZmVyZW5jZXNfKSkge1xuICAgICAgICBpZiAoIShpZCBpbiB0aGlzLmNvbXBvbmVudFNwZWNzXykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29tcG9uZW50IElEIG5vdCBmb3VuZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmZXJlbmNlc19baWRdID0gdGhpcy5jcmVhdGVDb21wb25lbnQodGhpcy5jb21wb25lbnRTcGVjc19baWRdLCBpZCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbXBvbmVudFJlZmVyZW5jZXNfW2lkXTtcbn07XG5cbi8qKlxuICogcmVuZGVyQ29tcG9uZW50XG4gKlxuICogUmVuZGVycyB0aGUgY29tcG9uZW50IHRvIHNwZWNpZmljIERPTSBlbGVtZW50XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtICAtIFRoZSBjb21wb25lbnQgb3IgdGhlIGNvbXBvbmVudCBpZFxuICogQHBhcmFtIHtET019IGVsICAtIERPTSBlbGVtZW50IHRvIHJlbmRlciB0aGUgY29tcG9uZW50XG4gKiBAcmV0dXJuIHtET019ICAtIFRoZSBlbFxuICovXG5pbnRlcm5hbHMuSXRlbUNvbnRleHQucHJvdG90eXBlLnJlbmRlckNvbXBvbmVudCA9IGZ1bmN0aW9uKHBhcmFtLCBlbClcbntcbiAgICAvLyBXZSBhcmUgYXNzdW1pbmcgdGhhdCBpZiB0aGUgcGFyYW0gaXMgYSBzdHJpbmcsIHRoZW4gaXQgaXMgdGhlXG4gICAgLy8gY29tcG9uZW50IGlkOyBvdGhlcndpc2UgaXMgdGhlIGNvbXBvbmVudCBpdHNlbGY7XG4gICAgdmFyIGNvbXBvbmVudCA9IHBhcmFtO1xuICAgIGlmICh0eXBlb2YgcGFyYW0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbXBvbmVudCA9IHRoaXMuZ2V0Q29tcG9uZW50KHBhcmFtKTtcbiAgICB9XG5cbiAgICAvLyBMaXR0bGUgaGFjayBzbyBJIGNhbiBnZXQgdGhlIGNvbXBvbmVudCB0eXBlIGZyb20gQmFja2JvbmUncyB2aWV3IG9yIFJlYWN0LlxuICAgIC8vIFJlYWN0IHByb3ZpZGVzIGNvbXBvbmVudEtpbmQoKSBtZXRob2QgdGhyb3VnaCBtaXhpblxuICAgIHZhciBjb21wb25lbnRLaW5kID0gKGNvbXBvbmVudC5jb21wb25lbnRLaW5kKSA/IGNvbXBvbmVudC5jb21wb25lbnRLaW5kKCkgOiBjb21wb25lbnQudHlwZS5wcm90b3R5cGUuY29tcG9uZW50S2luZCgpO1xuXG4gICAgLy8gQHRvZG8gLSBJbXBsZW1lbnQgc3RyYXRlZ3kgcGF0dGVybiB0byBoYW5kbGUgZGlmZmVyZW50IGNvbXBvbmVudEtpbmRzXG4gICAgaWYgKGNvbXBvbmVudEtpbmQgPT09ICdyZWFjdCcpIHtcbiAgICAgICAgUmVhY3QucmVuZGVyKGNvbXBvbmVudCwgZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBvbmVudC5yZW5kZXIoKTtcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQoY29tcG9uZW50LmVsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWw7XG59O1xuXG4vKipcbiAqIHJlbmRlclxuICpcbiAqIFJlbmRlcnMgdGhlIG1haW4gY29tcG9uZW50IG9uIHRoZSBlbGVtZW50XG4gKlxuICogQHBhcmFtIHtET019IGVsXG4gKlxuICogQHJldHVybnMge0RPTX1cbiAqL1xuaW50ZXJuYWxzLkl0ZW1Db250ZXh0LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihlbClcbntcbiAgICBpZiAoIXRoaXMuY29udGVudF8gfHwgIXRoaXMuY29udGVudF8uY29tcG9uZW50cykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGNvbXBvbmVudCB3YXMgc3BlY2lmaWVkJyk7XG4gICAgfVxuICAgIHZhciBtYWluQ29tcG9uZW50SWQgPSB0aGlzLmNvbnRlbnRfLmNvbXBvbmVudHNbMF0uaWQ7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyQ29tcG9uZW50KG1haW5Db21wb25lbnRJZCwgZWwpO1xufTtcblxuLyoqXG4gKiBjcmVhdGVJdGVtQ29udGV4dFxuICpcbiAqIEZhY3RvcnkgbWV0aG9kIHRvIGNyZWF0ZSBhIEl0ZW1Db250ZXh0XG4gKlxuICogQHJldHVybiB7SXRlbUNvbnRleHR9XG4gKi9cbmludGVybmFscy5jcmVhdGVJdGVtQ29udGV4dCA9IGZ1bmN0aW9uKHNldHRpbmdzKVxue1xuICAgIHJldHVybiBuZXcgaW50ZXJuYWxzLkl0ZW1Db250ZXh0KHNldHRpbmdzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLkl0ZW1Db250ZXh0ID0gaW50ZXJuYWxzLkl0ZW1Db250ZXh0O1xuXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVJdGVtQ29udGV4dCA9IGludGVybmFscy5jcmVhdGVJdGVtQ29udGV4dDsiLCIvKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIEVjb0xlYXJuaWEgcGxhdGZvcm0uXG4gKlxuICogKGMpIFlvdW5nIFN1ayBBaG4gUGFyayA8eXMuYWhucGFya0BtYXRobmlhLmNvbT5cbiAqXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKi9cblxuXG4vKipcbiAqIEVjb0xlYXJuaWEgdjAuMC4xXG4gKlxuICogQGZpbGVvdmVydmlld1xuICogIFRoaXMgZmlsZSBpbmNsdWRlcyByZWZlcmVuY2VzIHRvIGRlcGVuZGVuY2llcyBmb3IgZXZhbHVhdGlvbi5cbiAqXG4gKiBAYXV0aG9yIFlvdW5nIFN1ayBBaG4gUGFya1xuICogQGRhdGUgNi8wNS8xNVxuICovXG5cbnZhciBNYXRoRXhwcmVzc2lvbkV2YWwgPSByZXF1aXJlKCcuL21hdGhleHByZXNzaW9uZXZhbCcpLk1hdGhFeHByZXNzaW9uRXZhbDtcbnZhciBSZWdleEV2YWwgPSByZXF1aXJlKCcuL3JlZ2V4ZXZhbCcpLlJlZ2V4RXZhbDtcblxudmFyIGludGVybmFscyA9IHt9O1xuXG5pbnRlcm5hbHMucmVnaXN0ZXJFdmFsRW5naW5lcyA9IGZ1bmN0aW9uKGV2YWx1YXRvcilcbntcblx0dmFyIG1hdGhldmFsID0gbmV3IE1hdGhFeHByZXNzaW9uRXZhbCgpXG4gICAgZXZhbHVhdG9yLnJlZ2lzdGVyRW5naW5lKG1hdGhldmFsKTtcbiAgICB2YXIgcmVnZXhldmFsID0gbmV3IFJlZ2V4RXZhbCgpXG4gICAgZXZhbHVhdG9yLnJlZ2lzdGVyRW5naW5lKHJlZ2V4ZXZhbCk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzLnJlZ2lzdGVyRXZhbEVuZ2luZXMgPSBpbnRlcm5hbHMucmVnaXN0ZXJFdmFsRW5naW5lcztcblxuXG5cbiIsIi8qXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgRWNvTGVhcm5pYSBwbGF0Zm9ybS5cbiAqXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKi9cblxuLy92YXIgbWF0aCA9IHJlcXVpcmUoJ21hdGhqcycpO1xuXG52YXIgcHJvbWlzZXV0aWxzID0gcmVxdWlyZSgnLi4vLi4vY29tbW9uL3Byb21pc2V1dGlscycpO1xuXG4vKipcbiAqIEVjb0xlYXJuaWEgdjAuMC4xXG4gKlxuICogQGZpbGVvdmVydmlld1xuICogIFRoaXMgZmlsZSBpbmNsdWRlcyB0aGUgZGVmaW5pdGlvbiBvZiBNYXRoRXhwcmVzc2lvbkV2YWwgY2xhc3MuXG4gKlxuICogQGF1dGhvciBZb3VuZyBTdWsgQWhuIFBhcmtcbiAqIEBkYXRlIDYvMDUvMTVcbiAqL1xuXG4vKipcbiAqIEBjbGFzcyBNYXRoRXhwcmVzc2lvbkV2YWxcbiAqXG4gKiBAbW9kdWxlIGludGVyYWN0aXZlcy9ldmFsdWF0aW9uXG4gKlxuICogQGNsYXNzZGVzY1xuICogIEVuZ2luZSB0aGF0IGV2YWx1YXRlcyBNYXRoIGV4cHJlc3Npb24uXG4gKiAgVGhlIGludGVybmFsIGVuZ2luZSBpcyBmcm9tIGh0dHA6Ly9tYXRoanMub3JnL1xuICovXG5leHBvcnQgY2xhc3MgTWF0aEV4cHJlc3Npb25FdmFsIHtcblxuICAgIGNvbnN0cnVjdG9yKClcbiAgICB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbXMgIC0gRXZhbHVhdGlvbiBydWxlIHBhcmFtXG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgZXZhbHVhdGUocGFyYW1zLCBpbnB1dClcbiAgICB7XG4gICAgICAgIHZhciBwcm9taXNlID0gcHJvbWlzZXV0aWxzLmNyZWF0ZVByb21pc2UoIGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgaWYgKCFpbnB1dCB8fCAhaW5wdXQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBtYXRoLmV2YWwocGFyYW1zLmVweHJlc3Npb24pO1xuXG4gICAgICAgICAgICByZXNvbHZlKHJlc3VsdC50b1N0cmluZygpID09IGlucHV0LnZhbHVlKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG59O1xuXG5NYXRoRXhwcmVzc2lvbkV2YWwucHJvdG90eXBlLm5hbWUgPSAnbWF0aGV4cHJlc3Npb24nOyIsIi8qXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgRWNvTGVhcm5pYSBwbGF0Zm9ybS5cbiAqXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKi9cblxudmFyIHByb21pc2V1dGlscyA9IHJlcXVpcmUoJy4uLy4uL2NvbW1vbi9wcm9taXNldXRpbHMnKTtcblxuLyoqXG4gKiBFY29MZWFybmlhIHYwLjAuMVxuICpcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqICBUaGlzIGZpbGUgaW5jbHVkZXMgdGhlIGRlZmluaXRpb24gb2YgRXZhbFJlZ2V4IGNsYXNzLlxuICpcbiAqIEBhdXRob3IgWW91bmcgU3VrIEFobiBQYXJrXG4gKiBAZGF0ZSA2LzA1LzE1XG4gKi9cblxuLyoqXG4gKiBAY2xhc3MgRXZhbFJlZ2V4XG4gKlxuICogQG1vZHVsZSBpbnRlcmFjdGl2ZXMvZXZhbHVhdGlvblxuICpcbiAqIEBjbGFzc2Rlc2NcbiAqICBFbmdpbmUgdGhhdCBldmFsdWF0ZXMgcmVnZXggZXhwcmVzc2lvbi5cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWdleEV2YWwge1xuXG4gICAgY29uc3RydWN0b3IoKVxuICAgIHtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW1zICAtIEV2YWx1YXRpb24gcnVsZSBwYXJhbVxuICAgICAqIEBwYXJhbSB7T2JqZWN0e2tleSwgdmFsdWV9fSBpbnB1dFxuICAgICAqXG4gICAgICogQHJldHVybnMge1Byb21pc2UoYm9vbGVhbil9XG4gICAgICovXG4gICAgZXZhbHVhdGUocGFyYW1zLCBpbnB1dClcbiAgICB7XG4gICAgICAgIHZhciBwcm9taXNlID0gcHJvbWlzZXV0aWxzLmNyZWF0ZVByb21pc2UoIGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgaWYgKCFpbnB1dCB8fCAhaW5wdXQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByZSA9IFJlZ0V4cCgnXicgKyBwYXJhbXMucGF0dGVybiArICcnKTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSByZS50ZXN0KGlucHV0LnZhbHVlKTtcbiAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG59XG5cblJlZ2V4RXZhbC5wcm90b3R5cGUubmFtZSA9ICdyZWdleCc7IiwiO2lmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7ICB3aW5kb3cuYW1wZXJzYW5kID0gd2luZG93LmFtcGVyc2FuZCB8fCB7fTsgIHdpbmRvdy5hbXBlcnNhbmRbXCJhbXBlcnNhbmQtZXZlbnRzXCJdID0gd2luZG93LmFtcGVyc2FuZFtcImFtcGVyc2FuZC1ldmVudHNcIl0gfHwgW107ICB3aW5kb3cuYW1wZXJzYW5kW1wiYW1wZXJzYW5kLWV2ZW50c1wiXS5wdXNoKFwiMS4xLjFcIik7fVxudmFyIHJ1bk9uY2UgPSByZXF1aXJlKCdsb2Rhc2gub25jZScpO1xudmFyIHVuaXF1ZUlkID0gcmVxdWlyZSgnbG9kYXNoLnVuaXF1ZWlkJyk7XG52YXIga2V5cyA9IHJlcXVpcmUoJ2xvZGFzaC5rZXlzJyk7XG52YXIgaXNFbXB0eSA9IHJlcXVpcmUoJ2xvZGFzaC5pc2VtcHR5Jyk7XG52YXIgZWFjaCA9IHJlcXVpcmUoJ2xvZGFzaC5mb3JlYWNoJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJ2xvZGFzaC5iaW5kJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnbG9kYXNoLmFzc2lnbicpO1xudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xudmFyIGV2ZW50U3BsaXR0ZXIgPSAvXFxzKy87XG5cblxudmFyIEV2ZW50cyA9IHtcbiAgICAvLyBCaW5kIGFuIGV2ZW50IHRvIGEgYGNhbGxiYWNrYCBmdW5jdGlvbi4gUGFzc2luZyBgXCJhbGxcImAgd2lsbCBiaW5kXG4gICAgLy8gdGhlIGNhbGxiYWNrIHRvIGFsbCBldmVudHMgZmlyZWQuXG4gICAgb246IGZ1bmN0aW9uKG5hbWUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgIGlmICghZXZlbnRzQXBpKHRoaXMsICdvbicsIG5hbWUsIFtjYWxsYmFjaywgY29udGV4dF0pIHx8ICFjYWxsYmFjaykgcmV0dXJuIHRoaXM7XG4gICAgICAgIHRoaXMuX2V2ZW50cyB8fCAodGhpcy5fZXZlbnRzID0ge30pO1xuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzW25hbWVdIHx8ICh0aGlzLl9ldmVudHNbbmFtZV0gPSBbXSk7XG4gICAgICAgIGV2ZW50cy5wdXNoKHtjYWxsYmFjazogY2FsbGJhY2ssIGNvbnRleHQ6IGNvbnRleHQsIGN0eDogY29udGV4dCB8fCB0aGlzfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyBCaW5kIGFuIGV2ZW50IHRvIG9ubHkgYmUgdHJpZ2dlcmVkIGEgc2luZ2xlIHRpbWUuIEFmdGVyIHRoZSBmaXJzdCB0aW1lXG4gICAgLy8gdGhlIGNhbGxiYWNrIGlzIGludm9rZWQsIGl0IHdpbGwgYmUgcmVtb3ZlZC5cbiAgICBvbmNlOiBmdW5jdGlvbihuYW1lLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgICBpZiAoIWV2ZW50c0FwaSh0aGlzLCAnb25jZScsIG5hbWUsIFtjYWxsYmFjaywgY29udGV4dF0pIHx8ICFjYWxsYmFjaykgcmV0dXJuIHRoaXM7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIG9uY2UgPSBydW5PbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5vZmYobmFtZSwgb25jZSk7XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9KTtcbiAgICAgICAgb25jZS5fY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgcmV0dXJuIHRoaXMub24obmFtZSwgb25jZSwgY29udGV4dCk7XG4gICAgfSxcblxuICAgIC8vIFJlbW92ZSBvbmUgb3IgbWFueSBjYWxsYmFja3MuIElmIGBjb250ZXh0YCBpcyBudWxsLCByZW1vdmVzIGFsbFxuICAgIC8vIGNhbGxiYWNrcyB3aXRoIHRoYXQgZnVuY3Rpb24uIElmIGBjYWxsYmFja2AgaXMgbnVsbCwgcmVtb3ZlcyBhbGxcbiAgICAvLyBjYWxsYmFja3MgZm9yIHRoZSBldmVudC4gSWYgYG5hbWVgIGlzIG51bGwsIHJlbW92ZXMgYWxsIGJvdW5kXG4gICAgLy8gY2FsbGJhY2tzIGZvciBhbGwgZXZlbnRzLlxuICAgIG9mZjogZnVuY3Rpb24obmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIHJldGFpbiwgZXYsIGV2ZW50cywgbmFtZXMsIGksIGwsIGosIGs7XG4gICAgICAgIGlmICghdGhpcy5fZXZlbnRzIHx8ICFldmVudHNBcGkodGhpcywgJ29mZicsIG5hbWUsIFtjYWxsYmFjaywgY29udGV4dF0pKSByZXR1cm4gdGhpcztcbiAgICAgICAgaWYgKCFuYW1lICYmICFjYWxsYmFjayAmJiAhY29udGV4dCkge1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRzID0gdm9pZCAwO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgbmFtZXMgPSBuYW1lID8gW25hbWVdIDoga2V5cyh0aGlzLl9ldmVudHMpO1xuICAgICAgICBmb3IgKGkgPSAwLCBsID0gbmFtZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBuYW1lID0gbmFtZXNbaV07XG4gICAgICAgICAgICBpZiAoZXZlbnRzID0gdGhpcy5fZXZlbnRzW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW25hbWVdID0gcmV0YWluID0gW107XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrIHx8IGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gMCwgayA9IGV2ZW50cy5sZW5ndGg7IGogPCBrOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ID0gZXZlbnRzW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChjYWxsYmFjayAmJiBjYWxsYmFjayAhPT0gZXYuY2FsbGJhY2sgJiYgY2FsbGJhY2sgIT09IGV2LmNhbGxiYWNrLl9jYWxsYmFjaykgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbnRleHQgJiYgY29udGV4dCAhPT0gZXYuY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXRhaW4ucHVzaChldik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFyZXRhaW4ubGVuZ3RoKSBkZWxldGUgdGhpcy5fZXZlbnRzW25hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vIFRyaWdnZXIgb25lIG9yIG1hbnkgZXZlbnRzLCBmaXJpbmcgYWxsIGJvdW5kIGNhbGxiYWNrcy4gQ2FsbGJhY2tzIGFyZVxuICAgIC8vIHBhc3NlZCB0aGUgc2FtZSBhcmd1bWVudHMgYXMgYHRyaWdnZXJgIGlzLCBhcGFydCBmcm9tIHRoZSBldmVudCBuYW1lXG4gICAgLy8gKHVubGVzcyB5b3UncmUgbGlzdGVuaW5nIG9uIGBcImFsbFwiYCwgd2hpY2ggd2lsbCBjYXVzZSB5b3VyIGNhbGxiYWNrIHRvXG4gICAgLy8gcmVjZWl2ZSB0aGUgdHJ1ZSBuYW1lIG9mIHRoZSBldmVudCBhcyB0aGUgZmlyc3QgYXJndW1lbnQpLlxuICAgIHRyaWdnZXI6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9ldmVudHMpIHJldHVybiB0aGlzO1xuICAgICAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaWYgKCFldmVudHNBcGkodGhpcywgJ3RyaWdnZXInLCBuYW1lLCBhcmdzKSkgcmV0dXJuIHRoaXM7XG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHNbbmFtZV07XG4gICAgICAgIHZhciBhbGxFdmVudHMgPSB0aGlzLl9ldmVudHMuYWxsO1xuICAgICAgICBpZiAoZXZlbnRzKSB0cmlnZ2VyRXZlbnRzKGV2ZW50cywgYXJncyk7XG4gICAgICAgIGlmIChhbGxFdmVudHMpIHRyaWdnZXJFdmVudHMoYWxsRXZlbnRzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy8gVGVsbCB0aGlzIG9iamVjdCB0byBzdG9wIGxpc3RlbmluZyB0byBlaXRoZXIgc3BlY2lmaWMgZXZlbnRzIC4uLiBvclxuICAgIC8vIHRvIGV2ZXJ5IG9iamVjdCBpdCdzIGN1cnJlbnRseSBsaXN0ZW5pbmcgdG8uXG4gICAgc3RvcExpc3RlbmluZzogZnVuY3Rpb24ob2JqLCBuYW1lLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgbGlzdGVuaW5nVG8gPSB0aGlzLl9saXN0ZW5pbmdUbztcbiAgICAgICAgaWYgKCFsaXN0ZW5pbmdUbykgcmV0dXJuIHRoaXM7XG4gICAgICAgIHZhciByZW1vdmUgPSAhbmFtZSAmJiAhY2FsbGJhY2s7XG4gICAgICAgIGlmICghY2FsbGJhY2sgJiYgdHlwZW9mIG5hbWUgPT09ICdvYmplY3QnKSBjYWxsYmFjayA9IHRoaXM7XG4gICAgICAgIGlmIChvYmopIChsaXN0ZW5pbmdUbyA9IHt9KVtvYmouX2xpc3RlbklkXSA9IG9iajtcbiAgICAgICAgZm9yICh2YXIgaWQgaW4gbGlzdGVuaW5nVG8pIHtcbiAgICAgICAgICAgIG9iaiA9IGxpc3RlbmluZ1RvW2lkXTtcbiAgICAgICAgICAgIG9iai5vZmYobmFtZSwgY2FsbGJhY2ssIHRoaXMpO1xuICAgICAgICAgICAgaWYgKHJlbW92ZSB8fCBpc0VtcHR5KG9iai5fZXZlbnRzKSkgZGVsZXRlIHRoaXMuX2xpc3RlbmluZ1RvW2lkXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy8gZXh0ZW5kIGFuIG9iamVjdCB3aXRoIGV2ZW50IGNhcGFiaWxpdGllcyBpZiBwYXNzZWRcbiAgICAvLyBvciBqdXN0IHJldHVybiBhIG5ldyBvbmUuXG4gICAgY3JlYXRlRW1pdHRlcjogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gYXNzaWduKG9iaiB8fCB7fSwgRXZlbnRzKTtcbiAgICB9XG59O1xuXG5FdmVudHMuYmluZCA9IEV2ZW50cy5vbjtcbkV2ZW50cy51bmJpbmQgPSBFdmVudHMub2ZmO1xuXG5cbi8vIEltcGxlbWVudCBmYW5jeSBmZWF0dXJlcyBvZiB0aGUgRXZlbnRzIEFQSSBzdWNoIGFzIG11bHRpcGxlIGV2ZW50XG4vLyBuYW1lcyBgXCJjaGFuZ2UgYmx1clwiYCBhbmQgalF1ZXJ5LXN0eWxlIGV2ZW50IG1hcHMgYHtjaGFuZ2U6IGFjdGlvbn1gXG4vLyBpbiB0ZXJtcyBvZiB0aGUgZXhpc3RpbmcgQVBJLlxudmFyIGV2ZW50c0FwaSA9IGZ1bmN0aW9uKG9iaiwgYWN0aW9uLCBuYW1lLCByZXN0KSB7XG4gICAgaWYgKCFuYW1lKSByZXR1cm4gdHJ1ZTtcblxuICAgIC8vIEhhbmRsZSBldmVudCBtYXBzLlxuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG5hbWUpIHtcbiAgICAgICAgICAgIG9ialthY3Rpb25dLmFwcGx5KG9iaiwgW2tleSwgbmFtZVtrZXldXS5jb25jYXQocmVzdCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgc3BhY2Ugc2VwYXJhdGVkIGV2ZW50IG5hbWVzLlxuICAgIGlmIChldmVudFNwbGl0dGVyLnRlc3QobmFtZSkpIHtcbiAgICAgICAgdmFyIG5hbWVzID0gbmFtZS5zcGxpdChldmVudFNwbGl0dGVyKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBuYW1lcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIG9ialthY3Rpb25dLmFwcGx5KG9iaiwgW25hbWVzW2ldXS5jb25jYXQocmVzdCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8vIEEgZGlmZmljdWx0LXRvLWJlbGlldmUsIGJ1dCBvcHRpbWl6ZWQgaW50ZXJuYWwgZGlzcGF0Y2ggZnVuY3Rpb24gZm9yXG4vLyB0cmlnZ2VyaW5nIGV2ZW50cy4gVHJpZXMgdG8ga2VlcCB0aGUgdXN1YWwgY2FzZXMgc3BlZWR5LlxudmFyIHRyaWdnZXJFdmVudHMgPSBmdW5jdGlvbihldmVudHMsIGFyZ3MpIHtcbiAgICB2YXIgZXY7XG4gICAgdmFyIGkgPSAtMTtcbiAgICB2YXIgbCA9IGV2ZW50cy5sZW5ndGg7XG4gICAgdmFyIGExID0gYXJnc1swXTtcbiAgICB2YXIgYTIgPSBhcmdzWzFdO1xuICAgIHZhciBhMyA9IGFyZ3NbMl07XG4gICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDA6IHdoaWxlICgrK2kgPCBsKSAoZXYgPSBldmVudHNbaV0pLmNhbGxiYWNrLmNhbGwoZXYuY3R4KTsgcmV0dXJuO1xuICAgICAgICBjYXNlIDE6IHdoaWxlICgrK2kgPCBsKSAoZXYgPSBldmVudHNbaV0pLmNhbGxiYWNrLmNhbGwoZXYuY3R4LCBhMSk7IHJldHVybjtcbiAgICAgICAgY2FzZSAyOiB3aGlsZSAoKytpIDwgbCkgKGV2ID0gZXZlbnRzW2ldKS5jYWxsYmFjay5jYWxsKGV2LmN0eCwgYTEsIGEyKTsgcmV0dXJuO1xuICAgICAgICBjYXNlIDM6IHdoaWxlICgrK2kgPCBsKSAoZXYgPSBldmVudHNbaV0pLmNhbGxiYWNrLmNhbGwoZXYuY3R4LCBhMSwgYTIsIGEzKTsgcmV0dXJuO1xuICAgICAgICBkZWZhdWx0OiB3aGlsZSAoKytpIDwgbCkgKGV2ID0gZXZlbnRzW2ldKS5jYWxsYmFjay5hcHBseShldi5jdHgsIGFyZ3MpOyByZXR1cm47XG4gICAgfVxufTtcblxudmFyIGxpc3Rlbk1ldGhvZHMgPSB7XG4gICAgbGlzdGVuVG86ICdvbicsXG4gICAgbGlzdGVuVG9PbmNlOiAnb25jZSdcbn07XG5cbi8vIEludmVyc2lvbi1vZi1jb250cm9sIHZlcnNpb25zIG9mIGBvbmAgYW5kIGBvbmNlYC4gVGVsbCAqdGhpcyogb2JqZWN0IHRvXG4vLyBsaXN0ZW4gdG8gYW4gZXZlbnQgaW4gYW5vdGhlciBvYmplY3QgLi4uIGtlZXBpbmcgdHJhY2sgb2Ygd2hhdCBpdCdzXG4vLyBsaXN0ZW5pbmcgdG8uXG5lYWNoKGxpc3Rlbk1ldGhvZHMsIGZ1bmN0aW9uKGltcGxlbWVudGF0aW9uLCBtZXRob2QpIHtcbiAgICBFdmVudHNbbWV0aG9kXSA9IGZ1bmN0aW9uKG9iaiwgbmFtZSwgY2FsbGJhY2ssIHJ1bikge1xuICAgICAgICB2YXIgbGlzdGVuaW5nVG8gPSB0aGlzLl9saXN0ZW5pbmdUbyB8fCAodGhpcy5fbGlzdGVuaW5nVG8gPSB7fSk7XG4gICAgICAgIHZhciBpZCA9IG9iai5fbGlzdGVuSWQgfHwgKG9iai5fbGlzdGVuSWQgPSB1bmlxdWVJZCgnbCcpKTtcbiAgICAgICAgbGlzdGVuaW5nVG9baWRdID0gb2JqO1xuICAgICAgICBpZiAoIWNhbGxiYWNrICYmIHR5cGVvZiBuYW1lID09PSAnb2JqZWN0JykgY2FsbGJhY2sgPSB0aGlzO1xuICAgICAgICBvYmpbaW1wbGVtZW50YXRpb25dKG5hbWUsIGNhbGxiYWNrLCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbn0pO1xuXG5FdmVudHMubGlzdGVuVG9BbmRSdW4gPSBmdW5jdGlvbiAob2JqLCBuYW1lLCBjYWxsYmFjaykge1xuICAgIEV2ZW50cy5saXN0ZW5Uby5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICghY2FsbGJhY2sgJiYgdHlwZW9mIG5hbWUgPT09ICdvYmplY3QnKSBjYWxsYmFjayA9IHRoaXM7XG4gICAgY2FsbGJhY2suYXBwbHkodGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50cztcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4wIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS43LjAgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgYmFzZUFzc2lnbiA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZWFzc2lnbicpLFxuICAgIGNyZWF0ZUFzc2lnbmVyID0gcmVxdWlyZSgnbG9kYXNoLl9jcmVhdGVhc3NpZ25lcicpO1xuXG4vKipcbiAqIEFzc2lnbnMgb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBzb3VyY2Ugb2JqZWN0KHMpIHRvIHRoZSBkZXN0aW5hdGlvblxuICogb2JqZWN0LiBTdWJzZXF1ZW50IHNvdXJjZXMgb3ZlcndyaXRlIHByb3BlcnR5IGFzc2lnbm1lbnRzIG9mIHByZXZpb3VzIHNvdXJjZXMuXG4gKiBJZiBgY3VzdG9taXplcmAgaXMgcHJvdmlkZWQgaXQgaXMgaW52b2tlZCB0byBwcm9kdWNlIHRoZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBUaGUgYGN1c3RvbWl6ZXJgIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIGZpdmUgYXJndW1lbnRzO1xuICogKG9iamVjdFZhbHVlLCBzb3VyY2VWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBhbGlhcyBleHRlbmRcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlc10gVGhlIHNvdXJjZSBvYmplY3RzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduaW5nIHZhbHVlcy5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY3VzdG9taXplcmAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmFzc2lnbih7ICd1c2VyJzogJ2Jhcm5leScgfSwgeyAnYWdlJzogNDAgfSwgeyAndXNlcic6ICdmcmVkJyB9KTtcbiAqIC8vID0+IHsgJ3VzZXInOiAnZnJlZCcsICdhZ2UnOiA0MCB9XG4gKlxuICogLy8gdXNpbmcgYSBjdXN0b21pemVyIGNhbGxiYWNrXG4gKiB2YXIgZGVmYXVsdHMgPSBfLnBhcnRpYWxSaWdodChfLmFzc2lnbiwgZnVuY3Rpb24odmFsdWUsIG90aGVyKSB7XG4gKiAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3VuZGVmaW5lZCcgPyBvdGhlciA6IHZhbHVlO1xuICogfSk7XG4gKlxuICogZGVmYXVsdHMoeyAndXNlcic6ICdiYXJuZXknIH0sIHsgJ2FnZSc6IDM2IH0sIHsgJ3VzZXInOiAnZnJlZCcgfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9XG4gKi9cbnZhciBhc3NpZ24gPSBjcmVhdGVBc3NpZ25lcihiYXNlQXNzaWduKTtcblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ247XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMiAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGJhc2VDb3B5ID0gcmVxdWlyZSgnbG9kYXNoLl9iYXNlY29weScpLFxuICAgIGtleXMgPSByZXF1aXJlKCdsb2Rhc2gua2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbmAgd2l0aG91dCBzdXBwb3J0IGZvciBhcmd1bWVudCBqdWdnbGluZyxcbiAqIG11bHRpcGxlIHNvdXJjZXMsIGFuZCBgdGhpc2AgYmluZGluZyBgY3VzdG9taXplcmAgZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduaW5nIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnbihvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcikge1xuICB2YXIgcHJvcHMgPSBrZXlzKHNvdXJjZSk7XG4gIGlmICghY3VzdG9taXplcikge1xuICAgIHJldHVybiBiYXNlQ29weShzb3VyY2UsIG9iamVjdCwgcHJvcHMpO1xuICB9XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XSxcbiAgICAgICAgdmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgcmVzdWx0ID0gY3VzdG9taXplcih2YWx1ZSwgc291cmNlW2tleV0sIGtleSwgb2JqZWN0LCBzb3VyY2UpO1xuXG4gICAgaWYgKChyZXN1bHQgPT09IHJlc3VsdCA/IChyZXN1bHQgIT09IHZhbHVlKSA6ICh2YWx1ZSA9PT0gdmFsdWUpKSB8fFxuICAgICAgICAodHlwZW9mIHZhbHVlID09ICd1bmRlZmluZWQnICYmICEoa2V5IGluIG9iamVjdCkpKSB7XG4gICAgICBvYmplY3Rba2V5XSA9IHJlc3VsdDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjcuMCA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqXG4gKiBDb3BpZXMgdGhlIHByb3BlcnRpZXMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyB0by5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBuYW1lcyB0byBjb3B5LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUNvcHkoc291cmNlLCBvYmplY3QsIHByb3BzKSB7XG4gIGlmICghcHJvcHMpIHtcbiAgICBwcm9wcyA9IG9iamVjdDtcbiAgICBvYmplY3QgPSB7fTtcbiAgfVxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgb2JqZWN0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VDb3B5O1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjEgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBiaW5kQ2FsbGJhY2sgPSByZXF1aXJlKCdsb2Rhc2guX2JpbmRjYWxsYmFjaycpLFxuICAgIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnbG9kYXNoLl9pc2l0ZXJhdGVlY2FsbCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGFzc2lnbnMgcHJvcGVydGllcyBvZiBzb3VyY2Ugb2JqZWN0KHMpIHRvIGEgZ2l2ZW5cbiAqIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gYXNzaWduZXIgVGhlIGZ1bmN0aW9uIHRvIGFzc2lnbiB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhc3NpZ25lciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQXNzaWduZXIoYXNzaWduZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBsZW5ndGggPSBhcmdzLmxlbmd0aCxcbiAgICAgICAgb2JqZWN0ID0gYXJnc1swXTtcblxuICAgIGlmIChsZW5ndGggPCAyIHx8IG9iamVjdCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cbiAgICB2YXIgY3VzdG9taXplciA9IGFyZ3NbbGVuZ3RoIC0gMl0sXG4gICAgICAgIHRoaXNBcmcgPSBhcmdzW2xlbmd0aCAtIDFdLFxuICAgICAgICBndWFyZCA9IGFyZ3NbM107XG5cbiAgICBpZiAobGVuZ3RoID4gMyAmJiB0eXBlb2YgY3VzdG9taXplciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjdXN0b21pemVyID0gYmluZENhbGxiYWNrKGN1c3RvbWl6ZXIsIHRoaXNBcmcsIDUpO1xuICAgICAgbGVuZ3RoIC09IDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1c3RvbWl6ZXIgPSAobGVuZ3RoID4gMiAmJiB0eXBlb2YgdGhpc0FyZyA9PSAnZnVuY3Rpb24nKSA/IHRoaXNBcmcgOiBudWxsO1xuICAgICAgbGVuZ3RoIC09IChjdXN0b21pemVyID8gMSA6IDApO1xuICAgIH1cbiAgICBpZiAoZ3VhcmQgJiYgaXNJdGVyYXRlZUNhbGwoYXJnc1sxXSwgYXJnc1syXSwgZ3VhcmQpKSB7XG4gICAgICBjdXN0b21pemVyID0gbGVuZ3RoID09IDMgPyBudWxsIDogY3VzdG9taXplcjtcbiAgICAgIGxlbmd0aCA9IDI7XG4gICAgfVxuICAgIHZhciBpbmRleCA9IDA7XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBzb3VyY2UgPSBhcmdzW2luZGV4XTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgYXNzaWduZXIob2JqZWN0LCBzb3VyY2UsIGN1c3RvbWl6ZXIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUFzc2lnbmVyO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjcuMCA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VDYWxsYmFja2Agd2hpY2ggb25seSBzdXBwb3J0cyBgdGhpc2AgYmluZGluZ1xuICogYW5kIHNwZWNpZnlpbmcgdGhlIG51bWJlciBvZiBhcmd1bWVudHMgdG8gcHJvdmlkZSB0byBgZnVuY2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGJpbmQuXG4gKiBAcGFyYW0geyp9IHRoaXNBcmcgVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJnQ291bnRdIFRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRvIHByb3ZpZGUgdG8gYGZ1bmNgLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBjYWxsYmFjay5cbiAqL1xuZnVuY3Rpb24gYmluZENhbGxiYWNrKGZ1bmMsIHRoaXNBcmcsIGFyZ0NvdW50KSB7XG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGlkZW50aXR5O1xuICB9XG4gIGlmICh0eXBlb2YgdGhpc0FyZyA9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBmdW5jO1xuICB9XG4gIHN3aXRjaCAoYXJnQ291bnQpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCB2YWx1ZSk7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICB9O1xuICAgIGNhc2UgNDogcmV0dXJuIGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgfTtcbiAgICBjYXNlIDU6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgb3RoZXIsIGtleSwgb2JqZWN0LCBzb3VyY2UpIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgdmFsdWUsIG90aGVyLCBrZXksIG9iamVjdCwgc291cmNlKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IHByb3ZpZGVkIHRvIGl0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbGl0eVxuICogQHBhcmFtIHsqfSB2YWx1ZSBBbnkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAndXNlcic6ICdmcmVkJyB9O1xuICogXy5pZGVudGl0eShvYmplY3QpID09PSBvYmplY3Q7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiaW5kQ2FsbGJhY2s7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuNSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKipcbiAqIFVzZWQgYXMgdGhlIFttYXhpbXVtIGxlbmd0aF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW51bWJlci5tYXhfc2FmZV9pbnRlZ2VyKVxuICogb2YgYW4gYXJyYXktbGlrZSB2YWx1ZS5cbiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICB2YWx1ZSA9ICt2YWx1ZTtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuICByZXR1cm4gdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIHByb3ZpZGVkIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgdmFsdWUgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IGluZGV4IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgaW5kZXggb3Iga2V5IGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBvYmplY3QgYXJndW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmF0ZWVDYWxsKHZhbHVlLCBpbmRleCwgb2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiBpbmRleDtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcicpIHtcbiAgICB2YXIgbGVuZ3RoID0gb2JqZWN0Lmxlbmd0aCxcbiAgICAgICAgcHJlcmVxID0gaXNMZW5ndGgobGVuZ3RoKSAmJiBpc0luZGV4KGluZGV4LCBsZW5ndGgpO1xuICB9IGVsc2Uge1xuICAgIHByZXJlcSA9IHR5cGUgPT0gJ3N0cmluZycgJiYgaW5kZXggaW4gb2JqZWN0O1xuICB9XG4gIGlmIChwcmVyZXEpIHtcbiAgICB2YXIgb3RoZXIgPSBvYmplY3RbaW5kZXhdO1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyAodmFsdWUgPT09IG90aGVyKSA6IChvdGhlciAhPT0gb3RoZXIpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdHlwZSA9PSAnZnVuY3Rpb24nIHx8ICghIXZhbHVlICYmIHR5cGUgPT0gJ29iamVjdCcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSXRlcmF0ZWVDYWxsO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4xLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBjcmVhdGVXcmFwcGVyID0gcmVxdWlyZSgnbG9kYXNoLl9jcmVhdGV3cmFwcGVyJyksXG4gICAgcmVwbGFjZUhvbGRlcnMgPSByZXF1aXJlKCdsb2Rhc2guX3JlcGxhY2Vob2xkZXJzJyksXG4gICAgcmVzdFBhcmFtID0gcmVxdWlyZSgnbG9kYXNoLnJlc3RwYXJhbScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB3cmFwcGVyIG1ldGFkYXRhLiAqL1xudmFyIEJJTkRfRkxBRyA9IDEsXG4gICAgUEFSVElBTF9GTEFHID0gMzI7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgYHRoaXNBcmdgXG4gKiBhbmQgcHJlcGVuZHMgYW55IGFkZGl0aW9uYWwgYF8uYmluZGAgYXJndW1lbnRzIHRvIHRob3NlIHByb3ZpZGVkIHRvIHRoZVxuICogYm91bmQgZnVuY3Rpb24uXG4gKlxuICogVGhlIGBfLmJpbmQucGxhY2Vob2xkZXJgIHZhbHVlLCB3aGljaCBkZWZhdWx0cyB0byBgX2AgaW4gbW9ub2xpdGhpYyBidWlsZHMsXG4gKiBtYXkgYmUgdXNlZCBhcyBhIHBsYWNlaG9sZGVyIGZvciBwYXJ0aWFsbHkgYXBwbGllZCBhcmd1bWVudHMuXG4gKlxuICogKipOb3RlOioqIFVubGlrZSBuYXRpdmUgYEZ1bmN0aW9uI2JpbmRgIHRoaXMgbWV0aG9kIGRvZXMgbm90IHNldCB0aGUgYGxlbmd0aGBcbiAqIHByb3BlcnR5IG9mIGJvdW5kIGZ1bmN0aW9ucy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBiaW5kLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0gey4uLip9IFtwYXJ0aWFsc10gVGhlIGFyZ3VtZW50cyB0byBiZSBwYXJ0aWFsbHkgYXBwbGllZC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJvdW5kIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgZ3JlZXQgPSBmdW5jdGlvbihncmVldGluZywgcHVuY3R1YXRpb24pIHtcbiAqICAgcmV0dXJuIGdyZWV0aW5nICsgJyAnICsgdGhpcy51c2VyICsgcHVuY3R1YXRpb247XG4gKiB9O1xuICpcbiAqIHZhciBvYmplY3QgPSB7ICd1c2VyJzogJ2ZyZWQnIH07XG4gKlxuICogdmFyIGJvdW5kID0gXy5iaW5kKGdyZWV0LCBvYmplY3QsICdoaScpO1xuICogYm91bmQoJyEnKTtcbiAqIC8vID0+ICdoaSBmcmVkISdcbiAqXG4gKiAvLyB1c2luZyBwbGFjZWhvbGRlcnNcbiAqIHZhciBib3VuZCA9IF8uYmluZChncmVldCwgb2JqZWN0LCBfLCAnIScpO1xuICogYm91bmQoJ2hpJyk7XG4gKiAvLyA9PiAnaGkgZnJlZCEnXG4gKi9cbnZhciBiaW5kID0gcmVzdFBhcmFtKGZ1bmN0aW9uKGZ1bmMsIHRoaXNBcmcsIHBhcnRpYWxzKSB7XG4gIHZhciBiaXRtYXNrID0gQklORF9GTEFHO1xuICBpZiAocGFydGlhbHMubGVuZ3RoKSB7XG4gICAgdmFyIGhvbGRlcnMgPSByZXBsYWNlSG9sZGVycyhwYXJ0aWFscywgYmluZC5wbGFjZWhvbGRlcik7XG4gICAgYml0bWFzayB8PSBQQVJUSUFMX0ZMQUc7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZVdyYXBwZXIoZnVuYywgYml0bWFzaywgdGhpc0FyZywgcGFydGlhbHMsIGhvbGRlcnMpO1xufSk7XG5cbi8vIEFzc2lnbiBkZWZhdWx0IHBsYWNlaG9sZGVycy5cbmJpbmQucGxhY2Vob2xkZXIgPSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBiaW5kO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjMgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBhcnJheUNvcHkgPSByZXF1aXJlKCdsb2Rhc2guX2FycmF5Y29weScpLFxuICAgIGJhc2VDcmVhdGUgPSByZXF1aXJlKCdsb2Rhc2guX2Jhc2VjcmVhdGUnKSxcbiAgICByZXBsYWNlSG9sZGVycyA9IHJlcXVpcmUoJ2xvZGFzaC5fcmVwbGFjZWhvbGRlcnMnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3Igd3JhcHBlciBtZXRhZGF0YS4gKi9cbnZhciBCSU5EX0ZMQUcgPSAxLFxuICAgIEJJTkRfS0VZX0ZMQUcgPSAyLFxuICAgIENVUlJZX0JPVU5EX0ZMQUcgPSA0LFxuICAgIENVUlJZX0ZMQUcgPSA4LFxuICAgIENVUlJZX1JJR0hUX0ZMQUcgPSAxNixcbiAgICBQQVJUSUFMX0ZMQUcgPSAzMixcbiAgICBQQVJUSUFMX1JJR0hUX0ZMQUcgPSA2NCxcbiAgICBBUllfRkxBRyA9IDEyODtcblxuLyoqIFVzZWQgYXMgdGhlIGBUeXBlRXJyb3JgIG1lc3NhZ2UgZm9yIFwiRnVuY3Rpb25zXCIgbWV0aG9kcy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtbnVtYmVyLm1heF9zYWZlX2ludGVnZXIpXG4gKiBvZiBhbiBhcnJheS1saWtlIHZhbHVlLlxuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBwYXJ0aWFsbHkgYXBwbGllZCBhcmd1bWVudHMsXG4gKiBwbGFjZWhvbGRlcnMsIGFuZCBwcm92aWRlZCBhcmd1bWVudHMgaW50byBhIHNpbmdsZSBhcnJheSBvZiBhcmd1bWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBhcmdzIFRoZSBwcm92aWRlZCBhcmd1bWVudHMuXG4gKiBAcGFyYW0ge0FycmF5fSBwYXJ0aWFscyBUaGUgYXJndW1lbnRzIHRvIHByZXBlbmQgdG8gdGhvc2UgcHJvdmlkZWQuXG4gKiBAcGFyYW0ge0FycmF5fSBob2xkZXJzIFRoZSBgcGFydGlhbHNgIHBsYWNlaG9sZGVyIGluZGV4ZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheSBvZiBjb21wb3NlZCBhcmd1bWVudHMuXG4gKi9cbmZ1bmN0aW9uIGNvbXBvc2VBcmdzKGFyZ3MsIHBhcnRpYWxzLCBob2xkZXJzKSB7XG4gIHZhciBob2xkZXJzTGVuZ3RoID0gaG9sZGVycy5sZW5ndGgsXG4gICAgICBhcmdzSW5kZXggPSAtMSxcbiAgICAgIGFyZ3NMZW5ndGggPSBuYXRpdmVNYXgoYXJncy5sZW5ndGggLSBob2xkZXJzTGVuZ3RoLCAwKSxcbiAgICAgIGxlZnRJbmRleCA9IC0xLFxuICAgICAgbGVmdExlbmd0aCA9IHBhcnRpYWxzLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGFyZ3NMZW5ndGggKyBsZWZ0TGVuZ3RoKTtcblxuICB3aGlsZSAoKytsZWZ0SW5kZXggPCBsZWZ0TGVuZ3RoKSB7XG4gICAgcmVzdWx0W2xlZnRJbmRleF0gPSBwYXJ0aWFsc1tsZWZ0SW5kZXhdO1xuICB9XG4gIHdoaWxlICgrK2FyZ3NJbmRleCA8IGhvbGRlcnNMZW5ndGgpIHtcbiAgICByZXN1bHRbaG9sZGVyc1thcmdzSW5kZXhdXSA9IGFyZ3NbYXJnc0luZGV4XTtcbiAgfVxuICB3aGlsZSAoYXJnc0xlbmd0aC0tKSB7XG4gICAgcmVzdWx0W2xlZnRJbmRleCsrXSA9IGFyZ3NbYXJnc0luZGV4KytdO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBsaWtlIGBjb21wb3NlQXJnc2AgZXhjZXB0IHRoYXQgdGhlIGFyZ3VtZW50cyBjb21wb3NpdGlvblxuICogaXMgdGFpbG9yZWQgZm9yIGBfLnBhcnRpYWxSaWdodGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBhcmdzIFRoZSBwcm92aWRlZCBhcmd1bWVudHMuXG4gKiBAcGFyYW0ge0FycmF5fSBwYXJ0aWFscyBUaGUgYXJndW1lbnRzIHRvIGFwcGVuZCB0byB0aG9zZSBwcm92aWRlZC5cbiAqIEBwYXJhbSB7QXJyYXl9IGhvbGRlcnMgVGhlIGBwYXJ0aWFsc2AgcGxhY2Vob2xkZXIgaW5kZXhlcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIGNvbXBvc2VkIGFyZ3VtZW50cy5cbiAqL1xuZnVuY3Rpb24gY29tcG9zZUFyZ3NSaWdodChhcmdzLCBwYXJ0aWFscywgaG9sZGVycykge1xuICB2YXIgaG9sZGVyc0luZGV4ID0gLTEsXG4gICAgICBob2xkZXJzTGVuZ3RoID0gaG9sZGVycy5sZW5ndGgsXG4gICAgICBhcmdzSW5kZXggPSAtMSxcbiAgICAgIGFyZ3NMZW5ndGggPSBuYXRpdmVNYXgoYXJncy5sZW5ndGggLSBob2xkZXJzTGVuZ3RoLCAwKSxcbiAgICAgIHJpZ2h0SW5kZXggPSAtMSxcbiAgICAgIHJpZ2h0TGVuZ3RoID0gcGFydGlhbHMubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gQXJyYXkoYXJnc0xlbmd0aCArIHJpZ2h0TGVuZ3RoKTtcblxuICB3aGlsZSAoKythcmdzSW5kZXggPCBhcmdzTGVuZ3RoKSB7XG4gICAgcmVzdWx0W2FyZ3NJbmRleF0gPSBhcmdzW2FyZ3NJbmRleF07XG4gIH1cbiAgdmFyIHBhZCA9IGFyZ3NJbmRleDtcbiAgd2hpbGUgKCsrcmlnaHRJbmRleCA8IHJpZ2h0TGVuZ3RoKSB7XG4gICAgcmVzdWx0W3BhZCArIHJpZ2h0SW5kZXhdID0gcGFydGlhbHNbcmlnaHRJbmRleF07XG4gIH1cbiAgd2hpbGUgKCsraG9sZGVyc0luZGV4IDwgaG9sZGVyc0xlbmd0aCkge1xuICAgIHJlc3VsdFtwYWQgKyBob2xkZXJzW2hvbGRlcnNJbmRleF1dID0gYXJnc1thcmdzSW5kZXgrK107XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCB3cmFwcyBgZnVuY2AgYW5kIGludm9rZXMgaXQgd2l0aCB0aGUgYHRoaXNgXG4gKiBiaW5kaW5nIG9mIGB0aGlzQXJnYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYmluZC5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBib3VuZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmluZFdyYXBwZXIoZnVuYywgdGhpc0FyZykge1xuICB2YXIgQ3RvciA9IGNyZWF0ZUN0b3JXcmFwcGVyKGZ1bmMpO1xuXG4gIGZ1bmN0aW9uIHdyYXBwZXIoKSB7XG4gICAgdmFyIGZuID0gKHRoaXMgJiYgdGhpcyAhPT0gZ2xvYmFsICYmIHRoaXMgaW5zdGFuY2VvZiB3cmFwcGVyKSA/IEN0b3IgOiBmdW5jO1xuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmd1bWVudHMpO1xuICB9XG4gIHJldHVybiB3cmFwcGVyO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHByb2R1Y2VzIGFuIGluc3RhbmNlIG9mIGBDdG9yYCByZWdhcmRsZXNzIG9mXG4gKiB3aGV0aGVyIGl0IHdhcyBpbnZva2VkIGFzIHBhcnQgb2YgYSBgbmV3YCBleHByZXNzaW9uIG9yIGJ5IGBjYWxsYCBvciBgYXBwbHlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBDdG9yIFRoZSBjb25zdHJ1Y3RvciB0byB3cmFwLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgd3JhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQ3RvcldyYXBwZXIoQ3Rvcikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRoaXNCaW5kaW5nID0gYmFzZUNyZWF0ZShDdG9yLnByb3RvdHlwZSksXG4gICAgICAgIHJlc3VsdCA9IEN0b3IuYXBwbHkodGhpc0JpbmRpbmcsIGFyZ3VtZW50cyk7XG5cbiAgICAvLyBNaW1pYyB0aGUgY29uc3RydWN0b3IncyBgcmV0dXJuYCBiZWhhdmlvci5cbiAgICAvLyBTZWUgaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4MTMuMi4yIGZvciBtb3JlIGRldGFpbHMuXG4gICAgcmV0dXJuIGlzT2JqZWN0KHJlc3VsdCkgPyByZXN1bHQgOiB0aGlzQmluZGluZztcbiAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCB3cmFwcyBgZnVuY2AgYW5kIGludm9rZXMgaXQgd2l0aCBvcHRpb25hbCBgdGhpc2BcbiAqIGJpbmRpbmcgb2YsIHBhcnRpYWwgYXBwbGljYXRpb24sIGFuZCBjdXJyeWluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbnxzdHJpbmd9IGZ1bmMgVGhlIGZ1bmN0aW9uIG9yIG1ldGhvZCBuYW1lIHRvIHJlZmVyZW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIG9mIGZsYWdzLiBTZWUgYGNyZWF0ZVdyYXBwZXJgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtBcnJheX0gW3BhcnRpYWxzXSBUaGUgYXJndW1lbnRzIHRvIHByZXBlbmQgdG8gdGhvc2UgcHJvdmlkZWQgdG8gdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7QXJyYXl9IFtob2xkZXJzXSBUaGUgYHBhcnRpYWxzYCBwbGFjZWhvbGRlciBpbmRleGVzLlxuICogQHBhcmFtIHtBcnJheX0gW3BhcnRpYWxzUmlnaHRdIFRoZSBhcmd1bWVudHMgdG8gYXBwZW5kIHRvIHRob3NlIHByb3ZpZGVkIHRvIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge0FycmF5fSBbaG9sZGVyc1JpZ2h0XSBUaGUgYHBhcnRpYWxzUmlnaHRgIHBsYWNlaG9sZGVyIGluZGV4ZXMuXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJnUG9zXSBUaGUgYXJndW1lbnQgcG9zaXRpb25zIG9mIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyeV0gVGhlIGFyaXR5IGNhcCBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyaXR5XSBUaGUgYXJpdHkgb2YgYGZ1bmNgLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgd3JhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlSHlicmlkV3JhcHBlcihmdW5jLCBiaXRtYXNrLCB0aGlzQXJnLCBwYXJ0aWFscywgaG9sZGVycywgcGFydGlhbHNSaWdodCwgaG9sZGVyc1JpZ2h0LCBhcmdQb3MsIGFyeSwgYXJpdHkpIHtcbiAgdmFyIGlzQXJ5ID0gYml0bWFzayAmIEFSWV9GTEFHLFxuICAgICAgaXNCaW5kID0gYml0bWFzayAmIEJJTkRfRkxBRyxcbiAgICAgIGlzQmluZEtleSA9IGJpdG1hc2sgJiBCSU5EX0tFWV9GTEFHLFxuICAgICAgaXNDdXJyeSA9IGJpdG1hc2sgJiBDVVJSWV9GTEFHLFxuICAgICAgaXNDdXJyeUJvdW5kID0gYml0bWFzayAmIENVUlJZX0JPVU5EX0ZMQUcsXG4gICAgICBpc0N1cnJ5UmlnaHQgPSBiaXRtYXNrICYgQ1VSUllfUklHSFRfRkxBRztcblxuICB2YXIgQ3RvciA9ICFpc0JpbmRLZXkgJiYgY3JlYXRlQ3RvcldyYXBwZXIoZnVuYyksXG4gICAgICBrZXkgPSBmdW5jO1xuXG4gIGZ1bmN0aW9uIHdyYXBwZXIoKSB7XG4gICAgLy8gQXZvaWQgYGFyZ3VtZW50c2Agb2JqZWN0IHVzZSBkaXNxdWFsaWZ5aW5nIG9wdGltaXphdGlvbnMgYnlcbiAgICAvLyBjb252ZXJ0aW5nIGl0IHRvIGFuIGFycmF5IGJlZm9yZSBwcm92aWRpbmcgaXQgdG8gb3RoZXIgZnVuY3Rpb25zLlxuICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IGxlbmd0aCxcbiAgICAgICAgYXJncyA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoaW5kZXgtLSkge1xuICAgICAgYXJnc1tpbmRleF0gPSBhcmd1bWVudHNbaW5kZXhdO1xuICAgIH1cbiAgICBpZiAocGFydGlhbHMpIHtcbiAgICAgIGFyZ3MgPSBjb21wb3NlQXJncyhhcmdzLCBwYXJ0aWFscywgaG9sZGVycyk7XG4gICAgfVxuICAgIGlmIChwYXJ0aWFsc1JpZ2h0KSB7XG4gICAgICBhcmdzID0gY29tcG9zZUFyZ3NSaWdodChhcmdzLCBwYXJ0aWFsc1JpZ2h0LCBob2xkZXJzUmlnaHQpO1xuICAgIH1cbiAgICBpZiAoaXNDdXJyeSB8fCBpc0N1cnJ5UmlnaHQpIHtcbiAgICAgIHZhciBwbGFjZWhvbGRlciA9IHdyYXBwZXIucGxhY2Vob2xkZXIsXG4gICAgICAgICAgYXJnc0hvbGRlcnMgPSByZXBsYWNlSG9sZGVycyhhcmdzLCBwbGFjZWhvbGRlcik7XG5cbiAgICAgIGxlbmd0aCAtPSBhcmdzSG9sZGVycy5sZW5ndGg7XG4gICAgICBpZiAobGVuZ3RoIDwgYXJpdHkpIHtcbiAgICAgICAgdmFyIG5ld0FyZ1BvcyA9IGFyZ1BvcyA/IGFycmF5Q29weShhcmdQb3MpIDogbnVsbCxcbiAgICAgICAgICAgIG5ld0FyaXR5ID0gbmF0aXZlTWF4KGFyaXR5IC0gbGVuZ3RoLCAwKSxcbiAgICAgICAgICAgIG5ld3NIb2xkZXJzID0gaXNDdXJyeSA/IGFyZ3NIb2xkZXJzIDogbnVsbCxcbiAgICAgICAgICAgIG5ld0hvbGRlcnNSaWdodCA9IGlzQ3VycnkgPyBudWxsIDogYXJnc0hvbGRlcnMsXG4gICAgICAgICAgICBuZXdQYXJ0aWFscyA9IGlzQ3VycnkgPyBhcmdzIDogbnVsbCxcbiAgICAgICAgICAgIG5ld1BhcnRpYWxzUmlnaHQgPSBpc0N1cnJ5ID8gbnVsbCA6IGFyZ3M7XG5cbiAgICAgICAgYml0bWFzayB8PSAoaXNDdXJyeSA/IFBBUlRJQUxfRkxBRyA6IFBBUlRJQUxfUklHSFRfRkxBRyk7XG4gICAgICAgIGJpdG1hc2sgJj0gfihpc0N1cnJ5ID8gUEFSVElBTF9SSUdIVF9GTEFHIDogUEFSVElBTF9GTEFHKTtcblxuICAgICAgICBpZiAoIWlzQ3VycnlCb3VuZCkge1xuICAgICAgICAgIGJpdG1hc2sgJj0gfihCSU5EX0ZMQUcgfCBCSU5EX0tFWV9GTEFHKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVzdWx0ID0gY3JlYXRlSHlicmlkV3JhcHBlcihmdW5jLCBiaXRtYXNrLCB0aGlzQXJnLCBuZXdQYXJ0aWFscywgbmV3c0hvbGRlcnMsIG5ld1BhcnRpYWxzUmlnaHQsIG5ld0hvbGRlcnNSaWdodCwgbmV3QXJnUG9zLCBhcnksIG5ld0FyaXR5KTtcblxuICAgICAgICByZXN1bHQucGxhY2Vob2xkZXIgPSBwbGFjZWhvbGRlcjtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIHRoaXNCaW5kaW5nID0gaXNCaW5kID8gdGhpc0FyZyA6IHRoaXM7XG4gICAgaWYgKGlzQmluZEtleSkge1xuICAgICAgZnVuYyA9IHRoaXNCaW5kaW5nW2tleV07XG4gICAgfVxuICAgIGlmIChhcmdQb3MpIHtcbiAgICAgIGFyZ3MgPSByZW9yZGVyKGFyZ3MsIGFyZ1Bvcyk7XG4gICAgfVxuICAgIGlmIChpc0FyeSAmJiBhcnkgPCBhcmdzLmxlbmd0aCkge1xuICAgICAgYXJncy5sZW5ndGggPSBhcnk7XG4gICAgfVxuICAgIHZhciBmbiA9ICh0aGlzICYmIHRoaXMgIT09IGdsb2JhbCAmJiB0aGlzIGluc3RhbmNlb2Ygd3JhcHBlcikgPyAoQ3RvciB8fCBjcmVhdGVDdG9yV3JhcHBlcihmdW5jKSkgOiBmdW5jO1xuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQmluZGluZywgYXJncyk7XG4gIH1cbiAgcmV0dXJuIHdyYXBwZXI7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgd3JhcHMgYGZ1bmNgIGFuZCBpbnZva2VzIGl0IHdpdGggdGhlIG9wdGlvbmFsIGB0aGlzYFxuICogYmluZGluZyBvZiBgdGhpc0FyZ2AgYW5kIHRoZSBgcGFydGlhbHNgIHByZXBlbmRlZCB0byB0aG9zZSBwcm92aWRlZCB0b1xuICogdGhlIHdyYXBwZXIuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHBhcnRpYWxseSBhcHBseSBhcmd1bWVudHMgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBvZiBmbGFncy4gU2VlIGBjcmVhdGVXcmFwcGVyYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge0FycmF5fSBwYXJ0aWFscyBUaGUgYXJndW1lbnRzIHRvIHByZXBlbmQgdG8gdGhvc2UgcHJvdmlkZWQgdG8gdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJvdW5kIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVQYXJ0aWFsV3JhcHBlcihmdW5jLCBiaXRtYXNrLCB0aGlzQXJnLCBwYXJ0aWFscykge1xuICB2YXIgaXNCaW5kID0gYml0bWFzayAmIEJJTkRfRkxBRyxcbiAgICAgIEN0b3IgPSBjcmVhdGVDdG9yV3JhcHBlcihmdW5jKTtcblxuICBmdW5jdGlvbiB3cmFwcGVyKCkge1xuICAgIC8vIEF2b2lkIGBhcmd1bWVudHNgIG9iamVjdCB1c2UgZGlzcXVhbGlmeWluZyBvcHRpbWl6YXRpb25zIGJ5XG4gICAgLy8gY29udmVydGluZyBpdCB0byBhbiBhcnJheSBiZWZvcmUgcHJvdmlkaW5nIGl0IGBmdW5jYC5cbiAgICB2YXIgYXJnc0luZGV4ID0gLTEsXG4gICAgICAgIGFyZ3NMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICBsZWZ0SW5kZXggPSAtMSxcbiAgICAgICAgbGVmdExlbmd0aCA9IHBhcnRpYWxzLmxlbmd0aCxcbiAgICAgICAgYXJncyA9IEFycmF5KGFyZ3NMZW5ndGggKyBsZWZ0TGVuZ3RoKTtcblxuICAgIHdoaWxlICgrK2xlZnRJbmRleCA8IGxlZnRMZW5ndGgpIHtcbiAgICAgIGFyZ3NbbGVmdEluZGV4XSA9IHBhcnRpYWxzW2xlZnRJbmRleF07XG4gICAgfVxuICAgIHdoaWxlIChhcmdzTGVuZ3RoLS0pIHtcbiAgICAgIGFyZ3NbbGVmdEluZGV4KytdID0gYXJndW1lbnRzWysrYXJnc0luZGV4XTtcbiAgICB9XG4gICAgdmFyIGZuID0gKHRoaXMgJiYgdGhpcyAhPT0gZ2xvYmFsICYmIHRoaXMgaW5zdGFuY2VvZiB3cmFwcGVyKSA/IEN0b3IgOiBmdW5jO1xuICAgIHJldHVybiBmbi5hcHBseShpc0JpbmQgPyB0aGlzQXJnIDogdGhpcywgYXJncyk7XG4gIH1cbiAgcmV0dXJuIHdyYXBwZXI7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgZWl0aGVyIGN1cnJpZXMgb3IgaW52b2tlcyBgZnVuY2Agd2l0aCBvcHRpb25hbFxuICogYHRoaXNgIGJpbmRpbmcgYW5kIHBhcnRpYWxseSBhcHBsaWVkIGFyZ3VtZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbnxzdHJpbmd9IGZ1bmMgVGhlIGZ1bmN0aW9uIG9yIG1ldGhvZCBuYW1lIHRvIHJlZmVyZW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIG9mIGZsYWdzLlxuICogIFRoZSBiaXRtYXNrIG1heSBiZSBjb21wb3NlZCBvZiB0aGUgZm9sbG93aW5nIGZsYWdzOlxuICogICAgIDEgLSBgXy5iaW5kYFxuICogICAgIDIgLSBgXy5iaW5kS2V5YFxuICogICAgIDQgLSBgXy5jdXJyeWAgb3IgYF8uY3VycnlSaWdodGAgb2YgYSBib3VuZCBmdW5jdGlvblxuICogICAgIDggLSBgXy5jdXJyeWBcbiAqICAgIDE2IC0gYF8uY3VycnlSaWdodGBcbiAqICAgIDMyIC0gYF8ucGFydGlhbGBcbiAqICAgIDY0IC0gYF8ucGFydGlhbFJpZ2h0YFxuICogICAxMjggLSBgXy5yZWFyZ2BcbiAqICAgMjU2IC0gYF8uYXJ5YFxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7QXJyYXl9IFtwYXJ0aWFsc10gVGhlIGFyZ3VtZW50cyB0byBiZSBwYXJ0aWFsbHkgYXBwbGllZC5cbiAqIEBwYXJhbSB7QXJyYXl9IFtob2xkZXJzXSBUaGUgYHBhcnRpYWxzYCBwbGFjZWhvbGRlciBpbmRleGVzLlxuICogQHBhcmFtIHtBcnJheX0gW2FyZ1Bvc10gVGhlIGFyZ3VtZW50IHBvc2l0aW9ucyBvZiB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHBhcmFtIHtudW1iZXJ9IFthcnldIFRoZSBhcml0eSBjYXAgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtudW1iZXJ9IFthcml0eV0gVGhlIGFyaXR5IG9mIGBmdW5jYC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHdyYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVdyYXBwZXIoZnVuYywgYml0bWFzaywgdGhpc0FyZywgcGFydGlhbHMsIGhvbGRlcnMsIGFyZ1BvcywgYXJ5LCBhcml0eSkge1xuICB2YXIgaXNCaW5kS2V5ID0gYml0bWFzayAmIEJJTkRfS0VZX0ZMQUc7XG4gIGlmICghaXNCaW5kS2V5ICYmIHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIGxlbmd0aCA9IHBhcnRpYWxzID8gcGFydGlhbHMubGVuZ3RoIDogMDtcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBiaXRtYXNrICY9IH4oUEFSVElBTF9GTEFHIHwgUEFSVElBTF9SSUdIVF9GTEFHKTtcbiAgICBwYXJ0aWFscyA9IGhvbGRlcnMgPSBudWxsO1xuICB9XG4gIGxlbmd0aCAtPSAoaG9sZGVycyA/IGhvbGRlcnMubGVuZ3RoIDogMCk7XG4gIGlmIChiaXRtYXNrICYgUEFSVElBTF9SSUdIVF9GTEFHKSB7XG4gICAgdmFyIHBhcnRpYWxzUmlnaHQgPSBwYXJ0aWFscyxcbiAgICAgICAgaG9sZGVyc1JpZ2h0ID0gaG9sZGVycztcblxuICAgIHBhcnRpYWxzID0gaG9sZGVycyA9IG51bGw7XG4gIH1cbiAgdmFyIG5ld0RhdGEgPSBbZnVuYywgYml0bWFzaywgdGhpc0FyZywgcGFydGlhbHMsIGhvbGRlcnMsIHBhcnRpYWxzUmlnaHQsIGhvbGRlcnNSaWdodCwgYXJnUG9zLCBhcnksIGFyaXR5XTtcblxuICBuZXdEYXRhWzldID0gYXJpdHkgPT0gbnVsbFxuICAgID8gKGlzQmluZEtleSA/IDAgOiBmdW5jLmxlbmd0aClcbiAgICA6IChuYXRpdmVNYXgoYXJpdHkgLSBsZW5ndGgsIDApIHx8IDApO1xuXG4gIGlmIChiaXRtYXNrID09IEJJTkRfRkxBRykge1xuICAgIHZhciByZXN1bHQgPSBjcmVhdGVCaW5kV3JhcHBlcihuZXdEYXRhWzBdLCBuZXdEYXRhWzJdKTtcbiAgfSBlbHNlIGlmICgoYml0bWFzayA9PSBQQVJUSUFMX0ZMQUcgfHwgYml0bWFzayA9PSAoQklORF9GTEFHIHwgUEFSVElBTF9GTEFHKSkgJiYgIW5ld0RhdGFbNF0ubGVuZ3RoKSB7XG4gICAgcmVzdWx0ID0gY3JlYXRlUGFydGlhbFdyYXBwZXIuYXBwbHkodW5kZWZpbmVkLCBuZXdEYXRhKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSBjcmVhdGVIeWJyaWRXcmFwcGVyLmFwcGx5KHVuZGVmaW5lZCwgbmV3RGF0YSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFsdWUgPSArdmFsdWU7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGg7XG59XG5cbi8qKlxuICogUmVvcmRlciBgYXJyYXlgIGFjY29yZGluZyB0byB0aGUgc3BlY2lmaWVkIGluZGV4ZXMgd2hlcmUgdGhlIGVsZW1lbnQgYXRcbiAqIHRoZSBmaXJzdCBpbmRleCBpcyBhc3NpZ25lZCBhcyB0aGUgZmlyc3QgZWxlbWVudCwgdGhlIGVsZW1lbnQgYXRcbiAqIHRoZSBzZWNvbmQgaW5kZXggaXMgYXNzaWduZWQgYXMgdGhlIHNlY29uZCBlbGVtZW50LCBhbmQgc28gb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byByZW9yZGVyLlxuICogQHBhcmFtIHtBcnJheX0gaW5kZXhlcyBUaGUgYXJyYW5nZWQgYXJyYXkgaW5kZXhlcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiByZW9yZGVyKGFycmF5LCBpbmRleGVzKSB7XG4gIHZhciBhcnJMZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBsZW5ndGggPSBuYXRpdmVNaW4oaW5kZXhlcy5sZW5ndGgsIGFyckxlbmd0aCksXG4gICAgICBvbGRBcnJheSA9IGFycmF5Q29weShhcnJheSk7XG5cbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgdmFyIGluZGV4ID0gaW5kZXhlc1tsZW5ndGhdO1xuICAgIGFycmF5W2xlbmd0aF0gPSBpc0luZGV4KGluZGV4LCBhcnJMZW5ndGgpID8gb2xkQXJyYXlbaW5kZXhdIDogdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgW2xhbmd1YWdlIHR5cGVdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHR5cGUgPT0gJ2Z1bmN0aW9uJyB8fCAoISF2YWx1ZSAmJiB0eXBlID09ICdvYmplY3QnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVXcmFwcGVyO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjcuMCA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBgc291cmNlYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBzb3VyY2UgVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXk9W11dIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyB0by5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheUNvcHkoc291cmNlLCBhcnJheSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHNvdXJjZS5sZW5ndGg7XG5cbiAgYXJyYXkgfHwgKGFycmF5ID0gQXJyYXkobGVuZ3RoKSk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbaW5kZXhdID0gc291cmNlW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlDb3B5O1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjEgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jcmVhdGVgIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXNzaWduaW5nXG4gKiBwcm9wZXJ0aWVzIHRvIHRoZSBjcmVhdGVkIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHByb3RvdHlwZSBUaGUgb2JqZWN0IHRvIGluaGVyaXQgZnJvbS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKi9cbnZhciBiYXNlQ3JlYXRlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBPYmplY3QoKSB7fVxuICByZXR1cm4gZnVuY3Rpb24ocHJvdG90eXBlKSB7XG4gICAgaWYgKGlzT2JqZWN0KHByb3RvdHlwZSkpIHtcbiAgICAgIE9iamVjdC5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG4gICAgICB2YXIgcmVzdWx0ID0gbmV3IE9iamVjdDtcbiAgICAgIE9iamVjdC5wcm90b3R5cGUgPSBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0IHx8IGdsb2JhbC5PYmplY3QoKTtcbiAgfTtcbn0oKSk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlIFtsYW5ndWFnZSB0eXBlXShodHRwczovL2VzNS5naXRodWIuaW8vI3g4KSBvZiBgT2JqZWN0YC5cbiAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAvLyBBdm9pZCBhIFY4IEpJVCBidWcgaW4gQ2hyb21lIDE5LTIwLlxuICAvLyBTZWUgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIyOTEgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB0eXBlID09ICdmdW5jdGlvbicgfHwgKCEhdmFsdWUgJiYgdHlwZSA9PSAnb2JqZWN0Jyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNyZWF0ZTtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4wIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS43LjAgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKiBVc2VkIGFzIHRoZSBpbnRlcm5hbCBhcmd1bWVudCBwbGFjZWhvbGRlci4gKi9cbnZhciBQTEFDRUhPTERFUiA9ICdfX2xvZGFzaF9wbGFjZWhvbGRlcl9fJztcblxuLyoqXG4gKiBSZXBsYWNlcyBhbGwgYHBsYWNlaG9sZGVyYCBlbGVtZW50cyBpbiBgYXJyYXlgIHdpdGggYW4gaW50ZXJuYWwgcGxhY2Vob2xkZXJcbiAqIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIHRoZWlyIGluZGV4ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0geyp9IHBsYWNlaG9sZGVyIFRoZSBwbGFjZWhvbGRlciB0byByZXBsYWNlLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgb2YgcGxhY2Vob2xkZXIgaW5kZXhlcy5cbiAqL1xuZnVuY3Rpb24gcmVwbGFjZUhvbGRlcnMoYXJyYXksIHBsYWNlaG9sZGVyKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzSW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKGFycmF5W2luZGV4XSA9PT0gcGxhY2Vob2xkZXIpIHtcbiAgICAgIGFycmF5W2luZGV4XSA9IFBMQUNFSE9MREVSO1xuICAgICAgcmVzdWx0WysrcmVzSW5kZXhdID0gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVwbGFjZUhvbGRlcnM7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjYuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGVcbiAqIGNyZWF0ZWQgZnVuY3Rpb24gYW5kIGFyZ3VtZW50cyBmcm9tIGBzdGFydGAgYW5kIGJleW9uZCBwcm92aWRlZCBhcyBhbiBhcnJheS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgYmFzZWQgb24gdGhlIFtyZXN0IHBhcmFtZXRlcl0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvRnVuY3Rpb25zL3Jlc3RfcGFyYW1ldGVycykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgc2F5ID0gXy5yZXN0UGFyYW0oZnVuY3Rpb24od2hhdCwgbmFtZXMpIHtcbiAqICAgcmV0dXJuIHdoYXQgKyAnICcgKyBfLmluaXRpYWwobmFtZXMpLmpvaW4oJywgJykgK1xuICogICAgIChfLnNpemUobmFtZXMpID4gMSA/ICcsICYgJyA6ICcnKSArIF8ubGFzdChuYW1lcyk7XG4gKiB9KTtcbiAqXG4gKiBzYXkoJ2hlbGxvJywgJ2ZyZWQnLCAnYmFybmV5JywgJ3BlYmJsZXMnKTtcbiAqIC8vID0+ICdoZWxsbyBmcmVkLCBiYXJuZXksICYgcGViYmxlcydcbiAqL1xuZnVuY3Rpb24gcmVzdFBhcmFtKGZ1bmMsIHN0YXJ0KSB7XG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHN0YXJ0ID0gbmF0aXZlTWF4KHR5cGVvZiBzdGFydCA9PSAndW5kZWZpbmVkJyA/IChmdW5jLmxlbmd0aCAtIDEpIDogKCtzdGFydCB8fCAwKSwgMCk7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuICAgICAgICByZXN0ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICByZXN0W2luZGV4XSA9IGFyZ3Nbc3RhcnQgKyBpbmRleF07XG4gICAgfVxuICAgIHN3aXRjaCAoc3RhcnQpIHtcbiAgICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCByZXN0KTtcbiAgICAgIGNhc2UgMTogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCBhcmdzWzBdLCByZXN0KTtcbiAgICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCBhcmdzWzBdLCBhcmdzWzFdLCByZXN0KTtcbiAgICB9XG4gICAgdmFyIG90aGVyQXJncyA9IEFycmF5KHN0YXJ0ICsgMSk7XG4gICAgaW5kZXggPSAtMTtcbiAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG4gICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG4gICAgfVxuICAgIG90aGVyQXJnc1tzdGFydF0gPSByZXN0O1xuICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIG90aGVyQXJncyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVzdFBhcmFtO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjIgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBhcnJheUVhY2ggPSByZXF1aXJlKCdsb2Rhc2guX2FycmF5ZWFjaCcpLFxuICAgIGJhc2VFYWNoID0gcmVxdWlyZSgnbG9kYXNoLl9iYXNlZWFjaCcpLFxuICAgIGJpbmRDYWxsYmFjayA9IHJlcXVpcmUoJ2xvZGFzaC5fYmluZGNhbGxiYWNrJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJ2xvZGFzaC5pc2FycmF5Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIGZvciBgXy5mb3JFYWNoYCBvciBgXy5mb3JFYWNoUmlnaHRgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBhcnJheUZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGl0ZXJhdGUgb3ZlciBhbiBhcnJheS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVhY2hGdW5jIFRoZSBmdW5jdGlvbiB0byBpdGVyYXRlIG92ZXIgYSBjb2xsZWN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZWFjaCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlRm9yRWFjaChhcnJheUZ1bmMsIGVhY2hGdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBpdGVyYXRlZSwgdGhpc0FyZykge1xuICAgIHJldHVybiAodHlwZW9mIGl0ZXJhdGVlID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHRoaXNBcmcgPT0gJ3VuZGVmaW5lZCcgJiYgaXNBcnJheShjb2xsZWN0aW9uKSlcbiAgICAgID8gYXJyYXlGdW5jKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKVxuICAgICAgOiBlYWNoRnVuYyhjb2xsZWN0aW9uLCBiaW5kQ2FsbGJhY2soaXRlcmF0ZWUsIHRoaXNBcmcsIDMpKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGBjb2xsZWN0aW9uYCBpbnZva2luZyBgaXRlcmF0ZWVgIGZvciBlYWNoIGVsZW1lbnQuXG4gKiBUaGUgYGl0ZXJhdGVlYCBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6XG4gKiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuIEl0ZXJhdG9yIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHlcbiAqIGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogKipOb3RlOioqIEFzIHdpdGggb3RoZXIgXCJDb2xsZWN0aW9uc1wiIG1ldGhvZHMsIG9iamVjdHMgd2l0aCBhIGBsZW5ndGhgIHByb3BlcnR5XG4gKiBhcmUgaXRlcmF0ZWQgbGlrZSBhcnJheXMuIFRvIGF2b2lkIHRoaXMgYmVoYXZpb3IgYF8uZm9ySW5gIG9yIGBfLmZvck93bmBcbiAqIG1heSBiZSB1c2VkIGZvciBvYmplY3QgaXRlcmF0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAYWxpYXMgZWFjaFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgaXRlcmF0ZWVgLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdHxzdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfKFsxLCAyXSkuZm9yRWFjaChmdW5jdGlvbihuKSB7XG4gKiAgIGNvbnNvbGUubG9nKG4pO1xuICogfSkudmFsdWUoKTtcbiAqIC8vID0+IGxvZ3MgZWFjaCB2YWx1ZSBmcm9tIGxlZnQgdG8gcmlnaHQgYW5kIHJldHVybnMgdGhlIGFycmF5XG4gKlxuICogXy5mb3JFYWNoKHsgJ2EnOiAxLCAnYic6IDIgfSwgZnVuY3Rpb24obiwga2V5KSB7XG4gKiAgIGNvbnNvbGUubG9nKG4sIGtleSk7XG4gKiB9KTtcbiAqIC8vID0+IGxvZ3MgZWFjaCB2YWx1ZS1rZXkgcGFpciBhbmQgcmV0dXJucyB0aGUgb2JqZWN0IChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKi9cbnZhciBmb3JFYWNoID0gY3JlYXRlRm9yRWFjaChhcnJheUVhY2gsIGJhc2VFYWNoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmb3JFYWNoO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjcuMCA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZm9yRWFjaGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrXG4gKiBzaG9ydGhhbmRzIG9yIGB0aGlzYCBiaW5kaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheUVhY2goYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKGl0ZXJhdGVlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSA9PT0gZmFsc2UpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlFYWNoO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjIgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBrZXlzID0gcmVxdWlyZSgnbG9kYXNoLmtleXMnKTtcblxuLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JFYWNoYCB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrXG4gKiBzaG9ydGhhbmRzIGFuZCBgdGhpc2AgYmluZGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fHN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKi9cbnZhciBiYXNlRWFjaCA9IGNyZWF0ZUJhc2VFYWNoKGJhc2VGb3JPd24pO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBiYXNlRm9ySW5gIGFuZCBgYmFzZUZvck93bmAgd2hpY2ggaXRlcmF0ZXNcbiAqIG92ZXIgYG9iamVjdGAgcHJvcGVydGllcyByZXR1cm5lZCBieSBga2V5c0Z1bmNgIGludm9raW5nIGBpdGVyYXRlZWAgZm9yXG4gKiBlYWNoIHByb3BlcnR5LiBJdGVyYXRvciBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHlcbiAqIHJldHVybmluZyBgZmFsc2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG52YXIgYmFzZUZvciA9IGNyZWF0ZUJhc2VGb3IoKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JPd25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgY2FsbGJhY2tcbiAqIHNob3J0aGFuZHMgYW5kIGB0aGlzYCBiaW5kaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGb3JPd24ob2JqZWN0LCBpdGVyYXRlZSkge1xuICByZXR1cm4gYmFzZUZvcihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgYGJhc2VFYWNoYCBvciBgYmFzZUVhY2hSaWdodGAgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVhY2hGdW5jIFRoZSBmdW5jdGlvbiB0byBpdGVyYXRlIG92ZXIgYSBjb2xsZWN0aW9uLlxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRWFjaChlYWNoRnVuYywgZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICAgIHZhciBsZW5ndGggPSBjb2xsZWN0aW9uID8gY29sbGVjdGlvbi5sZW5ndGggOiAwO1xuICAgIGlmICghaXNMZW5ndGgobGVuZ3RoKSkge1xuICAgICAgcmV0dXJuIGVhY2hGdW5jKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKTtcbiAgICB9XG4gICAgdmFyIGluZGV4ID0gZnJvbVJpZ2h0ID8gbGVuZ3RoIDogLTEsXG4gICAgICAgIGl0ZXJhYmxlID0gdG9PYmplY3QoY29sbGVjdGlvbik7XG5cbiAgICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2luZGV4XSwgaW5kZXgsIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICB9O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBiYXNlIGZ1bmN0aW9uIGZvciBgXy5mb3JJbmAgb3IgYF8uZm9ySW5SaWdodGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUZvcihmcm9tUmlnaHQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCwgaXRlcmF0ZWUsIGtleXNGdW5jKSB7XG4gICAgdmFyIGl0ZXJhYmxlID0gdG9PYmplY3Qob2JqZWN0KSxcbiAgICAgICAgcHJvcHMgPSBrZXlzRnVuYyhvYmplY3QpLFxuICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGgsXG4gICAgICAgIGluZGV4ID0gZnJvbVJpZ2h0ID8gbGVuZ3RoIDogLTE7XG5cbiAgICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuICAgICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtrZXldLCBrZXksIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyBiYXNlZCBvbiBbYFRvTGVuZ3RoYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGFuIG9iamVjdCBpZiBpdCBpcyBub3Qgb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgb2JqZWN0LlxuICovXG5mdW5jdGlvbiB0b09iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3QodmFsdWUpID8gdmFsdWUgOiBPYmplY3QodmFsdWUpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdHlwZSA9PSAnZnVuY3Rpb24nIHx8ICghIXZhbHVlICYmIHR5cGUgPT0gJ29iamVjdCcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VFYWNoO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjEgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkgPiA1KS4gKi9cbnZhciByZUhvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgIFtzcGVjaWFsIGNoYXJhY3RlcnNdKGh0dHA6Ly93d3cucmVndWxhci1leHByZXNzaW9ucy5pbmZvL2NoYXJhY3RlcnMuaHRtbCNzcGVjaWFsKS5cbiAqIEluIGFkZGl0aW9uIHRvIHNwZWNpYWwgY2hhcmFjdGVycyB0aGUgZm9yd2FyZCBzbGFzaCBpcyBlc2NhcGVkIHRvIGFsbG93IGZvclxuICogZWFzaWVyIGBldmFsYCB1c2UgYW5kIGBGdW5jdGlvbmAgY29tcGlsYXRpb24uXG4gKi9cbnZhciByZVJlZ0V4cENoYXJzID0gL1suKis/XiR7fSgpfFtcXF1cXC9cXFxcXS9nLFxuICAgIHJlSGFzUmVnRXhwQ2hhcnMgPSBSZWdFeHAocmVSZWdFeHBDaGFycy5zb3VyY2UpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgaWYgaXQgaXMgbm90IG9uZS4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkXG4gKiBmb3IgYG51bGxgIG9yIGB1bmRlZmluZWRgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6ICh2YWx1ZSArICcnKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZuVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGVzY2FwZVJlZ0V4cChvYmpUb1N0cmluZylcbiAgLnJlcGxhY2UoL3RvU3RyaW5nfChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUlzQXJyYXkgPSBpc05hdGl2ZShuYXRpdmVJc0FycmF5ID0gQXJyYXkuaXNBcnJheSkgJiYgbmF0aXZlSXNBcnJheTtcblxuLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmIG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IGFycmF5VGFnO1xufTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc05hdGl2ZShBcnJheS5wcm90b3R5cGUucHVzaCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc05hdGl2ZShfKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBmdW5jVGFnKSB7XG4gICAgcmV0dXJuIHJlTmF0aXZlLnRlc3QoZm5Ub1N0cmluZy5jYWxsKHZhbHVlKSk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgcmVIb3N0Q3Rvci50ZXN0KHZhbHVlKTtcbn1cblxuLyoqXG4gKiBFc2NhcGVzIHRoZSBgUmVnRXhwYCBzcGVjaWFsIGNoYXJhY3RlcnMgXCJcXFwiLCBcIi9cIiwgXCJeXCIsIFwiJFwiLCBcIi5cIiwgXCJ8XCIsIFwiP1wiLFxuICogXCIqXCIsIFwiK1wiLCBcIihcIiwgXCIpXCIsIFwiW1wiLCBcIl1cIiwgXCJ7XCIgYW5kIFwifVwiIGluIGBzdHJpbmdgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBlc2NhcGUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5lc2NhcGVSZWdFeHAoJ1tsb2Rhc2hdKGh0dHBzOi8vbG9kYXNoLmNvbS8pJyk7XG4gKiAvLyA9PiAnXFxbbG9kYXNoXFxdXFwoaHR0cHM6XFwvXFwvbG9kYXNoXFwuY29tXFwvXFwpJ1xuICovXG5mdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyaW5nKSB7XG4gIHN0cmluZyA9IGJhc2VUb1N0cmluZyhzdHJpbmcpO1xuICByZXR1cm4gKHN0cmluZyAmJiByZUhhc1JlZ0V4cENoYXJzLnRlc3Qoc3RyaW5nKSlcbiAgICA/IHN0cmluZy5yZXBsYWNlKHJlUmVnRXhwQ2hhcnMsICdcXFxcJCYnKVxuICAgIDogc3RyaW5nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXk7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnbG9kYXNoLmlzYXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJ2xvZGFzaC5pc2FycmF5JyksXG4gICAgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJ2xvZGFzaC5pc2Z1bmN0aW9uJyksXG4gICAgaXNTdHJpbmcgPSByZXF1aXJlKCdsb2Rhc2guaXNzdHJpbmcnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnbG9kYXNoLmtleXMnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIFVzZWQgYXMgdGhlIFttYXhpbXVtIGxlbmd0aF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW51bWJlci5tYXhfc2FmZV9pbnRlZ2VyKVxuICogb2YgYW4gYXJyYXktbGlrZSB2YWx1ZS5cbiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgYmFzZWQgb24gW2BUb0xlbmd0aGBdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgZW1wdHkuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBlbXB0eSB1bmxlc3MgaXQgaXMgYW5cbiAqIGBhcmd1bWVudHNgIG9iamVjdCwgYXJyYXksIHN0cmluZywgb3IgalF1ZXJ5LWxpa2UgY29sbGVjdGlvbiB3aXRoIGEgbGVuZ3RoXG4gKiBncmVhdGVyIHRoYW4gYDBgIG9yIGFuIG9iamVjdCB3aXRoIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZW1wdHksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0VtcHR5KG51bGwpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNFbXB0eSh0cnVlKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRW1wdHkoMSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0VtcHR5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNFbXB0eSh7ICdhJzogMSB9KTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICBpZiAoaXNMZW5ndGgobGVuZ3RoKSAmJiAoaXNBcnJheSh2YWx1ZSkgfHwgaXNTdHJpbmcodmFsdWUpIHx8IGlzQXJndW1lbnRzKHZhbHVlKSB8fFxuICAgICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNGdW5jdGlvbih2YWx1ZS5zcGxpY2UpKSkpIHtcbiAgICByZXR1cm4gIWxlbmd0aDtcbiAgfVxuICByZXR1cm4gIWtleXModmFsdWUpLmxlbmd0aDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0VtcHR5O1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjEgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtbnVtYmVyLm1heF9zYWZlX2ludGVnZXIpXG4gKiBvZiBhbiBhcnJheS1saWtlIHZhbHVlLlxuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyBiYXNlZCBvbiBbYFRvTGVuZ3RoYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuICB2YXIgbGVuZ3RoID0gaXNPYmplY3RMaWtlKHZhbHVlKSA/IHZhbHVlLmxlbmd0aCA6IHVuZGVmaW5lZDtcbiAgcmV0dXJuIGlzTGVuZ3RoKGxlbmd0aCkgJiYgb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FyZ3VtZW50cztcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4yIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkgPiA1KS4gKi9cbnZhciByZUhvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgIFtzcGVjaWFsIGNoYXJhY3RlcnNdKGh0dHA6Ly93d3cucmVndWxhci1leHByZXNzaW9ucy5pbmZvL2NoYXJhY3RlcnMuaHRtbCNzcGVjaWFsKS5cbiAqIEluIGFkZGl0aW9uIHRvIHNwZWNpYWwgY2hhcmFjdGVycyB0aGUgZm9yd2FyZCBzbGFzaCBpcyBlc2NhcGVkIHRvIGFsbG93IGZvclxuICogZWFzaWVyIGBldmFsYCB1c2UgYW5kIGBGdW5jdGlvbmAgY29tcGlsYXRpb24uXG4gKi9cbnZhciByZVJlZ0V4cENoYXJzID0gL1suKis/XiR7fSgpfFtcXF1cXC9cXFxcXS9nLFxuICAgIHJlSGFzUmVnRXhwQ2hhcnMgPSBSZWdFeHAocmVSZWdFeHBDaGFycy5zb3VyY2UpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzRnVuY3Rpb25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgZW52aXJvbm1lbnRzXG4gKiB3aXRoIGluY29ycmVjdCBgdHlwZW9mYCByZXN1bHRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgQ2hha3JhIEpJVCBidWcgaW4gY29tcGF0aWJpbGl0eSBtb2RlcyBvZiBJRSAxMS5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNoa2VuYXMvdW5kZXJzY29yZS9pc3N1ZXMvMTYyMSBmb3IgbW9yZSBkZXRhaWxzLlxuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicgfHwgZmFsc2U7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyBpZiBpdCBpcyBub3Qgb25lLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWRcbiAqIGZvciBgbnVsbGAgb3IgYHVuZGVmaW5lZGAgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlVG9TdHJpbmcodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogKHZhbHVlICsgJycpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZm5Ub1N0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZXNjYXBlUmVnRXhwKG9ialRvU3RyaW5nKVxuICAucmVwbGFjZSgvdG9TdHJpbmd8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgVWludDhBcnJheSA9IGlzTmF0aXZlKFVpbnQ4QXJyYXkgPSBnbG9iYWwuVWludDhBcnJheSkgJiYgVWludDhBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzRnVuY3Rpb24gPSAhKGJhc2VJc0Z1bmN0aW9uKC94LykgfHwgKFVpbnQ4QXJyYXkgJiYgIWJhc2VJc0Z1bmN0aW9uKFVpbnQ4QXJyYXkpKSkgPyBiYXNlSXNGdW5jdGlvbiA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaSB3aGljaCByZXR1cm4gJ2Z1bmN0aW9uJyBmb3IgcmVnZXhlc1xuICAvLyBhbmQgU2FmYXJpIDggZXF1aXZhbGVudHMgd2hpY2ggcmV0dXJuICdvYmplY3QnIGZvciB0eXBlZCBhcnJheSBjb25zdHJ1Y3RvcnMuXG4gIHJldHVybiBvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBmdW5jVGFnO1xufTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc05hdGl2ZShBcnJheS5wcm90b3R5cGUucHVzaCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc05hdGl2ZShfKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBmdW5jVGFnKSB7XG4gICAgcmV0dXJuIHJlTmF0aXZlLnRlc3QoZm5Ub1N0cmluZy5jYWxsKHZhbHVlKSk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgcmVIb3N0Q3Rvci50ZXN0KHZhbHVlKTtcbn1cblxuLyoqXG4gKiBFc2NhcGVzIHRoZSBgUmVnRXhwYCBzcGVjaWFsIGNoYXJhY3RlcnMgXCJcXFwiLCBcIi9cIiwgXCJeXCIsIFwiJFwiLCBcIi5cIiwgXCJ8XCIsIFwiP1wiLFxuICogXCIqXCIsIFwiK1wiLCBcIihcIiwgXCIpXCIsIFwiW1wiLCBcIl1cIiwgXCJ7XCIgYW5kIFwifVwiIGluIGBzdHJpbmdgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBlc2NhcGUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5lc2NhcGVSZWdFeHAoJ1tsb2Rhc2hdKGh0dHBzOi8vbG9kYXNoLmNvbS8pJyk7XG4gKiAvLyA9PiAnXFxbbG9kYXNoXFxdXFwoaHR0cHM6XFwvXFwvbG9kYXNoXFwuY29tXFwvXFwpJ1xuICovXG5mdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyaW5nKSB7XG4gIHN0cmluZyA9IGJhc2VUb1N0cmluZyhzdHJpbmcpO1xuICByZXR1cm4gKHN0cmluZyAmJiByZUhhc1JlZ0V4cENoYXJzLnRlc3Qoc3RyaW5nKSlcbiAgICA/IHN0cmluZy5yZXBsYWNlKHJlUmVnRXhwQ2hhcnMsICdcXFxcJCYnKVxuICAgIDogc3RyaW5nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb247XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3RyaW5nYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3RyaW5nKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3RyaW5nKDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzdHJpbmdUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3RyaW5nO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjUgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJ2xvZGFzaC5pc2FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCdsb2Rhc2guaXNhcnJheScpLFxuICAgIGlzTmF0aXZlID0gcmVxdWlyZSgnbG9kYXNoLmlzbmF0aXZlJyk7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlS2V5cyA9IGlzTmF0aXZlKG5hdGl2ZUtleXMgPSBPYmplY3Qua2V5cykgJiYgbmF0aXZlS2V5cztcblxuLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuLyoqXG4gKiBBbiBvYmplY3QgZW52aXJvbm1lbnQgZmVhdHVyZSBmbGFncy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHR5cGUgT2JqZWN0XG4gKi9cbnZhciBzdXBwb3J0ID0ge307XG5cbihmdW5jdGlvbih4KSB7XG5cbiAgLyoqXG4gICAqIERldGVjdCBpZiBgYXJndW1lbnRzYCBvYmplY3QgaW5kZXhlcyBhcmUgbm9uLWVudW1lcmFibGUuXG4gICAqXG4gICAqIEluIEZpcmVmb3ggPCA0LCBJRSA8IDksIFBoYW50b21KUywgYW5kIFNhZmFyaSA8IDUuMSBgYXJndW1lbnRzYCBvYmplY3RcbiAgICogaW5kZXhlcyBhcmUgbm9uLWVudW1lcmFibGUuIENocm9tZSA8IDI1IGFuZCBOb2RlLmpzIDwgMC4xMS4wIHRyZWF0XG4gICAqIGBhcmd1bWVudHNgIG9iamVjdCBpbmRleGVzIGFzIG5vbi1lbnVtZXJhYmxlIGFuZCBmYWlsIGBoYXNPd25Qcm9wZXJ0eWBcbiAgICogY2hlY2tzIGZvciBpbmRleGVzIHRoYXQgZXhjZWVkIHRoZWlyIGZ1bmN0aW9uJ3MgZm9ybWFsIHBhcmFtZXRlcnMgd2l0aFxuICAgKiBhc3NvY2lhdGVkIHZhbHVlcyBvZiBgMGAuXG4gICAqXG4gICAqIEBtZW1iZXJPZiBfLnN1cHBvcnRcbiAgICogQHR5cGUgYm9vbGVhblxuICAgKi9cbiAgdHJ5IHtcbiAgICBzdXBwb3J0Lm5vbkVudW1BcmdzID0gIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgfSBjYXRjaChlKSB7XG4gICAgc3VwcG9ydC5ub25FbnVtQXJncyA9IHRydWU7XG4gIH1cbn0oMCwgMCkpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICB2YWx1ZSA9ICt2YWx1ZTtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuICByZXR1cm4gdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIEEgZmFsbGJhY2sgaW1wbGVtZW50YXRpb24gb2YgYE9iamVjdC5rZXlzYCB3aGljaCBjcmVhdGVzIGFuIGFycmF5IG9mIHRoZVxuICogb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gc2hpbUtleXMob2JqZWN0KSB7XG4gIHZhciBwcm9wcyA9IGtleXNJbihvYmplY3QpLFxuICAgICAgcHJvcHNMZW5ndGggPSBwcm9wcy5sZW5ndGgsXG4gICAgICBsZW5ndGggPSBwcm9wc0xlbmd0aCAmJiBvYmplY3QubGVuZ3RoO1xuXG4gIHZhciBhbGxvd0luZGV4ZXMgPSBsZW5ndGggJiYgaXNMZW5ndGgobGVuZ3RoKSAmJlxuICAgIChpc0FycmF5KG9iamVjdCkgfHwgKHN1cHBvcnQubm9uRW51bUFyZ3MgJiYgaXNBcmd1bWVudHMob2JqZWN0KSkpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBwcm9wc0xlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgaWYgKChhbGxvd0luZGV4ZXMgJiYgaXNJbmRleChrZXksIGxlbmd0aCkpIHx8IGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdHlwZSA9PSAnZnVuY3Rpb24nIHx8ICghIXZhbHVlICYmIHR5cGUgPT0gJ29iamVjdCcpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG52YXIga2V5cyA9ICFuYXRpdmVLZXlzID8gc2hpbUtleXMgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdCkge1xuICAgIHZhciBDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yLFxuICAgICAgICBsZW5ndGggPSBvYmplY3QubGVuZ3RoO1xuICB9XG4gIGlmICgodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSA9PT0gb2JqZWN0KSB8fFxuICAgICAgKHR5cGVvZiBvYmplY3QgIT0gJ2Z1bmN0aW9uJyAmJiAobGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkpKSkge1xuICAgIHJldHVybiBzaGltS2V5cyhvYmplY3QpO1xuICB9XG4gIHJldHVybiBpc09iamVjdChvYmplY3QpID8gbmF0aXZlS2V5cyhvYmplY3QpIDogW107XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzSW4obmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYicsICdjJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqL1xuZnVuY3Rpb24ga2V5c0luKG9iamVjdCkge1xuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gIH1cbiAgdmFyIGxlbmd0aCA9IG9iamVjdC5sZW5ndGg7XG4gIGxlbmd0aCA9IChsZW5ndGggJiYgaXNMZW5ndGgobGVuZ3RoKSAmJlxuICAgIChpc0FycmF5KG9iamVjdCkgfHwgKHN1cHBvcnQubm9uRW51bUFyZ3MgJiYgaXNBcmd1bWVudHMob2JqZWN0KSkpICYmIGxlbmd0aCkgfHwgMDtcblxuICB2YXIgQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcixcbiAgICAgIGluZGV4ID0gLTEsXG4gICAgICBpc1Byb3RvID0gdHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSA9PT0gb2JqZWN0LFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKSxcbiAgICAgIHNraXBJbmRleGVzID0gbGVuZ3RoID4gMDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSAoaW5kZXggKyAnJyk7XG4gIH1cbiAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgIGlmICghKHNraXBJbmRleGVzICYmIGlzSW5kZXgoa2V5LCBsZW5ndGgpKSAmJlxuICAgICAgICAhKGtleSA9PSAnY29uc3RydWN0b3InICYmIChpc1Byb3RvIHx8ICFoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXM7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpID4gNSkuICovXG52YXIgcmVIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYCBbc3BlY2lhbCBjaGFyYWN0ZXJzXShodHRwOi8vd3d3LnJlZ3VsYXItZXhwcmVzc2lvbnMuaW5mby9jaGFyYWN0ZXJzLmh0bWwjc3BlY2lhbCkuXG4gKiBJbiBhZGRpdGlvbiB0byBzcGVjaWFsIGNoYXJhY3RlcnMgdGhlIGZvcndhcmQgc2xhc2ggaXMgZXNjYXBlZCB0byBhbGxvdyBmb3JcbiAqIGVhc2llciBgZXZhbGAgdXNlIGFuZCBgRnVuY3Rpb25gIGNvbXBpbGF0aW9uLlxuICovXG52YXIgcmVSZWdFeHBDaGFycyA9IC9bLiorP14ke30oKXxbXFxdXFwvXFxcXF0vZyxcbiAgICByZUhhc1JlZ0V4cENoYXJzID0gUmVnRXhwKHJlUmVnRXhwQ2hhcnMuc291cmNlKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIGlmIGl0IGlzIG5vdCBvbmUuIEFuIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZFxuICogZm9yIGBudWxsYCBvciBgdW5kZWZpbmVkYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUb1N0cmluZyh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiAodmFsdWUgKyAnJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmblRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZU5hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBlc2NhcGVSZWdFeHAob2JqVG9TdHJpbmcpXG4gIC5yZXBsYWNlKC90b1N0cmluZ3woZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc05hdGl2ZShBcnJheS5wcm90b3R5cGUucHVzaCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc05hdGl2ZShfKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBmdW5jVGFnKSB7XG4gICAgcmV0dXJuIHJlTmF0aXZlLnRlc3QoZm5Ub1N0cmluZy5jYWxsKHZhbHVlKSk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgcmVIb3N0Q3Rvci50ZXN0KHZhbHVlKTtcbn1cblxuLyoqXG4gKiBFc2NhcGVzIHRoZSBgUmVnRXhwYCBzcGVjaWFsIGNoYXJhY3RlcnMgXCJcXFwiLCBcIi9cIiwgXCJeXCIsIFwiJFwiLCBcIi5cIiwgXCJ8XCIsIFwiP1wiLFxuICogXCIqXCIsIFwiK1wiLCBcIihcIiwgXCIpXCIsIFwiW1wiLCBcIl1cIiwgXCJ7XCIgYW5kIFwifVwiIGluIGBzdHJpbmdgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBlc2NhcGUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5lc2NhcGVSZWdFeHAoJ1tsb2Rhc2hdKGh0dHBzOi8vbG9kYXNoLmNvbS8pJyk7XG4gKiAvLyA9PiAnXFxbbG9kYXNoXFxdXFwoaHR0cHM6XFwvXFwvbG9kYXNoXFwuY29tXFwvXFwpJ1xuICovXG5mdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyaW5nKSB7XG4gIHN0cmluZyA9IGJhc2VUb1N0cmluZyhzdHJpbmcpO1xuICByZXR1cm4gKHN0cmluZyAmJiByZUhhc1JlZ0V4cENoYXJzLnRlc3Qoc3RyaW5nKSlcbiAgICA/IHN0cmluZy5yZXBsYWNlKHJlUmVnRXhwQ2hhcnMsICdcXFxcJCYnKVxuICAgIDogc3RyaW5nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTmF0aXZlO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjcuMCA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBiZWZvcmUgPSByZXF1aXJlKCdsb2Rhc2guYmVmb3JlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaXMgcmVzdHJpY3RlZCB0byBpbnZva2luZyBgZnVuY2Agb25jZS4gUmVwZWF0IGNhbGxzXG4gKiB0byB0aGUgZnVuY3Rpb24gcmV0dXJuIHRoZSB2YWx1ZSBvZiB0aGUgZmlyc3QgY2FsbC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkXG4gKiB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGUgY3JlYXRlZCBmdW5jdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHR5cGUgRnVuY3Rpb25cbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcmVzdHJpY3QuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyByZXN0cmljdGVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgaW5pdGlhbGl6ZSA9IF8ub25jZShjcmVhdGVBcHBsaWNhdGlvbik7XG4gKiBpbml0aWFsaXplKCk7XG4gKiBpbml0aWFsaXplKCk7XG4gKiAvLyBgaW5pdGlhbGl6ZWAgaW52b2tlcyBgY3JlYXRlQXBwbGljYXRpb25gIG9uY2VcbiAqL1xuZnVuY3Rpb24gb25jZShmdW5jKSB7XG4gIHJldHVybiBiZWZvcmUoZnVuYywgMik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb25jZTtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4xIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS43LjAgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgLCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBhbmQgYXJndW1lbnRzXG4gKiBvZiB0aGUgY3JlYXRlZCBmdW5jdGlvbiwgd2hpbGUgaXQgaXMgY2FsbGVkIGxlc3MgdGhhbiBgbmAgdGltZXMuIFN1YnNlcXVlbnRcbiAqIGNhbGxzIHRvIHRoZSBjcmVhdGVkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYCBpbnZvY2F0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgY2FsbHMgYXQgd2hpY2ggYGZ1bmNgIGlzIG5vIGxvbmdlciBpbnZva2VkLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcmVzdHJpY3QuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyByZXN0cmljdGVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiBqUXVlcnkoJyNhZGQnKS5vbignY2xpY2snLCBfLmJlZm9yZSg1LCBhZGRDb250YWN0VG9MaXN0KSk7XG4gKiAvLyA9PiBhbGxvd3MgYWRkaW5nIHVwIHRvIDQgY29udGFjdHMgdG8gdGhlIGxpc3RcbiAqL1xuZnVuY3Rpb24gYmVmb3JlKG4sIGZ1bmMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICBpZiAodHlwZW9mIG4gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIHRlbXAgPSBuO1xuICAgICAgbiA9IGZ1bmM7XG4gICAgICBmdW5jID0gdGVtcDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgaWYgKC0tbiA+IDApIHtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnVuYyA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmVmb3JlO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjcuMCA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBiYXNlVG9TdHJpbmcgPSByZXF1aXJlKCdsb2Rhc2guX2Jhc2V0b3N0cmluZycpO1xuXG4vKiogVXNlZCB0byBnZW5lcmF0ZSB1bmlxdWUgSURzLiAqL1xudmFyIGlkQ291bnRlciA9IDA7XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgdW5pcXVlIElELiBJZiBgcHJlZml4YCBpcyBwcm92aWRlZCB0aGUgSUQgaXMgYXBwZW5kZWQgdG8gaXQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsaXR5XG4gKiBAcGFyYW0ge3N0cmluZ30gW3ByZWZpeF0gVGhlIHZhbHVlIHRvIHByZWZpeCB0aGUgSUQgd2l0aC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHVuaXF1ZSBJRC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy51bmlxdWVJZCgnY29udGFjdF8nKTtcbiAqIC8vID0+ICdjb250YWN0XzEwNCdcbiAqXG4gKiBfLnVuaXF1ZUlkKCk7XG4gKiAvLyA9PiAnMTA1J1xuICovXG5mdW5jdGlvbiB1bmlxdWVJZChwcmVmaXgpIHtcbiAgdmFyIGlkID0gKytpZENvdW50ZXI7XG4gIHJldHVybiBiYXNlVG9TdHJpbmcocHJlZml4KSArIGlkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHVuaXF1ZUlkO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjcuMCA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIGlmIGl0IGlzIG5vdCBvbmUuIEFuIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZFxuICogZm9yIGBudWxsYCBvciBgdW5kZWZpbmVkYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUb1N0cmluZyh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiAodmFsdWUgKyAnJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRvU3RyaW5nO1xuIiwiO2lmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7ICB3aW5kb3cuYW1wZXJzYW5kID0gd2luZG93LmFtcGVyc2FuZCB8fCB7fTsgIHdpbmRvdy5hbXBlcnNhbmRbXCJhbXBlcnNhbmQtdmlld1wiXSA9IHdpbmRvdy5hbXBlcnNhbmRbXCJhbXBlcnNhbmQtdmlld1wiXSB8fCBbXTsgIHdpbmRvdy5hbXBlcnNhbmRbXCJhbXBlcnNhbmQtdmlld1wiXS5wdXNoKFwiNy4zLjBcIik7fVxudmFyIFN0YXRlID0gcmVxdWlyZSgnYW1wZXJzYW5kLXN0YXRlJyk7XG52YXIgQ29sbGVjdGlvblZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtY29sbGVjdGlvbi12aWV3Jyk7XG52YXIgZG9taWZ5ID0gcmVxdWlyZSgnZG9taWZ5Jyk7XG52YXIgdW5pcXVlSWQgPSByZXF1aXJlKFwibG9kYXNoLnVuaXF1ZWlkXCIpO1xudmFyIHBpY2sgPSByZXF1aXJlKFwibG9kYXNoLnBpY2tcIik7XG52YXIgYXNzaWduID0gcmVxdWlyZShcImxvZGFzaC5hc3NpZ25cIik7XG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoXCJsb2Rhc2guZm9yZWFjaFwiKTtcbnZhciByZXN1bHQgPSByZXF1aXJlKFwibG9kYXNoLnJlc3VsdFwiKTtcbnZhciBsYXN0ID0gcmVxdWlyZShcImxvZGFzaC5sYXN0XCIpO1xudmFyIGlzU3RyaW5nID0gcmVxdWlyZShcImxvZGFzaC5pc3N0cmluZ1wiKTtcbnZhciBiaW5kID0gcmVxdWlyZShcImxvZGFzaC5iaW5kXCIpO1xudmFyIGZsYXR0ZW4gPSByZXF1aXJlKFwibG9kYXNoLmZsYXR0ZW5cIik7XG52YXIgaW52b2tlID0gcmVxdWlyZShcImxvZGFzaC5pbnZva2VcIik7XG52YXIgZXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzLW1peGluJyk7XG52YXIgbWF0Y2hlcyA9IHJlcXVpcmUoJ21hdGNoZXMtc2VsZWN0b3InKTtcbnZhciBiaW5kaW5ncyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC1kb20tYmluZGluZ3MnKTtcbnZhciBnZXRQYXRoID0gcmVxdWlyZSgnZ2V0LW9iamVjdC1wYXRoJyk7XG5cblxuZnVuY3Rpb24gVmlldyhhdHRycykge1xuICAgIHRoaXMuY2lkID0gdW5pcXVlSWQoJ3ZpZXcnKTtcbiAgICBhdHRycyB8fCAoYXR0cnMgPSB7fSk7XG4gICAgdmFyIHBhcmVudCA9IGF0dHJzLnBhcmVudDtcbiAgICBkZWxldGUgYXR0cnMucGFyZW50O1xuICAgIEJhc2VTdGF0ZS5jYWxsKHRoaXMsIGF0dHJzLCB7aW5pdDogZmFsc2UsIHBhcmVudDogcGFyZW50fSk7XG4gICAgdGhpcy5vbignY2hhbmdlOmVsJywgdGhpcy5faGFuZGxlRWxlbWVudENoYW5nZSwgdGhpcyk7XG4gICAgdGhpcy5fcGFyc2VkQmluZGluZ3MgPSBiaW5kaW5ncyh0aGlzLmJpbmRpbmdzLCB0aGlzKTtcbiAgICB0aGlzLl9pbml0aWFsaXplQmluZGluZ3MoKTtcbiAgICBpZiAoYXR0cnMuZWwgJiYgIXRoaXMuYXV0b1JlbmRlcikge1xuICAgICAgICB0aGlzLl9oYW5kbGVFbGVtZW50Q2hhbmdlKCk7XG4gICAgfVxuICAgIHRoaXMuX2luaXRpYWxpemVTdWJ2aWV3cygpO1xuICAgIHRoaXMudGVtcGxhdGUgPSBhdHRycy50ZW1wbGF0ZSB8fCB0aGlzLnRlbXBsYXRlO1xuICAgIHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuc2V0KHBpY2soYXR0cnMsIHZpZXdPcHRpb25zKSk7XG4gICAgaWYgKHRoaXMuYXV0b1JlbmRlciAmJiB0aGlzLnRlbXBsYXRlKSB7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxufVxuXG52YXIgQmFzZVN0YXRlID0gU3RhdGUuZXh0ZW5kKHtcbiAgICBkYXRhVHlwZXM6IHtcbiAgICAgICAgZWxlbWVudDoge1xuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAobmV3VmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBuZXdWYWwsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IG5ld1ZhbCBpbnN0YW5jZW9mIEVsZW1lbnQgPyAnZWxlbWVudCcgOiB0eXBlb2YgbmV3VmFsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb21wYXJlOiBmdW5jdGlvbiAoZWwxLCBlbDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwxID09PSBlbDI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbGxlY3Rpb246IHtcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKG5ld1ZhbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbDogbmV3VmFsLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBuZXdWYWwgJiYgbmV3VmFsLmlzQ29sbGVjdGlvbiA/ICdjb2xsZWN0aW9uJyA6IHR5cGVvZiBuZXdWYWxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbXBhcmU6IGZ1bmN0aW9uIChjdXJyZW50VmFsLCBuZXdWYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudFZhbCA9PT0gbmV3VmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBwcm9wczoge1xuICAgICAgICBtb2RlbDogJ3N0YXRlJyxcbiAgICAgICAgZWw6ICdlbGVtZW50JyxcbiAgICAgICAgY29sbGVjdGlvbjogJ2NvbGxlY3Rpb24nXG4gICAgfSxcbiAgICBkZXJpdmVkOiB7XG4gICAgICAgIHJlbmRlcmVkOiB7XG4gICAgICAgICAgICBkZXBzOiBbJ2VsJ10sXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhIXRoaXMuZWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGhhc0RhdGE6IHtcbiAgICAgICAgICAgIGRlcHM6IFsnbW9kZWwnXSxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhdGhpcy5tb2RlbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG4vLyBDYWNoZWQgcmVnZXggdG8gc3BsaXQga2V5cyBmb3IgYGRlbGVnYXRlYC5cbnZhciBkZWxlZ2F0ZUV2ZW50U3BsaXR0ZXIgPSAvXihcXFMrKVxccyooLiopJC87XG5cbi8vIExpc3Qgb2YgdmlldyBvcHRpb25zIHRvIGJlIG1lcmdlZCBhcyBwcm9wZXJ0aWVzLlxudmFyIHZpZXdPcHRpb25zID0gWydtb2RlbCcsICdjb2xsZWN0aW9uJywgJ2VsJ107XG5cblZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShCYXNlU3RhdGUucHJvdG90eXBlKTtcblxuLy8gU2V0IHVwIGFsbCBpbmhlcml0YWJsZSBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzLlxuYXNzaWduKFZpZXcucHJvdG90eXBlLCB7XG4gICAgLy8gIyMgcXVlcnlcbiAgICAvLyBHZXQgYW4gc2luZ2xlIGVsZW1lbnQgYmFzZWQgb24gQ1NTIHNlbGVjdG9yIHNjb3BlZCB0byB0aGlzLmVsXG4gICAgLy8gaWYgeW91IHBhc3MgYW4gZW1wdHkgc3RyaW5nIGl0IHJldHVybiBgdGhpcy5lbGAuXG4gICAgLy8gSWYgeW91IHBhc3MgYW4gZWxlbWVudCB3ZSBqdXN0IHJldHVybiBpdCBiYWNrLlxuICAgIC8vIFRoaXMgbGV0cyB1cyB1c2UgYGdldGAgdG8gaGFuZGxlIGNhc2VzIHdoZXJlIHVzZXJzXG4gICAgLy8gY2FuIHBhc3MgYSBzZWxlY3RvciBvciBhbiBhbHJlYWR5IHNlbGVjdGVkIGVsZW1lbnQuXG4gICAgcXVlcnk6IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICAgICAgICBpZiAoIXNlbGVjdG9yKSByZXR1cm4gdGhpcy5lbDtcbiAgICAgICAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzKHRoaXMuZWwsIHNlbGVjdG9yKSkgcmV0dXJuIHRoaXMuZWw7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSB8fCB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yO1xuICAgIH0sXG5cbiAgICAvLyAjIyBxdWVyeUFsbFxuICAgIC8vIFJldHVybnMgYW4gYXJyYXkgb2YgZWxlbWVudHMgYmFzZWQgb24gQ1NTIHNlbGVjdG9yIHNjb3BlZCB0byB0aGlzLmVsXG4gICAgLy8gaWYgeW91IHBhc3MgYW4gZW1wdHkgc3RyaW5nIGl0IHJldHVybiBgdGhpcy5lbGAuIEFsc28gaW5jbHVkZXMgcm9vdFxuICAgIC8vIGVsZW1lbnQuXG4gICAgcXVlcnlBbGw6IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICAgICAgICB2YXIgcmVzID0gW107XG4gICAgICAgIGlmICghdGhpcy5lbCkgcmV0dXJuIHJlcztcbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSAnJykgcmV0dXJuIFt0aGlzLmVsXTtcbiAgICAgICAgaWYgKG1hdGNoZXModGhpcy5lbCwgc2VsZWN0b3IpKSByZXMucHVzaCh0aGlzLmVsKTtcbiAgICAgICAgcmV0dXJuIHJlcy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5lbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSkpO1xuICAgIH0sXG5cbiAgICAvLyAjIyBxdWVyeUJ5SG9va1xuICAgIC8vIENvbnZlbmllbmNlIG1ldGhvZCBmb3IgZmV0Y2hpbmcgZWxlbWVudCBieSBpdCdzIGBkYXRhLWhvb2tgIGF0dHJpYnV0ZS5cbiAgICAvLyBBbHNvIHRyaWVzIHRvIG1hdGNoIGFnYWluc3Qgcm9vdCBlbGVtZW50LlxuICAgIC8vIEFsc28gc3VwcG9ydHMgbWF0Y2hpbmcgJ29uZScgb2Ygc2V2ZXJhbCBzcGFjZSBzZXBhcmF0ZWQgaG9va3MuXG4gICAgcXVlcnlCeUhvb2s6IGZ1bmN0aW9uIChob29rKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnF1ZXJ5KCdbZGF0YS1ob29rfj1cIicgKyBob29rICsgJ1wiXScpO1xuICAgIH0sXG5cbiAgICAvLyBJbml0aWFsaXplIGlzIGFuIGVtcHR5IGZ1bmN0aW9uIGJ5IGRlZmF1bHQuIE92ZXJyaWRlIGl0IHdpdGggeW91ciBvd25cbiAgICAvLyBpbml0aWFsaXphdGlvbiBsb2dpYy5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7fSxcblxuICAgIC8vICoqcmVuZGVyKiogaXMgdGhlIGNvcmUgZnVuY3Rpb24gdGhhdCB5b3VyIHZpZXcgY2FuIG92ZXJyaWRlLCBpdHMgam9iIGlzXG4gICAgLy8gdG8gcG9wdWxhdGUgaXRzIGVsZW1lbnQgKGB0aGlzLmVsYCksIHdpdGggdGhlIGFwcHJvcHJpYXRlIEhUTUwuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucmVuZGVyV2l0aFRlbXBsYXRlKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy8gUmVtb3ZlIHRoaXMgdmlldyBieSB0YWtpbmcgdGhlIGVsZW1lbnQgb3V0IG9mIHRoZSBET00sIGFuZCByZW1vdmluZyBhbnlcbiAgICAvLyBhcHBsaWNhYmxlIGV2ZW50cyBsaXN0ZW5lcnMuXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwYXJzZWRCaW5kaW5ncyA9IHRoaXMuX3BhcnNlZEJpbmRpbmdzO1xuICAgICAgICBpZiAodGhpcy5lbCAmJiB0aGlzLmVsLnBhcmVudE5vZGUpIHRoaXMuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmVsKTtcbiAgICAgICAgaWYgKHRoaXMuX3N1YnZpZXdzKSBpbnZva2UoZmxhdHRlbih0aGlzLl9zdWJ2aWV3cyksICdyZW1vdmUnKTtcbiAgICAgICAgdGhpcy5zdG9wTGlzdGVuaW5nKCk7XG4gICAgICAgIC8vIFRPRE86IE5vdCBzdXJlIGlmIHRoaXMgaXMgYWN0dWFsbHkgbmVjZXNzYXJ5LlxuICAgICAgICAvLyBKdXN0IHRyeWluZyB0byBkZS1yZWZlcmVuY2UgdGhpcyBwb3RlbnRpYWxseSBsYXJnZVxuICAgICAgICAvLyBhbW91bnQgb2YgZ2VuZXJhdGVkIGZ1bmN0aW9ucyB0byBhdm9pZCBtZW1vcnkgbGVha3MuXG4gICAgICAgIGZvckVhY2gocGFyc2VkQmluZGluZ3MsIGZ1bmN0aW9uIChwcm9wZXJ0aWVzLCBtb2RlbE5hbWUpIHtcbiAgICAgICAgICAgIGZvckVhY2gocHJvcGVydGllcywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgcGFyc2VkQmluZGluZ3NbbW9kZWxOYW1lXVtrZXldO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkZWxldGUgcGFyc2VkQmluZGluZ3NbbW9kZWxOYW1lXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudHJpZ2dlcigncmVtb3ZlJywgdGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyBDaGFuZ2UgdGhlIHZpZXcncyBlbGVtZW50IChgdGhpcy5lbGAgcHJvcGVydHkpLCBpbmNsdWRpbmcgZXZlbnRcbiAgICAvLyByZS1kZWxlZ2F0aW9uLlxuICAgIF9oYW5kbGVFbGVtZW50Q2hhbmdlOiBmdW5jdGlvbiAoZWxlbWVudCwgZGVsZWdhdGUpIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRNYW5hZ2VyKSB0aGlzLmV2ZW50TWFuYWdlci51bmJpbmQoKTtcbiAgICAgICAgdGhpcy5ldmVudE1hbmFnZXIgPSBldmVudHModGhpcy5lbCwgdGhpcyk7XG4gICAgICAgIHRoaXMuZGVsZWdhdGVFdmVudHMoKTtcbiAgICAgICAgdGhpcy5fYXBwbHlCaW5kaW5nc0ZvcktleSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy8gU2V0IGNhbGxiYWNrcywgd2hlcmUgYHRoaXMuZXZlbnRzYCBpcyBhIGhhc2ggb2ZcbiAgICAvL1xuICAgIC8vICp7XCJldmVudCBzZWxlY3RvclwiOiBcImNhbGxiYWNrXCJ9KlxuICAgIC8vXG4gICAgLy8gICAgIHtcbiAgICAvLyAgICAgICAnbW91c2Vkb3duIC50aXRsZSc6ICAnZWRpdCcsXG4gICAgLy8gICAgICAgJ2NsaWNrIC5idXR0b24nOiAgICAgJ3NhdmUnLFxuICAgIC8vICAgICAgICdjbGljayAub3Blbic6ICAgICAgIGZ1bmN0aW9uIChlKSB7IC4uLiB9XG4gICAgLy8gICAgIH1cbiAgICAvL1xuICAgIC8vIHBhaXJzLiBDYWxsYmFja3Mgd2lsbCBiZSBib3VuZCB0byB0aGUgdmlldywgd2l0aCBgdGhpc2Agc2V0IHByb3Blcmx5LlxuICAgIC8vIFVzZXMgZXZlbnQgZGVsZWdhdGlvbiBmb3IgZWZmaWNpZW5jeS5cbiAgICAvLyBPbWl0dGluZyB0aGUgc2VsZWN0b3IgYmluZHMgdGhlIGV2ZW50IHRvIGB0aGlzLmVsYC5cbiAgICAvLyBUaGlzIG9ubHkgd29ya3MgZm9yIGRlbGVnYXRlLWFibGUgZXZlbnRzOiBub3QgYGZvY3VzYCwgYGJsdXJgLCBhbmRcbiAgICAvLyBub3QgYGNoYW5nZWAsIGBzdWJtaXRgLCBhbmQgYHJlc2V0YCBpbiBJbnRlcm5ldCBFeHBsb3Jlci5cbiAgICBkZWxlZ2F0ZUV2ZW50czogZnVuY3Rpb24gKGV2ZW50cykge1xuICAgICAgICBpZiAoIShldmVudHMgfHwgKGV2ZW50cyA9IHJlc3VsdCh0aGlzLCAnZXZlbnRzJykpKSkgcmV0dXJuIHRoaXM7XG4gICAgICAgIHRoaXMudW5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gZXZlbnRzKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50TWFuYWdlci5iaW5kKGtleSwgZXZlbnRzW2tleV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyBDbGVhcnMgYWxsIGNhbGxiYWNrcyBwcmV2aW91c2x5IGJvdW5kIHRvIHRoZSB2aWV3IHdpdGggYGRlbGVnYXRlRXZlbnRzYC5cbiAgICAvLyBZb3UgdXN1YWxseSBkb24ndCBuZWVkIHRvIHVzZSB0aGlzLCBidXQgbWF5IHdpc2ggdG8gaWYgeW91IGhhdmUgbXVsdGlwbGVcbiAgICAvLyBCYWNrYm9uZSB2aWV3cyBhdHRhY2hlZCB0byB0aGUgc2FtZSBET00gZWxlbWVudC5cbiAgICB1bmRlbGVnYXRlRXZlbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZXZlbnRNYW5hZ2VyLnVuYmluZCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy8gIyMgcmVnaXN0ZXJTdWJ2aWV3XG4gICAgLy8gUGFzcyBpdCBhIHZpZXcuIFRoaXMgY2FuIGJlIGFueXRoaW5nIHdpdGggYSBgcmVtb3ZlYCBtZXRob2RcbiAgICByZWdpc3RlclN1YnZpZXc6IGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgICAgIC8vIFN0b3JhZ2UgZm9yIG91ciBzdWJ2aWV3cy5cbiAgICAgICAgdGhpcy5fc3Vidmlld3MgfHwgKHRoaXMuX3N1YnZpZXdzID0gW10pO1xuICAgICAgICB0aGlzLl9zdWJ2aWV3cy5wdXNoKHZpZXcpO1xuICAgICAgICAvLyBJZiB2aWV3IGhhcyBhbiAnZWwnIGl0J3MgYSBzaW5nbGUgdmlldyBub3RcbiAgICAgICAgLy8gYW4gYXJyYXkgb2Ygdmlld3MgcmVnaXN0ZXJlZCBieSByZW5kZXJDb2xsZWN0aW9uXG4gICAgICAgIC8vIHNvIHdlIHN0b3JlIGEgcmVmZXJlbmNlIHRvIHRoZSBwYXJlbnQgdmlldy5cbiAgICAgICAgaWYgKHZpZXcuZWwpIHZpZXcucGFyZW50ID0gdGhpcztcbiAgICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfSxcblxuICAgIC8vICMjIHJlbmRlclN1YnZpZXdcbiAgICAvLyBQYXNzIGl0IGEgdmlldyBpbnN0YW5jZSBhbmQgYSBjb250YWluZXIgZWxlbWVudFxuICAgIC8vIHRvIHJlbmRlciBpdCBpbi4gSXQncyBgcmVtb3ZlYCBtZXRob2Qgd2lsbCBiZSBjYWxsZWRcbiAgICAvLyB3aGVuIHRoZSBwYXJlbnQgdmlldyBpcyBkZXN0cm95ZWQuXG4gICAgcmVuZGVyU3VidmlldzogZnVuY3Rpb24gKHZpZXcsIGNvbnRhaW5lcikge1xuICAgICAgICBpZiAodHlwZW9mIGNvbnRhaW5lciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IHRoaXMucXVlcnkoY29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcbiAgICAgICAgdmlldy5yZW5kZXIoKTtcbiAgICAgICAgKGNvbnRhaW5lciB8fCB0aGlzLmVsKS5hcHBlbmRDaGlsZCh2aWV3LmVsKTtcbiAgICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfSxcblxuICAgIF9hcHBseUJpbmRpbmdzRm9yS2V5OiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICBpZiAoIXRoaXMuZWwpIHJldHVybjtcbiAgICAgICAgdmFyIGZucyA9IHRoaXMuX3BhcnNlZEJpbmRpbmdzLmdldEdyb3VwZWQobmFtZSk7XG4gICAgICAgIHZhciBpdGVtO1xuICAgICAgICBmb3IgKGl0ZW0gaW4gZm5zKSB7XG4gICAgICAgICAgICBmbnNbaXRlbV0uZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICBmbih0aGlzLmVsLCBnZXRQYXRoKHRoaXMsIGl0ZW0pLCBsYXN0KGl0ZW0uc3BsaXQoJy4nKSkpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2luaXRpYWxpemVCaW5kaW5nczogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuYmluZGluZ3MpIHJldHVybjtcbiAgICAgICAgdGhpcy5vbignYWxsJywgZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgaWYgKGV2ZW50TmFtZS5zbGljZSgwLCA3KSA9PT0gJ2NoYW5nZTonKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXBwbHlCaW5kaW5nc0ZvcktleShldmVudE5hbWUuc3BsaXQoJzonKVsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvLyAjIyBfaW5pdGlhbGl6ZVN1YnZpZXdzXG4gICAgLy8gdGhpcyBpcyBjYWxsZWQgYXQgc2V0dXAgYW5kIGdyYWJzIGRlY2xhcmVkIHN1YnZpZXdzXG4gICAgX2luaXRpYWxpemVTdWJ2aWV3czogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuc3Vidmlld3MpIHJldHVybjtcbiAgICAgICAgZm9yICh2YXIgaXRlbSBpbiB0aGlzLnN1YnZpZXdzKSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJzZVN1YnZpZXcodGhpcy5zdWJ2aWV3c1tpdGVtXSwgaXRlbSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gIyMgX3BhcnNlU3Vidmlld1xuICAgIC8vIGhlbHBlciBmb3IgcGFyc2luZyBvdXQgdGhlIHN1YnZpZXcgZGVjbGFyYXRpb24gYW5kIHJlZ2lzdGVyaW5nXG4gICAgLy8gdGhlIGB3YWl0Rm9yYCBpZiBuZWVkIGJlLlxuICAgIF9wYXJzZVN1YnZpZXc6IGZ1bmN0aW9uIChzdWJ2aWV3LCBuYW1lKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIG9wdHMgPSB7XG4gICAgICAgICAgICBzZWxlY3Rvcjogc3Vidmlldy5jb250YWluZXIgfHwgJ1tkYXRhLWhvb2s9XCInICsgc3Vidmlldy5ob29rICsgJ1wiXScsXG4gICAgICAgICAgICB3YWl0Rm9yOiBzdWJ2aWV3LndhaXRGb3IgfHwgJycsXG4gICAgICAgICAgICBwcmVwYXJlVmlldzogc3Vidmlldy5wcmVwYXJlVmlldyB8fCBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHN1YnZpZXcuY29uc3RydWN0b3Ioe1xuICAgICAgICAgICAgICAgICAgICBlbDogZWwsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudDogc2VsZlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBmdW5jdGlvbiBhY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZWwsIHN1YnZpZXc7XG4gICAgICAgICAgICAvLyBpZiBub3QgcmVuZGVyZWQgb3Igd2UgY2FuJ3QgZmluZCBvdXIgZWxlbWVudCwgc3RvcCBoZXJlLlxuICAgICAgICAgICAgaWYgKCF0aGlzLmVsIHx8ICEoZWwgPSB0aGlzLnF1ZXJ5KG9wdHMuc2VsZWN0b3IpKSkgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKCFvcHRzLndhaXRGb3IgfHwgZ2V0UGF0aCh0aGlzLCBvcHRzLndhaXRGb3IpKSB7XG4gICAgICAgICAgICAgICAgc3VidmlldyA9IHRoaXNbbmFtZV0gPSBvcHRzLnByZXBhcmVWaWV3LmNhbGwodGhpcywgZWwpO1xuICAgICAgICAgICAgICAgIHN1YnZpZXcucmVuZGVyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlclN1YnZpZXcoc3Vidmlldyk7XG4gICAgICAgICAgICAgICAgdGhpcy5vZmYoJ2NoYW5nZScsIGFjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gd2UgbGlzdGVuIGZvciBtYWluIGBjaGFuZ2VgIGl0ZW1zXG4gICAgICAgIHRoaXMub24oJ2NoYW5nZScsIGFjdGlvbiwgdGhpcyk7XG4gICAgfSxcblxuXG4gICAgLy8gU2hvcnRjdXQgZm9yIGRvaW5nIGV2ZXJ5dGhpbmcgd2UgbmVlZCB0byBkbyB0b1xuICAgIC8vIHJlbmRlciBhbmQgZnVsbHkgcmVwbGFjZSBjdXJyZW50IHJvb3QgZWxlbWVudC5cbiAgICAvLyBFaXRoZXIgZGVmaW5lIGEgYHRlbXBsYXRlYCBwcm9wZXJ0eSBvZiB5b3VyIHZpZXdcbiAgICAvLyBvciBwYXNzIGluIGEgdGVtcGxhdGUgZGlyZWN0bHkuXG4gICAgLy8gVGhlIHRlbXBsYXRlIGNhbiBlaXRoZXIgYmUgYSBzdHJpbmcgb3IgYSBmdW5jdGlvbi5cbiAgICAvLyBJZiBpdCdzIGEgZnVuY3Rpb24gaXQgd2lsbCBiZSBwYXNzZWQgdGhlIGBjb250ZXh0YFxuICAgIC8vIGFyZ3VtZW50LlxuICAgIHJlbmRlcldpdGhUZW1wbGF0ZTogZnVuY3Rpb24gKGNvbnRleHQsIHRlbXBsYXRlQXJnKSB7XG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IHRlbXBsYXRlQXJnIHx8IHRoaXMudGVtcGxhdGU7XG4gICAgICAgIGlmICghdGVtcGxhdGUpIHRocm93IG5ldyBFcnJvcignVGVtcGxhdGUgc3RyaW5nIG9yIGZ1bmN0aW9uIG5lZWRlZC4nKTtcbiAgICAgICAgdmFyIG5ld0RvbSA9IGlzU3RyaW5nKHRlbXBsYXRlKSA/IHRlbXBsYXRlIDogdGVtcGxhdGUuY2FsbCh0aGlzLCBjb250ZXh0IHx8IHRoaXMpO1xuICAgICAgICBpZiAoaXNTdHJpbmcobmV3RG9tKSkgbmV3RG9tID0gZG9taWZ5KG5ld0RvbSk7XG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLmVsICYmIHRoaXMuZWwucGFyZW50Tm9kZTtcbiAgICAgICAgaWYgKHBhcmVudCkgcGFyZW50LnJlcGxhY2VDaGlsZChuZXdEb20sIHRoaXMuZWwpO1xuICAgICAgICBpZiAobmV3RG9tLm5vZGVOYW1lID09PSAnI2RvY3VtZW50LWZyYWdtZW50JykgdGhyb3cgbmV3IEVycm9yKCdWaWV3cyBjYW4gb25seSBoYXZlIG9uZSByb290IGVsZW1lbnQuJyk7XG4gICAgICAgIHRoaXMuZWwgPSBuZXdEb207XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyAjIyBjYWNoZUVsZW1lbnRzXG4gICAgLy8gVGhpcyBpcyBhIHNob3J0Y3V0IGZvciBhZGRpbmcgcmVmZXJlbmNlIHRvIHNwZWNpZmljIGVsZW1lbnRzIHdpdGhpbiB5b3VyIHZpZXcgZm9yXG4gICAgLy8gYWNjZXNzIGxhdGVyLiBUaGlzIGF2b2lkcyBleGNlc3NpdmUgRE9NIHF1ZXJpZXMgYW5kIG1ha2VzIGl0IGVhc2llciB0byB1cGRhdGVcbiAgICAvLyB5b3VyIHZpZXcgaWYgeW91ciB0ZW1wbGF0ZSBjaGFuZ2VzLlxuICAgIC8vXG4gICAgLy8gSW4geW91ciBgcmVuZGVyYCBtZXRob2QuIFVzZSBpdCBsaWtlIHNvOlxuICAgIC8vXG4gICAgLy8gICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIC8vICAgICAgIHRoaXMuYmFzaWNSZW5kZXIoKTtcbiAgICAvLyAgICAgICB0aGlzLmNhY2hlRWxlbWVudHMoe1xuICAgIC8vICAgICAgICAgcGFnZXM6ICcjcGFnZXMnLFxuICAgIC8vICAgICAgICAgY2hhdDogJyN0ZWFtQ2hhdCcsXG4gICAgLy8gICAgICAgICBuYXY6ICduYXYjdmlld3MgdWwnLFxuICAgIC8vICAgICAgICAgbWU6ICcjbWUnLFxuICAgIC8vICAgICAgICAgY2hlYXRTaGVldDogJyNjaGVhdFNoZWV0JyxcbiAgICAvLyAgICAgICAgIG9tbmlCb3g6ICcjYXdlc29tZVNhdWNlJ1xuICAgIC8vICAgICAgIH0pO1xuICAgIC8vICAgICB9XG4gICAgLy9cbiAgICAvLyBUaGVuIGxhdGVyIHlvdSBjYW4gYWNjZXNzIGVsZW1lbnRzIGJ5IHJlZmVyZW5jZSBsaWtlIHNvOiBgdGhpcy5wYWdlc2AsIG9yIGB0aGlzLmNoYXRgLlxuICAgIGNhY2hlRWxlbWVudHM6IGZ1bmN0aW9uIChoYXNoKSB7XG4gICAgICAgIGZvciAodmFyIGl0ZW0gaW4gaGFzaCkge1xuICAgICAgICAgICAgdGhpc1tpdGVtXSA9IHRoaXMucXVlcnkoaGFzaFtpdGVtXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vICMjIGxpc3RlblRvQW5kUnVuXG4gICAgLy8gU2hvcnRjdXQgZm9yIHJlZ2lzdGVyaW5nIGEgbGlzdGVuZXIgZm9yIGEgbW9kZWxcbiAgICAvLyBhbmQgYWxzbyB0cmlnZ2VyaW5nIGl0IHJpZ2h0IGF3YXkuXG4gICAgbGlzdGVuVG9BbmRSdW46IGZ1bmN0aW9uIChvYmplY3QsIGV2ZW50cywgaGFuZGxlcikge1xuICAgICAgICB2YXIgYm91bmQgPSBiaW5kKGhhbmRsZXIsIHRoaXMpO1xuICAgICAgICB0aGlzLmxpc3RlblRvKG9iamVjdCwgZXZlbnRzLCBib3VuZCk7XG4gICAgICAgIGJvdW5kKCk7XG4gICAgfSxcblxuICAgIC8vICMjIGFuaW1hdGVSZW1vdmVcbiAgICAvLyBQbGFjZWhvbGRlciBmb3IgaWYgeW91IHdhbnQgdG8gZG8gc29tZXRoaW5nIHNwZWNpYWwgd2hlbiB0aGV5J3JlIHJlbW92ZWQuXG4gICAgLy8gRm9yIGV4YW1wbGUgZmFkZSBpdCBvdXQsIGV0Yy5cbiAgICAvLyBBbnkgb3ZlcnJpZGUgaGVyZSBzaG91bGQgY2FsbCBgLnJlbW92ZSgpYCB3aGVuIGRvbmUuXG4gICAgYW5pbWF0ZVJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgIH0sXG5cbiAgICAvLyAjIyByZW5kZXJDb2xsZWN0aW9uXG4gICAgLy8gTWV0aG9kIGZvciByZW5kZXJpbmcgYSBjb2xsZWN0aW9ucyB3aXRoIGluZGl2aWR1YWwgdmlld3MuXG4gICAgLy8gSnVzdCBwYXNzIGl0IHRoZSBjb2xsZWN0aW9uLCBhbmQgdGhlIHZpZXcgdG8gdXNlIGZvciB0aGUgaXRlbXMgaW4gdGhlXG4gICAgLy8gY29sbGVjdGlvbi4gVGhlIGNvbGxlY3Rpb25WaWV3IGlzIHJldHVybmVkLlxuICAgIHJlbmRlckNvbGxlY3Rpb246IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBWaWV3Q2xhc3MsIGNvbnRhaW5lciwgb3B0cykge1xuICAgICAgICB2YXIgY29udGFpbmVyRWwgPSAodHlwZW9mIGNvbnRhaW5lciA9PT0gJ3N0cmluZycpID8gdGhpcy5xdWVyeShjb250YWluZXIpIDogY29udGFpbmVyO1xuICAgICAgICB2YXIgY29uZmlnID0gYXNzaWduKHtcbiAgICAgICAgICAgIGNvbGxlY3Rpb246IGNvbGxlY3Rpb24sXG4gICAgICAgICAgICBlbDogY29udGFpbmVyRWwgfHwgdGhpcy5lbCxcbiAgICAgICAgICAgIHZpZXc6IFZpZXdDbGFzcyxcbiAgICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICAgIHZpZXdPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgcGFyZW50OiB0aGlzXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIG9wdHMpO1xuICAgICAgICB2YXIgY29sbGVjdGlvblZpZXcgPSBuZXcgQ29sbGVjdGlvblZpZXcoY29uZmlnKTtcbiAgICAgICAgY29sbGVjdGlvblZpZXcucmVuZGVyKCk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlZ2lzdGVyU3Vidmlldyhjb2xsZWN0aW9uVmlldyk7XG4gICAgfVxufSk7XG5cblZpZXcuZXh0ZW5kID0gQmFzZVN0YXRlLmV4dGVuZDtcbm1vZHVsZS5leHBvcnRzID0gVmlldztcbiIsIjtpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikgeyAgd2luZG93LmFtcGVyc2FuZCA9IHdpbmRvdy5hbXBlcnNhbmQgfHwge307ICB3aW5kb3cuYW1wZXJzYW5kW1wiYW1wZXJzYW5kLWNvbGxlY3Rpb24tdmlld1wiXSA9IHdpbmRvdy5hbXBlcnNhbmRbXCJhbXBlcnNhbmQtY29sbGVjdGlvbi12aWV3XCJdIHx8IFtdOyAgd2luZG93LmFtcGVyc2FuZFtcImFtcGVyc2FuZC1jb2xsZWN0aW9uLXZpZXdcIl0ucHVzaChcIjEuNC4wXCIpO31cbnZhciBhc3NpZ24gPSByZXF1aXJlKCdsb2Rhc2guYXNzaWduJyk7XG52YXIgaW52b2tlID0gcmVxdWlyZSgnbG9kYXNoLmludm9rZScpO1xudmFyIHBpY2sgPSByZXF1aXJlKCdsb2Rhc2gucGljaycpO1xudmFyIGZpbmQgPSByZXF1aXJlKCdsb2Rhc2guZmluZCcpO1xudmFyIGRpZmZlcmVuY2UgPSByZXF1aXJlKCdsb2Rhc2guZGlmZmVyZW5jZScpO1xudmFyIEV2ZW50cyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC1ldmVudHMnKTtcbnZhciBhbXBFeHRlbmQgPSByZXF1aXJlKCdhbXBlcnNhbmQtY2xhc3MtZXh0ZW5kJyk7XG5cbi8vIG9wdGlvbnNcbnZhciBvcHRpb25zID0gWydjb2xsZWN0aW9uJywgJ2VsJywgJ3ZpZXdPcHRpb25zJywgJ3ZpZXcnLCAnZW1wdHlWaWV3JywgJ2ZpbHRlcicsICdyZXZlcnNlJywgJ3BhcmVudCddO1xuXG5cbmZ1bmN0aW9uIENvbGxlY3Rpb25WaWV3KHNwZWMpIHtcbiAgICBpZiAoIXNwZWMpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdDb2xsZWN0aW9uIHZpZXcgbWlzc2luZyByZXF1aXJlZCBwYXJhbWV0ZXJzOiBjb2xsZWN0aW9uLCBlbCcpO1xuICAgIH1cbiAgICBpZiAoIXNwZWMuY29sbGVjdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0NvbGxlY3Rpb24gdmlldyByZXF1aXJlcyBhIGNvbGxlY3Rpb24nKTtcbiAgICB9XG4gICAgaWYgKCFzcGVjLmVsICYmICF0aGlzLmluc2VydFNlbGYpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdDb2xsZWN0aW9uIHZpZXcgcmVxdWlyZXMgYW4gZWwnKTtcbiAgICB9XG4gICAgYXNzaWduKHRoaXMsIHBpY2soc3BlYywgb3B0aW9ucykpO1xuICAgIHRoaXMudmlld3MgPSBbXTtcbiAgICB0aGlzLmxpc3RlblRvKHRoaXMuY29sbGVjdGlvbiwgJ2FkZCcsIHRoaXMuX2FkZFZpZXdGb3JNb2RlbCk7XG4gICAgdGhpcy5saXN0ZW5Ubyh0aGlzLmNvbGxlY3Rpb24sICdyZW1vdmUnLCB0aGlzLl9yZW1vdmVWaWV3Rm9yTW9kZWwpO1xuICAgIHRoaXMubGlzdGVuVG8odGhpcy5jb2xsZWN0aW9uLCAnc29ydCcsIHRoaXMuX3JlcmVuZGVyQWxsKTtcbiAgICB0aGlzLmxpc3RlblRvKHRoaXMuY29sbGVjdGlvbiwgJ3JlZnJlc2ggcmVzZXQnLCB0aGlzLl9yZXNldCk7XG59XG5cbmFzc2lnbihDb2xsZWN0aW9uVmlldy5wcm90b3R5cGUsIEV2ZW50cywge1xuICAgIC8vIGZvciB2aWV3IGNvbnRyYWN0IGNvbXBsaWFuY2VcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyQWxsKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGludm9rZSh0aGlzLnZpZXdzLCAncmVtb3ZlJyk7XG4gICAgICAgIHRoaXMuc3RvcExpc3RlbmluZygpO1xuICAgIH0sXG4gICAgX2dldFZpZXdCeU1vZGVsOiBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgICAgcmV0dXJuIGZpbmQodGhpcy52aWV3cywgZnVuY3Rpb24gKHZpZXcpIHtcbiAgICAgICAgICAgIHJldHVybiBtb2RlbCA9PT0gdmlldy5tb2RlbDtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBfY3JlYXRlVmlld0Zvck1vZGVsOiBmdW5jdGlvbiAobW9kZWwsIHJlbmRlck9wdHMpIHtcbiAgICAgICAgdmFyIGRlZmF1bHRWaWV3T3B0aW9ucyA9IHttb2RlbDogbW9kZWwsIGNvbGxlY3Rpb246IHRoaXMuY29sbGVjdGlvbiwgcGFyZW50OiB0aGlzfTtcbiAgICAgICAgdmFyIHZpZXcgPSBuZXcgdGhpcy52aWV3KGFzc2lnbihkZWZhdWx0Vmlld09wdGlvbnMsIHRoaXMudmlld09wdGlvbnMpKTtcbiAgICAgICAgdGhpcy52aWV3cy5wdXNoKHZpZXcpO1xuICAgICAgICB2aWV3LnJlbmRlcmVkQnlQYXJlbnRWaWV3ID0gdHJ1ZTtcbiAgICAgICAgdmlldy5yZW5kZXIocmVuZGVyT3B0cyk7XG4gICAgICAgIHJldHVybiB2aWV3O1xuICAgIH0sXG4gICAgX2dldE9yQ3JlYXRlQnlNb2RlbDogZnVuY3Rpb24gKG1vZGVsLCByZW5kZXJPcHRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRWaWV3QnlNb2RlbChtb2RlbCkgfHwgdGhpcy5fY3JlYXRlVmlld0Zvck1vZGVsKG1vZGVsLCByZW5kZXJPcHRzKTtcbiAgICB9LFxuICAgIF9hZGRWaWV3Rm9yTW9kZWw6IGZ1bmN0aW9uIChtb2RlbCwgY29sbGVjdGlvbiwgb3B0aW9ucykge1xuICAgICAgICB2YXIgbWF0Y2hlcyA9IHRoaXMuZmlsdGVyID8gdGhpcy5maWx0ZXIobW9kZWwpIDogdHJ1ZTtcbiAgICAgICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmVuZGVyZWRFbXB0eVZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZWRFbXB0eVZpZXcucmVtb3ZlKCk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5yZW5kZXJlZEVtcHR5VmlldztcbiAgICAgICAgfVxuICAgICAgICB2YXIgdmlldyA9IHRoaXMuX2dldE9yQ3JlYXRlQnlNb2RlbChtb2RlbCwge2NvbnRhaW5lckVsOiB0aGlzLmVsfSk7XG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMucmVyZW5kZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2luc2VydFZpZXcodmlldyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9pbnNlcnRWaWV3QXRJbmRleCh2aWV3KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgX2luc2VydFZpZXdBdEluZGV4OiBmdW5jdGlvbiAodmlldykge1xuICAgICAgICBpZiAoIXZpZXcuaW5zZXJ0U2VsZikge1xuICAgICAgICAgICAgdmFyIHBvcyA9IHRoaXMuY29sbGVjdGlvbi5pbmRleE9mKHZpZXcubW9kZWwpO1xuICAgICAgICAgICAgdmFyIG1vZGVsVG9JbnNlcnRCZWZvcmUsIHZpZXdUb0luc2VydEJlZm9yZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMucmV2ZXJzZSkge1xuICAgICAgICAgICAgICAgIG1vZGVsVG9JbnNlcnRCZWZvcmUgPSB0aGlzLmNvbGxlY3Rpb24uYXQocG9zIC0gMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1vZGVsVG9JbnNlcnRCZWZvcmUgPSB0aGlzLmNvbGxlY3Rpb24uYXQocG9zICsgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZpZXdUb0luc2VydEJlZm9yZSA9IHRoaXMuX2dldFZpZXdCeU1vZGVsKG1vZGVsVG9JbnNlcnRCZWZvcmUpO1xuXG4gICAgICAgICAgICAvLyBGSVggSUUgYnVnIChodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm9kZS5pbnNlcnRCZWZvcmUpXG4gICAgICAgICAgICAvLyBcIkluIEludGVybmV0IEV4cGxvcmVyIGFuIHVuZGVmaW5lZCB2YWx1ZSBhcyByZWZlcmVuY2VFbGVtZW50IHdpbGwgdGhyb3cgZXJyb3JzLCB3aGlsZSBpbiByZXN0IG9mIHRoZSBtb2Rlcm4gYnJvd3NlcnMsIHRoaXMgd29ya3MgZmluZS5cIlxuICAgICAgICAgICAgaWYodmlld1RvSW5zZXJ0QmVmb3JlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbC5pbnNlcnRCZWZvcmUodmlldy5lbCwgdmlld1RvSW5zZXJ0QmVmb3JlICYmIHZpZXdUb0luc2VydEJlZm9yZS5lbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQodmlldy5lbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIF9pbnNlcnRWaWV3OiBmdW5jdGlvbiAodmlldykge1xuICAgICAgICBpZiAoIXZpZXcuaW5zZXJ0U2VsZikge1xuICAgICAgICAgICAgaWYgKHRoaXMucmV2ZXJzZSAmJiB0aGlzLmVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsLmluc2VydEJlZm9yZSh2aWV3LmVsLCB0aGlzLmVsLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsLmFwcGVuZENoaWxkKHZpZXcuZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBfcmVtb3ZlVmlld0Zvck1vZGVsOiBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzLl9nZXRWaWV3QnlNb2RlbChtb2RlbCk7XG4gICAgICAgIGlmICghdmlldykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMudmlld3MuaW5kZXhPZih2aWV3KTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgLy8gcmVtb3ZlIGl0IGlmIHdlIGZvdW5kIGl0IGNhbGxpbmcgYW5pbWF0ZVJlbW92ZVxuICAgICAgICAgICAgLy8gdG8gZ2l2ZSB1c2VyIG9wdGlvbiBvZiBncmFjZWZ1bGx5IGRlc3Ryb3lpbmcuXG4gICAgICAgICAgICB2aWV3ID0gdGhpcy52aWV3cy5zcGxpY2UoaW5kZXgsIDEpWzBdO1xuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlVmlldyh2aWV3KTtcbiAgICAgICAgICAgIGlmICh0aGlzLnZpZXdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlckVtcHR5VmlldygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBfcmVtb3ZlVmlldzogZnVuY3Rpb24gKHZpZXcpIHtcbiAgICAgICAgaWYgKHZpZXcuYW5pbWF0ZVJlbW92ZSkge1xuICAgICAgICAgICAgdmlldy5hbmltYXRlUmVtb3ZlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2aWV3LnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBfcmVuZGVyQWxsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbi5lYWNoKHRoaXMuX2FkZFZpZXdGb3JNb2RlbCwgdGhpcyk7XG4gICAgICAgIGlmICh0aGlzLnZpZXdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5fcmVuZGVyRW1wdHlWaWV3KCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIF9yZXJlbmRlckFsbDogZnVuY3Rpb24gKGNvbGxlY3Rpb24sIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbi5lYWNoKGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgICAgICAgdGhpcy5fYWRkVmlld0Zvck1vZGVsKG1vZGVsLCB0aGlzLCBhc3NpZ24ob3B0aW9ucywge3JlcmVuZGVyOiB0cnVlfSkpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIF9yZW5kZXJFbXB0eVZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5lbXB0eVZpZXcgJiYgIXRoaXMucmVuZGVyZWRFbXB0eVZpZXcpIHtcbiAgICAgICAgICAgIHZhciB2aWV3ID0gdGhpcy5yZW5kZXJlZEVtcHR5VmlldyA9IG5ldyB0aGlzLmVtcHR5Vmlldyh7cGFyZW50OiB0aGlzfSk7XG4gICAgICAgICAgICB0aGlzLmVsLmFwcGVuZENoaWxkKHZpZXcucmVuZGVyKCkuZWwpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBfcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5ld1ZpZXdzID0gdGhpcy5jb2xsZWN0aW9uLm1hcCh0aGlzLl9nZXRPckNyZWF0ZUJ5TW9kZWwsIHRoaXMpO1xuXG4gICAgICAgIC8vUmVtb3ZlIGV4aXN0aW5nIHZpZXdzIGZyb20gdGhlIHVpXG4gICAgICAgIHZhciB0b1JlbW92ZSA9IGRpZmZlcmVuY2UodGhpcy52aWV3cywgbmV3Vmlld3MpO1xuICAgICAgICB0b1JlbW92ZS5mb3JFYWNoKHRoaXMuX3JlbW92ZVZpZXcsIHRoaXMpO1xuXG4gICAgICAgIC8vUmVyZW5kZXIgdGhlIGZ1bGwgbGlzdCB3aXRoIHRoZSBuZXcgdmlld3NcbiAgICAgICAgdGhpcy52aWV3cyA9IG5ld1ZpZXdzO1xuICAgICAgICB0aGlzLl9yZXJlbmRlckFsbCgpO1xuICAgICAgICBpZiAodGhpcy52aWV3cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckVtcHR5VmlldygpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbkNvbGxlY3Rpb25WaWV3LmV4dGVuZCA9IGFtcEV4dGVuZDtcblxubW9kdWxlLmV4cG9ydHMgPSBDb2xsZWN0aW9uVmlldztcbiIsInZhciBhc3NpZ24gPSByZXF1aXJlKCdsb2Rhc2guYXNzaWduJyk7XG5cbi8vLyBGb2xsb3dpbmcgY29kZSBpcyBsYXJnZWx5IHBhc3RlZCBmcm9tIEJhY2tib25lLmpzXG5cbi8vIEhlbHBlciBmdW5jdGlvbiB0byBjb3JyZWN0bHkgc2V0IHVwIHRoZSBwcm90b3R5cGUgY2hhaW4sIGZvciBzdWJjbGFzc2VzLlxuLy8gU2ltaWxhciB0byBgZ29vZy5pbmhlcml0c2AsIGJ1dCB1c2VzIGEgaGFzaCBvZiBwcm90b3R5cGUgcHJvcGVydGllcyBhbmRcbi8vIGNsYXNzIHByb3BlcnRpZXMgdG8gYmUgZXh0ZW5kZWQuXG52YXIgZXh0ZW5kID0gZnVuY3Rpb24ocHJvdG9Qcm9wcykge1xuICAgIHZhciBwYXJlbnQgPSB0aGlzO1xuICAgIHZhciBjaGlsZDtcbiAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgIC8vIFRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiBmb3IgdGhlIG5ldyBzdWJjbGFzcyBpcyBlaXRoZXIgZGVmaW5lZCBieSB5b3VcbiAgICAvLyAodGhlIFwiY29uc3RydWN0b3JcIiBwcm9wZXJ0eSBpbiB5b3VyIGBleHRlbmRgIGRlZmluaXRpb24pLCBvciBkZWZhdWx0ZWRcbiAgICAvLyBieSB1cyB0byBzaW1wbHkgY2FsbCB0aGUgcGFyZW50J3MgY29uc3RydWN0b3IuXG4gICAgaWYgKHByb3RvUHJvcHMgJiYgcHJvdG9Qcm9wcy5oYXNPd25Qcm9wZXJ0eSgnY29uc3RydWN0b3InKSkge1xuICAgICAgICBjaGlsZCA9IHByb3RvUHJvcHMuY29uc3RydWN0b3I7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gQWRkIHN0YXRpYyBwcm9wZXJ0aWVzIHRvIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiBmcm9tIHBhcmVudFxuICAgIGFzc2lnbihjaGlsZCwgcGFyZW50KTtcblxuICAgIC8vIFNldCB0aGUgcHJvdG90eXBlIGNoYWluIHRvIGluaGVyaXQgZnJvbSBgcGFyZW50YCwgd2l0aG91dCBjYWxsaW5nXG4gICAgLy8gYHBhcmVudGAncyBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cbiAgICB2YXIgU3Vycm9nYXRlID0gZnVuY3Rpb24oKXsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9O1xuICAgIFN1cnJvZ2F0ZS5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xuICAgIGNoaWxkLnByb3RvdHlwZSA9IG5ldyBTdXJyb2dhdGUoKTtcblxuICAgIC8vIE1peCBpbiBhbGwgcHJvdG90eXBlIHByb3BlcnRpZXMgdG8gdGhlIHN1YmNsYXNzIGlmIHN1cHBsaWVkLlxuICAgIGlmIChwcm90b1Byb3BzKSB7XG4gICAgICAgIGFyZ3MudW5zaGlmdChjaGlsZC5wcm90b3R5cGUpO1xuICAgICAgICBhc3NpZ24uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfVxuXG4gICAgLy8gU2V0IGEgY29udmVuaWVuY2UgcHJvcGVydHkgaW4gY2FzZSB0aGUgcGFyZW50J3MgcHJvdG90eXBlIGlzIG5lZWRlZFxuICAgIC8vIGxhdGVyLlxuICAgIGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7XG5cbiAgICByZXR1cm4gY2hpbGQ7XG59O1xuXG4vLyBFeHBvc2UgdGhlIGV4dGVuZCBmdW5jdGlvblxubW9kdWxlLmV4cG9ydHMgPSBleHRlbmQ7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMiAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpID4gNSkuICovXG52YXIgcmVIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYCBbc3BlY2lhbCBjaGFyYWN0ZXJzXShodHRwOi8vd3d3LnJlZ3VsYXItZXhwcmVzc2lvbnMuaW5mby9jaGFyYWN0ZXJzLmh0bWwjc3BlY2lhbCkuXG4gKiBJbiBhZGRpdGlvbiB0byBzcGVjaWFsIGNoYXJhY3RlcnMgdGhlIGZvcndhcmQgc2xhc2ggaXMgZXNjYXBlZCB0byBhbGxvdyBmb3JcbiAqIGVhc2llciBgZXZhbGAgdXNlIGFuZCBgRnVuY3Rpb25gIGNvbXBpbGF0aW9uLlxuICovXG52YXIgcmVSZWdFeHBDaGFycyA9IC9bLiorP14ke30oKXxbXFxdXFwvXFxcXF0vZyxcbiAgICByZUhhc1JlZ0V4cENoYXJzID0gUmVnRXhwKHJlUmVnRXhwQ2hhcnMuc291cmNlKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0Z1bmN0aW9uYCB3aXRob3V0IHN1cHBvcnQgZm9yIGVudmlyb25tZW50c1xuICogd2l0aCBpbmNvcnJlY3QgYHR5cGVvZmAgcmVzdWx0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNGdW5jdGlvbih2YWx1ZSkge1xuICAvLyBBdm9pZCBhIENoYWtyYSBKSVQgYnVnIGluIGNvbXBhdGliaWxpdHkgbW9kZXMgb2YgSUUgMTEuXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vamFzaGtlbmFzL3VuZGVyc2NvcmUvaXNzdWVzLzE2MjEgZm9yIG1vcmUgZGV0YWlscy5cbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nIHx8IGZhbHNlO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgaWYgaXQgaXMgbm90IG9uZS4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkXG4gKiBmb3IgYG51bGxgIG9yIGB1bmRlZmluZWRgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6ICh2YWx1ZSArICcnKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZuVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGVzY2FwZVJlZ0V4cChvYmpUb1N0cmluZylcbiAgLnJlcGxhY2UoL3RvU3RyaW5nfChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKiogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIFVpbnQ4QXJyYXkgPSBpc05hdGl2ZShVaW50OEFycmF5ID0gZ2xvYmFsLlVpbnQ4QXJyYXkpICYmIFVpbnQ4QXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0Z1bmN0aW9uID0gIShiYXNlSXNGdW5jdGlvbigveC8pIHx8IChVaW50OEFycmF5ICYmICFiYXNlSXNGdW5jdGlvbihVaW50OEFycmF5KSkpID8gYmFzZUlzRnVuY3Rpb24gOiBmdW5jdGlvbih2YWx1ZSkge1xuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gb2xkZXIgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBTYWZhcmkgd2hpY2ggcmV0dXJuICdmdW5jdGlvbicgZm9yIHJlZ2V4ZXNcbiAgLy8gYW5kIFNhZmFyaSA4IGVxdWl2YWxlbnRzIHdoaWNoIHJldHVybiAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXkgY29uc3RydWN0b3JzLlxuICByZXR1cm4gb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gZnVuY1RhZztcbn07XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNOYXRpdmUoQXJyYXkucHJvdG90eXBlLnB1c2gpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOYXRpdmUoXyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAob2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gZnVuY1RhZykge1xuICAgIHJldHVybiByZU5hdGl2ZS50ZXN0KGZuVG9TdHJpbmcuY2FsbCh2YWx1ZSkpO1xuICB9XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIHJlSG9zdEN0b3IudGVzdCh2YWx1ZSk7XG59XG5cbi8qKlxuICogRXNjYXBlcyB0aGUgYFJlZ0V4cGAgc3BlY2lhbCBjaGFyYWN0ZXJzIFwiXFxcIiwgXCIvXCIsIFwiXlwiLCBcIiRcIiwgXCIuXCIsIFwifFwiLCBcIj9cIixcbiAqIFwiKlwiLCBcIitcIiwgXCIoXCIsIFwiKVwiLCBcIltcIiwgXCJdXCIsIFwie1wiIGFuZCBcIn1cIiBpbiBgc3RyaW5nYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gZXNjYXBlLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgZXNjYXBlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZXNjYXBlUmVnRXhwKCdbbG9kYXNoXShodHRwczovL2xvZGFzaC5jb20vKScpO1xuICogLy8gPT4gJ1xcW2xvZGFzaFxcXVxcKGh0dHBzOlxcL1xcL2xvZGFzaFxcLmNvbVxcL1xcKSdcbiAqL1xuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cmluZykge1xuICBzdHJpbmcgPSBiYXNlVG9TdHJpbmcoc3RyaW5nKTtcbiAgcmV0dXJuIChzdHJpbmcgJiYgcmVIYXNSZWdFeHBDaGFycy50ZXN0KHN0cmluZykpXG4gICAgPyBzdHJpbmcucmVwbGFjZShyZVJlZ0V4cENoYXJzLCAnXFxcXCQmJylcbiAgICA6IHN0cmluZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4xLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBiYXNlRGlmZmVyZW5jZSA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZWRpZmZlcmVuY2UnKSxcbiAgICBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZWZsYXR0ZW4nKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJ2xvZGFzaC5pc2FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCdsb2Rhc2guaXNhcnJheScpLFxuICAgIHJlc3RQYXJhbSA9IHJlcXVpcmUoJ2xvZGFzaC5yZXN0cGFyYW0nKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IGV4Y2x1ZGluZyBhbGwgdmFsdWVzIG9mIHRoZSBwcm92aWRlZCBhcnJheXMgdXNpbmdcbiAqIGBTYW1lVmFsdWVaZXJvYCBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuXG4gKlxuICogKipOb3RlOioqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbnMgYXJlIGxpa2Ugc3RyaWN0IGVxdWFsaXR5IGNvbXBhcmlzb25zLCBlLmcuIGA9PT1gLCBleGNlcHQgdGhhdFxuICogYE5hTmAgbWF0Y2hlcyBgTmFOYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Li4uQXJyYXl9IFt2YWx1ZXNdIFRoZSBhcnJheXMgb2YgdmFsdWVzIHRvIGV4Y2x1ZGUuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheSBvZiBmaWx0ZXJlZCB2YWx1ZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGlmZmVyZW5jZShbMSwgMiwgM10sIFs0LCAyXSk7XG4gKiAvLyA9PiBbMSwgM11cbiAqL1xudmFyIGRpZmZlcmVuY2UgPSByZXN0UGFyYW0oZnVuY3Rpb24oYXJyYXksIHZhbHVlcykge1xuICByZXR1cm4gKGlzQXJyYXkoYXJyYXkpIHx8IGlzQXJndW1lbnRzKGFycmF5KSlcbiAgICA/IGJhc2VEaWZmZXJlbmNlKGFycmF5LCBiYXNlRmxhdHRlbih2YWx1ZXMsIGZhbHNlLCB0cnVlKSlcbiAgICA6IFtdO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGlmZmVyZW5jZTtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4yIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgYmFzZUluZGV4T2YgPSByZXF1aXJlKCdsb2Rhc2guX2Jhc2VpbmRleG9mJyksXG4gICAgY2FjaGVJbmRleE9mID0gcmVxdWlyZSgnbG9kYXNoLl9jYWNoZWluZGV4b2YnKSxcbiAgICBjcmVhdGVDYWNoZSA9IHJlcXVpcmUoJ2xvZGFzaC5fY3JlYXRlY2FjaGUnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5kaWZmZXJlbmNlYCB3aGljaCBhY2NlcHRzIGEgc2luZ2xlIGFycmF5XG4gKiBvZiB2YWx1ZXMgdG8gZXhjbHVkZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byBleGNsdWRlLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgb2YgZmlsdGVyZWQgdmFsdWVzLlxuICovXG5mdW5jdGlvbiBiYXNlRGlmZmVyZW5jZShhcnJheSwgdmFsdWVzKSB7XG4gIHZhciBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDAsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICBpZiAoIWxlbmd0aCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBpbmRleE9mID0gYmFzZUluZGV4T2YsXG4gICAgICBpc0NvbW1vbiA9IHRydWUsXG4gICAgICBjYWNoZSA9IChpc0NvbW1vbiAmJiB2YWx1ZXMubGVuZ3RoID49IDIwMCkgPyBjcmVhdGVDYWNoZSh2YWx1ZXMpIDogbnVsbCxcbiAgICAgIHZhbHVlc0xlbmd0aCA9IHZhbHVlcy5sZW5ndGg7XG5cbiAgaWYgKGNhY2hlKSB7XG4gICAgaW5kZXhPZiA9IGNhY2hlSW5kZXhPZjtcbiAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgIHZhbHVlcyA9IGNhY2hlO1xuICB9XG4gIG91dGVyOlxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcblxuICAgIGlmIChpc0NvbW1vbiAmJiB2YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgIHZhciB2YWx1ZXNJbmRleCA9IHZhbHVlc0xlbmd0aDtcbiAgICAgIHdoaWxlICh2YWx1ZXNJbmRleC0tKSB7XG4gICAgICAgIGlmICh2YWx1ZXNbdmFsdWVzSW5kZXhdID09PSB2YWx1ZSkge1xuICAgICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGluZGV4T2YodmFsdWVzLCB2YWx1ZSwgMCkgPCAwKSB7XG4gICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZURpZmZlcmVuY2U7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjEuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmluZGV4T2ZgIHdpdGhvdXQgc3VwcG9ydCBmb3IgYmluYXJ5IHNlYXJjaGVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcbiAgaWYgKHZhbHVlICE9PSB2YWx1ZSkge1xuICAgIHJldHVybiBpbmRleE9mTmFOKGFycmF5LCBmcm9tSW5kZXgpO1xuICB9XG4gIHZhciBpbmRleCA9IGZyb21JbmRleCAtIDEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoYXJyYXlbaW5kZXhdID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYE5hTmAgaXMgZm91bmQgaW4gYGFycmF5YC5cbiAqIElmIGBmcm9tUmlnaHRgIGlzIHByb3ZpZGVkIGVsZW1lbnRzIG9mIGBhcnJheWAgYXJlIGl0ZXJhdGVkIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNlYXJjaC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCBgTmFOYCwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBpbmRleE9mTmFOKGFycmF5LCBmcm9tSW5kZXgsIGZyb21SaWdodCkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgaW5kZXggPSBmcm9tSW5kZXggKyAoZnJvbVJpZ2h0ID8gMCA6IC0xKTtcblxuICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuICAgIHZhciBvdGhlciA9IGFycmF5W2luZGV4XTtcbiAgICBpZiAob3RoZXIgIT09IG90aGVyKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSW5kZXhPZjtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4xIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgaW4gYGNhY2hlYCBtaW1pY2tpbmcgdGhlIHJldHVybiBzaWduYXR1cmUgb2ZcbiAqIGBfLmluZGV4T2ZgIGJ5IHJldHVybmluZyBgMGAgaWYgdGhlIHZhbHVlIGlzIGZvdW5kLCBlbHNlIGAtMWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBjYWNoZSBUaGUgY2FjaGUgdG8gc2VhcmNoLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgYDBgIGlmIGB2YWx1ZWAgaXMgZm91bmQsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gY2FjaGVJbmRleE9mKGNhY2hlLCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IGNhY2hlLmRhdGEsXG4gICAgICByZXN1bHQgPSAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8IGlzT2JqZWN0KHZhbHVlKSkgPyBkYXRhLnNldC5oYXModmFsdWUpIDogZGF0YS5oYXNoW3ZhbHVlXTtcblxuICByZXR1cm4gcmVzdWx0ID8gMCA6IC0xO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdHlwZSA9PSAnZnVuY3Rpb24nIHx8ICghIXZhbHVlICYmIHR5cGUgPT0gJ29iamVjdCcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhY2hlSW5kZXhPZjtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4xIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgaXNOYXRpdmUgPSByZXF1aXJlKCdsb2Rhc2guaXNuYXRpdmUnKTtcblxuLyoqIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBTZXQgPSBpc05hdGl2ZShTZXQgPSBnbG9iYWwuU2V0KSAmJiBTZXQ7XG5cbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlQ3JlYXRlID0gaXNOYXRpdmUobmF0aXZlQ3JlYXRlID0gT2JqZWN0LmNyZWF0ZSkgJiYgbmF0aXZlQ3JlYXRlO1xuXG4vKipcbiAqXG4gKiBDcmVhdGVzIGEgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIHVuaXF1ZSB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFNldENhY2hlKHZhbHVlcykge1xuICB2YXIgbGVuZ3RoID0gdmFsdWVzID8gdmFsdWVzLmxlbmd0aCA6IDA7XG5cbiAgdGhpcy5kYXRhID0geyAnaGFzaCc6IG5hdGl2ZUNyZWF0ZShudWxsKSwgJ3NldCc6IG5ldyBTZXQgfTtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgdGhpcy5wdXNoKHZhbHVlc1tsZW5ndGhdKTtcbiAgfVxufVxuXG4vKipcbiAqIEFkZHMgYHZhbHVlYCB0byB0aGUgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHB1c2hcbiAqIEBtZW1iZXJPZiBTZXRDYWNoZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIGNhY2hlUHVzaCh2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCBpc09iamVjdCh2YWx1ZSkpIHtcbiAgICBkYXRhLnNldC5hZGQodmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIGRhdGEuaGFzaFt2YWx1ZV0gPSB0cnVlO1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBTZXRgIGNhY2hlIG9iamVjdCB0byBvcHRpbWl6ZSBsaW5lYXIgc2VhcmNoZXMgb2YgbGFyZ2UgYXJyYXlzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIGNhY2hlLlxuICogQHJldHVybnMge251bGx8T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgY2FjaGUgb2JqZWN0IGlmIGBTZXRgIGlzIHN1cHBvcnRlZCwgZWxzZSBgbnVsbGAuXG4gKi9cbnZhciBjcmVhdGVDYWNoZSA9ICEobmF0aXZlQ3JlYXRlICYmIFNldCkgPyBjb25zdGFudChudWxsKSA6IGZ1bmN0aW9uKHZhbHVlcykge1xuICByZXR1cm4gbmV3IFNldENhY2hlKHZhbHVlcyk7XG59O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdHlwZSA9PSAnZnVuY3Rpb24nIHx8ICghIXZhbHVlICYmIHR5cGUgPT0gJ29iamVjdCcpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYHZhbHVlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxpdHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHJldHVybiBmcm9tIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAqIHZhciBnZXR0ZXIgPSBfLmNvbnN0YW50KG9iamVjdCk7XG4gKlxuICogZ2V0dGVyKCkgPT09IG9iamVjdDtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gY29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbn1cblxuLy8gQWRkIGZ1bmN0aW9ucyB0byB0aGUgYFNldGAgY2FjaGUuXG5TZXRDYWNoZS5wcm90b3R5cGUucHVzaCA9IGNhY2hlUHVzaDtcblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVDYWNoZTtcbiIsIi8qKlxuICogbG9kYXNoIDMuMS4xIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgaXNBcmd1bWVudHMgPSByZXF1aXJlKCdsb2Rhc2guaXNhcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnbG9kYXNoLmlzYXJyYXknKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIFVzZWQgYXMgdGhlIFttYXhpbXVtIGxlbmd0aF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW51bWJlci5tYXhfc2FmZV9pbnRlZ2VyKVxuICogb2YgYW4gYXJyYXktbGlrZSB2YWx1ZS5cbiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZsYXR0ZW5gIHdpdGggYWRkZWQgc3VwcG9ydCBmb3IgcmVzdHJpY3RpbmdcbiAqIGZsYXR0ZW5pbmcgYW5kIHNwZWNpZnlpbmcgdGhlIHN0YXJ0IGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmxhdHRlbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEZWVwIFNwZWNpZnkgYSBkZWVwIGZsYXR0ZW4uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzU3RyaWN0IFJlc3RyaWN0IGZsYXR0ZW5pbmcgdG8gYXJyYXlzIGFuZCBgYXJndW1lbnRzYCBvYmplY3RzLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmxhdHRlbmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBiYXNlRmxhdHRlbihhcnJheSwgaXNEZWVwLCBpc1N0cmljdCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc0luZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcblxuICAgIGlmIChpc09iamVjdExpa2UodmFsdWUpICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgKGlzQXJyYXkodmFsdWUpIHx8IGlzQXJndW1lbnRzKHZhbHVlKSkpIHtcbiAgICAgIGlmIChpc0RlZXApIHtcbiAgICAgICAgLy8gUmVjdXJzaXZlbHkgZmxhdHRlbiBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICAgICAgdmFsdWUgPSBiYXNlRmxhdHRlbih2YWx1ZSwgaXNEZWVwLCBpc1N0cmljdCk7XG4gICAgICB9XG4gICAgICB2YXIgdmFsSW5kZXggPSAtMSxcbiAgICAgICAgICB2YWxMZW5ndGggPSB2YWx1ZS5sZW5ndGg7XG5cbiAgICAgIHJlc3VsdC5sZW5ndGggKz0gdmFsTGVuZ3RoO1xuICAgICAgd2hpbGUgKCsrdmFsSW5kZXggPCB2YWxMZW5ndGgpIHtcbiAgICAgICAgcmVzdWx0WysrcmVzSW5kZXhdID0gdmFsdWVbdmFsSW5kZXhdO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIWlzU3RyaWN0KSB7XG4gICAgICByZXN1bHRbKytyZXNJbmRleF0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGbGF0dGVuO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4yLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBiYXNlQ2FsbGJhY2sgPSByZXF1aXJlKCdsb2Rhc2guX2Jhc2VjYWxsYmFjaycpLFxuICAgIGJhc2VFYWNoID0gcmVxdWlyZSgnbG9kYXNoLl9iYXNlZWFjaCcpLFxuICAgIGJhc2VGaW5kID0gcmVxdWlyZSgnbG9kYXNoLl9iYXNlZmluZCcpLFxuICAgIGJhc2VGaW5kSW5kZXggPSByZXF1aXJlKCdsb2Rhc2guX2Jhc2VmaW5kaW5kZXgnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnbG9kYXNoLmlzYXJyYXknKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnbG9kYXNoLmtleXMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYF8uZmluZGAgb3IgYF8uZmluZExhc3RgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYWNoRnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGEgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZmluZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlRmluZChlYWNoRnVuYywgZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBwcmVkaWNhdGUsIHRoaXNBcmcpIHtcbiAgICBwcmVkaWNhdGUgPSBiYXNlQ2FsbGJhY2socHJlZGljYXRlLCB0aGlzQXJnLCAzKTtcbiAgICBpZiAoaXNBcnJheShjb2xsZWN0aW9uKSkge1xuICAgICAgdmFyIGluZGV4ID0gYmFzZUZpbmRJbmRleChjb2xsZWN0aW9uLCBwcmVkaWNhdGUsIGZyb21SaWdodCk7XG4gICAgICByZXR1cm4gaW5kZXggPiAtMSA/IGNvbGxlY3Rpb25baW5kZXhdIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gYmFzZUZpbmQoY29sbGVjdGlvbiwgcHJlZGljYXRlLCBlYWNoRnVuYyk7XG4gIH1cbn1cblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGBjb2xsZWN0aW9uYCwgcmV0dXJuaW5nIHRoZSBmaXJzdCBlbGVtZW50XG4gKiBgcHJlZGljYXRlYCByZXR1cm5zIHRydXRoeSBmb3IuIFRoZSBwcmVkaWNhdGUgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZFxuICogaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICpcbiAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYHByZWRpY2F0ZWAgdGhlIGNyZWF0ZWQgYF8ucHJvcGVydHlgXG4gKiBzdHlsZSBjYWxsYmFjayByZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAqXG4gKiBJZiBhIHZhbHVlIGlzIGFsc28gcHJvdmlkZWQgZm9yIGB0aGlzQXJnYCB0aGUgY3JlYXRlZCBgXy5tYXRjaGVzUHJvcGVydHlgXG4gKiBzdHlsZSBjYWxsYmFjayByZXR1cm5zIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIGEgbWF0Y2hpbmcgcHJvcGVydHlcbiAqIHZhbHVlLCBlbHNlIGBmYWxzZWAuXG4gKlxuICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgcHJlZGljYXRlYCB0aGUgY3JlYXRlZCBgXy5tYXRjaGVzYCBzdHlsZVxuICogY2FsbGJhY2sgcmV0dXJucyBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW5cbiAqIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAYWxpYXMgZGV0ZWN0XG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHNlYXJjaC5cbiAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW3ByZWRpY2F0ZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZFxuICogIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYHByZWRpY2F0ZWAuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWF0Y2hlZCBlbGVtZW50LCBlbHNlIGB1bmRlZmluZWRgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgdXNlcnMgPSBbXG4gKiAgIHsgJ3VzZXInOiAnYmFybmV5JywgICdhZ2UnOiAzNiwgJ2FjdGl2ZSc6IHRydWUgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJywgICAgJ2FnZSc6IDQwLCAnYWN0aXZlJzogZmFsc2UgfSxcbiAqICAgeyAndXNlcic6ICdwZWJibGVzJywgJ2FnZSc6IDEsICAnYWN0aXZlJzogdHJ1ZSB9XG4gKiBdO1xuICpcbiAqIF8ucmVzdWx0KF8uZmluZCh1c2VycywgZnVuY3Rpb24oY2hyKSB7XG4gKiAgIHJldHVybiBjaHIuYWdlIDwgNDA7XG4gKiB9KSwgJ3VzZXInKTtcbiAqIC8vID0+ICdiYXJuZXknXG4gKlxuICogLy8gdXNpbmcgdGhlIGBfLm1hdGNoZXNgIGNhbGxiYWNrIHNob3J0aGFuZFxuICogXy5yZXN1bHQoXy5maW5kKHVzZXJzLCB7ICdhZ2UnOiAxLCAnYWN0aXZlJzogdHJ1ZSB9KSwgJ3VzZXInKTtcbiAqIC8vID0+ICdwZWJibGVzJ1xuICpcbiAqIC8vIHVzaW5nIHRoZSBgXy5tYXRjaGVzUHJvcGVydHlgIGNhbGxiYWNrIHNob3J0aGFuZFxuICogXy5yZXN1bHQoXy5maW5kKHVzZXJzLCAnYWN0aXZlJywgZmFsc2UpLCAndXNlcicpO1xuICogLy8gPT4gJ2ZyZWQnXG4gKlxuICogLy8gdXNpbmcgdGhlIGBfLnByb3BlcnR5YCBjYWxsYmFjayBzaG9ydGhhbmRcbiAqIF8ucmVzdWx0KF8uZmluZCh1c2VycywgJ2FjdGl2ZScpLCAndXNlcicpO1xuICogLy8gPT4gJ2Jhcm5leSdcbiAqL1xudmFyIGZpbmQgPSBjcmVhdGVGaW5kKGJhc2VFYWNoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmaW5kO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4xLjMgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBiYXNlSXNFcXVhbCA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZWlzZXF1YWwnKSxcbiAgICBiaW5kQ2FsbGJhY2sgPSByZXF1aXJlKCdsb2Rhc2guX2JpbmRjYWxsYmFjaycpLFxuICAgIGtleXMgPSByZXF1aXJlKCdsb2Rhc2gua2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmNhbGxiYWNrYCB3aGljaCBzdXBwb3J0cyBzcGVjaWZ5aW5nIHRoZVxuICogbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBwcm92aWRlIHRvIGBmdW5jYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSBbZnVuYz1fLmlkZW50aXR5XSBUaGUgdmFsdWUgdG8gY29udmVydCB0byBhIGNhbGxiYWNrLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJnQ291bnRdIFRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRvIHByb3ZpZGUgdG8gYGZ1bmNgLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBjYWxsYmFjay5cbiAqL1xuZnVuY3Rpb24gYmFzZUNhbGxiYWNrKGZ1bmMsIHRoaXNBcmcsIGFyZ0NvdW50KSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIGZ1bmM7XG4gIGlmICh0eXBlID09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXNBcmcgPT0gJ3VuZGVmaW5lZCdcbiAgICAgID8gZnVuY1xuICAgICAgOiBiaW5kQ2FsbGJhY2soZnVuYywgdGhpc0FyZywgYXJnQ291bnQpO1xuICB9XG4gIGlmIChmdW5jID09IG51bGwpIHtcbiAgICByZXR1cm4gaWRlbnRpdHk7XG4gIH1cbiAgaWYgKHR5cGUgPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gYmFzZU1hdGNoZXMoZnVuYyk7XG4gIH1cbiAgcmV0dXJuIHR5cGVvZiB0aGlzQXJnID09ICd1bmRlZmluZWQnXG4gICAgPyBiYXNlUHJvcGVydHkoZnVuYyArICcnKVxuICAgIDogYmFzZU1hdGNoZXNQcm9wZXJ0eShmdW5jICsgJycsIHRoaXNBcmcpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTWF0Y2hgIHdpdGhvdXQgc3VwcG9ydCBmb3IgY2FsbGJhY2tcbiAqIHNob3J0aGFuZHMgYW5kIGB0aGlzYCBiaW5kaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBzb3VyY2UgcHJvcGVydHkgbmFtZXMgdG8gbWF0Y2guXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHNvdXJjZSB2YWx1ZXMgdG8gbWF0Y2guXG4gKiBAcGFyYW0ge0FycmF5fSBzdHJpY3RDb21wYXJlRmxhZ3MgU3RyaWN0IGNvbXBhcmlzb24gZmxhZ3MgZm9yIHNvdXJjZSB2YWx1ZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpbmcgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgb2JqZWN0YCBpcyBhIG1hdGNoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc01hdGNoKG9iamVjdCwgcHJvcHMsIHZhbHVlcywgc3RyaWN0Q29tcGFyZUZsYWdzLCBjdXN0b21pemVyKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgbm9DdXN0b21pemVyID0gIWN1c3RvbWl6ZXI7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoKG5vQ3VzdG9taXplciAmJiBzdHJpY3RDb21wYXJlRmxhZ3NbaW5kZXhdKVxuICAgICAgICAgID8gdmFsdWVzW2luZGV4XSAhPT0gb2JqZWN0W3Byb3BzW2luZGV4XV1cbiAgICAgICAgICA6ICEocHJvcHNbaW5kZXhdIGluIG9iamVjdClcbiAgICAgICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIGluZGV4ID0gLTE7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XSxcbiAgICAgICAgb2JqVmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgc3JjVmFsdWUgPSB2YWx1ZXNbaW5kZXhdO1xuXG4gICAgaWYgKG5vQ3VzdG9taXplciAmJiBzdHJpY3RDb21wYXJlRmxhZ3NbaW5kZXhdKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdHlwZW9mIG9ialZhbHVlICE9ICd1bmRlZmluZWQnIHx8IChrZXkgaW4gb2JqZWN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gY3VzdG9taXplciA/IGN1c3RvbWl6ZXIob2JqVmFsdWUsIHNyY1ZhbHVlLCBrZXkpIDogdW5kZWZpbmVkO1xuICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmVzdWx0ID0gYmFzZUlzRXF1YWwoc3JjVmFsdWUsIG9ialZhbHVlLCBjdXN0b21pemVyLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWF0Y2hlc2Agd2hpY2ggZG9lcyBub3QgY2xvbmUgYHNvdXJjZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCBvZiBwcm9wZXJ0eSB2YWx1ZXMgdG8gbWF0Y2guXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZU1hdGNoZXMoc291cmNlKSB7XG4gIHZhciBwcm9wcyA9IGtleXMoc291cmNlKSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICBpZiAoIWxlbmd0aCkge1xuICAgIHJldHVybiBjb25zdGFudCh0cnVlKTtcbiAgfVxuICBpZiAobGVuZ3RoID09IDEpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbMF0sXG4gICAgICAgIHZhbHVlID0gc291cmNlW2tleV07XG5cbiAgICBpZiAoaXNTdHJpY3RDb21wYXJhYmxlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYgb2JqZWN0W2tleV0gPT09IHZhbHVlICYmXG4gICAgICAgICAgKHR5cGVvZiB2YWx1ZSAhPSAndW5kZWZpbmVkJyB8fCAoa2V5IGluIHRvT2JqZWN0KG9iamVjdCkpKTtcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIHZhciB2YWx1ZXMgPSBBcnJheShsZW5ndGgpLFxuICAgICAgc3RyaWN0Q29tcGFyZUZsYWdzID0gQXJyYXkobGVuZ3RoKTtcblxuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICB2YWx1ZSA9IHNvdXJjZVtwcm9wc1tsZW5ndGhdXTtcbiAgICB2YWx1ZXNbbGVuZ3RoXSA9IHZhbHVlO1xuICAgIHN0cmljdENvbXBhcmVGbGFnc1tsZW5ndGhdID0gaXNTdHJpY3RDb21wYXJhYmxlKHZhbHVlKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCAhPSBudWxsICYmIGJhc2VJc01hdGNoKHRvT2JqZWN0KG9iamVjdCksIHByb3BzLCB2YWx1ZXMsIHN0cmljdENvbXBhcmVGbGFncyk7XG4gIH07XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWF0Y2hlc1Byb3BlcnR5YCB3aGljaCBkb2VzIG5vdCBjb2VyY2UgYGtleWBcbiAqIHRvIGEgc3RyaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZU1hdGNoZXNQcm9wZXJ0eShrZXksIHZhbHVlKSB7XG4gIGlmIChpc1N0cmljdENvbXBhcmFibGUodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgcmV0dXJuIG9iamVjdCAhPSBudWxsICYmIG9iamVjdFtrZXldID09PSB2YWx1ZSAmJlxuICAgICAgICAodHlwZW9mIHZhbHVlICE9ICd1bmRlZmluZWQnIHx8IChrZXkgaW4gdG9PYmplY3Qob2JqZWN0KSkpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBiYXNlSXNFcXVhbCh2YWx1ZSwgb2JqZWN0W2tleV0sIG51bGwsIHRydWUpO1xuICB9O1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnByb3BlcnR5YCB3aGljaCBkb2VzIG5vdCBjb2VyY2UgYGtleWAgdG8gYSBzdHJpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VQcm9wZXJ0eShrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICB9O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciBzdHJpY3QgZXF1YWxpdHkgY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaWYgc3VpdGFibGUgZm9yIHN0cmljdFxuICogIGVxdWFsaXR5IGNvbXBhcmlzb25zLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaWN0Q29tcGFyYWJsZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT09IHZhbHVlICYmICh2YWx1ZSA9PT0gMCA/ICgoMSAvIHZhbHVlKSA+IDApIDogIWlzT2JqZWN0KHZhbHVlKSk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhbiBvYmplY3QgaWYgaXQgaXMgbm90IG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gdG9PYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSA/IHZhbHVlIDogT2JqZWN0KHZhbHVlKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgW2xhbmd1YWdlIHR5cGVdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHR5cGUgPT0gJ2Z1bmN0aW9uJyB8fCAoISF2YWx1ZSAmJiB0eXBlID09ICdvYmplY3QnKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGB2YWx1ZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsaXR5XG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byByZXR1cm4gZnJvbSB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICd1c2VyJzogJ2ZyZWQnIH07XG4gKiB2YXIgZ2V0dGVyID0gXy5jb25zdGFudChvYmplY3QpO1xuICpcbiAqIGdldHRlcigpID09PSBvYmplY3Q7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGNvbnN0YW50KHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgZmlyc3QgYXJndW1lbnQgcHJvdmlkZWQgdG8gaXQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsaXR5XG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICd1c2VyJzogJ2ZyZWQnIH07XG4gKlxuICogXy5pZGVudGl0eShvYmplY3QpID09PSBvYmplY3Q7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ2FsbGJhY2s7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMyAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCdsb2Rhc2guaXNhcnJheScpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJ2xvZGFzaC5pc3R5cGVkYXJyYXknKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnbG9kYXNoLmtleXMnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJztcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzRXF1YWxgIHdpdGhvdXQgc3VwcG9ydCBmb3IgYHRoaXNgIGJpbmRpbmdcbiAqIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaW5nIHZhbHVlcy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzTG9vc2VdIFNwZWNpZnkgcGVyZm9ybWluZyBwYXJ0aWFsIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQV0gVHJhY2tzIHRyYXZlcnNlZCBgdmFsdWVgIG9iamVjdHMuXG4gKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tCXSBUcmFja3MgdHJhdmVyc2VkIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsKHZhbHVlLCBvdGhlciwgY3VzdG9taXplciwgaXNMb29zZSwgc3RhY2tBLCBzdGFja0IpIHtcbiAgLy8gRXhpdCBlYXJseSBmb3IgaWRlbnRpY2FsIHZhbHVlcy5cbiAgaWYgKHZhbHVlID09PSBvdGhlcikge1xuICAgIC8vIFRyZWF0IGArMGAgdnMuIGAtMGAgYXMgbm90IGVxdWFsLlxuICAgIHJldHVybiB2YWx1ZSAhPT0gMCB8fCAoMSAvIHZhbHVlID09IDEgLyBvdGhlcik7XG4gIH1cbiAgdmFyIHZhbFR5cGUgPSB0eXBlb2YgdmFsdWUsXG4gICAgICBvdGhUeXBlID0gdHlwZW9mIG90aGVyO1xuXG4gIC8vIEV4aXQgZWFybHkgZm9yIHVubGlrZSBwcmltaXRpdmUgdmFsdWVzLlxuICBpZiAoKHZhbFR5cGUgIT0gJ2Z1bmN0aW9uJyAmJiB2YWxUeXBlICE9ICdvYmplY3QnICYmIG90aFR5cGUgIT0gJ2Z1bmN0aW9uJyAmJiBvdGhUeXBlICE9ICdvYmplY3QnKSB8fFxuICAgICAgdmFsdWUgPT0gbnVsbCB8fCBvdGhlciA9PSBudWxsKSB7XG4gICAgLy8gUmV0dXJuIGBmYWxzZWAgdW5sZXNzIGJvdGggdmFsdWVzIGFyZSBgTmFOYC5cbiAgICByZXR1cm4gdmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcjtcbiAgfVxuICByZXR1cm4gYmFzZUlzRXF1YWxEZWVwKHZhbHVlLCBvdGhlciwgYmFzZUlzRXF1YWwsIGN1c3RvbWl6ZXIsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsYCBmb3IgYXJyYXlzIGFuZCBvYmplY3RzIHdoaWNoIHBlcmZvcm1zXG4gKiBkZWVwIGNvbXBhcmlzb25zIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMgZW5hYmxpbmcgb2JqZWN0cyB3aXRoIGNpcmN1bGFyXG4gKiByZWZlcmVuY2VzIHRvIGJlIGNvbXBhcmVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpbmcgb2JqZWN0cy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzTG9vc2VdIFNwZWNpZnkgcGVyZm9ybWluZyBwYXJ0aWFsIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQT1bXV0gVHJhY2tzIHRyYXZlcnNlZCBgdmFsdWVgIG9iamVjdHMuXG4gKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tCPVtdXSBUcmFja3MgdHJhdmVyc2VkIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNFcXVhbERlZXAob2JqZWN0LCBvdGhlciwgZXF1YWxGdW5jLCBjdXN0b21pemVyLCBpc0xvb3NlLCBzdGFja0EsIHN0YWNrQikge1xuICB2YXIgb2JqSXNBcnIgPSBpc0FycmF5KG9iamVjdCksXG4gICAgICBvdGhJc0FyciA9IGlzQXJyYXkob3RoZXIpLFxuICAgICAgb2JqVGFnID0gYXJyYXlUYWcsXG4gICAgICBvdGhUYWcgPSBhcnJheVRhZztcblxuICBpZiAoIW9iaklzQXJyKSB7XG4gICAgb2JqVGFnID0gb2JqVG9TdHJpbmcuY2FsbChvYmplY3QpO1xuICAgIGlmIChvYmpUYWcgPT0gYXJnc1RhZykge1xuICAgICAgb2JqVGFnID0gb2JqZWN0VGFnO1xuICAgIH0gZWxzZSBpZiAob2JqVGFnICE9IG9iamVjdFRhZykge1xuICAgICAgb2JqSXNBcnIgPSBpc1R5cGVkQXJyYXkob2JqZWN0KTtcbiAgICB9XG4gIH1cbiAgaWYgKCFvdGhJc0Fycikge1xuICAgIG90aFRhZyA9IG9ialRvU3RyaW5nLmNhbGwob3RoZXIpO1xuICAgIGlmIChvdGhUYWcgPT0gYXJnc1RhZykge1xuICAgICAgb3RoVGFnID0gb2JqZWN0VGFnO1xuICAgIH0gZWxzZSBpZiAob3RoVGFnICE9IG9iamVjdFRhZykge1xuICAgICAgb3RoSXNBcnIgPSBpc1R5cGVkQXJyYXkob3RoZXIpO1xuICAgIH1cbiAgfVxuICB2YXIgb2JqSXNPYmogPSAob2JqVGFnID09IG9iamVjdFRhZyB8fCAoaXNMb29zZSAmJiBvYmpUYWcgPT0gZnVuY1RhZykpLFxuICAgICAgb3RoSXNPYmogPSAob3RoVGFnID09IG9iamVjdFRhZyB8fCAoaXNMb29zZSAmJiBvdGhUYWcgPT0gZnVuY1RhZykpLFxuICAgICAgaXNTYW1lVGFnID0gb2JqVGFnID09IG90aFRhZztcblxuICBpZiAoaXNTYW1lVGFnICYmICEob2JqSXNBcnIgfHwgb2JqSXNPYmopKSB7XG4gICAgcmV0dXJuIGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgb2JqVGFnKTtcbiAgfVxuICBpZiAoaXNMb29zZSkge1xuICAgIGlmICghaXNTYW1lVGFnICYmICEob2JqSXNPYmogJiYgb3RoSXNPYmopKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciB2YWxXcmFwcGVkID0gb2JqSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsICdfX3dyYXBwZWRfXycpLFxuICAgICAgICBvdGhXcmFwcGVkID0gb3RoSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwgJ19fd3JhcHBlZF9fJyk7XG5cbiAgICBpZiAodmFsV3JhcHBlZCB8fCBvdGhXcmFwcGVkKSB7XG4gICAgICByZXR1cm4gZXF1YWxGdW5jKHZhbFdyYXBwZWQgPyBvYmplY3QudmFsdWUoKSA6IG9iamVjdCwgb3RoV3JhcHBlZCA/IG90aGVyLnZhbHVlKCkgOiBvdGhlciwgY3VzdG9taXplciwgaXNMb29zZSwgc3RhY2tBLCBzdGFja0IpO1xuICAgIH1cbiAgICBpZiAoIWlzU2FtZVRhZykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gIC8vIEZvciBtb3JlIGluZm9ybWF0aW9uIG9uIGRldGVjdGluZyBjaXJjdWxhciByZWZlcmVuY2VzIHNlZSBodHRwczovL2VzNS5naXRodWIuaW8vI0pPLlxuICBzdGFja0EgfHwgKHN0YWNrQSA9IFtdKTtcbiAgc3RhY2tCIHx8IChzdGFja0IgPSBbXSk7XG5cbiAgdmFyIGxlbmd0aCA9IHN0YWNrQS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChzdGFja0FbbGVuZ3RoXSA9PSBvYmplY3QpIHtcbiAgICAgIHJldHVybiBzdGFja0JbbGVuZ3RoXSA9PSBvdGhlcjtcbiAgICB9XG4gIH1cbiAgLy8gQWRkIGBvYmplY3RgIGFuZCBgb3RoZXJgIHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgc3RhY2tBLnB1c2gob2JqZWN0KTtcbiAgc3RhY2tCLnB1c2gob3RoZXIpO1xuXG4gIHZhciByZXN1bHQgPSAob2JqSXNBcnIgPyBlcXVhbEFycmF5cyA6IGVxdWFsT2JqZWN0cykob2JqZWN0LCBvdGhlciwgZXF1YWxGdW5jLCBjdXN0b21pemVyLCBpc0xvb3NlLCBzdGFja0EsIHN0YWNrQik7XG5cbiAgc3RhY2tBLnBvcCgpO1xuICBzdGFja0IucG9wKCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIGFycmF5cyB3aXRoIHN1cHBvcnQgZm9yXG4gKiBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtBcnJheX0gb3RoZXIgVGhlIG90aGVyIGFycmF5IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpbmcgYXJyYXlzLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNMb29zZV0gU3BlY2lmeSBwZXJmb3JtaW5nIHBhcnRpYWwgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tBXSBUcmFja3MgdHJhdmVyc2VkIGB2YWx1ZWAgb2JqZWN0cy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0JdIFRyYWNrcyB0cmF2ZXJzZWQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcnJheXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxBcnJheXMoYXJyYXksIG90aGVyLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgYXJyTGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgb3RoTGVuZ3RoID0gb3RoZXIubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gdHJ1ZTtcblxuICBpZiAoYXJyTGVuZ3RoICE9IG90aExlbmd0aCAmJiAhKGlzTG9vc2UgJiYgb3RoTGVuZ3RoID4gYXJyTGVuZ3RoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBEZWVwIGNvbXBhcmUgdGhlIGNvbnRlbnRzLCBpZ25vcmluZyBub24tbnVtZXJpYyBwcm9wZXJ0aWVzLlxuICB3aGlsZSAocmVzdWx0ICYmICsraW5kZXggPCBhcnJMZW5ndGgpIHtcbiAgICB2YXIgYXJyVmFsdWUgPSBhcnJheVtpbmRleF0sXG4gICAgICAgIG90aFZhbHVlID0gb3RoZXJbaW5kZXhdO1xuXG4gICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICByZXN1bHQgPSBpc0xvb3NlXG4gICAgICAgID8gY3VzdG9taXplcihvdGhWYWx1ZSwgYXJyVmFsdWUsIGluZGV4KVxuICAgICAgICA6IGN1c3RvbWl6ZXIoYXJyVmFsdWUsIG90aFZhbHVlLCBpbmRleCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcmVzdWx0ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgICAgaWYgKGlzTG9vc2UpIHtcbiAgICAgICAgdmFyIG90aEluZGV4ID0gb3RoTGVuZ3RoO1xuICAgICAgICB3aGlsZSAob3RoSW5kZXgtLSkge1xuICAgICAgICAgIG90aFZhbHVlID0gb3RoZXJbb3RoSW5kZXhdO1xuICAgICAgICAgIHJlc3VsdCA9IChhcnJWYWx1ZSAmJiBhcnJWYWx1ZSA9PT0gb3RoVmFsdWUpIHx8IGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGN1c3RvbWl6ZXIsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKTtcbiAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IChhcnJWYWx1ZSAmJiBhcnJWYWx1ZSA9PT0gb3RoVmFsdWUpIHx8IGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGN1c3RvbWl6ZXIsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuICEhcmVzdWx0O1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgY29tcGFyaW5nIG9iamVjdHMgb2ZcbiAqIHRoZSBzYW1lIGB0b1N0cmluZ1RhZ2AuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gb25seSBzdXBwb3J0cyBjb21wYXJpbmcgdmFsdWVzIHdpdGggdGFncyBvZlxuICogYEJvb2xlYW5gLCBgRGF0ZWAsIGBFcnJvcmAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgb3IgYFN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZSBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZyBUaGUgYHRvU3RyaW5nVGFnYCBvZiB0aGUgb2JqZWN0cyB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgdGFnKSB7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBib29sVGFnOlxuICAgIGNhc2UgZGF0ZVRhZzpcbiAgICAgIC8vIENvZXJjZSBkYXRlcyBhbmQgYm9vbGVhbnMgdG8gbnVtYmVycywgZGF0ZXMgdG8gbWlsbGlzZWNvbmRzIGFuZCBib29sZWFuc1xuICAgICAgLy8gdG8gYDFgIG9yIGAwYCB0cmVhdGluZyBpbnZhbGlkIGRhdGVzIGNvZXJjZWQgdG8gYE5hTmAgYXMgbm90IGVxdWFsLlxuICAgICAgcmV0dXJuICtvYmplY3QgPT0gK290aGVyO1xuXG4gICAgY2FzZSBlcnJvclRhZzpcbiAgICAgIHJldHVybiBvYmplY3QubmFtZSA9PSBvdGhlci5uYW1lICYmIG9iamVjdC5tZXNzYWdlID09IG90aGVyLm1lc3NhZ2U7XG5cbiAgICBjYXNlIG51bWJlclRhZzpcbiAgICAgIC8vIFRyZWF0IGBOYU5gIHZzLiBgTmFOYCBhcyBlcXVhbC5cbiAgICAgIHJldHVybiAob2JqZWN0ICE9ICtvYmplY3QpXG4gICAgICAgID8gb3RoZXIgIT0gK290aGVyXG4gICAgICAgIC8vIEJ1dCwgdHJlYXQgYC0wYCB2cy4gYCswYCBhcyBub3QgZXF1YWwuXG4gICAgICAgIDogKG9iamVjdCA9PSAwID8gKCgxIC8gb2JqZWN0KSA9PSAoMSAvIG90aGVyKSkgOiBvYmplY3QgPT0gK290aGVyKTtcblxuICAgIGNhc2UgcmVnZXhwVGFnOlxuICAgIGNhc2Ugc3RyaW5nVGFnOlxuICAgICAgLy8gQ29lcmNlIHJlZ2V4ZXMgdG8gc3RyaW5ncyBhbmQgdHJlYXQgc3RyaW5ncyBwcmltaXRpdmVzIGFuZCBzdHJpbmdcbiAgICAgIC8vIG9iamVjdHMgYXMgZXF1YWwuIFNlZSBodHRwczovL2VzNS5naXRodWIuaW8vI3gxNS4xMC42LjQgZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgIHJldHVybiBvYmplY3QgPT0gKG90aGVyICsgJycpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIG9iamVjdHMgd2l0aCBzdXBwb3J0IGZvclxuICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpbmcgdmFsdWVzLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNMb29zZV0gU3BlY2lmeSBwZXJmb3JtaW5nIHBhcnRpYWwgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tBXSBUcmFja3MgdHJhdmVyc2VkIGB2YWx1ZWAgb2JqZWN0cy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0JdIFRyYWNrcyB0cmF2ZXJzZWQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKSB7XG4gIHZhciBvYmpQcm9wcyA9IGtleXMob2JqZWN0KSxcbiAgICAgIG9iakxlbmd0aCA9IG9ialByb3BzLmxlbmd0aCxcbiAgICAgIG90aFByb3BzID0ga2V5cyhvdGhlciksXG4gICAgICBvdGhMZW5ndGggPSBvdGhQcm9wcy5sZW5ndGg7XG5cbiAgaWYgKG9iakxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIWlzTG9vc2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHNraXBDdG9yID0gaXNMb29zZSxcbiAgICAgIGluZGV4ID0gLTE7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBvYmpMZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gb2JqUHJvcHNbaW5kZXhdLFxuICAgICAgICByZXN1bHQgPSBpc0xvb3NlID8ga2V5IGluIG90aGVyIDogaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwga2V5KTtcblxuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldLFxuICAgICAgICAgIG90aFZhbHVlID0gb3RoZXJba2V5XTtcblxuICAgICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICAgICAgcmVzdWx0ID0gaXNMb29zZVxuICAgICAgICAgID8gY3VzdG9taXplcihvdGhWYWx1ZSwgb2JqVmFsdWUsIGtleSlcbiAgICAgICAgICA6IGN1c3RvbWl6ZXIob2JqVmFsdWUsIG90aFZhbHVlLCBrZXkpO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgICAgIHJlc3VsdCA9IChvYmpWYWx1ZSAmJiBvYmpWYWx1ZSA9PT0gb3RoVmFsdWUpIHx8IGVxdWFsRnVuYyhvYmpWYWx1ZSwgb3RoVmFsdWUsIGN1c3RvbWl6ZXIsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgc2tpcEN0b3IgfHwgKHNraXBDdG9yID0ga2V5ID09ICdjb25zdHJ1Y3RvcicpO1xuICB9XG4gIGlmICghc2tpcEN0b3IpIHtcbiAgICB2YXIgb2JqQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcixcbiAgICAgICAgb3RoQ3RvciA9IG90aGVyLmNvbnN0cnVjdG9yO1xuXG4gICAgLy8gTm9uIGBPYmplY3RgIG9iamVjdCBpbnN0YW5jZXMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1YWwuXG4gICAgaWYgKG9iakN0b3IgIT0gb3RoQ3RvciAmJlxuICAgICAgICAoJ2NvbnN0cnVjdG9yJyBpbiBvYmplY3QgJiYgJ2NvbnN0cnVjdG9yJyBpbiBvdGhlcikgJiZcbiAgICAgICAgISh0eXBlb2Ygb2JqQ3RvciA9PSAnZnVuY3Rpb24nICYmIG9iakN0b3IgaW5zdGFuY2VvZiBvYmpDdG9yICYmXG4gICAgICAgICAgdHlwZW9mIG90aEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvdGhDdG9yIGluc3RhbmNlb2Ygb3RoQ3RvcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzRXF1YWw7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9XG50eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9IHR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIFVzZWQgYXMgdGhlIFttYXhpbXVtIGxlbmd0aF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW51bWJlci5tYXhfc2FmZV9pbnRlZ2VyKVxuICogb2YgYW4gYXJyYXktbGlrZSB2YWx1ZS5cbiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgYmFzZWQgb24gW2BUb0xlbmd0aGBdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShuZXcgVWludDhBcnJheSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkoW10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tvYmpUb1N0cmluZy5jYWxsKHZhbHVlKV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNUeXBlZEFycmF5O1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjcuMCA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5maW5kYCwgYF8uZmluZExhc3RgLCBgXy5maW5kS2V5YCwgYW5kIGBfLmZpbmRMYXN0S2V5YCxcbiAqIHdpdGhvdXQgc3VwcG9ydCBmb3IgY2FsbGJhY2sgc2hvcnRoYW5kcyBhbmQgYHRoaXNgIGJpbmRpbmcsIHdoaWNoIGl0ZXJhdGVzXG4gKiBvdmVyIGBjb2xsZWN0aW9uYCB1c2luZyB0aGUgcHJvdmlkZWQgYGVhY2hGdW5jYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHNlYXJjaC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZWFjaEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGl0ZXJhdGUgb3ZlciBgY29sbGVjdGlvbmAuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtyZXRLZXldIFNwZWNpZnkgcmV0dXJuaW5nIHRoZSBrZXkgb2YgdGhlIGZvdW5kIGVsZW1lbnRcbiAqICBpbnN0ZWFkIG9mIHRoZSBlbGVtZW50IGl0c2VsZi5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmb3VuZCBlbGVtZW50IG9yIGl0cyBrZXksIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGaW5kKGNvbGxlY3Rpb24sIHByZWRpY2F0ZSwgZWFjaEZ1bmMsIHJldEtleSkge1xuICB2YXIgcmVzdWx0O1xuICBlYWNoRnVuYyhjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKSB7XG4gICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKSkge1xuICAgICAgcmVzdWx0ID0gcmV0S2V5ID8ga2V5IDogdmFsdWU7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRmluZDtcbiIsIi8qKlxuICogbG9kYXNoIDMuNi4wIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmluZEluZGV4YCBhbmQgYF8uZmluZExhc3RJbmRleGAgd2l0aG91dFxuICogc3VwcG9ydCBmb3IgY2FsbGJhY2sgc2hvcnRoYW5kcyBhbmQgYHRoaXNgIGJpbmRpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBzZWFyY2guXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZpbmRJbmRleChhcnJheSwgcHJlZGljYXRlLCBmcm9tUmlnaHQpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIGluZGV4ID0gZnJvbVJpZ2h0ID8gbGVuZ3RoIDogLTE7XG5cbiAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcbiAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZpbmRJbmRleDtcbiIsIjtpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikgeyAgd2luZG93LmFtcGVyc2FuZCA9IHdpbmRvdy5hbXBlcnNhbmQgfHwge307ICB3aW5kb3cuYW1wZXJzYW5kW1wiYW1wZXJzYW5kLWRvbS1iaW5kaW5nc1wiXSA9IHdpbmRvdy5hbXBlcnNhbmRbXCJhbXBlcnNhbmQtZG9tLWJpbmRpbmdzXCJdIHx8IFtdOyAgd2luZG93LmFtcGVyc2FuZFtcImFtcGVyc2FuZC1kb20tYmluZGluZ3NcIl0ucHVzaChcIjMuNS4wXCIpO31cbnZhciBTdG9yZSA9IHJlcXVpcmUoJ2tleS10cmVlLXN0b3JlJyk7XG52YXIgZG9tID0gcmVxdWlyZSgnYW1wZXJzYW5kLWRvbScpO1xudmFyIG1hdGNoZXNTZWxlY3RvciA9IHJlcXVpcmUoJ21hdGNoZXMtc2VsZWN0b3InKTtcblxuXG4vLyByZXR1cm5zIGEga2V5LXRyZWUtc3RvcmUgb2YgZnVuY3Rpb25zXG4vLyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGFueSBlbGVtZW50L21vZGVsLlxuXG4vLyBhbGwgcmVzdWx0aW5nIGZ1bmN0aW9ucyBzaG91bGQgYmUgY2FsbGVkXG4vLyBsaWtlIGZ1bmMoZWwsIHZhbHVlLCBsYXN0S2V5TmFtZSlcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpbmRpbmdzLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0b3JlID0gbmV3IFN0b3JlKCk7XG4gICAgdmFyIGtleSwgY3VycmVudDtcblxuICAgIGZvciAoa2V5IGluIGJpbmRpbmdzKSB7XG4gICAgICAgIGN1cnJlbnQgPSBiaW5kaW5nc1trZXldO1xuICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBzdG9yZS5hZGQoa2V5LCBnZXRCaW5kaW5nRnVuYyh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBjdXJyZW50XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudC5mb3JFYWNoKSB7XG4gICAgICAgICAgICBjdXJyZW50LmZvckVhY2goZnVuY3Rpb24gKGJpbmRpbmcpIHtcbiAgICAgICAgICAgICAgICBzdG9yZS5hZGQoa2V5LCBnZXRCaW5kaW5nRnVuYyhiaW5kaW5nLCBjb250ZXh0KSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0b3JlLmFkZChrZXksIGdldEJpbmRpbmdGdW5jKGN1cnJlbnQsIGNvbnRleHQpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdG9yZTtcbn07XG5cblxudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5mdW5jdGlvbiBnZXRNYXRjaGVzKGVsLCBzZWxlY3Rvcikge1xuICAgIGlmIChzZWxlY3RvciA9PT0gJycpIHJldHVybiBbZWxdO1xuICAgIHZhciBtYXRjaGVzID0gW107XG4gICAgaWYgKG1hdGNoZXNTZWxlY3RvcihlbCwgc2VsZWN0b3IpKSBtYXRjaGVzLnB1c2goZWwpO1xuICAgIHJldHVybiBtYXRjaGVzLmNvbmNhdChzbGljZS5jYWxsKGVsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKSk7XG59XG5cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXMoZWwsIGF0dHJzKSB7XG4gICAgZm9yICh2YXIgbmFtZSBpbiBhdHRycykge1xuICAgICAgICBkb20uc2V0QXR0cmlidXRlKGVsLCBuYW1lLCBhdHRyc1tuYW1lXSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVBdHRyaWJ1dGVzKGVsLCBhdHRycykge1xuICAgIGZvciAodmFyIG5hbWUgaW4gYXR0cnMpIHtcbiAgICAgICAgZG9tLnJlbW92ZUF0dHJpYnV0ZShlbCwgbmFtZSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBtYWtlQXJyYXkodmFsKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsKSA/IHZhbCA6IFt2YWxdO1xufVxuXG5mdW5jdGlvbiBnZXRCaW5kaW5nRnVuYyhiaW5kaW5nLCBjb250ZXh0KSB7XG4gICAgdmFyIHR5cGUgPSBiaW5kaW5nLnR5cGUgfHwgJ3RleHQnO1xuICAgIHZhciBpc0N1c3RvbUJpbmRpbmcgPSB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJztcbiAgICB2YXIgc2VsZWN0b3IgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodHlwZW9mIGJpbmRpbmcuc2VsZWN0b3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gYmluZGluZy5zZWxlY3RvcjtcbiAgICAgICAgfSBlbHNlIGlmIChiaW5kaW5nLmhvb2spIHtcbiAgICAgICAgICAgIHJldHVybiAnW2RhdGEtaG9va349XCInICsgYmluZGluZy5ob29rICsgJ1wiXSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICB9KSgpO1xuICAgIHZhciB5ZXMgPSBiaW5kaW5nLnllcztcbiAgICB2YXIgbm8gPSBiaW5kaW5nLm5vO1xuICAgIHZhciBoYXNZZXNObyA9ICEhKHllcyB8fCBubyk7XG5cbiAgICAvLyBzdG9yYWdlIHZhcmlhYmxlIGZvciBwcmV2aW91cyBpZiByZWxldmFudFxuICAgIHZhciBwcmV2aW91c1ZhbHVlO1xuXG4gICAgaWYgKGlzQ3VzdG9tQmluZGluZykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGVsLCB2YWx1ZSkge1xuICAgICAgICAgICAgZ2V0TWF0Y2hlcyhlbCwgc2VsZWN0b3IpLmZvckVhY2goZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgdHlwZS5jYWxsKGNvbnRleHQsIG1hdGNoLCB2YWx1ZSwgcHJldmlvdXNWYWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByZXZpb3VzVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGVsLCB2YWx1ZSkge1xuICAgICAgICAgICAgZ2V0TWF0Y2hlcyhlbCwgc2VsZWN0b3IpLmZvckVhY2goZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgZG9tLnRleHQobWF0Y2gsIHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGVsLCB2YWx1ZSkge1xuICAgICAgICAgICAgZ2V0TWF0Y2hlcyhlbCwgc2VsZWN0b3IpLmZvckVhY2goZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgZG9tLnN3aXRjaENsYXNzKG1hdGNoLCBwcmV2aW91c1ZhbHVlLCB2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByZXZpb3VzVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdhdHRyaWJ1dGUnKSB7XG4gICAgICAgIGlmICghYmluZGluZy5uYW1lKSB0aHJvdyBFcnJvcignYXR0cmlidXRlIGJpbmRpbmdzIG11c3QgaGF2ZSBhIFwibmFtZVwiJyk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZWwsIHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgbmFtZXMgPSBtYWtlQXJyYXkoYmluZGluZy5uYW1lKTtcbiAgICAgICAgICAgIGdldE1hdGNoZXMoZWwsIHNlbGVjdG9yKS5mb3JFYWNoKGZ1bmN0aW9uIChtYXRjaCkge1xuICAgICAgICAgICAgICAgIG5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9tLnNldEF0dHJpYnV0ZShtYXRjaCwgbmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcmV2aW91c1ZhbHVlID0gdmFsdWU7XG4gICAgICAgIH07XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAndmFsdWUnKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZWwsIHZhbHVlKSB7XG4gICAgICAgICAgICBnZXRNYXRjaGVzKGVsLCBzZWxlY3RvcikuZm9yRWFjaChmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXZhbHVlICYmIHZhbHVlICE9PSAwKSB2YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIC8vIG9ubHkgYXBwbHkgYmluZGluZ3MgaWYgZWxlbWVudCBpcyBub3QgY3VycmVudGx5IGZvY3VzZWRcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gbWF0Y2gpIG1hdGNoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByZXZpb3VzVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdib29sZWFuQ2xhc3MnKSB7XG4gICAgICAgIC8vIGlmIHRoZXJlJ3MgYSBgbm9gIGNhc2UgdGhpcyBpcyBhY3R1YWxseSBhIHN3aXRjaFxuICAgICAgICBpZiAoaGFzWWVzTm8pIHtcbiAgICAgICAgICAgIHllcyA9IG1ha2VBcnJheSh5ZXMgfHwgJycpO1xuICAgICAgICAgICAgbm8gPSBtYWtlQXJyYXkobm8gfHwgJycpO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChlbCwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJldkNsYXNzID0gdmFsdWUgPyBubyA6IHllcztcbiAgICAgICAgICAgICAgICB2YXIgbmV3Q2xhc3MgPSB2YWx1ZSA/IHllcyA6IG5vO1xuICAgICAgICAgICAgICAgIGdldE1hdGNoZXMoZWwsIHNlbGVjdG9yKS5mb3JFYWNoKGZ1bmN0aW9uIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICBwcmV2Q2xhc3MuZm9yRWFjaChmdW5jdGlvbiAocGMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbS5yZW1vdmVDbGFzcyhtYXRjaCwgcGMpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgbmV3Q2xhc3MuZm9yRWFjaChmdW5jdGlvbiAobmMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbS5hZGRDbGFzcyhtYXRjaCwgbmMpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGVsLCB2YWx1ZSwga2V5TmFtZSkge1xuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gbWFrZUFycmF5KGJpbmRpbmcubmFtZSB8fCBrZXlOYW1lKTtcbiAgICAgICAgICAgICAgICBnZXRNYXRjaGVzKGVsLCBzZWxlY3RvcikuZm9yRWFjaChmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZS5mb3JFYWNoKGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbVt2YWx1ZSA/ICdhZGRDbGFzcycgOiAncmVtb3ZlQ2xhc3MnXShtYXRjaCwgY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnYm9vbGVhbkF0dHJpYnV0ZScpIHtcbiAgICAgICAgLy8gaWYgdGhlcmUgYXJlIGB5ZXNgIGFuZCBgbm9gIHNlbGVjdG9ycywgdGhpcyBzd2FwcyBiZXR3ZWVuIHRoZW1cbiAgICAgICAgaWYgKGhhc1llc05vKSB7XG4gICAgICAgICAgICB5ZXMgPSBtYWtlQXJyYXkoeWVzIHx8ICcnKTtcbiAgICAgICAgICAgIG5vID0gbWFrZUFycmF5KG5vIHx8ICcnKTtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoZWwsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByZXZBdHRyaWJ1dGUgPSB2YWx1ZSA/IG5vIDogeWVzO1xuICAgICAgICAgICAgICAgIHZhciBuZXdBdHRyaWJ1dGUgPSB2YWx1ZSA/IHllcyA6IG5vO1xuICAgICAgICAgICAgICAgIGdldE1hdGNoZXMoZWwsIHNlbGVjdG9yKS5mb3JFYWNoKGZ1bmN0aW9uIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICBwcmV2QXR0cmlidXRlLmZvckVhY2goZnVuY3Rpb24gKHBhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb20ucmVtb3ZlQXR0cmlidXRlKG1hdGNoLCBwYSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBuZXdBdHRyaWJ1dGUuZm9yRWFjaChmdW5jdGlvbiAobmEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbS5hZGRBdHRyaWJ1dGUobWF0Y2gsIG5hKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChlbCwgdmFsdWUsIGtleU5hbWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IG1ha2VBcnJheShiaW5kaW5nLm5hbWUgfHwga2V5TmFtZSk7XG4gICAgICAgICAgICAgICAgZ2V0TWF0Y2hlcyhlbCwgc2VsZWN0b3IpLmZvckVhY2goZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWUuZm9yRWFjaChmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9tW3ZhbHVlID8gJ2FkZEF0dHJpYnV0ZScgOiAncmVtb3ZlQXR0cmlidXRlJ10obWF0Y2gsIGF0dHIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICd0b2dnbGUnKSB7XG4gICAgICAgIHZhciBtb2RlID0gKGJpbmRpbmcubW9kZSB8fCAnZGlzcGxheScpO1xuICAgICAgICAvLyB0aGlzIGRvZXNuJ3QgcmVxdWlyZSBhIHNlbGVjdG9yIHNpbmNlIHdlIGNhbiBwYXNzIHllcy9ubyBzZWxlY3RvcnNcbiAgICAgICAgaWYgKGhhc1llc05vKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGVsLCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGdldE1hdGNoZXMoZWwsIHllcykuZm9yRWFjaChmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9tW3ZhbHVlID8gJ3Nob3cnIDogJ2hpZGUnXShtYXRjaCwgbW9kZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZ2V0TWF0Y2hlcyhlbCwgbm8pLmZvckVhY2goZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbVt2YWx1ZSA/ICdoaWRlJyA6ICdzaG93J10obWF0Y2gsIG1vZGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoZWwsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZ2V0TWF0Y2hlcyhlbCwgc2VsZWN0b3IpLmZvckVhY2goZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbVt2YWx1ZSA/ICdzaG93JyA6ICdoaWRlJ10obWF0Y2gsIG1vZGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N3aXRjaCcpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nLmNhc2VzKSB0aHJvdyBFcnJvcignc3dpdGNoIGJpbmRpbmdzIG11c3QgaGF2ZSBcImNhc2VzXCInKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChlbCwgdmFsdWUpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGl0ZW0gaW4gYmluZGluZy5jYXNlcykge1xuICAgICAgICAgICAgICAgIGdldE1hdGNoZXMoZWwsIGJpbmRpbmcuY2FzZXNbaXRlbV0pLmZvckVhY2goZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbVt2YWx1ZSA9PT0gaXRlbSA/ICdzaG93JyA6ICdoaWRlJ10obWF0Y2gpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2lubmVySFRNTCcpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChlbCwgdmFsdWUpIHtcbiAgICAgICAgICAgIGdldE1hdGNoZXMoZWwsIHNlbGVjdG9yKS5mb3JFYWNoKGZ1bmN0aW9uIChtYXRjaCkge1xuICAgICAgICAgICAgICAgIGRvbS5odG1sKG1hdGNoLCB2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzd2l0Y2hDbGFzcycpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nLmNhc2VzKSB0aHJvdyBFcnJvcignc3dpdGNoQ2xhc3MgYmluZGluZ3MgbXVzdCBoYXZlIFwiY2FzZXNcIicpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGVsLCB2YWx1ZSwga2V5TmFtZSkge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBtYWtlQXJyYXkoYmluZGluZy5uYW1lIHx8IGtleU5hbWUpO1xuICAgICAgICAgICAgZm9yICh2YXIgaXRlbSBpbiBiaW5kaW5nLmNhc2VzKSB7XG4gICAgICAgICAgICAgICAgZ2V0TWF0Y2hlcyhlbCwgYmluZGluZy5jYXNlc1tpdGVtXSkuZm9yRWFjaChmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZS5mb3JFYWNoKGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbVt2YWx1ZSA9PT0gaXRlbSA/ICdhZGRDbGFzcycgOiAncmVtb3ZlQ2xhc3MnXShtYXRjaCwgY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnc3dpdGNoQXR0cmlidXRlJykge1xuICAgICAgICBpZiAoIWJpbmRpbmcuY2FzZXMpIHRocm93IEVycm9yKCdzd2l0Y2hBdHRyaWJ1dGUgYmluZGluZ3MgbXVzdCBoYXZlIFwiY2FzZXNcIicpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGVsLCB2YWx1ZSwga2V5TmFtZSkge1xuICAgICAgICAgICAgZ2V0TWF0Y2hlcyhlbCwgc2VsZWN0b3IpLmZvckVhY2goZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZpb3VzVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlQXR0cmlidXRlcyhtYXRjaCwgcHJldmlvdXNWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlIGluIGJpbmRpbmcuY2FzZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gYmluZGluZy5jYXNlc1t2YWx1ZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXR0cnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnNbYmluZGluZy5uYW1lIHx8IGtleU5hbWVdID0gYmluZGluZy5jYXNlc1t2YWx1ZV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2V0QXR0cmlidXRlcyhtYXRjaCwgYXR0cnMpO1xuXG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzVmFsdWUgPSBhdHRycztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIHN1Y2ggYmluZGluZyB0eXBlOiAnICsgdHlwZSk7XG4gICAgfVxufVxuIiwiO2lmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7ICB3aW5kb3cuYW1wZXJzYW5kID0gd2luZG93LmFtcGVyc2FuZCB8fCB7fTsgIHdpbmRvdy5hbXBlcnNhbmRbXCJhbXBlcnNhbmQtZG9tXCJdID0gd2luZG93LmFtcGVyc2FuZFtcImFtcGVyc2FuZC1kb21cIl0gfHwgW107ICB3aW5kb3cuYW1wZXJzYW5kW1wiYW1wZXJzYW5kLWRvbVwiXS5wdXNoKFwiMS40LjBcIik7fVxudmFyIGRvbSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICAgIHRleHQ6IGZ1bmN0aW9uIChlbCwgdmFsKSB7XG4gICAgICAgIGVsLnRleHRDb250ZW50ID0gZ2V0U3RyaW5nKHZhbCk7XG4gICAgfSxcbiAgICAvLyBvcHRpbWl6ZSBpZiB3ZSBoYXZlIGNsYXNzTGlzdFxuICAgIGFkZENsYXNzOiBmdW5jdGlvbiAoZWwsIGNscykge1xuICAgICAgICBjbHMgPSBnZXRTdHJpbmcoY2xzKTtcbiAgICAgICAgaWYgKCFjbHMpIHJldHVybjtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2xzKSkge1xuICAgICAgICAgICAgY2xzLmZvckVhY2goZnVuY3Rpb24oYykge1xuICAgICAgICAgICAgICAgIGRvbS5hZGRDbGFzcyhlbCwgYyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghaGFzQ2xhc3MoZWwsIGNscykpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbC5jbGFzc05hbWUgKz0gJyAnICsgY2xzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uIChlbCwgY2xzKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNscykpIHtcbiAgICAgICAgICAgIGNscy5mb3JFYWNoKGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgICAgICAgICBkb20ucmVtb3ZlQ2xhc3MoZWwsIGMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICAgICAgICBjbHMgPSBnZXRTdHJpbmcoY2xzKTtcbiAgICAgICAgICAgIGlmIChjbHMpIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIG1heSBiZSBmYXN0ZXIgdG8gbm90IGVkaXQgdW5sZXNzIHdlIGtub3cgd2UgaGF2ZSBpdD9cbiAgICAgICAgICAgIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJyhefFxcXFxiKScgKyBjbHMuc3BsaXQoJyAnKS5qb2luKCd8JykgKyAnKFxcXFxifCQpJywgJ2dpJyksICcgJyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGhhc0NsYXNzOiBoYXNDbGFzcyxcbiAgICBzd2l0Y2hDbGFzczogZnVuY3Rpb24gKGVsLCBwcmV2Q2xzLCBuZXdDbHMpIHtcbiAgICAgICAgaWYgKHByZXZDbHMpIHRoaXMucmVtb3ZlQ2xhc3MoZWwsIHByZXZDbHMpO1xuICAgICAgICB0aGlzLmFkZENsYXNzKGVsLCBuZXdDbHMpO1xuICAgIH0sXG4gICAgLy8gbWFrZXMgc3VyZSBhdHRyaWJ1dGUgKHdpdGggbm8gY29udGVudCkgaXMgYWRkZWRcbiAgICAvLyBpZiBleGlzdHMgaXQgd2lsbCBiZSBjbGVhcmVkIG9mIGNvbnRlbnRcbiAgICBhZGRBdHRyaWJ1dGU6IGZ1bmN0aW9uIChlbCwgYXR0cikge1xuICAgICAgICAvLyBzZXR0aW5nIHRvIGVtcHR5IHN0cmluZyBkb2VzIHNhbWVcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKGF0dHIsICcnKTtcbiAgICAgICAgLy8gU29tZSBicm93c2VycyB3b24ndCB1cGRhdGUgVUkgZm9yIGJvb2xlYW4gYXR0cmlidXRlcyB1bmxlc3MgeW91XG4gICAgICAgIC8vIHNldCBpdCBkaXJlY3RseS4gU28gd2UgZG8gYm90aFxuICAgICAgICBpZiAoaGFzQm9vbGVhblByb3BlcnR5KGVsLCBhdHRyKSkgZWxbYXR0cl0gPSB0cnVlO1xuICAgIH0sXG4gICAgLy8gY29tcGxldGVseSByZW1vdmVzIGF0dHJpYnV0ZVxuICAgIHJlbW92ZUF0dHJpYnV0ZTogZnVuY3Rpb24gKGVsLCBhdHRyKSB7XG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgaWYgKGhhc0Jvb2xlYW5Qcm9wZXJ0eShlbCwgYXR0cikpIGVsW2F0dHJdID0gZmFsc2U7XG4gICAgfSxcbiAgICAvLyBzZXRzIGF0dHJpYnV0ZSB0byBzdHJpbmcgdmFsdWUgZ2l2ZW4sIGNsZWFyaW5nIGFueSBjdXJyZW50IHZhbHVlXG4gICAgc2V0QXR0cmlidXRlOiBmdW5jdGlvbiAoZWwsIGF0dHIsIHZhbHVlKSB7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyLCBnZXRTdHJpbmcodmFsdWUpKTtcbiAgICB9LFxuICAgIGdldEF0dHJpYnV0ZTogZnVuY3Rpb24gKGVsLCBhdHRyKSB7XG4gICAgICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gICAgfSxcbiAgICBoYXNBdHRyaWJ1dGU6IGZ1bmN0aW9uIChlbCwgYXR0cikge1xuICAgICAgICByZXR1cm4gZWwuaGFzQXR0cmlidXRlKGF0dHIpO1xuICAgIH0sXG4gICAgaGlkZTogZnVuY3Rpb24gKGVsLCBtb2RlKSB7XG4gICAgICAgIGlmICghbW9kZSkgbW9kZSA9ICdkaXNwbGF5JztcbiAgICAgICAgaWYgKCFpc0hpZGRlbihlbCkpIHtcbiAgICAgICAgICAgIHN0b3JlRGlzcGxheVN0eWxlKGVsLCBtb2RlKTtcbiAgICAgICAgICAgIGhpZGUoZWwsIG1vZGUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyBzaG93IGVsZW1lbnRcbiAgICBzaG93OiBmdW5jdGlvbiAoZWwsIG1vZGUpIHtcbiAgICAgICAgaWYgKCFtb2RlKSBtb2RlID0gJ2Rpc3BsYXknO1xuICAgICAgICBzaG93KGVsLCBtb2RlKTtcbiAgICB9LFxuICAgIGh0bWw6IGZ1bmN0aW9uIChlbCwgY29udGVudCkge1xuICAgICAgICBlbC5pbm5lckhUTUwgPSBjb250ZW50O1xuICAgIH1cbn07XG5cbi8vIGhlbHBlcnNcbmZ1bmN0aW9uIGdldFN0cmluZyh2YWwpIHtcbiAgICBpZiAoIXZhbCAmJiB2YWwgIT09IDApIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBoYXNDbGFzcyhlbCwgY2xzKSB7XG4gICAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgICAgICByZXR1cm4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNscyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJyhefCApJyArIGNscyArICcoIHwkKScsICdnaScpLnRlc3QoZWwuY2xhc3NOYW1lKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGhhc0Jvb2xlYW5Qcm9wZXJ0eShlbCwgcHJvcCkge1xuICAgIHZhciB2YWwgPSBlbFtwcm9wXTtcbiAgICByZXR1cm4gcHJvcCBpbiBlbCAmJiAodmFsID09PSB0cnVlIHx8IHZhbCA9PT0gZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBpc0hpZGRlbiAoZWwpIHtcbiAgICByZXR1cm4gZG9tLmdldEF0dHJpYnV0ZShlbCwgJ2RhdGEtYW5kZG9tLWhpZGRlbicpID09PSAndHJ1ZSc7XG59XG5cbmZ1bmN0aW9uIHN0b3JlRGlzcGxheVN0eWxlIChlbCwgbW9kZSkge1xuICAgIGRvbS5zZXRBdHRyaWJ1dGUoZWwsICdkYXRhLWFuZGRvbS0nICsgbW9kZSwgZWwuc3R5bGVbbW9kZV0pO1xufVxuXG5mdW5jdGlvbiBzaG93IChlbCwgbW9kZSkge1xuICAgIGVsLnN0eWxlW21vZGVdID0gZG9tLmdldEF0dHJpYnV0ZShlbCwgJ2RhdGEtYW5kZG9tLScgKyBtb2RlKSB8fCAnJztcbiAgICBkb20ucmVtb3ZlQXR0cmlidXRlKGVsLCAnZGF0YS1hbmRkb20taGlkZGVuJyk7XG59XG5cbmZ1bmN0aW9uIGhpZGUgKGVsLCBtb2RlKSB7XG4gICAgZG9tLnNldEF0dHJpYnV0ZShlbCwgJ2RhdGEtYW5kZG9tLWhpZGRlbicsICd0cnVlJyk7XG4gICAgZWwuc3R5bGVbbW9kZV0gPSAobW9kZSA9PT0gJ3Zpc2liaWxpdHknID8gJ2hpZGRlbicgOiAnbm9uZScpO1xufVxuIiwidmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG4vLyBvdXIgY29uc3RydWN0b3JcbmZ1bmN0aW9uIEtleVRyZWVTdG9yZSgpIHtcbiAgICB0aGlzLnN0b3JhZ2UgPSB7fTtcbn1cblxuLy8gYWRkIGFuIG9iamVjdCB0byB0aGUgc3RvcmVcbktleVRyZWVTdG9yZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGtleXBhdGgsIG9iaikge1xuICAgIHZhciBhcnIgPSB0aGlzLnN0b3JhZ2Vba2V5cGF0aF0gfHwgKHRoaXMuc3RvcmFnZVtrZXlwYXRoXSA9IFtdKTtcbiAgICBhcnIucHVzaChvYmopO1xufTtcblxuLy8gcmVtb3ZlIGFuIG9iamVjdFxuS2V5VHJlZVN0b3JlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgdmFyIHBhdGgsIGFycjtcbiAgICBmb3IgKHBhdGggaW4gdGhpcy5zdG9yYWdlKSB7XG4gICAgICAgIGFyciA9IHRoaXMuc3RvcmFnZVtwYXRoXTtcbiAgICAgICAgYXJyLnNvbWUoZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgICBpZiAoaXRlbSA9PT0gb2JqKSB7XG4gICAgICAgICAgICAgICAgYXJyLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbi8vIGdldCBhcnJheSBvZiBhbGwgYWxsIHJlbGV2YW50IGZ1bmN0aW9ucywgd2l0aG91dCBrZXlzXG5LZXlUcmVlU3RvcmUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChrZXlwYXRoKSB7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIHZhciBrZXk7XG5cbiAgICBmb3IgKGtleSBpbiB0aGlzLnN0b3JhZ2UpIHtcbiAgICAgICAgaWYgKCFrZXlwYXRoIHx8IGtleXBhdGggPT09IGtleSB8fCBrZXkuaW5kZXhPZihrZXlwYXRoICsgJy4nKSA9PT0gMCkge1xuICAgICAgICAgICAgcmVzID0gcmVzLmNvbmNhdCh0aGlzLnN0b3JhZ2Vba2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xufTtcblxuLy8gZ2V0IGFsbCByZXN1bHRzIHRoYXQgbWF0Y2gga2V5cGF0aCBidXQgc3RpbGwgZ3JvdXBlZCBieSBrZXlcbktleVRyZWVTdG9yZS5wcm90b3R5cGUuZ2V0R3JvdXBlZCA9IGZ1bmN0aW9uIChrZXlwYXRoKSB7XG4gICAgdmFyIHJlcyA9IHt9O1xuICAgIHZhciBrZXk7XG5cbiAgICBmb3IgKGtleSBpbiB0aGlzLnN0b3JhZ2UpIHtcbiAgICAgICAgaWYgKCFrZXlwYXRoIHx8IGtleXBhdGggPT09IGtleSB8fCBrZXkuaW5kZXhPZihrZXlwYXRoICsgJy4nKSA9PT0gMCkge1xuICAgICAgICAgICAgcmVzW2tleV0gPSBzbGljZS5jYWxsKHRoaXMuc3RvcmFnZVtrZXldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXM7XG59O1xuXG4vLyBnZXQgYWxsIHJlc3VsdHMgdGhhdCBtYXRjaCBrZXlwYXRoIGJ1dCBzdGlsbCBncm91cGVkIGJ5IGtleVxuS2V5VHJlZVN0b3JlLnByb3RvdHlwZS5nZXRBbGwgPSBmdW5jdGlvbiAoa2V5cGF0aCkge1xuICAgIHZhciByZXMgPSB7fTtcbiAgICB2YXIga2V5O1xuXG4gICAgZm9yIChrZXkgaW4gdGhpcy5zdG9yYWdlKSB7XG4gICAgICAgIGlmIChrZXlwYXRoID09PSBrZXkgfHwga2V5LmluZGV4T2Yoa2V5cGF0aCArICcuJykgPT09IDApIHtcbiAgICAgICAgICAgIHJlc1trZXldID0gc2xpY2UuY2FsbCh0aGlzLnN0b3JhZ2Vba2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xufTtcblxuLy8gcnVuIGFsbCBtYXRjaGVzIHdpdGggb3B0aW9uYWwgY29udGV4dFxuS2V5VHJlZVN0b3JlLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoa2V5cGF0aCwgY29udGV4dCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHRoaXMuZ2V0KGtleXBhdGgpLmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIGZuLmFwcGx5KGNvbnRleHQgfHwgdGhpcywgYXJncyk7XG4gICAgfSk7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBLZXlUcmVlU3RvcmU7XG4iLCI7aWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHsgIHdpbmRvdy5hbXBlcnNhbmQgPSB3aW5kb3cuYW1wZXJzYW5kIHx8IHt9OyAgd2luZG93LmFtcGVyc2FuZFtcImFtcGVyc2FuZC1zdGF0ZVwiXSA9IHdpbmRvdy5hbXBlcnNhbmRbXCJhbXBlcnNhbmQtc3RhdGVcIl0gfHwgW107ICB3aW5kb3cuYW1wZXJzYW5kW1wiYW1wZXJzYW5kLXN0YXRlXCJdLnB1c2goXCI0LjUuMlwiKTt9XG52YXIgdW5pcXVlSWQgPSByZXF1aXJlKCdsb2Rhc2gudW5pcXVlaWQnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdsb2Rhc2guYXNzaWduJyk7XG52YXIgb21pdCA9IHJlcXVpcmUoJ2xvZGFzaC5vbWl0Jyk7XG52YXIgZXNjYXBlID0gcmVxdWlyZSgnbG9kYXNoLmVzY2FwZScpO1xudmFyIGZvckVhY2ggPSByZXF1aXJlKCdsb2Rhc2guZm9yZWFjaCcpO1xudmFyIGluY2x1ZGVzID0gcmVxdWlyZSgnbG9kYXNoLmluY2x1ZGVzJyk7XG52YXIgaXNTdHJpbmcgPSByZXF1aXJlKCdsb2Rhc2guaXNzdHJpbmcnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJ2xvZGFzaC5pc29iamVjdCcpO1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCdsb2Rhc2guaXNhcnJheScpO1xudmFyIGlzRGF0ZSA9IHJlcXVpcmUoJ2xvZGFzaC5pc2RhdGUnKTtcbnZhciBpc1VuZGVmaW5lZCA9IHJlcXVpcmUoJ2xvZGFzaC5pc3VuZGVmaW5lZCcpO1xudmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCdsb2Rhc2guaXNmdW5jdGlvbicpO1xudmFyIGlzTnVsbCA9IHJlcXVpcmUoJ2xvZGFzaC5pc251bGwnKTtcbnZhciBpc0VtcHR5ID0gcmVxdWlyZSgnbG9kYXNoLmlzZW1wdHknKTtcbnZhciBpc0VxdWFsID0gcmVxdWlyZSgnbG9kYXNoLmlzZXF1YWwnKTtcbnZhciBjbG9uZSA9IHJlcXVpcmUoJ2xvZGFzaC5jbG9uZScpO1xudmFyIGhhcyA9IHJlcXVpcmUoJ2xvZGFzaC5oYXMnKTtcbnZhciByZXN1bHQgPSByZXF1aXJlKCdsb2Rhc2gucmVzdWx0Jyk7XG52YXIga2V5cyA9IHJlcXVpcmUoJ2xvZGFzaC5rZXlzJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJ2xvZGFzaC5iaW5kJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCdsb2Rhc2guZGVmYXVsdHMnKTtcbnZhciB1bmlvbiA9IHJlcXVpcmUoJ2xvZGFzaC51bmlvbicpO1xudmFyIEV2ZW50cyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC1ldmVudHMnKTtcbnZhciBLZXlUcmVlID0gcmVxdWlyZSgna2V5LXRyZWUtc3RvcmUnKTtcbnZhciBhcnJheU5leHQgPSByZXF1aXJlKCdhcnJheS1uZXh0Jyk7XG52YXIgY2hhbmdlUkUgPSAvXmNoYW5nZTovO1xuXG5mdW5jdGlvbiBCYXNlKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KTtcbiAgICB0aGlzLmNpZCB8fCAodGhpcy5jaWQgPSB1bmlxdWVJZCgnc3RhdGUnKSk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgdGhpcy5fdmFsdWVzID0ge307XG4gICAgdGhpcy5fZGVmaW5pdGlvbiA9IE9iamVjdC5jcmVhdGUodGhpcy5fZGVmaW5pdGlvbik7XG4gICAgaWYgKG9wdGlvbnMucGFyc2UpIGF0dHJzID0gdGhpcy5wYXJzZShhdHRycywgb3B0aW9ucyk7XG4gICAgdGhpcy5wYXJlbnQgPSBvcHRpb25zLnBhcmVudDtcbiAgICB0aGlzLmNvbGxlY3Rpb24gPSBvcHRpb25zLmNvbGxlY3Rpb247XG4gICAgdGhpcy5fa2V5VHJlZSA9IG5ldyBLZXlUcmVlKCk7XG4gICAgdGhpcy5faW5pdENvbGxlY3Rpb25zKCk7XG4gICAgdGhpcy5faW5pdENoaWxkcmVuKCk7XG4gICAgdGhpcy5fY2FjaGUgPSB7fTtcbiAgICB0aGlzLl9wcmV2aW91c0F0dHJpYnV0ZXMgPSB7fTtcbiAgICBpZiAoYXR0cnMpIHRoaXMuc2V0KGF0dHJzLCBhc3NpZ24oe3NpbGVudDogdHJ1ZSwgaW5pdGlhbDogdHJ1ZX0sIG9wdGlvbnMpKTtcbiAgICB0aGlzLl9jaGFuZ2VkID0ge307XG4gICAgaWYgKHRoaXMuX2Rlcml2ZWQpIHRoaXMuX2luaXREZXJpdmVkKCk7XG4gICAgaWYgKG9wdGlvbnMuaW5pdCAhPT0gZmFsc2UpIHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5cbmFzc2lnbihCYXNlLnByb3RvdHlwZSwgRXZlbnRzLCB7XG4gICAgLy8gY2FuIGJlIGFsbG93LCBpZ25vcmUsIHJlamVjdFxuICAgIGV4dHJhUHJvcGVydGllczogJ2lnbm9yZScsXG5cbiAgICBpZEF0dHJpYnV0ZTogJ2lkJyxcblxuICAgIG5hbWVzcGFjZUF0dHJpYnV0ZTogJ25hbWVzcGFjZScsXG5cbiAgICB0eXBlQXR0cmlidXRlOiAnbW9kZWxUeXBlJyxcblxuICAgIC8vIFN0dWJiZWQgb3V0IHRvIGJlIG92ZXJ3cml0dGVuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy8gR2V0IElEIG9mIG1vZGVsIHBlciBjb25maWd1cmF0aW9uLlxuICAgIC8vIFNob3VsZCAqYWx3YXlzKiBiZSBob3cgSUQgaXMgZGV0ZXJtaW5lZCBieSBvdGhlciBjb2RlLlxuICAgIGdldElkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzW3RoaXMuaWRBdHRyaWJ1dGVdO1xuICAgIH0sXG5cbiAgICAvLyBHZXQgbmFtZXNwYWNlIG9mIG1vZGVsIHBlciBjb25maWd1cmF0aW9uLlxuICAgIC8vIFNob3VsZCAqYWx3YXlzKiBiZSBob3cgbmFtZXNwYWNlIGlzIGRldGVybWluZWQgYnkgb3RoZXIgY29kZS5cbiAgICBnZXROYW1lc3BhY2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbdGhpcy5uYW1lc3BhY2VBdHRyaWJ1dGVdO1xuICAgIH0sXG5cbiAgICAvLyBHZXQgdHlwZSBvZiBtb2RlbCBwZXIgY29uZmlndXJhdGlvbi5cbiAgICAvLyBTaG91bGQgKmFsd2F5cyogYmUgaG93IHR5cGUgaXMgZGV0ZXJtaW5lZCBieSBvdGhlciBjb2RlLlxuICAgIGdldFR5cGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbdGhpcy50eXBlQXR0cmlidXRlXTtcbiAgICB9LFxuXG4gICAgLy8gQSBtb2RlbCBpcyBuZXcgaWYgaXQgaGFzIG5ldmVyIGJlZW4gc2F2ZWQgdG8gdGhlIHNlcnZlciwgYW5kIGxhY2tzIGFuIGlkLlxuICAgIGlzTmV3OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldElkKCkgPT0gbnVsbDtcbiAgICB9LFxuXG4gICAgLy8gZ2V0IEhUTUwtZXNjYXBlZCB2YWx1ZSBvZiBhdHRyaWJ1dGVcbiAgICBlc2NhcGU6IGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgIHJldHVybiBlc2NhcGUodGhpcy5nZXQoYXR0cikpO1xuICAgIH0sXG5cbiAgICAvLyBDaGVjayBpZiB0aGUgbW9kZWwgaXMgY3VycmVudGx5IGluIGEgdmFsaWQgc3RhdGUuXG4gICAgaXNWYWxpZDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbGlkYXRlKHt9LCBhc3NpZ24ob3B0aW9ucyB8fCB7fSwgeyB2YWxpZGF0ZTogdHJ1ZSB9KSk7XG4gICAgfSxcblxuICAgIC8vIFBhcnNlIGNhbiBiZSB1c2VkIHJlbWFwL3Jlc3RydWN0dXJlL3JlbmFtZSBpbmNvbWluZyBwcm9wZXJ0aWVzXG4gICAgLy8gYmVmb3JlIHRoZXkgYXJlIGFwcGxpZWQgdG8gYXR0cmlidXRlcy5cbiAgICBwYXJzZTogZnVuY3Rpb24gKHJlc3AsIG9wdGlvbnMpIHtcbiAgICAgICAgLy9qc2hpbnQgdW51c2VkOmZhbHNlXG4gICAgICAgIHJldHVybiByZXNwO1xuICAgIH0sXG5cbiAgICAvLyBTZXJpYWxpemUgaXMgdGhlIGludmVyc2Ugb2YgYHBhcnNlYCBpdCBsZXRzIHlvdSBtYXNzYWdlIGRhdGFcbiAgICAvLyBvbiB0aGUgd2F5IG91dC4gQmVmb3JlLCBzZW5kaW5nIHRvIHNlcnZlciwgZm9yIGV4YW1wbGUuXG4gICAgc2VyaWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZXMgPSB0aGlzLmdldEF0dHJpYnV0ZXMoe3Byb3BzOiB0cnVlfSwgdHJ1ZSk7XG4gICAgICAgIGZvckVhY2godGhpcy5fY2hpbGRyZW4sIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICByZXNba2V5XSA9IHRoaXNba2V5XS5zZXJpYWxpemUoKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIGZvckVhY2godGhpcy5fY29sbGVjdGlvbnMsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICByZXNba2V5XSA9IHRoaXNba2V5XS5zZXJpYWxpemUoKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfSxcblxuICAgIC8vIE1haW4gc2V0IG1ldGhvZCB1c2VkIGJ5IGdlbmVyYXRlZCBzZXR0ZXJzL2dldHRlcnMgYW5kIGNhblxuICAgIC8vIGJlIHVzZWQgZGlyZWN0bHkgaWYgeW91IG5lZWQgdG8gcGFzcyBvcHRpb25zIG9yIHNldCBtdWx0aXBsZVxuICAgIC8vIHByb3BlcnRpZXMgYXQgb25jZS5cbiAgICBzZXQ6IGZ1bmN0aW9uIChrZXksIHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGV4dHJhUHJvcGVydGllcyA9IHRoaXMuZXh0cmFQcm9wZXJ0aWVzO1xuICAgICAgICB2YXIgY2hhbmdpbmcsIGNoYW5nZXMsIG5ld1R5cGUsIG5ld1ZhbCwgZGVmLCBjYXN0LCBlcnIsIGF0dHIsXG4gICAgICAgICAgICBhdHRycywgZGF0YVR5cGUsIHNpbGVudCwgdW5zZXQsIGN1cnJlbnRWYWwsIGluaXRpYWwsIGhhc0NoYW5nZWQsIGlzRXF1YWw7XG5cbiAgICAgICAgLy8gSGFuZGxlIGJvdGggYFwia2V5XCIsIHZhbHVlYCBhbmQgYHtrZXk6IHZhbHVlfWAgLXN0eWxlIGFyZ3VtZW50cy5cbiAgICAgICAgaWYgKGlzT2JqZWN0KGtleSkgfHwga2V5ID09PSBudWxsKSB7XG4gICAgICAgICAgICBhdHRycyA9IGtleTtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF0dHJzID0ge307XG4gICAgICAgICAgICBhdHRyc1trZXldID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICBpZiAoIXRoaXMuX3ZhbGlkYXRlKGF0dHJzLCBvcHRpb25zKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIC8vIEV4dHJhY3QgYXR0cmlidXRlcyBhbmQgb3B0aW9ucy5cbiAgICAgICAgdW5zZXQgPSBvcHRpb25zLnVuc2V0O1xuICAgICAgICBzaWxlbnQgPSBvcHRpb25zLnNpbGVudDtcbiAgICAgICAgaW5pdGlhbCA9IG9wdGlvbnMuaW5pdGlhbDtcblxuICAgICAgICBjaGFuZ2VzID0gW107XG4gICAgICAgIGNoYW5naW5nID0gdGhpcy5fY2hhbmdpbmc7XG4gICAgICAgIHRoaXMuX2NoYW5naW5nID0gdHJ1ZTtcblxuICAgICAgICAvLyBpZiBub3QgYWxyZWFkeSBjaGFuZ2luZywgc3RvcmUgcHJldmlvdXNcbiAgICAgICAgaWYgKCFjaGFuZ2luZykge1xuICAgICAgICAgICAgdGhpcy5fcHJldmlvdXNBdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzO1xuICAgICAgICAgICAgdGhpcy5fY2hhbmdlZCA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRm9yIGVhY2ggYHNldGAgYXR0cmlidXRlLi4uXG4gICAgICAgIGZvciAoYXR0ciBpbiBhdHRycykge1xuICAgICAgICAgICAgbmV3VmFsID0gYXR0cnNbYXR0cl07XG4gICAgICAgICAgICBuZXdUeXBlID0gdHlwZW9mIG5ld1ZhbDtcbiAgICAgICAgICAgIGN1cnJlbnRWYWwgPSB0aGlzLl92YWx1ZXNbYXR0cl07XG4gICAgICAgICAgICBkZWYgPSB0aGlzLl9kZWZpbml0aW9uW2F0dHJdO1xuXG5cbiAgICAgICAgICAgIGlmICghZGVmKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyBhIGNoaWxkIG1vZGVsIG9yIGNvbGxlY3Rpb25cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2hpbGRyZW5bYXR0cl0gfHwgdGhpcy5fY29sbGVjdGlvbnNbYXR0cl0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1thdHRyXS5zZXQobmV3VmFsLCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChleHRyYVByb3BlcnRpZXMgPT09ICdpZ25vcmUnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXh0cmFQcm9wZXJ0aWVzID09PSAncmVqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdObyBcIicgKyBhdHRyICsgJ1wiIHByb3BlcnR5IGRlZmluZWQgb24gJyArICh0aGlzLnR5cGUgfHwgJ3RoaXMnKSArICcgbW9kZWwgYW5kIGV4dHJhUHJvcGVydGllcyBub3Qgc2V0IHRvIFwiaWdub3JlXCIgb3IgXCJhbGxvd1wiJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChleHRyYVByb3BlcnRpZXMgPT09ICdhbGxvdycpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmID0gdGhpcy5fY3JlYXRlUHJvcGVydHlEZWZpbml0aW9uKGF0dHIsICdhbnknKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV4dHJhUHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHZhbHVlIGZvciBleHRyYVByb3BlcnRpZXM6IFwiJyArIGV4dHJhUHJvcGVydGllcyArICdcIicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaXNFcXVhbCA9IHRoaXMuX2dldENvbXBhcmVGb3JUeXBlKGRlZi50eXBlKTtcbiAgICAgICAgICAgIGRhdGFUeXBlID0gdGhpcy5fZGF0YVR5cGVzW2RlZi50eXBlXTtcblxuICAgICAgICAgICAgLy8gY2hlY2sgdHlwZSBpZiB3ZSBoYXZlIG9uZVxuICAgICAgICAgICAgaWYgKGRhdGFUeXBlICYmIGRhdGFUeXBlLnNldCkge1xuICAgICAgICAgICAgICAgIGNhc3QgPSBkYXRhVHlwZS5zZXQobmV3VmFsKTtcbiAgICAgICAgICAgICAgICBuZXdWYWwgPSBjYXN0LnZhbDtcbiAgICAgICAgICAgICAgICBuZXdUeXBlID0gY2FzdC50eXBlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiB3ZSd2ZSBkZWZpbmVkIGEgdGVzdCwgcnVuIGl0XG4gICAgICAgICAgICBpZiAoZGVmLnRlc3QpIHtcbiAgICAgICAgICAgICAgICBlcnIgPSBkZWYudGVzdC5jYWxsKHRoaXMsIG5ld1ZhbCwgbmV3VHlwZSk7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9wZXJ0eSBcXCcnICsgYXR0ciArICdcXCcgZmFpbGVkIHZhbGlkYXRpb24gd2l0aCBlcnJvcjogJyArIGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUgcmVxdWlyZWQgYnV0IHVuZGVmaW5lZCwgdGhyb3cgZXJyb3IuXG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUgbnVsbCBhbmQgYXJlIG5vdCBhbGxvd2luZyBudWxsLCB0aHJvdyBlcnJvclxuICAgICAgICAgICAgLy8gSWYgd2UgaGF2ZSBhIGRlZmluZWQgdHlwZSBhbmQgdGhlIG5ldyB0eXBlIGRvZXNuJ3QgbWF0Y2gsIGFuZCB3ZSBhcmUgbm90IG51bGwsIHRocm93IGVycm9yLlxuXG4gICAgICAgICAgICBpZiAoaXNVbmRlZmluZWQobmV3VmFsKSAmJiBkZWYucmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdSZXF1aXJlZCBwcm9wZXJ0eSBcXCcnICsgYXR0ciArICdcXCcgbXVzdCBiZSBvZiB0eXBlICcgKyBkZWYudHlwZSArICcuIFRyaWVkIHRvIHNldCAnICsgbmV3VmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc051bGwobmV3VmFsKSAmJiBkZWYucmVxdWlyZWQgJiYgIWRlZi5hbGxvd051bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9wZXJ0eSBcXCcnICsgYXR0ciArICdcXCcgbXVzdCBiZSBvZiB0eXBlICcgKyBkZWYudHlwZSArICcgKGNhbm5vdCBiZSBudWxsKS4gVHJpZWQgdG8gc2V0ICcgKyBuZXdWYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKChkZWYudHlwZSAmJiBkZWYudHlwZSAhPT0gJ2FueScgJiYgZGVmLnR5cGUgIT09IG5ld1R5cGUpICYmICFpc051bGwobmV3VmFsKSAmJiAhaXNVbmRlZmluZWQobmV3VmFsKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb3BlcnR5IFxcJycgKyBhdHRyICsgJ1xcJyBtdXN0IGJlIG9mIHR5cGUgJyArIGRlZi50eXBlICsgJy4gVHJpZWQgdG8gc2V0ICcgKyBuZXdWYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRlZi52YWx1ZXMgJiYgIWluY2x1ZGVzKGRlZi52YWx1ZXMsIG5ld1ZhbCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9wZXJ0eSBcXCcnICsgYXR0ciArICdcXCcgbXVzdCBiZSBvbmUgb2YgdmFsdWVzOiAnICsgZGVmLnZhbHVlcy5qb2luKCcsICcpICsgJy4gVHJpZWQgdG8gc2V0ICcgKyBuZXdWYWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBoYXNDaGFuZ2VkID0gIWlzRXF1YWwoY3VycmVudFZhbCwgbmV3VmFsLCBhdHRyKTtcblxuICAgICAgICAgICAgLy8gZW5mb3JjZSBgc2V0T25jZWAgZm9yIHByb3BlcnRpZXMgaWYgc2V0XG4gICAgICAgICAgICBpZiAoZGVmLnNldE9uY2UgJiYgY3VycmVudFZhbCAhPT0gdW5kZWZpbmVkICYmIGhhc0NoYW5nZWQgJiYgIWluaXRpYWwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9wZXJ0eSBcXCcnICsgYXR0ciArICdcXCcgY2FuIG9ubHkgYmUgc2V0IG9uY2UuJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGtlZXAgdHJhY2sgb2YgY2hhbmdlZCBhdHRyaWJ1dGVzXG4gICAgICAgICAgICAvLyBhbmQgcHVzaCB0byBjaGFuZ2VzIGFycmF5XG4gICAgICAgICAgICBpZiAoaGFzQ2hhbmdlZCkge1xuICAgICAgICAgICAgICAgIGNoYW5nZXMucHVzaCh7cHJldjogY3VycmVudFZhbCwgdmFsOiBuZXdWYWwsIGtleTogYXR0cn0pO1xuICAgICAgICAgICAgICAgIHNlbGYuX2NoYW5nZWRbYXR0cl0gPSBuZXdWYWw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBzZWxmLl9jaGFuZ2VkW2F0dHJdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWN0dWFsbHkgdXBkYXRlIG91ciB2YWx1ZXNcbiAgICAgICAgZm9yRWFjaChjaGFuZ2VzLCBmdW5jdGlvbiAoY2hhbmdlKSB7XG4gICAgICAgICAgICBzZWxmLl9wcmV2aW91c0F0dHJpYnV0ZXNbY2hhbmdlLmtleV0gPSBjaGFuZ2UucHJldjtcbiAgICAgICAgICAgIGlmICh1bnNldCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBzZWxmLl92YWx1ZXNbY2hhbmdlLmtleV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuX3ZhbHVlc1tjaGFuZ2Uua2V5XSA9IGNoYW5nZS52YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghc2lsZW50ICYmIGNoYW5nZXMubGVuZ3RoKSBzZWxmLl9wZW5kaW5nID0gdHJ1ZTtcbiAgICAgICAgaWYgKCFzaWxlbnQpIHtcbiAgICAgICAgICAgIGZvckVhY2goY2hhbmdlcywgZnVuY3Rpb24gKGNoYW5nZSkge1xuICAgICAgICAgICAgICAgIHNlbGYudHJpZ2dlcignY2hhbmdlOicgKyBjaGFuZ2Uua2V5LCBzZWxmLCBjaGFuZ2UudmFsLCBvcHRpb25zKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gWW91IG1pZ2h0IGJlIHdvbmRlcmluZyB3aHkgdGhlcmUncyBhIGB3aGlsZWAgbG9vcCBoZXJlLiBDaGFuZ2VzIGNhblxuICAgICAgICAvLyBiZSByZWN1cnNpdmVseSBuZXN0ZWQgd2l0aGluIGBcImNoYW5nZVwiYCBldmVudHMuXG4gICAgICAgIGlmIChjaGFuZ2luZykgcmV0dXJuIHRoaXM7XG4gICAgICAgIGlmICghc2lsZW50KSB7XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5fcGVuZGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ2NoYW5nZScsIHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3BlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fY2hhbmdpbmcgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGdldDogZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbYXR0cl07XG4gICAgfSxcblxuICAgIC8vIFRvZ2dsZSBib29sZWFuIHByb3BlcnRpZXMgb3IgcHJvcGVydGllcyB0aGF0IGhhdmUgYSBgdmFsdWVzYFxuICAgIC8vIGFycmF5IGluIGl0cyBkZWZpbml0aW9uLlxuICAgIHRvZ2dsZTogZnVuY3Rpb24gKHByb3BlcnR5KSB7XG4gICAgICAgIHZhciBkZWYgPSB0aGlzLl9kZWZpbml0aW9uW3Byb3BlcnR5XTtcbiAgICAgICAgaWYgKGRlZi50eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIC8vIGlmIGl0J3MgYSBib29sLCBqdXN0IGZsaXAgaXRcbiAgICAgICAgICAgIHRoaXNbcHJvcGVydHldID0gIXRoaXNbcHJvcGVydHldO1xuICAgICAgICB9IGVsc2UgaWYgKGRlZiAmJiBkZWYudmFsdWVzKSB7XG4gICAgICAgICAgICAvLyBJZiBpdCdzIGEgcHJvcGVydHkgd2l0aCBhbiBhcnJheSBvZiB2YWx1ZXNcbiAgICAgICAgICAgIC8vIHNraXAgdG8gdGhlIG5leHQgb25lIGxvb3BpbmcgYmFjayBpZiBhdCBlbmQuXG4gICAgICAgICAgICB0aGlzW3Byb3BlcnR5XSA9IGFycmF5TmV4dChkZWYudmFsdWVzLCB0aGlzW3Byb3BlcnR5XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW4gb25seSB0b2dnbGUgcHJvcGVydGllcyB0aGF0IGFyZSB0eXBlIGBib29sZWFuYCBvciBoYXZlIGB2YWx1ZXNgIGFycmF5LicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyBHZXQgYWxsIG9mIHRoZSBhdHRyaWJ1dGVzIG9mIHRoZSBtb2RlbCBhdCB0aGUgdGltZSBvZiB0aGUgcHJldmlvdXNcbiAgICAvLyBgXCJjaGFuZ2VcImAgZXZlbnQuXG4gICAgcHJldmlvdXNBdHRyaWJ1dGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjbG9uZSh0aGlzLl9wcmV2aW91c0F0dHJpYnV0ZXMpO1xuICAgIH0sXG5cbiAgICAvLyBEZXRlcm1pbmUgaWYgdGhlIG1vZGVsIGhhcyBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IGBcImNoYW5nZVwiYCBldmVudC5cbiAgICAvLyBJZiB5b3Ugc3BlY2lmeSBhbiBhdHRyaWJ1dGUgbmFtZSwgZGV0ZXJtaW5lIGlmIHRoYXQgYXR0cmlidXRlIGhhcyBjaGFuZ2VkLlxuICAgIGhhc0NoYW5nZWQ6IGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgIGlmIChhdHRyID09IG51bGwpIHJldHVybiAhaXNFbXB0eSh0aGlzLl9jaGFuZ2VkKTtcbiAgICAgICAgcmV0dXJuIGhhcyh0aGlzLl9jaGFuZ2VkLCBhdHRyKTtcbiAgICB9LFxuXG4gICAgLy8gUmV0dXJuIGFuIG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgYXR0cmlidXRlcyB0aGF0IGhhdmUgY2hhbmdlZCwgb3JcbiAgICAvLyBmYWxzZSBpZiB0aGVyZSBhcmUgbm8gY2hhbmdlZCBhdHRyaWJ1dGVzLiBVc2VmdWwgZm9yIGRldGVybWluaW5nIHdoYXRcbiAgICAvLyBwYXJ0cyBvZiBhIHZpZXcgbmVlZCB0byBiZSB1cGRhdGVkIGFuZC9vciB3aGF0IGF0dHJpYnV0ZXMgbmVlZCB0byBiZVxuICAgIC8vIHBlcnNpc3RlZCB0byB0aGUgc2VydmVyLiBVbnNldCBhdHRyaWJ1dGVzIHdpbGwgYmUgc2V0IHRvIHVuZGVmaW5lZC5cbiAgICAvLyBZb3UgY2FuIGFsc28gcGFzcyBhbiBhdHRyaWJ1dGVzIG9iamVjdCB0byBkaWZmIGFnYWluc3QgdGhlIG1vZGVsLFxuICAgIC8vIGRldGVybWluaW5nIGlmIHRoZXJlICp3b3VsZCBiZSogYSBjaGFuZ2UuXG4gICAgY2hhbmdlZEF0dHJpYnV0ZXM6IGZ1bmN0aW9uIChkaWZmKSB7XG4gICAgICAgIGlmICghZGlmZikgcmV0dXJuIHRoaXMuaGFzQ2hhbmdlZCgpID8gY2xvbmUodGhpcy5fY2hhbmdlZCkgOiBmYWxzZTtcbiAgICAgICAgdmFyIHZhbCwgY2hhbmdlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgb2xkID0gdGhpcy5fY2hhbmdpbmcgPyB0aGlzLl9wcmV2aW91c0F0dHJpYnV0ZXMgOiB0aGlzLmF0dHJpYnV0ZXM7XG4gICAgICAgIHZhciBkZWYsIGlzRXF1YWw7XG4gICAgICAgIGZvciAodmFyIGF0dHIgaW4gZGlmZikge1xuICAgICAgICAgICAgZGVmID0gdGhpcy5fZGVmaW5pdGlvblthdHRyXTtcbiAgICAgICAgICAgIGlmICghZGVmKSBjb250aW51ZTtcbiAgICAgICAgICAgIGlzRXF1YWwgPSB0aGlzLl9nZXRDb21wYXJlRm9yVHlwZShkZWYudHlwZSk7XG4gICAgICAgICAgICBpZiAoaXNFcXVhbChvbGRbYXR0cl0sICh2YWwgPSBkaWZmW2F0dHJdKSkpIGNvbnRpbnVlO1xuICAgICAgICAgICAgKGNoYW5nZWQgfHwgKGNoYW5nZWQgPSB7fSkpW2F0dHJdID0gdmFsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGFuZ2VkO1xuICAgIH0sXG5cbiAgICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VyaWFsaXplKCk7XG4gICAgfSxcblxuICAgIHVuc2V0OiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICAgICAgYXR0cnMgPSBBcnJheS5pc0FycmF5KGF0dHJzKSA/IGF0dHJzIDogW2F0dHJzXTtcbiAgICAgICAgZm9yRWFjaChhdHRycywgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgdmFyIGRlZiA9IHRoaXMuX2RlZmluaXRpb25ba2V5XTtcbiAgICAgICAgICAgIHZhciB2YWw7XG4gICAgICAgICAgICBpZiAoZGVmLnJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgICAgdmFsID0gcmVzdWx0KGRlZiwgJ2RlZmF1bHQnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXQoa2V5LCB2YWwsIG9wdGlvbnMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXQoa2V5LCB2YWwsIGFzc2lnbih7fSwgb3B0aW9ucywge3Vuc2V0OiB0cnVlfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgY2xlYXI6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgZm9yRWFjaChrZXlzKHRoaXMuYXR0cmlidXRlcyksIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHNlbGYudW5zZXQoa2V5LCBvcHRpb25zKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBwcmV2aW91czogZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgaWYgKGF0dHIgPT0gbnVsbCB8fCAhT2JqZWN0LmtleXModGhpcy5fcHJldmlvdXNBdHRyaWJ1dGVzKS5sZW5ndGgpIHJldHVybiBudWxsO1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJldmlvdXNBdHRyaWJ1dGVzW2F0dHJdO1xuICAgIH0sXG5cbiAgICAvLyBHZXQgZGVmYXVsdCB2YWx1ZXMgZm9yIGEgY2VydGFpbiB0eXBlXG4gICAgX2dldERlZmF1bHRGb3JUeXBlOiBmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICB2YXIgZGF0YVR5cGUgPSB0aGlzLl9kYXRhVHlwZXNbdHlwZV07XG4gICAgICAgIHJldHVybiBkYXRhVHlwZSAmJiBkYXRhVHlwZS5kZWZhdWx0O1xuICAgIH0sXG5cbiAgICAvLyBEZXRlcm1pbmUgd2hpY2ggY29tcGFyaXNvbiBhbGdvcml0aG0gdG8gdXNlIGZvciBjb21wYXJpbmcgYSBwcm9wZXJ0eVxuICAgIF9nZXRDb21wYXJlRm9yVHlwZTogZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgdmFyIGRhdGFUeXBlID0gdGhpcy5fZGF0YVR5cGVzW3R5cGVdO1xuICAgICAgICBpZiAoZGF0YVR5cGUgJiYgZGF0YVR5cGUuY29tcGFyZSkgcmV0dXJuIGJpbmQoZGF0YVR5cGUuY29tcGFyZSwgdGhpcyk7XG4gICAgICAgIHJldHVybiBpc0VxdWFsO1xuICAgIH0sXG5cbiAgICAvLyBSdW4gdmFsaWRhdGlvbiBhZ2FpbnN0IHRoZSBuZXh0IGNvbXBsZXRlIHNldCBvZiBtb2RlbCBhdHRyaWJ1dGVzLFxuICAgIC8vIHJldHVybmluZyBgdHJ1ZWAgaWYgYWxsIGlzIHdlbGwuIE90aGVyd2lzZSwgZmlyZSBhbiBgXCJpbnZhbGlkXCJgIGV2ZW50LlxuICAgIF92YWxpZGF0ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgICAgIGlmICghb3B0aW9ucy52YWxpZGF0ZSB8fCAhdGhpcy52YWxpZGF0ZSkgcmV0dXJuIHRydWU7XG4gICAgICAgIGF0dHJzID0gYXNzaWduKHt9LCB0aGlzLmF0dHJpYnV0ZXMsIGF0dHJzKTtcbiAgICAgICAgdmFyIGVycm9yID0gdGhpcy52YWxpZGF0aW9uRXJyb3IgPSB0aGlzLnZhbGlkYXRlKGF0dHJzLCBvcHRpb25zKSB8fCBudWxsO1xuICAgICAgICBpZiAoIWVycm9yKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdpbnZhbGlkJywgdGhpcywgZXJyb3IsIGFzc2lnbihvcHRpb25zIHx8IHt9LCB7dmFsaWRhdGlvbkVycm9yOiBlcnJvcn0pKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBfY3JlYXRlUHJvcGVydHlEZWZpbml0aW9uOiBmdW5jdGlvbiAobmFtZSwgZGVzYywgaXNTZXNzaW9uKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVQcm9wZXJ0eURlZmluaXRpb24odGhpcywgbmFtZSwgZGVzYywgaXNTZXNzaW9uKTtcbiAgICB9LFxuXG4gICAgLy8ganVzdCBtYWtlcyBmcmllbmRsaWVyIGVycm9ycyB3aGVuIHRyeWluZyB0byBkZWZpbmUgYSBuZXcgbW9kZWxcbiAgICAvLyBvbmx5IHVzZWQgd2hlbiBzZXR0aW5nIHVwIG9yaWdpbmFsIHByb3BlcnR5IGRlZmluaXRpb25zXG4gICAgX2Vuc3VyZVZhbGlkVHlwZTogZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIGluY2x1ZGVzKFsnc3RyaW5nJywgJ251bWJlcicsICdib29sZWFuJywgJ2FycmF5JywgJ29iamVjdCcsICdkYXRlJywgJ2FueSddLmNvbmNhdChrZXlzKHRoaXMuX2RhdGFUeXBlcykpLCB0eXBlKSA/IHR5cGUgOiB1bmRlZmluZWQ7XG4gICAgfSxcblxuICAgIGdldEF0dHJpYnV0ZXM6IGZ1bmN0aW9uIChvcHRpb25zLCByYXcpIHtcbiAgICAgICAgb3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KTtcbiAgICAgICAgZGVmYXVsdHMob3B0aW9ucywge1xuICAgICAgICAgICAgc2Vzc2lvbjogZmFsc2UsXG4gICAgICAgICAgICBwcm9wczogZmFsc2UsXG4gICAgICAgICAgICBkZXJpdmVkOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHJlcyA9IHt9O1xuICAgICAgICB2YXIgdmFsLCBpdGVtLCBkZWY7XG4gICAgICAgIGZvciAoaXRlbSBpbiB0aGlzLl9kZWZpbml0aW9uKSB7XG4gICAgICAgICAgICBkZWYgPSB0aGlzLl9kZWZpbml0aW9uW2l0ZW1dO1xuICAgICAgICAgICAgaWYgKChvcHRpb25zLnNlc3Npb24gJiYgZGVmLnNlc3Npb24pIHx8IChvcHRpb25zLnByb3BzICYmICFkZWYuc2Vzc2lvbikpIHtcbiAgICAgICAgICAgICAgICB2YWwgPSAocmF3KSA/IHRoaXMuX3ZhbHVlc1tpdGVtXSA6IHRoaXNbaXRlbV07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB2YWwgPSByZXN1bHQoZGVmLCAnZGVmYXVsdCcpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsICE9PSAndW5kZWZpbmVkJykgcmVzW2l0ZW1dID0gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmRlcml2ZWQpIHtcbiAgICAgICAgICAgIGZvciAoaXRlbSBpbiB0aGlzLl9kZXJpdmVkKSByZXNbaXRlbV0gPSB0aGlzW2l0ZW1dO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfSxcblxuICAgIF9pbml0RGVyaXZlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgZm9yRWFjaCh0aGlzLl9kZXJpdmVkLCBmdW5jdGlvbiAodmFsdWUsIG5hbWUpIHtcbiAgICAgICAgICAgIHZhciBkZWYgPSBzZWxmLl9kZXJpdmVkW25hbWVdO1xuICAgICAgICAgICAgZGVmLmRlcHMgPSBkZWYuZGVwTGlzdDtcblxuICAgICAgICAgICAgdmFyIHVwZGF0ZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgICAgICAgICB2YXIgbmV3VmFsID0gZGVmLmZuLmNhbGwoc2VsZik7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5fY2FjaGVbbmFtZV0gIT09IG5ld1ZhbCB8fCAhZGVmLmNhY2hlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWYuY2FjaGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3ByZXZpb3VzQXR0cmlidXRlc1tuYW1lXSA9IHNlbGYuX2NhY2hlW25hbWVdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2NhY2hlW25hbWVdID0gbmV3VmFsO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnRyaWdnZXIoJ2NoYW5nZTonICsgbmFtZSwgc2VsZiwgc2VsZi5fY2FjaGVbbmFtZV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRlZi5kZXBzLmZvckVhY2goZnVuY3Rpb24gKHByb3BTdHJpbmcpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9rZXlUcmVlLmFkZChwcm9wU3RyaW5nLCB1cGRhdGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMub24oJ2FsbCcsIGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgICAgICAgICAgIGlmIChjaGFuZ2VSRS50ZXN0KGV2ZW50TmFtZSkpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9rZXlUcmVlLmdldChldmVudE5hbWUuc3BsaXQoJzonKVsxXSkuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIF9nZXREZXJpdmVkUHJvcGVydHk6IGZ1bmN0aW9uIChuYW1lLCBmbHVzaENhY2hlKSB7XG4gICAgICAgIC8vIGlzIHRoaXMgYSBkZXJpdmVkIHByb3BlcnR5IHRoYXQgaXMgY2FjaGVkXG4gICAgICAgIGlmICh0aGlzLl9kZXJpdmVkW25hbWVdLmNhY2hlKSB7XG4gICAgICAgICAgICAvL3NldCBpZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lLCBvciBmbHVzaENhY2hlIGlzIHNldFxuICAgICAgICAgICAgaWYgKGZsdXNoQ2FjaGUgfHwgIXRoaXMuX2NhY2hlLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FjaGVbbmFtZV0gPSB0aGlzLl9kZXJpdmVkW25hbWVdLmZuLmFwcGx5KHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlW25hbWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Rlcml2ZWRbbmFtZV0uZm4uYXBwbHkodGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2luaXRDb2xsZWN0aW9uczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY29sbDtcbiAgICAgICAgaWYgKCF0aGlzLl9jb2xsZWN0aW9ucykgcmV0dXJuO1xuICAgICAgICBmb3IgKGNvbGwgaW4gdGhpcy5fY29sbGVjdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXNbY29sbF0gPSBuZXcgdGhpcy5fY29sbGVjdGlvbnNbY29sbF0obnVsbCwge3BhcmVudDogdGhpc30pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9pbml0Q2hpbGRyZW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNoaWxkO1xuICAgICAgICBpZiAoIXRoaXMuX2NoaWxkcmVuKSByZXR1cm47XG4gICAgICAgIGZvciAoY2hpbGQgaW4gdGhpcy5fY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIHRoaXNbY2hpbGRdID0gbmV3IHRoaXMuX2NoaWxkcmVuW2NoaWxkXSh7fSwge3BhcmVudDogdGhpc30pO1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5Ubyh0aGlzW2NoaWxkXSwgJ2FsbCcsIHRoaXMuX2dldEV2ZW50QnViYmxpbmdIYW5kbGVyKGNoaWxkKSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gUmV0dXJucyBhIGJvdW5kIGhhbmRsZXIgZm9yIGRvaW5nIGV2ZW50IGJ1YmJsaW5nIHdoaWxlXG4gICAgLy8gYWRkaW5nIGEgbmFtZSB0byB0aGUgY2hhbmdlIHN0cmluZy5cbiAgICBfZ2V0RXZlbnRCdWJibGluZ0hhbmRsZXI6IGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGJpbmQoZnVuY3Rpb24gKG5hbWUsIG1vZGVsLCBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgaWYgKGNoYW5nZVJFLnRlc3QobmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ2NoYW5nZTonICsgcHJvcGVydHlOYW1lICsgJy4nICsgbmFtZS5zcGxpdCgnOicpWzFdLCBtb2RlbCwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuYW1lID09PSAnY2hhbmdlJykge1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcignY2hhbmdlJywgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvLyBDaGVjayB0aGF0IGFsbCByZXF1aXJlZCBhdHRyaWJ1dGVzIGFyZSBwcmVzZW50XG4gICAgX3ZlcmlmeVJlcXVpcmVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhdHRycyA9IHRoaXMuYXR0cmlidXRlczsgLy8gc2hvdWxkIGluY2x1ZGUgc2Vzc2lvblxuICAgICAgICBmb3IgKHZhciBkZWYgaW4gdGhpcy5fZGVmaW5pdGlvbikge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2RlZmluaXRpb25bZGVmXS5yZXF1aXJlZCAmJiB0eXBlb2YgYXR0cnNbZGVmXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufSk7XG5cbi8vIGdldHRlciBmb3IgYXR0cmlidXRlc1xuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoQmFzZS5wcm90b3R5cGUsIHtcbiAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlcyh7cHJvcHM6IHRydWUsIHNlc3Npb246IHRydWV9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgYWxsOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlcyh7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwcm9wczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkZXJpdmVkOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaXNTdGF0ZToge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKCkgeyB9XG4gICAgfVxufSk7XG5cbi8vIGhlbHBlciBmb3IgY3JlYXRpbmcvc3RvcmluZyBwcm9wZXJ0eSBkZWZpbml0aW9ucyBhbmQgY3JlYXRpbmdcbi8vIGFwcHJvcHJpYXRlIGdldHRlcnMvc2V0dGVyc1xuZnVuY3Rpb24gY3JlYXRlUHJvcGVydHlEZWZpbml0aW9uKG9iamVjdCwgbmFtZSwgZGVzYywgaXNTZXNzaW9uKSB7XG4gICAgdmFyIGRlZiA9IG9iamVjdC5fZGVmaW5pdGlvbltuYW1lXSA9IHt9O1xuICAgIHZhciB0eXBlLCBkZXNjQXJyYXk7XG5cbiAgICBpZiAoaXNTdHJpbmcoZGVzYykpIHtcbiAgICAgICAgLy8gZ3JhYiBvdXIgdHlwZSBpZiBhbGwgd2UndmUgZ290IGlzIGEgc3RyaW5nXG4gICAgICAgIHR5cGUgPSBvYmplY3QuX2Vuc3VyZVZhbGlkVHlwZShkZXNjKTtcbiAgICAgICAgaWYgKHR5cGUpIGRlZi50eXBlID0gdHlwZTtcbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIC8vVHJhbnNmb3JtIGFycmF5IG9mIFsndHlwZScsIHJlcXVpcmVkLCBkZWZhdWx0XSB0byBvYmplY3QgZm9ybVxuICAgICAgICBpZiAoaXNBcnJheShkZXNjKSkge1xuICAgICAgICAgICAgZGVzY0FycmF5ID0gZGVzYztcbiAgICAgICAgICAgIGRlc2MgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogZGVzY0FycmF5WzBdLFxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBkZXNjQXJyYXlbMV0sXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogZGVzY0FycmF5WzJdXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdHlwZSA9IG9iamVjdC5fZW5zdXJlVmFsaWRUeXBlKGRlc2MudHlwZSk7XG4gICAgICAgIGlmICh0eXBlKSBkZWYudHlwZSA9IHR5cGU7XG5cbiAgICAgICAgaWYgKGRlc2MucmVxdWlyZWQpIGRlZi5yZXF1aXJlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKGRlc2MuZGVmYXVsdCAmJiB0eXBlb2YgZGVzYy5kZWZhdWx0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGRlZmF1bHQgdmFsdWUgZm9yICcgKyBuYW1lICsgJyBjYW5ub3QgYmUgYW4gb2JqZWN0L2FycmF5LCBtdXN0IGJlIGEgdmFsdWUgb3IgYSBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGEgdmFsdWUvb2JqZWN0L2FycmF5Jyk7XG4gICAgICAgIH1cbiAgICAgICAgZGVmLmRlZmF1bHQgPSBkZXNjLmRlZmF1bHQ7XG5cbiAgICAgICAgZGVmLmFsbG93TnVsbCA9IGRlc2MuYWxsb3dOdWxsID8gZGVzYy5hbGxvd051bGwgOiBmYWxzZTtcbiAgICAgICAgaWYgKGRlc2Muc2V0T25jZSkgZGVmLnNldE9uY2UgPSB0cnVlO1xuICAgICAgICBpZiAoZGVmLnJlcXVpcmVkICYmIGlzVW5kZWZpbmVkKGRlZi5kZWZhdWx0KSAmJiAhZGVmLnNldE9uY2UpIGRlZi5kZWZhdWx0ID0gb2JqZWN0Ll9nZXREZWZhdWx0Rm9yVHlwZSh0eXBlKTtcbiAgICAgICAgZGVmLnRlc3QgPSBkZXNjLnRlc3Q7XG4gICAgICAgIGRlZi52YWx1ZXMgPSBkZXNjLnZhbHVlcztcbiAgICB9XG4gICAgaWYgKGlzU2Vzc2lvbikgZGVmLnNlc3Npb24gPSB0cnVlO1xuXG4gICAgLy8gZGVmaW5lIGEgZ2V0dGVyL3NldHRlciBvbiB0aGUgcHJvdG90eXBlXG4gICAgLy8gYnV0IHRoZXkgZ2V0L3NldCBvbiB0aGUgaW5zdGFuY2VcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCB7XG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgdGhpcy5zZXQobmFtZSwgdmFsKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLl92YWx1ZXNbbmFtZV07XG4gICAgICAgICAgICB2YXIgdHlwZURlZiA9IHRoaXMuX2RhdGFUeXBlc1tkZWYudHlwZV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlRGVmICYmIHR5cGVEZWYuZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdHlwZURlZi5nZXQodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IHJlc3VsdChkZWYsICdkZWZhdWx0Jyk7XG4gICAgICAgICAgICB0aGlzLl92YWx1ZXNbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRlZjtcbn1cblxuLy8gaGVscGVyIGZvciBjcmVhdGluZyBkZXJpdmVkIHByb3BlcnR5IGRlZmluaXRpb25zXG5mdW5jdGlvbiBjcmVhdGVEZXJpdmVkUHJvcGVydHkobW9kZWxQcm90bywgbmFtZSwgZGVmaW5pdGlvbikge1xuICAgIHZhciBkZWYgPSBtb2RlbFByb3RvLl9kZXJpdmVkW25hbWVdID0ge1xuICAgICAgICBmbjogaXNGdW5jdGlvbihkZWZpbml0aW9uKSA/IGRlZmluaXRpb24gOiBkZWZpbml0aW9uLmZuLFxuICAgICAgICBjYWNoZTogKGRlZmluaXRpb24uY2FjaGUgIT09IGZhbHNlKSxcbiAgICAgICAgZGVwTGlzdDogZGVmaW5pdGlvbi5kZXBzIHx8IFtdXG4gICAgfTtcblxuICAgIC8vIGFkZCB0byBvdXIgc2hhcmVkIGRlcGVuZGVuY3kgbGlzdFxuICAgIGZvckVhY2goZGVmLmRlcExpc3QsIGZ1bmN0aW9uIChkZXApIHtcbiAgICAgICAgbW9kZWxQcm90by5fZGVwc1tkZXBdID0gdW5pb24obW9kZWxQcm90by5fZGVwc1tkZXBdIHx8IFtdLCBbbmFtZV0pO1xuICAgIH0pO1xuXG4gICAgLy8gZGVmaW5lZCBhIHRvcC1sZXZlbCBnZXR0ZXIgZm9yIGRlcml2ZWQgbmFtZXNcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kZWxQcm90bywgbmFtZSwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9nZXREZXJpdmVkUHJvcGVydHkobmFtZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCInICsgbmFtZSArICdcIiBpcyBhIGRlcml2ZWQgcHJvcGVydHksIGl0IGNhblxcJ3QgYmUgc2V0IGRpcmVjdGx5LicpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbnZhciBkYXRhVHlwZXMgPSB7XG4gICAgc3RyaW5nOiB7XG4gICAgICAgIGRlZmF1bHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGF0ZToge1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdWYWwpIHtcbiAgICAgICAgICAgIHZhciBuZXdUeXBlO1xuICAgICAgICAgICAgaWYgKG5ld1ZhbCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbmV3VHlwZSA9IHR5cGVvZiBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghaXNEYXRlKG5ld1ZhbCkpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0ZVZhbCA9IG5ldyBEYXRlKG5ld1ZhbCkudmFsdWVPZigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNOYU4oZGF0ZVZhbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBuZXdWYWwgY2FudCBiZSBwYXJzZWQsIHRoZW4gdHJ5IHBhcnNlSW50IGZpcnN0XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlVmFsID0gbmV3IERhdGUocGFyc2VJbnQobmV3VmFsLCAxMCkpLnZhbHVlT2YoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc05hTihkYXRlVmFsKSkgdGhyb3cgVHlwZUVycm9yO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5ld1ZhbCA9IGRhdGVWYWw7XG4gICAgICAgICAgICAgICAgICAgIG5ld1R5cGUgPSAnZGF0ZSc7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdUeXBlID0gdHlwZW9mIG5ld1ZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld1R5cGUgPSAnZGF0ZSc7XG4gICAgICAgICAgICAgICAgbmV3VmFsID0gbmV3VmFsLnZhbHVlT2YoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB2YWw6IG5ld1ZhbCxcbiAgICAgICAgICAgICAgICB0eXBlOiBuZXdUeXBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgIGlmICh2YWwgPT0gbnVsbCkgeyByZXR1cm4gdmFsOyB9XG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUodmFsKTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGFycmF5OiB7XG4gICAgICAgIHNldDogZnVuY3Rpb24gKG5ld1ZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB2YWw6IG5ld1ZhbCxcbiAgICAgICAgICAgICAgICB0eXBlOiBpc0FycmF5KG5ld1ZhbCkgPyAnYXJyYXknIDogdHlwZW9mIG5ld1ZhbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvYmplY3Q6IHtcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmV3VmFsKSB7XG4gICAgICAgICAgICB2YXIgbmV3VHlwZSA9IHR5cGVvZiBuZXdWYWw7XG4gICAgICAgICAgICAvLyB3ZSBoYXZlIHRvIGhhdmUgYSB3YXkgb2Ygc3VwcG9ydGluZyBcIm1pc3NpbmdcIiBvYmplY3RzLlxuICAgICAgICAgICAgLy8gTnVsbCBpcyBhbiBvYmplY3QsIGJ1dCBzZXR0aW5nIGEgdmFsdWUgdG8gdW5kZWZpbmVkXG4gICAgICAgICAgICAvLyBzaG91bGQgd29yayB0b28sIElNTy4gV2UganVzdCBvdmVycmlkZSBpdCwgaW4gdGhhdCBjYXNlLlxuICAgICAgICAgICAgaWYgKG5ld1R5cGUgIT09ICdvYmplY3QnICYmIGlzVW5kZWZpbmVkKG5ld1ZhbCkpIHtcbiAgICAgICAgICAgICAgICBuZXdWYWwgPSBudWxsO1xuICAgICAgICAgICAgICAgIG5ld1R5cGUgPSAnb2JqZWN0JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdmFsOiBuZXdWYWwsXG4gICAgICAgICAgICAgICAgdHlwZTogbmV3VHlwZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyB0aGUgYHN0YXRlYCBkYXRhIHR5cGUgaXMgYSBiaXQgc3BlY2lhbCBpbiB0aGF0IHNldHRpbmcgaXQgc2hvdWxkXG4gICAgLy8gYWxzbyBidWJibGUgZXZlbnRzXG4gICAgc3RhdGU6IHtcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmV3VmFsKSB7XG4gICAgICAgICAgICB2YXIgaXNJbnN0YW5jZSA9IG5ld1ZhbCBpbnN0YW5jZW9mIEJhc2UgfHwgKG5ld1ZhbCAmJiBuZXdWYWwuaXNTdGF0ZSk7XG4gICAgICAgICAgICBpZiAoaXNJbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbDogbmV3VmFsLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RhdGUnXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBuZXdWYWwsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IHR5cGVvZiBuZXdWYWxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjb21wYXJlOiBmdW5jdGlvbiAoY3VycmVudFZhbCwgbmV3VmFsLCBhdHRyaWJ1dGVOYW1lKSB7XG4gICAgICAgICAgICB2YXIgaXNTYW1lID0gY3VycmVudFZhbCA9PT0gbmV3VmFsO1xuXG4gICAgICAgICAgICAvLyBpZiB0aGlzIGhhcyBjaGFuZ2VkIHdlIHdhbnQgdG8gYWxzbyBoYW5kbGVcbiAgICAgICAgICAgIC8vIGV2ZW50IHByb3BhZ2F0aW9uXG4gICAgICAgICAgICBpZiAoIWlzU2FtZSkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcExpc3RlbmluZyhjdXJyZW50VmFsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobmV3VmFsICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0ZW5UbyhuZXdWYWwsICdhbGwnLCB0aGlzLl9nZXRFdmVudEJ1YmJsaW5nSGFuZGxlcihhdHRyaWJ1dGVOYW1lKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gaXNTYW1lO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLy8gdGhlIGV4dGVuZCBtZXRob2QgdXNlZCB0byBleHRlbmQgcHJvdG90eXBlcywgbWFpbnRhaW4gaW5oZXJpdGFuY2UgY2hhaW5zIGZvciBpbnN0YW5jZW9mXG4vLyBhbmQgYWxsb3cgZm9yIGFkZGl0aW9ucyB0byB0aGUgbW9kZWwgZGVmaW5pdGlvbnMuXG5mdW5jdGlvbiBleHRlbmQocHJvdG9Qcm9wcykge1xuICAgIHZhciBwYXJlbnQgPSB0aGlzO1xuICAgIHZhciBjaGlsZDtcbiAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgIC8vIFRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiBmb3IgdGhlIG5ldyBzdWJjbGFzcyBpcyBlaXRoZXIgZGVmaW5lZCBieSB5b3VcbiAgICAvLyAodGhlIFwiY29uc3RydWN0b3JcIiBwcm9wZXJ0eSBpbiB5b3VyIGBleHRlbmRgIGRlZmluaXRpb24pLCBvciBkZWZhdWx0ZWRcbiAgICAvLyBieSB1cyB0byBzaW1wbHkgY2FsbCB0aGUgcGFyZW50J3MgY29uc3RydWN0b3IuXG4gICAgaWYgKHByb3RvUHJvcHMgJiYgcHJvdG9Qcm9wcy5oYXNPd25Qcm9wZXJ0eSgnY29uc3RydWN0b3InKSkge1xuICAgICAgICBjaGlsZCA9IHByb3RvUHJvcHMuY29uc3RydWN0b3I7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gQWRkIHN0YXRpYyBwcm9wZXJ0aWVzIHRvIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiBmcm9tIHBhcmVudFxuICAgIGFzc2lnbihjaGlsZCwgcGFyZW50KTtcblxuICAgIC8vIFNldCB0aGUgcHJvdG90eXBlIGNoYWluIHRvIGluaGVyaXQgZnJvbSBgcGFyZW50YCwgd2l0aG91dCBjYWxsaW5nXG4gICAgLy8gYHBhcmVudGAncyBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cbiAgICB2YXIgU3Vycm9nYXRlID0gZnVuY3Rpb24gKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH07XG4gICAgU3Vycm9nYXRlLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7XG4gICAgY2hpbGQucHJvdG90eXBlID0gbmV3IFN1cnJvZ2F0ZSgpO1xuXG4gICAgLy8gc2V0IHByb3RvdHlwZSBsZXZlbCBvYmplY3RzXG4gICAgY2hpbGQucHJvdG90eXBlLl9kZXJpdmVkID0gIGFzc2lnbih7fSwgcGFyZW50LnByb3RvdHlwZS5fZGVyaXZlZCk7XG4gICAgY2hpbGQucHJvdG90eXBlLl9kZXBzID0gYXNzaWduKHt9LCBwYXJlbnQucHJvdG90eXBlLl9kZXBzKTtcbiAgICBjaGlsZC5wcm90b3R5cGUuX2RlZmluaXRpb24gPSBhc3NpZ24oe30sIHBhcmVudC5wcm90b3R5cGUuX2RlZmluaXRpb24pO1xuICAgIGNoaWxkLnByb3RvdHlwZS5fY29sbGVjdGlvbnMgPSBhc3NpZ24oe30sIHBhcmVudC5wcm90b3R5cGUuX2NvbGxlY3Rpb25zKTtcbiAgICBjaGlsZC5wcm90b3R5cGUuX2NoaWxkcmVuID0gYXNzaWduKHt9LCBwYXJlbnQucHJvdG90eXBlLl9jaGlsZHJlbik7XG4gICAgY2hpbGQucHJvdG90eXBlLl9kYXRhVHlwZXMgPSBhc3NpZ24oe30sIHBhcmVudC5wcm90b3R5cGUuX2RhdGFUeXBlcyB8fCBkYXRhVHlwZXMpO1xuXG4gICAgLy8gTWl4IGluIGFsbCBwcm90b3R5cGUgcHJvcGVydGllcyB0byB0aGUgc3ViY2xhc3MgaWYgc3VwcGxpZWQuXG4gICAgaWYgKHByb3RvUHJvcHMpIHtcbiAgICAgICAgdmFyIG9taXRGcm9tRXh0ZW5kID0gW1xuICAgICAgICAgICAgJ2RhdGFUeXBlcycsICdwcm9wcycsICdzZXNzaW9uJywgJ2Rlcml2ZWQnLCAnY29sbGVjdGlvbnMnLCAnY2hpbGRyZW4nXG4gICAgICAgIF07XG4gICAgICAgIGFyZ3MuZm9yRWFjaChmdW5jdGlvbiBwcm9jZXNzQXJnKGRlZikge1xuICAgICAgICAgICAgaWYgKGRlZi5kYXRhVHlwZXMpIHtcbiAgICAgICAgICAgICAgICBmb3JFYWNoKGRlZi5kYXRhVHlwZXMsIGZ1bmN0aW9uIChkZWYsIG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQucHJvdG90eXBlLl9kYXRhVHlwZXNbbmFtZV0gPSBkZWY7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGVmLnByb3BzKSB7XG4gICAgICAgICAgICAgICAgZm9yRWFjaChkZWYucHJvcHMsIGZ1bmN0aW9uIChkZWYsIG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlUHJvcGVydHlEZWZpbml0aW9uKGNoaWxkLnByb3RvdHlwZSwgbmFtZSwgZGVmKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkZWYuc2Vzc2lvbikge1xuICAgICAgICAgICAgICAgIGZvckVhY2goZGVmLnNlc3Npb24sIGZ1bmN0aW9uIChkZWYsIG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlUHJvcGVydHlEZWZpbml0aW9uKGNoaWxkLnByb3RvdHlwZSwgbmFtZSwgZGVmLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkZWYuZGVyaXZlZCkge1xuICAgICAgICAgICAgICAgIGZvckVhY2goZGVmLmRlcml2ZWQsIGZ1bmN0aW9uIChkZWYsIG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGVyaXZlZFByb3BlcnR5KGNoaWxkLnByb3RvdHlwZSwgbmFtZSwgZGVmKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkZWYuY29sbGVjdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBmb3JFYWNoKGRlZi5jb2xsZWN0aW9ucywgZnVuY3Rpb24gKGNvbnN0cnVjdG9yLCBuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLnByb3RvdHlwZS5fY29sbGVjdGlvbnNbbmFtZV0gPSBjb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkZWYuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBmb3JFYWNoKGRlZi5jaGlsZHJlbiwgZnVuY3Rpb24gKGNvbnN0cnVjdG9yLCBuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLnByb3RvdHlwZS5fY2hpbGRyZW5bbmFtZV0gPSBjb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFzc2lnbihjaGlsZC5wcm90b3R5cGUsIG9taXQoZGVmLCBvbWl0RnJvbUV4dGVuZCkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBTZXQgYSBjb252ZW5pZW5jZSBwcm9wZXJ0eSBpbiBjYXNlIHRoZSBwYXJlbnQncyBwcm90b3R5cGUgaXMgbmVlZGVkXG4gICAgLy8gbGF0ZXIuXG4gICAgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTtcblxuICAgIHJldHVybiBjaGlsZDtcbn1cblxuQmFzZS5leHRlbmQgPSBleHRlbmQ7XG5cbi8vIE91ciBtYWluIGV4cG9ydHNcbm1vZHVsZS5leHBvcnRzID0gQmFzZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXJyYXlOZXh0KGFycmF5LCBjdXJyZW50SXRlbSkge1xuICAgIHZhciBsZW4gPSBhcnJheS5sZW5ndGg7XG4gICAgdmFyIG5ld0luZGV4ID0gYXJyYXkuaW5kZXhPZihjdXJyZW50SXRlbSkgKyAxO1xuICAgIGlmIChuZXdJbmRleCA+IChsZW4gLSAxKSkgbmV3SW5kZXggPSAwO1xuICAgIHJldHVybiBhcnJheVtuZXdJbmRleF07XG59O1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjEgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjcuMCA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBiYXNlQ2xvbmUgPSByZXF1aXJlKCdsb2Rhc2guX2Jhc2VjbG9uZScpLFxuICAgIGJpbmRDYWxsYmFjayA9IHJlcXVpcmUoJ2xvZGFzaC5fYmluZGNhbGxiYWNrJyksXG4gICAgaXNJdGVyYXRlZUNhbGwgPSByZXF1aXJlKCdsb2Rhc2guX2lzaXRlcmF0ZWVjYWxsJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGB2YWx1ZWAuIElmIGBpc0RlZXBgIGlzIGB0cnVlYCBuZXN0ZWQgb2JqZWN0cyBhcmUgY2xvbmVkLFxuICogb3RoZXJ3aXNlIHRoZXkgYXJlIGFzc2lnbmVkIGJ5IHJlZmVyZW5jZS4gSWYgYGN1c3RvbWl6ZXJgIGlzIHByb3ZpZGVkIGl0IGlzXG4gKiBpbnZva2VkIHRvIHByb2R1Y2UgdGhlIGNsb25lZCB2YWx1ZXMuIElmIGBjdXN0b21pemVyYCByZXR1cm5zIGB1bmRlZmluZWRgXG4gKiBjbG9uaW5nIGlzIGhhbmRsZWQgYnkgdGhlIG1ldGhvZCBpbnN0ZWFkLiBUaGUgYGN1c3RvbWl6ZXJgIGlzIGJvdW5kIHRvXG4gKiBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0d28gYXJndW1lbnQ7ICh2YWx1ZSBbLCBpbmRleHxrZXksIG9iamVjdF0pLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uIHRoZSBzdHJ1Y3R1cmVkIGNsb25lIGFsZ29yaXRobS5cbiAqIFRoZSBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYGFyZ3VtZW50c2Agb2JqZWN0cyBhbmQgb2JqZWN0cyBjcmVhdGVkIGJ5XG4gKiBjb25zdHJ1Y3RvcnMgb3RoZXIgdGhhbiBgT2JqZWN0YCBhcmUgY2xvbmVkIHRvIHBsYWluIGBPYmplY3RgIG9iamVjdHMuIEFuXG4gKiBlbXB0eSBvYmplY3QgaXMgcmV0dXJuZWQgZm9yIHVuY2xvbmVhYmxlIHZhbHVlcyBzdWNoIGFzIGZ1bmN0aW9ucywgRE9NIG5vZGVzLFxuICogTWFwcywgU2V0cywgYW5kIFdlYWtNYXBzLiBTZWUgdGhlIFtIVE1MNSBzcGVjaWZpY2F0aW9uXShodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNS9pbmZyYXN0cnVjdHVyZS5odG1sI2ludGVybmFsLXN0cnVjdHVyZWQtY2xvbmluZy1hbGdvcml0aG0pXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY2xvbmluZyB2YWx1ZXMuXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGN1c3RvbWl6ZXJgLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHVzZXJzID0gW1xuICogICB7ICd1c2VyJzogJ2Jhcm5leScgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJyB9XG4gKiBdO1xuICpcbiAqIHZhciBzaGFsbG93ID0gXy5jbG9uZSh1c2Vycyk7XG4gKiBzaGFsbG93WzBdID09PSB1c2Vyc1swXTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiB2YXIgZGVlcCA9IF8uY2xvbmUodXNlcnMsIHRydWUpO1xuICogZGVlcFswXSA9PT0gdXNlcnNbMF07XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIC8vIHVzaW5nIGEgY3VzdG9taXplciBjYWxsYmFja1xuICogdmFyIGVsID0gXy5jbG9uZShkb2N1bWVudC5ib2R5LCBmdW5jdGlvbih2YWx1ZSkge1xuICogICBpZiAoXy5pc0VsZW1lbnQodmFsdWUpKSB7XG4gKiAgICAgcmV0dXJuIHZhbHVlLmNsb25lTm9kZShmYWxzZSk7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIGVsID09PSBkb2N1bWVudC5ib2R5XG4gKiAvLyA9PiBmYWxzZVxuICogZWwubm9kZU5hbWVcbiAqIC8vID0+IEJPRFlcbiAqIGVsLmNoaWxkTm9kZXMubGVuZ3RoO1xuICogLy8gPT4gMFxuICovXG5mdW5jdGlvbiBjbG9uZSh2YWx1ZSwgaXNEZWVwLCBjdXN0b21pemVyLCB0aGlzQXJnKSB7XG4gIGlmIChpc0RlZXAgJiYgdHlwZW9mIGlzRGVlcCAhPSAnYm9vbGVhbicgJiYgaXNJdGVyYXRlZUNhbGwodmFsdWUsIGlzRGVlcCwgY3VzdG9taXplcikpIHtcbiAgICBpc0RlZXAgPSBmYWxzZTtcbiAgfVxuICBlbHNlIGlmICh0eXBlb2YgaXNEZWVwID09ICdmdW5jdGlvbicpIHtcbiAgICB0aGlzQXJnID0gY3VzdG9taXplcjtcbiAgICBjdXN0b21pemVyID0gaXNEZWVwO1xuICAgIGlzRGVlcCA9IGZhbHNlO1xuICB9XG4gIGN1c3RvbWl6ZXIgPSB0eXBlb2YgY3VzdG9taXplciA9PSAnZnVuY3Rpb24nICYmIGJpbmRDYWxsYmFjayhjdXN0b21pemVyLCB0aGlzQXJnLCAxKTtcbiAgcmV0dXJuIGJhc2VDbG9uZSh2YWx1ZSwgaXNEZWVwLCBjdXN0b21pemVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZTtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4xIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgYXJyYXlDb3B5ID0gcmVxdWlyZSgnbG9kYXNoLl9hcnJheWNvcHknKSxcbiAgICBhcnJheUVhY2ggPSByZXF1aXJlKCdsb2Rhc2guX2FycmF5ZWFjaCcpLFxuICAgIGJhc2VDb3B5ID0gcmVxdWlyZSgnbG9kYXNoLl9iYXNlY29weScpLFxuICAgIGJhc2VGb3IgPSByZXF1aXJlKCdsb2Rhc2guX2Jhc2Vmb3InKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnbG9kYXNoLmlzYXJyYXknKSxcbiAgICBpc05hdGl2ZSA9IHJlcXVpcmUoJ2xvZGFzaC5pc25hdGl2ZScpLFxuICAgIGtleXMgPSByZXF1aXJlKCdsb2Rhc2gua2V5cycpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgIGZsYWdzIGZyb20gdGhlaXIgY29lcmNlZCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlRmxhZ3MgPSAvXFx3KiQvO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBzdXBwb3J0ZWQgYnkgYF8uY2xvbmVgLiAqL1xudmFyIGNsb25lYWJsZVRhZ3MgPSB7fTtcbmNsb25lYWJsZVRhZ3NbYXJnc1RhZ10gPSBjbG9uZWFibGVUYWdzW2FycmF5VGFnXSA9XG5jbG9uZWFibGVUYWdzW2FycmF5QnVmZmVyVGFnXSA9IGNsb25lYWJsZVRhZ3NbYm9vbFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tkYXRlVGFnXSA9IGNsb25lYWJsZVRhZ3NbZmxvYXQzMlRhZ10gPVxuY2xvbmVhYmxlVGFnc1tmbG9hdDY0VGFnXSA9IGNsb25lYWJsZVRhZ3NbaW50OFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tpbnQxNlRhZ10gPSBjbG9uZWFibGVUYWdzW2ludDMyVGFnXSA9XG5jbG9uZWFibGVUYWdzW251bWJlclRhZ10gPSBjbG9uZWFibGVUYWdzW29iamVjdFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tyZWdleHBUYWddID0gY2xvbmVhYmxlVGFnc1tzdHJpbmdUYWddID1cbmNsb25lYWJsZVRhZ3NbdWludDhUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50OENsYW1wZWRUYWddID1cbmNsb25lYWJsZVRhZ3NbdWludDE2VGFnXSA9IGNsb25lYWJsZVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG5jbG9uZWFibGVUYWdzW2Vycm9yVGFnXSA9IGNsb25lYWJsZVRhZ3NbZnVuY1RhZ10gPVxuY2xvbmVhYmxlVGFnc1ttYXBUYWddID0gY2xvbmVhYmxlVGFnc1tzZXRUYWddID1cbmNsb25lYWJsZVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIEFycmF5QnVmZmVyID0gaXNOYXRpdmUoQXJyYXlCdWZmZXIgPSBnbG9iYWwuQXJyYXlCdWZmZXIpICYmIEFycmF5QnVmZmVyLFxuICAgIGJ1ZmZlclNsaWNlID0gaXNOYXRpdmUoYnVmZmVyU2xpY2UgPSBBcnJheUJ1ZmZlciAmJiBuZXcgQXJyYXlCdWZmZXIoMCkuc2xpY2UpICYmIGJ1ZmZlclNsaWNlLFxuICAgIGZsb29yID0gTWF0aC5mbG9vcixcbiAgICBVaW50OEFycmF5ID0gaXNOYXRpdmUoVWludDhBcnJheSA9IGdsb2JhbC5VaW50OEFycmF5KSAmJiBVaW50OEFycmF5O1xuXG4vKiogVXNlZCB0byBjbG9uZSBhcnJheSBidWZmZXJzLiAqL1xudmFyIEZsb2F0NjRBcnJheSA9IChmdW5jdGlvbigpIHtcbiAgLy8gU2FmYXJpIDUgZXJyb3JzIHdoZW4gdXNpbmcgYW4gYXJyYXkgYnVmZmVyIHRvIGluaXRpYWxpemUgYSB0eXBlZCBhcnJheVxuICAvLyB3aGVyZSB0aGUgYXJyYXkgYnVmZmVyJ3MgYGJ5dGVMZW5ndGhgIGlzIG5vdCBhIG11bHRpcGxlIG9mIHRoZSB0eXBlZFxuICAvLyBhcnJheSdzIGBCWVRFU19QRVJfRUxFTUVOVGAuXG4gIHRyeSB7XG4gICAgdmFyIGZ1bmMgPSBpc05hdGl2ZShmdW5jID0gZ2xvYmFsLkZsb2F0NjRBcnJheSkgJiYgZnVuYyxcbiAgICAgICAgcmVzdWx0ID0gbmV3IGZ1bmMobmV3IEFycmF5QnVmZmVyKDEwKSwgMCwgMSkgJiYgZnVuYztcbiAgfSBjYXRjaChlKSB7fVxuICByZXR1cm4gcmVzdWx0O1xufSgpKTtcblxuLyoqIFVzZWQgYXMgdGhlIHNpemUsIGluIGJ5dGVzLCBvZiBlYWNoIGBGbG9hdDY0QXJyYXlgIGVsZW1lbnQuICovXG52YXIgRkxPQVQ2NF9CWVRFU19QRVJfRUxFTUVOVCA9IEZsb2F0NjRBcnJheSA/IEZsb2F0NjRBcnJheS5CWVRFU19QRVJfRUxFTUVOVCA6IDA7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY2xvbmVgIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXJndW1lbnQganVnZ2xpbmdcbiAqIGFuZCBgdGhpc2AgYmluZGluZyBgY3VzdG9taXplcmAgZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjbG9uaW5nIHZhbHVlcy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBba2V5XSBUaGUga2V5IG9mIGB2YWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCBgdmFsdWVgIGJlbG9uZ3MgdG8uXG4gKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tBPVtdXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSBvYmplY3RzLlxuICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQj1bXV0gQXNzb2NpYXRlcyBjbG9uZXMgd2l0aCBzb3VyY2UgY291bnRlcnBhcnRzLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUNsb25lKHZhbHVlLCBpc0RlZXAsIGN1c3RvbWl6ZXIsIGtleSwgb2JqZWN0LCBzdGFja0EsIHN0YWNrQikge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoY3VzdG9taXplcikge1xuICAgIHJlc3VsdCA9IG9iamVjdCA/IGN1c3RvbWl6ZXIodmFsdWUsIGtleSwgb2JqZWN0KSA6IGN1c3RvbWl6ZXIodmFsdWUpO1xuICB9XG4gIGlmICh0eXBlb2YgcmVzdWx0ICE9ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKTtcbiAgaWYgKGlzQXJyKSB7XG4gICAgcmVzdWx0ID0gaW5pdENsb25lQXJyYXkodmFsdWUpO1xuICAgIGlmICghaXNEZWVwKSB7XG4gICAgICByZXR1cm4gYXJyYXlDb3B5KHZhbHVlLCByZXN1bHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgdGFnID0gb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSksXG4gICAgICAgIGlzRnVuYyA9IHRhZyA9PSBmdW5jVGFnO1xuXG4gICAgaWYgKHRhZyA9PSBvYmplY3RUYWcgfHwgdGFnID09IGFyZ3NUYWcgfHwgKGlzRnVuYyAmJiAhb2JqZWN0KSkge1xuICAgICAgcmVzdWx0ID0gaW5pdENsb25lT2JqZWN0KGlzRnVuYyA/IHt9IDogdmFsdWUpO1xuICAgICAgaWYgKCFpc0RlZXApIHtcbiAgICAgICAgcmV0dXJuIGJhc2VDb3B5KHZhbHVlLCByZXN1bHQsIGtleXModmFsdWUpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNsb25lYWJsZVRhZ3NbdGFnXVxuICAgICAgICA/IGluaXRDbG9uZUJ5VGFnKHZhbHVlLCB0YWcsIGlzRGVlcClcbiAgICAgICAgOiAob2JqZWN0ID8gdmFsdWUgOiB7fSk7XG4gICAgfVxuICB9XG4gIC8vIENoZWNrIGZvciBjaXJjdWxhciByZWZlcmVuY2VzIGFuZCByZXR1cm4gY29ycmVzcG9uZGluZyBjbG9uZS5cbiAgc3RhY2tBIHx8IChzdGFja0EgPSBbXSk7XG4gIHN0YWNrQiB8fCAoc3RhY2tCID0gW10pO1xuXG4gIHZhciBsZW5ndGggPSBzdGFja0EubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoc3RhY2tBW2xlbmd0aF0gPT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiBzdGFja0JbbGVuZ3RoXTtcbiAgICB9XG4gIH1cbiAgLy8gQWRkIHRoZSBzb3VyY2UgdmFsdWUgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzIGFuZCBhc3NvY2lhdGUgaXQgd2l0aCBpdHMgY2xvbmUuXG4gIHN0YWNrQS5wdXNoKHZhbHVlKTtcbiAgc3RhY2tCLnB1c2gocmVzdWx0KTtcblxuICAvLyBSZWN1cnNpdmVseSBwb3B1bGF0ZSBjbG9uZSAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAoaXNBcnIgPyBhcnJheUVhY2ggOiBiYXNlRm9yT3duKSh2YWx1ZSwgZnVuY3Rpb24oc3ViVmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFtrZXldID0gYmFzZUNsb25lKHN1YlZhbHVlLCBpc0RlZXAsIGN1c3RvbWl6ZXIsIGtleSwgdmFsdWUsIHN0YWNrQSwgc3RhY2tCKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yT3duYCB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrXG4gKiBzaG9ydGhhbmRzIGFuZCBgdGhpc2AgYmluZGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlRm9yT3duKG9iamVjdCwgaXRlcmF0ZWUpIHtcbiAgcmV0dXJuIGJhc2VGb3Iob2JqZWN0LCBpdGVyYXRlZSwga2V5cyk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoZSBnaXZlbiBhcnJheSBidWZmZXIuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGJ1ZmZlciBUaGUgYXJyYXkgYnVmZmVyIHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5QnVmZmVyfSBSZXR1cm5zIHRoZSBjbG9uZWQgYXJyYXkgYnVmZmVyLlxuICovXG5mdW5jdGlvbiBidWZmZXJDbG9uZShidWZmZXIpIHtcbiAgcmV0dXJuIGJ1ZmZlclNsaWNlLmNhbGwoYnVmZmVyLCAwKTtcbn1cbmlmICghYnVmZmVyU2xpY2UpIHtcbiAgLy8gUGhhbnRvbUpTIGhhcyBgQXJyYXlCdWZmZXJgIGFuZCBgVWludDhBcnJheWAgYnV0IG5vdCBgRmxvYXQ2NEFycmF5YC5cbiAgYnVmZmVyQ2xvbmUgPSAhKEFycmF5QnVmZmVyICYmIFVpbnQ4QXJyYXkpID8gY29uc3RhbnQobnVsbCkgOiBmdW5jdGlvbihidWZmZXIpIHtcbiAgICB2YXIgYnl0ZUxlbmd0aCA9IGJ1ZmZlci5ieXRlTGVuZ3RoLFxuICAgICAgICBmbG9hdExlbmd0aCA9IEZsb2F0NjRBcnJheSA/IGZsb29yKGJ5dGVMZW5ndGggLyBGTE9BVDY0X0JZVEVTX1BFUl9FTEVNRU5UKSA6IDAsXG4gICAgICAgIG9mZnNldCA9IGZsb2F0TGVuZ3RoICogRkxPQVQ2NF9CWVRFU19QRVJfRUxFTUVOVCxcbiAgICAgICAgcmVzdWx0ID0gbmV3IEFycmF5QnVmZmVyKGJ5dGVMZW5ndGgpO1xuXG4gICAgaWYgKGZsb2F0TGVuZ3RoKSB7XG4gICAgICB2YXIgdmlldyA9IG5ldyBGbG9hdDY0QXJyYXkocmVzdWx0LCAwLCBmbG9hdExlbmd0aCk7XG4gICAgICB2aWV3LnNldChuZXcgRmxvYXQ2NEFycmF5KGJ1ZmZlciwgMCwgZmxvYXRMZW5ndGgpKTtcbiAgICB9XG4gICAgaWYgKGJ5dGVMZW5ndGggIT0gb2Zmc2V0KSB7XG4gICAgICB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkocmVzdWx0LCBvZmZzZXQpO1xuICAgICAgdmlldy5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmZmVyLCBvZmZzZXQpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBhcnJheSBjbG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lQXJyYXkoYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IG5ldyBhcnJheS5jb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gIC8vIEFkZCBhcnJheSBwcm9wZXJ0aWVzIGFzc2lnbmVkIGJ5IGBSZWdFeHAjZXhlY2AuXG4gIGlmIChsZW5ndGggJiYgdHlwZW9mIGFycmF5WzBdID09ICdzdHJpbmcnICYmIGhhc093blByb3BlcnR5LmNhbGwoYXJyYXksICdpbmRleCcpKSB7XG4gICAgcmVzdWx0LmluZGV4ID0gYXJyYXkuaW5kZXg7XG4gICAgcmVzdWx0LmlucHV0ID0gYXJyYXkuaW5wdXQ7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBvYmplY3QgY2xvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVPYmplY3Qob2JqZWN0KSB7XG4gIHZhciBDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yO1xuICBpZiAoISh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IgaW5zdGFuY2VvZiBDdG9yKSkge1xuICAgIEN0b3IgPSBPYmplY3Q7XG4gIH1cbiAgcmV0dXJuIG5ldyBDdG9yO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIG9iamVjdCBjbG9uZSBiYXNlZCBvbiBpdHMgYHRvU3RyaW5nVGFnYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBvbmx5IHN1cHBvcnRzIGNsb25pbmcgdmFsdWVzIHdpdGggdGFncyBvZlxuICogYEJvb2xlYW5gLCBgRGF0ZWAsIGBFcnJvcmAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgb3IgYFN0cmluZ2AuXG4gKlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUJ5VGFnKG9iamVjdCwgdGFnLCBpc0RlZXApIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3I7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBhcnJheUJ1ZmZlclRhZzpcbiAgICAgIHJldHVybiBidWZmZXJDbG9uZShvYmplY3QpO1xuXG4gICAgY2FzZSBib29sVGFnOlxuICAgIGNhc2UgZGF0ZVRhZzpcbiAgICAgIHJldHVybiBuZXcgQ3Rvcigrb2JqZWN0KTtcblxuICAgIGNhc2UgZmxvYXQzMlRhZzogY2FzZSBmbG9hdDY0VGFnOlxuICAgIGNhc2UgaW50OFRhZzogY2FzZSBpbnQxNlRhZzogY2FzZSBpbnQzMlRhZzpcbiAgICBjYXNlIHVpbnQ4VGFnOiBjYXNlIHVpbnQ4Q2xhbXBlZFRhZzogY2FzZSB1aW50MTZUYWc6IGNhc2UgdWludDMyVGFnOlxuICAgICAgdmFyIGJ1ZmZlciA9IG9iamVjdC5idWZmZXI7XG4gICAgICByZXR1cm4gbmV3IEN0b3IoaXNEZWVwID8gYnVmZmVyQ2xvbmUoYnVmZmVyKSA6IGJ1ZmZlciwgb2JqZWN0LmJ5dGVPZmZzZXQsIG9iamVjdC5sZW5ndGgpO1xuXG4gICAgY2FzZSBudW1iZXJUYWc6XG4gICAgY2FzZSBzdHJpbmdUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3Iob2JqZWN0KTtcblxuICAgIGNhc2UgcmVnZXhwVGFnOlxuICAgICAgdmFyIHJlc3VsdCA9IG5ldyBDdG9yKG9iamVjdC5zb3VyY2UsIHJlRmxhZ3MuZXhlYyhvYmplY3QpKTtcbiAgICAgIHJlc3VsdC5sYXN0SW5kZXggPSBvYmplY3QubGFzdEluZGV4O1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlIFtsYW5ndWFnZSB0eXBlXShodHRwczovL2VzNS5naXRodWIuaW8vI3g4KSBvZiBgT2JqZWN0YC5cbiAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAvLyBBdm9pZCBhIFY4IEpJVCBidWcgaW4gQ2hyb21lIDE5LTIwLlxuICAvLyBTZWUgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIyOTEgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB0eXBlID09ICdmdW5jdGlvbicgfHwgKCEhdmFsdWUgJiYgdHlwZSA9PSAnb2JqZWN0Jyk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBgdmFsdWVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbGl0eVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmV0dXJuIGZyb20gdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAndXNlcic6ICdmcmVkJyB9O1xuICogdmFyIGdldHRlciA9IF8uY29uc3RhbnQob2JqZWN0KTtcbiAqXG4gKiBnZXR0ZXIoKSA9PT0gb2JqZWN0O1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBjb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VDbG9uZTtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4xIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGJhc2VGb3JJbmAgYW5kIGBiYXNlRm9yT3duYCB3aGljaCBpdGVyYXRlc1xuICogb3ZlciBgb2JqZWN0YCBwcm9wZXJ0aWVzIHJldHVybmVkIGJ5IGBrZXlzRnVuY2AgaW52b2tpbmcgYGl0ZXJhdGVlYCBmb3JcbiAqIGVhY2ggcHJvcGVydHkuIEl0ZXJhdG9yIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseVxuICogcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbnZhciBiYXNlRm9yID0gY3JlYXRlQmFzZUZvcigpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBiYXNlIGZ1bmN0aW9uIGZvciBgXy5mb3JJbmAgb3IgYF8uZm9ySW5SaWdodGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUZvcihmcm9tUmlnaHQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCwgaXRlcmF0ZWUsIGtleXNGdW5jKSB7XG4gICAgdmFyIGl0ZXJhYmxlID0gdG9PYmplY3Qob2JqZWN0KSxcbiAgICAgICAgcHJvcHMgPSBrZXlzRnVuYyhvYmplY3QpLFxuICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGgsXG4gICAgICAgIGluZGV4ID0gZnJvbVJpZ2h0ID8gbGVuZ3RoIDogLTE7XG5cbiAgICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuICAgICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtrZXldLCBrZXksIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhbiBvYmplY3QgaWYgaXQgaXMgbm90IG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gdG9PYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSA/IHZhbHVlIDogT2JqZWN0KHZhbHVlKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgW2xhbmd1YWdlIHR5cGVdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHR5cGUgPT0gJ2Z1bmN0aW9uJyB8fCAoISF2YWx1ZSAmJiB0eXBlID09ICdvYmplY3QnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRm9yO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4xLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBhc3NpZ24gPSByZXF1aXJlKCdsb2Rhc2guYXNzaWduJyksXG4gICAgcmVzdFBhcmFtID0gcmVxdWlyZSgnbG9kYXNoLnJlc3RwYXJhbScpO1xuXG4vKipcbiAqIFVzZWQgYnkgYF8uZGVmYXVsdHNgIHRvIGN1c3RvbWl6ZSBpdHMgYF8uYXNzaWduYCB1c2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gb2JqZWN0VmFsdWUgVGhlIGRlc3RpbmF0aW9uIG9iamVjdCBwcm9wZXJ0eSB2YWx1ZS5cbiAqIEBwYXJhbSB7Kn0gc291cmNlVmFsdWUgVGhlIHNvdXJjZSBvYmplY3QgcHJvcGVydHkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgdmFsdWUgdG8gYXNzaWduIHRvIHRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGFzc2lnbkRlZmF1bHRzKG9iamVjdFZhbHVlLCBzb3VyY2VWYWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIG9iamVjdFZhbHVlID09ICd1bmRlZmluZWQnID8gc291cmNlVmFsdWUgOiBvYmplY3RWYWx1ZTtcbn1cblxuLyoqXG4gKiBBc3NpZ25zIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdChzKSB0byB0aGUgZGVzdGluYXRpb25cbiAqIG9iamVjdCBmb3IgYWxsIGRlc3RpbmF0aW9uIHByb3BlcnRpZXMgdGhhdCByZXNvbHZlIHRvIGB1bmRlZmluZWRgLiBPbmNlIGFcbiAqIHByb3BlcnR5IGlzIHNldCwgYWRkaXRpb25hbCB2YWx1ZXMgb2YgdGhlIHNhbWUgcHJvcGVydHkgYXJlIGlnbm9yZWQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlc10gVGhlIHNvdXJjZSBvYmplY3RzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZhdWx0cyh7ICd1c2VyJzogJ2Jhcm5leScgfSwgeyAnYWdlJzogMzYgfSwgeyAndXNlcic6ICdmcmVkJyB9KTtcbiAqIC8vID0+IHsgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM2IH1cbiAqL1xudmFyIGRlZmF1bHRzID0gcmVzdFBhcmFtKGZ1bmN0aW9uKGFyZ3MpIHtcbiAgdmFyIG9iamVjdCA9IGFyZ3NbMF07XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgYXJncy5wdXNoKGFzc2lnbkRlZmF1bHRzKTtcbiAgcmV0dXJuIGFzc2lnbi5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuNy4wIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGJhc2VUb1N0cmluZyA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZXRvc3RyaW5nJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIEhUTUwgZW50aXRpZXMgYW5kIEhUTUwgY2hhcmFjdGVycy4gKi9cbnZhciByZVVuZXNjYXBlZEh0bWwgPSAvWyY8PlwiJ2BdL2csXG4gICAgcmVIYXNVbmVzY2FwZWRIdG1sID0gUmVnRXhwKHJlVW5lc2NhcGVkSHRtbC5zb3VyY2UpO1xuXG4vKiogVXNlZCB0byBtYXAgY2hhcmFjdGVycyB0byBIVE1MIGVudGl0aWVzLiAqL1xudmFyIGh0bWxFc2NhcGVzID0ge1xuICAnJic6ICcmYW1wOycsXG4gICc8JzogJyZsdDsnLFxuICAnPic6ICcmZ3Q7JyxcbiAgJ1wiJzogJyZxdW90OycsXG4gIFwiJ1wiOiAnJiMzOTsnLFxuICAnYCc6ICcmIzk2Oydcbn07XG5cbi8qKlxuICogVXNlZCBieSBgXy5lc2NhcGVgIHRvIGNvbnZlcnQgY2hhcmFjdGVycyB0byBIVE1MIGVudGl0aWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gY2hyIFRoZSBtYXRjaGVkIGNoYXJhY3RlciB0byBlc2NhcGUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIGNoYXJhY3Rlci5cbiAqL1xuZnVuY3Rpb24gZXNjYXBlSHRtbENoYXIoY2hyKSB7XG4gIHJldHVybiBodG1sRXNjYXBlc1tjaHJdO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBjaGFyYWN0ZXJzIFwiJlwiLCBcIjxcIiwgXCI+XCIsICdcIicsIFwiJ1wiLCBhbmQgJ2AnLCBpbiBgc3RyaW5nYCB0b1xuICogdGhlaXIgY29ycmVzcG9uZGluZyBIVE1MIGVudGl0aWVzLlxuICpcbiAqICoqTm90ZToqKiBObyBvdGhlciBjaGFyYWN0ZXJzIGFyZSBlc2NhcGVkLiBUbyBlc2NhcGUgYWRkaXRpb25hbCBjaGFyYWN0ZXJzXG4gKiB1c2UgYSB0aGlyZC1wYXJ0eSBsaWJyYXJ5IGxpa2UgW19oZV9dKGh0dHBzOi8vbXRocy5iZS9oZSkuXG4gKlxuICogVGhvdWdoIHRoZSBcIj5cIiBjaGFyYWN0ZXIgaXMgZXNjYXBlZCBmb3Igc3ltbWV0cnksIGNoYXJhY3RlcnMgbGlrZVxuICogXCI+XCIgYW5kIFwiL1wiIGRvbid0IHJlcXVpcmUgZXNjYXBpbmcgaW4gSFRNTCBhbmQgaGF2ZSBubyBzcGVjaWFsIG1lYW5pbmdcbiAqIHVubGVzcyB0aGV5J3JlIHBhcnQgb2YgYSB0YWcgb3IgdW5xdW90ZWQgYXR0cmlidXRlIHZhbHVlLlxuICogU2VlIFtNYXRoaWFzIEJ5bmVucydzIGFydGljbGVdKGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9hbWJpZ3VvdXMtYW1wZXJzYW5kcylcbiAqICh1bmRlciBcInNlbWktcmVsYXRlZCBmdW4gZmFjdFwiKSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEJhY2t0aWNrcyBhcmUgZXNjYXBlZCBiZWNhdXNlIGluIEludGVybmV0IEV4cGxvcmVyIDwgOSwgdGhleSBjYW4gYnJlYWsgb3V0XG4gKiBvZiBhdHRyaWJ1dGUgdmFsdWVzIG9yIEhUTUwgY29tbWVudHMuIFNlZSBbIzEwMl0oaHR0cHM6Ly9odG1sNXNlYy5vcmcvIzEwMiksXG4gKiBbIzEwOF0oaHR0cHM6Ly9odG1sNXNlYy5vcmcvIzEwOCksIGFuZCBbIzEzM10oaHR0cHM6Ly9odG1sNXNlYy5vcmcvIzEzMykgb2ZcbiAqIHRoZSBbSFRNTDUgU2VjdXJpdHkgQ2hlYXRzaGVldF0oaHR0cHM6Ly9odG1sNXNlYy5vcmcvKSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFdoZW4gd29ya2luZyB3aXRoIEhUTUwgeW91IHNob3VsZCBhbHdheXMgcXVvdGUgYXR0cmlidXRlIHZhbHVlcyB0byByZWR1Y2VcbiAqIFhTUyB2ZWN0b3JzLiBTZWUgW1J5YW4gR3JvdmUncyBhcnRpY2xlXShodHRwOi8vd29ua28uY29tL3Bvc3QvaHRtbC1lc2NhcGluZylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBTdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyaW5nPScnXSBUaGUgc3RyaW5nIHRvIGVzY2FwZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGVzY2FwZWQgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmVzY2FwZSgnZnJlZCwgYmFybmV5LCAmIHBlYmJsZXMnKTtcbiAqIC8vID0+ICdmcmVkLCBiYXJuZXksICZhbXA7IHBlYmJsZXMnXG4gKi9cbmZ1bmN0aW9uIGVzY2FwZShzdHJpbmcpIHtcbiAgLy8gUmVzZXQgYGxhc3RJbmRleGAgYmVjYXVzZSBpbiBJRSA8IDkgYFN0cmluZyNyZXBsYWNlYCBkb2VzIG5vdC5cbiAgc3RyaW5nID0gYmFzZVRvU3RyaW5nKHN0cmluZyk7XG4gIHJldHVybiAoc3RyaW5nICYmIHJlSGFzVW5lc2NhcGVkSHRtbC50ZXN0KHN0cmluZykpXG4gICAgPyBzdHJpbmcucmVwbGFjZShyZVVuZXNjYXBlZEh0bWwsIGVzY2FwZUh0bWxDaGFyKVxuICAgIDogc3RyaW5nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVzY2FwZTtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4wIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS43LjAgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBga2V5YCBleGlzdHMgYXMgYSBkaXJlY3QgcHJvcGVydHkgb2YgYG9iamVjdGAgaW5zdGVhZCBvZiBhblxuICogaW5oZXJpdGVkIHByb3BlcnR5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBga2V5YCBpcyBhIGRpcmVjdCBwcm9wZXJ0eSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmhhcyh7ICdhJzogMSwgJ2InOiAyLCAnYyc6IDMgfSwgJ2InKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaGFzKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgPyBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSA6IGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhcztcbiIsIi8qKlxuICogbG9kYXNoIDMuMS4wIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgYmFzZUluZGV4T2YgPSByZXF1aXJlKCdsb2Rhc2guX2Jhc2VpbmRleG9mJyksXG4gICAgYmFzZVZhbHVlcyA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZXZhbHVlcycpLFxuICAgIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnbG9kYXNoLl9pc2l0ZXJhdGVlY2FsbCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCdsb2Rhc2guaXNhcnJheScpLFxuICAgIGlzU3RyaW5nID0gcmVxdWlyZSgnbG9kYXNoLmlzc3RyaW5nJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJ2xvZGFzaC5rZXlzJyk7XG5cbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtbnVtYmVyLm1heF9zYWZlX2ludGVnZXIpXG4gKiBvZiBhbiBhcnJheS1saWtlIHZhbHVlLlxuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyBiYXNlZCBvbiBbYFRvTGVuZ3RoYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBpbiBgY29sbGVjdGlvbmAgdXNpbmcgYFNhbWVWYWx1ZVplcm9gIGZvciBlcXVhbGl0eVxuICogY29tcGFyaXNvbnMuIElmIGBmcm9tSW5kZXhgIGlzIG5lZ2F0aXZlLCBpdCBpcyB1c2VkIGFzIHRoZSBvZmZzZXQgZnJvbVxuICogdGhlIGVuZCBvZiBgY29sbGVjdGlvbmAuXG4gKlxuICogKipOb3RlOioqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbnMgYXJlIGxpa2Ugc3RyaWN0IGVxdWFsaXR5IGNvbXBhcmlzb25zLCBlLmcuIGA9PT1gLCBleGNlcHQgdGhhdFxuICogYE5hTmAgbWF0Y2hlcyBgTmFOYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGFsaWFzIGNvbnRhaW5zLCBpbmNsdWRlXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHNlYXJjaC5cbiAqIEBwYXJhbSB7Kn0gdGFyZ2V0IFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtudW1iZXJ9IFtmcm9tSW5kZXg9MF0gVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEVuYWJsZXMgdXNlIGFzIGEgY2FsbGJhY2sgZm9yIGZ1bmN0aW9ucyBsaWtlIGBfLnJlZHVjZWAuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYSBtYXRjaGluZyBlbGVtZW50IGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaW5jbHVkZXMoWzEsIDIsIDNdLCAxKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmluY2x1ZGVzKFsxLCAyLCAzXSwgMSwgMik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaW5jbHVkZXMoeyAndXNlcic6ICdmcmVkJywgJ2FnZSc6IDQwIH0sICdmcmVkJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pbmNsdWRlcygncGViYmxlcycsICdlYicpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpbmNsdWRlcyhjb2xsZWN0aW9uLCB0YXJnZXQsIGZyb21JbmRleCwgZ3VhcmQpIHtcbiAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24gPyBjb2xsZWN0aW9uLmxlbmd0aCA6IDA7XG4gIGlmICghaXNMZW5ndGgobGVuZ3RoKSkge1xuICAgIGNvbGxlY3Rpb24gPSB2YWx1ZXMoY29sbGVjdGlvbik7XG4gICAgbGVuZ3RoID0gY29sbGVjdGlvbi5sZW5ndGg7XG4gIH1cbiAgaWYgKCFsZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHR5cGVvZiBmcm9tSW5kZXggIT0gJ251bWJlcicgfHwgKGd1YXJkICYmIGlzSXRlcmF0ZWVDYWxsKHRhcmdldCwgZnJvbUluZGV4LCBndWFyZCkpKSB7XG4gICAgZnJvbUluZGV4ID0gMDtcbiAgfSBlbHNlIHtcbiAgICBmcm9tSW5kZXggPSBmcm9tSW5kZXggPCAwID8gbmF0aXZlTWF4KGxlbmd0aCArIGZyb21JbmRleCwgMCkgOiAoZnJvbUluZGV4IHx8IDApO1xuICB9XG4gIHJldHVybiAodHlwZW9mIGNvbGxlY3Rpb24gPT0gJ3N0cmluZycgfHwgIWlzQXJyYXkoY29sbGVjdGlvbikgJiYgaXNTdHJpbmcoY29sbGVjdGlvbikpXG4gICAgPyAoZnJvbUluZGV4IDwgbGVuZ3RoICYmIGNvbGxlY3Rpb24uaW5kZXhPZih0YXJnZXQsIGZyb21JbmRleCkgPiAtMSlcbiAgICA6IChiYXNlSW5kZXhPZihjb2xsZWN0aW9uLCB0YXJnZXQsIGZyb21JbmRleCkgPiAtMSk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgdmFsdWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IHZhbHVlcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy52YWx1ZXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbMSwgMl0gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLnZhbHVlcygnaGknKTtcbiAqIC8vID0+IFsnaCcsICdpJ11cbiAqL1xuZnVuY3Rpb24gdmFsdWVzKG9iamVjdCkge1xuICByZXR1cm4gYmFzZVZhbHVlcyhvYmplY3QsIGtleXMob2JqZWN0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5jbHVkZXM7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuNy4wIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnZhbHVlc2AgYW5kIGBfLnZhbHVlc0luYCB3aGljaCBjcmVhdGVzIGFuXG4gKiBhcnJheSBvZiBgb2JqZWN0YCBwcm9wZXJ0eSB2YWx1ZXMgY29ycmVzcG9uZGluZyB0byB0aGUgcHJvcGVydHkgbmFtZXNcbiAqIHJldHVybmVkIGJ5IGBrZXlzRnVuY2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBuYW1lcyB0byBnZXQgdmFsdWVzIGZvci5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gYmFzZVZhbHVlcyhvYmplY3QsIHByb3BzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSBvYmplY3RbcHJvcHNbaW5kZXhdXTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VWYWx1ZXM7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBEYXRlYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNEYXRlKG5ldyBEYXRlKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRGF0ZSgnTW9uIEFwcmlsIDIzIDIwMTInKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRGF0ZSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBkYXRlVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRGF0ZTtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4xIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgYmFzZUlzRXF1YWwgPSByZXF1aXJlKCdsb2Rhc2guX2Jhc2Vpc2VxdWFsJyksXG4gICAgYmluZENhbGxiYWNrID0gcmVxdWlyZSgnbG9kYXNoLl9iaW5kY2FsbGJhY2snKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3Igc3RyaWN0IGVxdWFsaXR5IGNvbXBhcmlzb25zLCBpLmUuIGA9PT1gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlmIHN1aXRhYmxlIGZvciBzdHJpY3RcbiAqICBlcXVhbGl0eSBjb21wYXJpc29ucywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1N0cmljdENvbXBhcmFibGUodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSAmJiAodmFsdWUgPT09IDAgPyAoKDEgLyB2YWx1ZSkgPiAwKSA6ICFpc09iamVjdCh2YWx1ZSkpO1xufVxuXG4vKipcbiAqIFBlcmZvcm1zIGEgZGVlcCBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmVcbiAqIGVxdWl2YWxlbnQuIElmIGBjdXN0b21pemVyYCBpcyBwcm92aWRlZCBpdCBpcyBpbnZva2VkIHRvIGNvbXBhcmUgdmFsdWVzLlxuICogSWYgYGN1c3RvbWl6ZXJgIHJldHVybnMgYHVuZGVmaW5lZGAgY29tcGFyaXNvbnMgYXJlIGhhbmRsZWQgYnkgdGhlIG1ldGhvZFxuICogaW5zdGVhZC4gVGhlIGBjdXN0b21pemVyYCBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZVxuICogYXJndW1lbnRzOiAodmFsdWUsIG90aGVyIFssIGluZGV4fGtleV0pLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBzdXBwb3J0cyBjb21wYXJpbmcgYXJyYXlzLCBib29sZWFucywgYERhdGVgIG9iamVjdHMsXG4gKiBudW1iZXJzLCBgT2JqZWN0YCBvYmplY3RzLCByZWdleGVzLCBhbmQgc3RyaW5ncy4gT2JqZWN0cyBhcmUgY29tcGFyZWQgYnlcbiAqIHRoZWlyIG93biwgbm90IGluaGVyaXRlZCwgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLiBGdW5jdGlvbnMgYW5kIERPTSBub2Rlc1xuICogYXJlICoqbm90Kiogc3VwcG9ydGVkLiBQcm92aWRlIGEgY3VzdG9taXplciBmdW5jdGlvbiB0byBleHRlbmQgc3VwcG9ydFxuICogZm9yIGNvbXBhcmluZyBvdGhlciB2YWx1ZXMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmluZyB2YWx1ZXMuXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGN1c3RvbWl6ZXJgLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAqIHZhciBvdGhlciA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAqXG4gKiBvYmplY3QgPT0gb3RoZXI7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNFcXVhbChvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiAvLyB1c2luZyBhIGN1c3RvbWl6ZXIgY2FsbGJhY2tcbiAqIHZhciBhcnJheSA9IFsnaGVsbG8nLCAnZ29vZGJ5ZSddO1xuICogdmFyIG90aGVyID0gWydoaScsICdnb29kYnllJ107XG4gKlxuICogXy5pc0VxdWFsKGFycmF5LCBvdGhlciwgZnVuY3Rpb24odmFsdWUsIG90aGVyKSB7XG4gKiAgIGlmIChfLmV2ZXJ5KFt2YWx1ZSwgb3RoZXJdLCBSZWdFeHAucHJvdG90eXBlLnRlc3QsIC9eaCg/Oml8ZWxsbykkLykpIHtcbiAqICAgICByZXR1cm4gdHJ1ZTtcbiAqICAgfVxuICogfSk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlzRXF1YWwodmFsdWUsIG90aGVyLCBjdXN0b21pemVyLCB0aGlzQXJnKSB7XG4gIGN1c3RvbWl6ZXIgPSB0eXBlb2YgY3VzdG9taXplciA9PSAnZnVuY3Rpb24nICYmIGJpbmRDYWxsYmFjayhjdXN0b21pemVyLCB0aGlzQXJnLCAzKTtcbiAgaWYgKCFjdXN0b21pemVyICYmIGlzU3RyaWN0Q29tcGFyYWJsZSh2YWx1ZSkgJiYgaXNTdHJpY3RDb21wYXJhYmxlKG90aGVyKSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gb3RoZXI7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IGN1c3RvbWl6ZXIgPyBjdXN0b21pemVyKHZhbHVlLCBvdGhlcikgOiB1bmRlZmluZWQ7XG4gIHJldHVybiB0eXBlb2YgcmVzdWx0ID09ICd1bmRlZmluZWQnID8gYmFzZUlzRXF1YWwodmFsdWUsIG90aGVyLCBjdXN0b21pemVyKSA6ICEhcmVzdWx0O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdHlwZSA9PSAnZnVuY3Rpb24nIHx8ICghIXZhbHVlICYmIHR5cGUgPT0gJ29iamVjdCcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRXF1YWw7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMiAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpID4gNSkuICovXG52YXIgcmVIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYCBbc3BlY2lhbCBjaGFyYWN0ZXJzXShodHRwOi8vd3d3LnJlZ3VsYXItZXhwcmVzc2lvbnMuaW5mby9jaGFyYWN0ZXJzLmh0bWwjc3BlY2lhbCkuXG4gKiBJbiBhZGRpdGlvbiB0byBzcGVjaWFsIGNoYXJhY3RlcnMgdGhlIGZvcndhcmQgc2xhc2ggaXMgZXNjYXBlZCB0byBhbGxvdyBmb3JcbiAqIGVhc2llciBgZXZhbGAgdXNlIGFuZCBgRnVuY3Rpb25gIGNvbXBpbGF0aW9uLlxuICovXG52YXIgcmVSZWdFeHBDaGFycyA9IC9bLiorP14ke30oKXxbXFxdXFwvXFxcXF0vZyxcbiAgICByZUhhc1JlZ0V4cENoYXJzID0gUmVnRXhwKHJlUmVnRXhwQ2hhcnMuc291cmNlKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0Z1bmN0aW9uYCB3aXRob3V0IHN1cHBvcnQgZm9yIGVudmlyb25tZW50c1xuICogd2l0aCBpbmNvcnJlY3QgYHR5cGVvZmAgcmVzdWx0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNGdW5jdGlvbih2YWx1ZSkge1xuICAvLyBBdm9pZCBhIENoYWtyYSBKSVQgYnVnIGluIGNvbXBhdGliaWxpdHkgbW9kZXMgb2YgSUUgMTEuXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vamFzaGtlbmFzL3VuZGVyc2NvcmUvaXNzdWVzLzE2MjEgZm9yIG1vcmUgZGV0YWlscy5cbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nIHx8IGZhbHNlO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgaWYgaXQgaXMgbm90IG9uZS4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkXG4gKiBmb3IgYG51bGxgIG9yIGB1bmRlZmluZWRgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6ICh2YWx1ZSArICcnKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZuVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGVzY2FwZVJlZ0V4cChvYmpUb1N0cmluZylcbiAgLnJlcGxhY2UoL3RvU3RyaW5nfChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKiogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIFVpbnQ4QXJyYXkgPSBpc05hdGl2ZShVaW50OEFycmF5ID0gZ2xvYmFsLlVpbnQ4QXJyYXkpICYmIFVpbnQ4QXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0Z1bmN0aW9uID0gIShiYXNlSXNGdW5jdGlvbigveC8pIHx8IChVaW50OEFycmF5ICYmICFiYXNlSXNGdW5jdGlvbihVaW50OEFycmF5KSkpID8gYmFzZUlzRnVuY3Rpb24gOiBmdW5jdGlvbih2YWx1ZSkge1xuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gb2xkZXIgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBTYWZhcmkgd2hpY2ggcmV0dXJuICdmdW5jdGlvbicgZm9yIHJlZ2V4ZXNcbiAgLy8gYW5kIFNhZmFyaSA4IGVxdWl2YWxlbnRzIHdoaWNoIHJldHVybiAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXkgY29uc3RydWN0b3JzLlxuICByZXR1cm4gb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gZnVuY1RhZztcbn07XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNOYXRpdmUoQXJyYXkucHJvdG90eXBlLnB1c2gpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOYXRpdmUoXyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAob2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gZnVuY1RhZykge1xuICAgIHJldHVybiByZU5hdGl2ZS50ZXN0KGZuVG9TdHJpbmcuY2FsbCh2YWx1ZSkpO1xuICB9XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIHJlSG9zdEN0b3IudGVzdCh2YWx1ZSk7XG59XG5cbi8qKlxuICogRXNjYXBlcyB0aGUgYFJlZ0V4cGAgc3BlY2lhbCBjaGFyYWN0ZXJzIFwiXFxcIiwgXCIvXCIsIFwiXlwiLCBcIiRcIiwgXCIuXCIsIFwifFwiLCBcIj9cIixcbiAqIFwiKlwiLCBcIitcIiwgXCIoXCIsIFwiKVwiLCBcIltcIiwgXCJdXCIsIFwie1wiIGFuZCBcIn1cIiBpbiBgc3RyaW5nYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gZXNjYXBlLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgZXNjYXBlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZXNjYXBlUmVnRXhwKCdbbG9kYXNoXShodHRwczovL2xvZGFzaC5jb20vKScpO1xuICogLy8gPT4gJ1xcW2xvZGFzaFxcXVxcKGh0dHBzOlxcL1xcL2xvZGFzaFxcLmNvbVxcL1xcKSdcbiAqL1xuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cmluZykge1xuICBzdHJpbmcgPSBiYXNlVG9TdHJpbmcoc3RyaW5nKTtcbiAgcmV0dXJuIChzdHJpbmcgJiYgcmVIYXNSZWdFeHBDaGFycy50ZXN0KHN0cmluZykpXG4gICAgPyBzdHJpbmcucmVwbGFjZShyZVJlZ0V4cENoYXJzLCAnXFxcXCQmJylcbiAgICA6IHN0cmluZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjcuMCA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBgbnVsbGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGBudWxsYCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTnVsbChudWxsKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTnVsbCh2b2lkIDApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOdWxsKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gbnVsbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc051bGw7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdHlwZSA9PSAnZnVuY3Rpb24nIHx8ICghIXZhbHVlICYmIHR5cGUgPT0gJ29iamVjdCcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjcuMCA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBgdW5kZWZpbmVkYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYHVuZGVmaW5lZGAsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1VuZGVmaW5lZCh2b2lkIDApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNVbmRlZmluZWQobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICd1bmRlZmluZWQnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVW5kZWZpbmVkO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4xLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBhcnJheU1hcCA9IHJlcXVpcmUoJ2xvZGFzaC5fYXJyYXltYXAnKSxcbiAgICBiYXNlRGlmZmVyZW5jZSA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZWRpZmZlcmVuY2UnKSxcbiAgICBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZWZsYXR0ZW4nKSxcbiAgICBiaW5kQ2FsbGJhY2sgPSByZXF1aXJlKCdsb2Rhc2guX2JpbmRjYWxsYmFjaycpLFxuICAgIHBpY2tCeUFycmF5ID0gcmVxdWlyZSgnbG9kYXNoLl9waWNrYnlhcnJheScpLFxuICAgIHBpY2tCeUNhbGxiYWNrID0gcmVxdWlyZSgnbG9kYXNoLl9waWNrYnljYWxsYmFjaycpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJ2xvZGFzaC5rZXlzaW4nKSxcbiAgICByZXN0UGFyYW0gPSByZXF1aXJlKCdsb2Rhc2gucmVzdHBhcmFtJyk7XG5cbi8qKlxuICogVGhlIG9wcG9zaXRlIG9mIGBfLnBpY2tgOyB0aGlzIG1ldGhvZCBjcmVhdGVzIGFuIG9iamVjdCBjb21wb3NlZCBvZiB0aGVcbiAqIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBgb2JqZWN0YCB0aGF0IGFyZSBub3Qgb21pdHRlZC5cbiAqIFByb3BlcnR5IG5hbWVzIG1heSBiZSBzcGVjaWZpZWQgYXMgaW5kaXZpZHVhbCBhcmd1bWVudHMgb3IgYXMgYXJyYXlzIG9mXG4gKiBwcm9wZXJ0eSBuYW1lcy4gSWYgYHByZWRpY2F0ZWAgaXMgcHJvdmlkZWQgaXQgaXMgaW52b2tlZCBmb3IgZWFjaCBwcm9wZXJ0eVxuICogb2YgYG9iamVjdGAgb21pdHRpbmcgdGhlIHByb3BlcnRpZXMgYHByZWRpY2F0ZWAgcmV0dXJucyB0cnV0aHkgZm9yLiBUaGVcbiAqIHByZWRpY2F0ZSBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6XG4gKiAodmFsdWUsIGtleSwgb2JqZWN0KS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb258Li4uKHN0cmluZ3xzdHJpbmdbXSl9IFtwcmVkaWNhdGVdIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlclxuICogIGl0ZXJhdGlvbiBvciBwcm9wZXJ0eSBuYW1lcyB0byBvbWl0LCBzcGVjaWZpZWQgYXMgaW5kaXZpZHVhbCBwcm9wZXJ0eVxuICogIG5hbWVzIG9yIGFycmF5cyBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgcHJlZGljYXRlYC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICd1c2VyJzogJ2ZyZWQnLCAnYWdlJzogNDAgfTtcbiAqXG4gKiBfLm9taXQob2JqZWN0LCAnYWdlJyk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2ZyZWQnIH1cbiAqXG4gKiBfLm9taXQob2JqZWN0LCBfLmlzTnVtYmVyKTtcbiAqIC8vID0+IHsgJ3VzZXInOiAnZnJlZCcgfVxuICovXG52YXIgb21pdCA9IHJlc3RQYXJhbShmdW5jdGlvbihvYmplY3QsIHByb3BzKSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuICBpZiAodHlwZW9mIHByb3BzWzBdICE9ICdmdW5jdGlvbicpIHtcbiAgICB2YXIgcHJvcHMgPSBhcnJheU1hcChiYXNlRmxhdHRlbihwcm9wcyksIFN0cmluZyk7XG4gICAgcmV0dXJuIHBpY2tCeUFycmF5KG9iamVjdCwgYmFzZURpZmZlcmVuY2Uoa2V5c0luKG9iamVjdCksIHByb3BzKSk7XG4gIH1cbiAgdmFyIHByZWRpY2F0ZSA9IGJpbmRDYWxsYmFjayhwcm9wc1swXSwgcHJvcHNbMV0sIDMpO1xuICByZXR1cm4gcGlja0J5Q2FsbGJhY2sob2JqZWN0LCBmdW5jdGlvbih2YWx1ZSwga2V5LCBvYmplY3QpIHtcbiAgICByZXR1cm4gIXByZWRpY2F0ZSh2YWx1ZSwga2V5LCBvYmplY3QpO1xuICB9KTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG9taXQ7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuNy4wIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5tYXBgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvciBjYWxsYmFja1xuICogc2hvcnRoYW5kcyBvciBgdGhpc2AgYmluZGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBtYXBwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TWFwKGFycmF5LCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlNYXA7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGlzTmF0aXZlID0gcmVxdWlyZSgnbG9kYXNoLmlzbmF0aXZlJyk7XG5cbi8qKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgU2V0ID0gaXNOYXRpdmUoU2V0ID0gZ2xvYmFsLlNldCkgJiYgU2V0O1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUNyZWF0ZSA9IGlzTmF0aXZlKG5hdGl2ZUNyZWF0ZSA9IE9iamVjdC5jcmVhdGUpICYmIG5hdGl2ZUNyZWF0ZTtcblxuLyoqXG4gKlxuICogQ3JlYXRlcyBhIGNhY2hlIG9iamVjdCB0byBzdG9yZSB1bmlxdWUgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTZXRDYWNoZSh2YWx1ZXMpIHtcbiAgdmFyIGxlbmd0aCA9IHZhbHVlcyA/IHZhbHVlcy5sZW5ndGggOiAwO1xuXG4gIHRoaXMuZGF0YSA9IHsgJ2hhc2gnOiBuYXRpdmVDcmVhdGUobnVsbCksICdzZXQnOiBuZXcgU2V0IH07XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIHRoaXMucHVzaCh2YWx1ZXNbbGVuZ3RoXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBZGRzIGB2YWx1ZWAgdG8gdGhlIGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBwdXNoXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBjYWNoZVB1c2godmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgfHwgaXNPYmplY3QodmFsdWUpKSB7XG4gICAgZGF0YS5zZXQuYWRkKHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhLmhhc2hbdmFsdWVdID0gdHJ1ZTtcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBgU2V0YCBjYWNoZSBvYmplY3QgdG8gb3B0aW1pemUgbGluZWFyIHNlYXJjaGVzIG9mIGxhcmdlIGFycmF5cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW3ZhbHVlc10gVGhlIHZhbHVlcyB0byBjYWNoZS5cbiAqIEByZXR1cm5zIHtudWxsfE9iamVjdH0gUmV0dXJucyB0aGUgbmV3IGNhY2hlIG9iamVjdCBpZiBgU2V0YCBpcyBzdXBwb3J0ZWQsIGVsc2UgYG51bGxgLlxuICovXG52YXIgY3JlYXRlQ2FjaGUgPSAhKG5hdGl2ZUNyZWF0ZSAmJiBTZXQpID8gY29uc3RhbnQobnVsbCkgOiBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgcmV0dXJuIG5ldyBTZXRDYWNoZSh2YWx1ZXMpO1xufTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgW2xhbmd1YWdlIHR5cGVdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHR5cGUgPT0gJ2Z1bmN0aW9uJyB8fCAoISF2YWx1ZSAmJiB0eXBlID09ICdvYmplY3QnKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGB2YWx1ZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsaXR5XG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byByZXR1cm4gZnJvbSB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICd1c2VyJzogJ2ZyZWQnIH07XG4gKiB2YXIgZ2V0dGVyID0gXy5jb25zdGFudChvYmplY3QpO1xuICpcbiAqIGdldHRlcigpID09PSBvYmplY3Q7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGNvbnN0YW50KHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG59XG5cbi8vIEFkZCBmdW5jdGlvbnMgdG8gdGhlIGBTZXRgIGNhY2hlLlxuU2V0Q2FjaGUucHJvdG90eXBlLnB1c2ggPSBjYWNoZVB1c2g7XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQ2FjaGU7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5waWNrYCB0aGF0IHBpY2tzIGBvYmplY3RgIHByb3BlcnRpZXMgc3BlY2lmaWVkXG4gKiBieSB0aGUgYHByb3BzYCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHByb3BzIFRoZSBwcm9wZXJ0eSBuYW1lcyB0byBwaWNrLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gcGlja0J5QXJyYXkob2JqZWN0LCBwcm9wcykge1xuICBvYmplY3QgPSB0b09iamVjdChvYmplY3QpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0ge307XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICByZXN1bHRba2V5XSA9IG9iamVjdFtrZXldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gb2JqZWN0IGlmIGl0IGlzIG5vdCBvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdCh2YWx1ZSkgPyB2YWx1ZSA6IE9iamVjdCh2YWx1ZSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlIFtsYW5ndWFnZSB0eXBlXShodHRwczovL2VzNS5naXRodWIuaW8vI3g4KSBvZiBgT2JqZWN0YC5cbiAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAvLyBBdm9pZCBhIFY4IEpJVCBidWcgaW4gQ2hyb21lIDE5LTIwLlxuICAvLyBTZWUgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIyOTEgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB0eXBlID09ICdmdW5jdGlvbicgfHwgKCEhdmFsdWUgJiYgdHlwZSA9PSAnb2JqZWN0Jyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGlja0J5QXJyYXk7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuNy4wIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGJhc2VGb3IgPSByZXF1aXJlKCdsb2Rhc2guX2Jhc2Vmb3InKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCdsb2Rhc2gua2V5c2luJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9ySW5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgY2FsbGJhY2tcbiAqIHNob3J0aGFuZHMgYW5kIGB0aGlzYCBiaW5kaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGb3JJbihvYmplY3QsIGl0ZXJhdGVlKSB7XG4gIHJldHVybiBiYXNlRm9yKG9iamVjdCwgaXRlcmF0ZWUsIGtleXNJbik7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLnBpY2tgIHRoYXQgcGlja3MgYG9iamVjdGAgcHJvcGVydGllcyBgcHJlZGljYXRlYFxuICogcmV0dXJucyB0cnV0aHkgZm9yLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBwaWNrQnlDYWxsYmFjayhvYmplY3QsIHByZWRpY2F0ZSkge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIGJhc2VGb3JJbihvYmplY3QsIGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iamVjdCkge1xuICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGtleSwgb2JqZWN0KSkge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBpY2tCeUNhbGxiYWNrO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjQgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJ2xvZGFzaC5pc2FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCdsb2Rhc2guaXNhcnJheScpO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKipcbiAqIFVzZWQgYXMgdGhlIFttYXhpbXVtIGxlbmd0aF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW51bWJlci5tYXhfc2FmZV9pbnRlZ2VyKVxuICogb2YgYW4gYXJyYXktbGlrZSB2YWx1ZS5cbiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuXG4vKipcbiAqIEFuIG9iamVjdCBlbnZpcm9ubWVudCBmZWF0dXJlIGZsYWdzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAdHlwZSBPYmplY3RcbiAqL1xudmFyIHN1cHBvcnQgPSB7fTtcblxuKGZ1bmN0aW9uKHgpIHtcblxuICAvKipcbiAgICogRGV0ZWN0IGlmIGBhcmd1bWVudHNgIG9iamVjdCBpbmRleGVzIGFyZSBub24tZW51bWVyYWJsZS5cbiAgICpcbiAgICogSW4gRmlyZWZveCA8IDQsIElFIDwgOSwgUGhhbnRvbUpTLCBhbmQgU2FmYXJpIDwgNS4xIGBhcmd1bWVudHNgIG9iamVjdFxuICAgKiBpbmRleGVzIGFyZSBub24tZW51bWVyYWJsZS4gQ2hyb21lIDwgMjUgYW5kIE5vZGUuanMgPCAwLjExLjAgdHJlYXRcbiAgICogYGFyZ3VtZW50c2Agb2JqZWN0IGluZGV4ZXMgYXMgbm9uLWVudW1lcmFibGUgYW5kIGZhaWwgYGhhc093blByb3BlcnR5YFxuICAgKiBjaGVja3MgZm9yIGluZGV4ZXMgdGhhdCBleGNlZWQgdGhlaXIgZnVuY3Rpb24ncyBmb3JtYWwgcGFyYW1ldGVycyB3aXRoXG4gICAqIGFzc29jaWF0ZWQgdmFsdWVzIG9mIGAwYC5cbiAgICpcbiAgICogQG1lbWJlck9mIF8uc3VwcG9ydFxuICAgKiBAdHlwZSBib29sZWFuXG4gICAqL1xuICB0cnkge1xuICAgIHN1cHBvcnQubm9uRW51bUFyZ3MgPSAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChhcmd1bWVudHMsIDEpO1xuICB9IGNhdGNoKGUpIHtcbiAgICBzdXBwb3J0Lm5vbkVudW1BcmdzID0gdHJ1ZTtcbiAgfVxufSgwLCAwKSk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIHZhbHVlID0gK3ZhbHVlO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgYmFzZWQgb24gW2BUb0xlbmd0aGBdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlIFtsYW5ndWFnZSB0eXBlXShodHRwczovL2VzNS5naXRodWIuaW8vI3g4KSBvZiBgT2JqZWN0YC5cbiAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAvLyBBdm9pZCBhIFY4IEpJVCBidWcgaW4gQ2hyb21lIDE5LTIwLlxuICAvLyBTZWUgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIyOTEgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB0eXBlID09ICdmdW5jdGlvbicgfHwgKCEhdmFsdWUgJiYgdHlwZSA9PSAnb2JqZWN0Jyk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXNJbihuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG5mdW5jdGlvbiBrZXlzSW4ob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gb2JqZWN0Lmxlbmd0aDtcbiAgbGVuZ3RoID0gKGxlbmd0aCAmJiBpc0xlbmd0aChsZW5ndGgpICYmXG4gICAgKGlzQXJyYXkob2JqZWN0KSB8fCAoc3VwcG9ydC5ub25FbnVtQXJncyAmJiBpc0FyZ3VtZW50cyhvYmplY3QpKSkgJiYgbGVuZ3RoKSB8fCAwO1xuXG4gIHZhciBDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yLFxuICAgICAgaW5kZXggPSAtMSxcbiAgICAgIGlzUHJvdG8gPSB0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlID09PSBvYmplY3QsXG4gICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBsZW5ndGggPiAwO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IChpbmRleCArICcnKTtcbiAgfVxuICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKCEoc2tpcEluZGV4ZXMgJiYgaXNJbmRleChrZXksIGxlbmd0aCkpICYmXG4gICAgICAgICEoa2V5ID09ICdjb25zdHJ1Y3RvcicgJiYgKGlzUHJvdG8gfHwgIWhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5c0luO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4xLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZWZsYXR0ZW4nKSxcbiAgICBiYXNlVW5pcSA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZXVuaXEnKSxcbiAgICByZXN0UGFyYW0gPSByZXF1aXJlKCdsb2Rhc2gucmVzdHBhcmFtJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB1bmlxdWUgdmFsdWVzLCBpbiBvcmRlciwgb2YgdGhlIHByb3ZpZGVkIGFycmF5cyB1c2luZ1xuICogYFNhbWVWYWx1ZVplcm9gIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy5cbiAqXG4gKiAqKk5vdGU6KiogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29ucyBhcmUgbGlrZSBzdHJpY3QgZXF1YWxpdHkgY29tcGFyaXNvbnMsIGUuZy4gYD09PWAsIGV4Y2VwdCB0aGF0XG4gKiBgTmFOYCBtYXRjaGVzIGBOYU5gLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7Li4uQXJyYXl9IFthcnJheXNdIFRoZSBhcnJheXMgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIGNvbWJpbmVkIHZhbHVlcy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy51bmlvbihbMSwgMl0sIFs0LCAyXSwgWzIsIDFdKTtcbiAqIC8vID0+IFsxLCAyLCA0XVxuICovXG52YXIgdW5pb24gPSByZXN0UGFyYW0oZnVuY3Rpb24oYXJyYXlzKSB7XG4gIHJldHVybiBiYXNlVW5pcShiYXNlRmxhdHRlbihhcnJheXMsIGZhbHNlLCB0cnVlKSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB1bmlvbjtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4yIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgYmFzZUluZGV4T2YgPSByZXF1aXJlKCdsb2Rhc2guX2Jhc2VpbmRleG9mJyksXG4gICAgY2FjaGVJbmRleE9mID0gcmVxdWlyZSgnbG9kYXNoLl9jYWNoZWluZGV4b2YnKSxcbiAgICBjcmVhdGVDYWNoZSA9IHJlcXVpcmUoJ2xvZGFzaC5fY3JlYXRlY2FjaGUnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmlxYCB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrIHNob3J0aGFuZHNcbiAqIGFuZCBgdGhpc2AgYmluZGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWVdIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBkdXBsaWNhdGUtdmFsdWUtZnJlZSBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuaXEoYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgaW5kZXhPZiA9IGJhc2VJbmRleE9mLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgaXNDb21tb24gPSB0cnVlLFxuICAgICAgaXNMYXJnZSA9IGlzQ29tbW9uICYmIGxlbmd0aCA+PSAyMDAsXG4gICAgICBzZWVuID0gaXNMYXJnZSA/IGNyZWF0ZUNhY2hlKCkgOiBudWxsLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgaWYgKHNlZW4pIHtcbiAgICBpbmRleE9mID0gY2FjaGVJbmRleE9mO1xuICAgIGlzQ29tbW9uID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgaXNMYXJnZSA9IGZhbHNlO1xuICAgIHNlZW4gPSBpdGVyYXRlZSA/IFtdIDogcmVzdWx0O1xuICB9XG4gIG91dGVyOlxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XSxcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSA/IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgYXJyYXkpIDogdmFsdWU7XG5cbiAgICBpZiAoaXNDb21tb24gJiYgdmFsdWUgPT09IHZhbHVlKSB7XG4gICAgICB2YXIgc2VlbkluZGV4ID0gc2Vlbi5sZW5ndGg7XG4gICAgICB3aGlsZSAoc2VlbkluZGV4LS0pIHtcbiAgICAgICAgaWYgKHNlZW5bc2VlbkluZGV4XSA9PT0gY29tcHV0ZWQpIHtcbiAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGl0ZXJhdGVlKSB7XG4gICAgICAgIHNlZW4ucHVzaChjb21wdXRlZCk7XG4gICAgICB9XG4gICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGluZGV4T2Yoc2VlbiwgY29tcHV0ZWQsIDApIDwgMCkge1xuICAgICAgaWYgKGl0ZXJhdGVlIHx8IGlzTGFyZ2UpIHtcbiAgICAgICAgc2Vlbi5wdXNoKGNvbXB1dGVkKTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVW5pcTtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4xIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgaXNOYXRpdmUgPSByZXF1aXJlKCdsb2Rhc2guaXNuYXRpdmUnKTtcblxuLyoqIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBTZXQgPSBpc05hdGl2ZShTZXQgPSBnbG9iYWwuU2V0KSAmJiBTZXQ7XG5cbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlQ3JlYXRlID0gaXNOYXRpdmUobmF0aXZlQ3JlYXRlID0gT2JqZWN0LmNyZWF0ZSkgJiYgbmF0aXZlQ3JlYXRlO1xuXG4vKipcbiAqXG4gKiBDcmVhdGVzIGEgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIHVuaXF1ZSB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFNldENhY2hlKHZhbHVlcykge1xuICB2YXIgbGVuZ3RoID0gdmFsdWVzID8gdmFsdWVzLmxlbmd0aCA6IDA7XG5cbiAgdGhpcy5kYXRhID0geyAnaGFzaCc6IG5hdGl2ZUNyZWF0ZShudWxsKSwgJ3NldCc6IG5ldyBTZXQgfTtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgdGhpcy5wdXNoKHZhbHVlc1tsZW5ndGhdKTtcbiAgfVxufVxuXG4vKipcbiAqIEFkZHMgYHZhbHVlYCB0byB0aGUgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHB1c2hcbiAqIEBtZW1iZXJPZiBTZXRDYWNoZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIGNhY2hlUHVzaCh2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCBpc09iamVjdCh2YWx1ZSkpIHtcbiAgICBkYXRhLnNldC5hZGQodmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIGRhdGEuaGFzaFt2YWx1ZV0gPSB0cnVlO1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBTZXRgIGNhY2hlIG9iamVjdCB0byBvcHRpbWl6ZSBsaW5lYXIgc2VhcmNoZXMgb2YgbGFyZ2UgYXJyYXlzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIGNhY2hlLlxuICogQHJldHVybnMge251bGx8T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgY2FjaGUgb2JqZWN0IGlmIGBTZXRgIGlzIHN1cHBvcnRlZCwgZWxzZSBgbnVsbGAuXG4gKi9cbnZhciBjcmVhdGVDYWNoZSA9ICEobmF0aXZlQ3JlYXRlICYmIFNldCkgPyBjb25zdGFudChudWxsKSA6IGZ1bmN0aW9uKHZhbHVlcykge1xuICByZXR1cm4gbmV3IFNldENhY2hlKHZhbHVlcyk7XG59O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdHlwZSA9PSAnZnVuY3Rpb24nIHx8ICghIXZhbHVlICYmIHR5cGUgPT0gJ29iamVjdCcpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYHZhbHVlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxpdHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHJldHVybiBmcm9tIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAqIHZhciBnZXR0ZXIgPSBfLmNvbnN0YW50KG9iamVjdCk7XG4gKlxuICogZ2V0dGVyKCkgPT09IG9iamVjdDtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gY29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbn1cblxuLy8gQWRkIGZ1bmN0aW9ucyB0byB0aGUgYFNldGAgY2FjaGUuXG5TZXRDYWNoZS5wcm90b3R5cGUucHVzaCA9IGNhY2hlUHVzaDtcblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVDYWNoZTtcbiIsIlxuLyoqXG4gKiBFeHBvc2UgYHBhcnNlYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlO1xuXG4vKipcbiAqIFRlc3RzIGZvciBicm93c2VyIHN1cHBvcnQuXG4gKi9cblxudmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuLy8gU2V0dXBcbmRpdi5pbm5lckhUTUwgPSAnICA8bGluay8+PHRhYmxlPjwvdGFibGU+PGEgaHJlZj1cIi9hXCI+YTwvYT48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIvPic7XG4vLyBNYWtlIHN1cmUgdGhhdCBsaW5rIGVsZW1lbnRzIGdldCBzZXJpYWxpemVkIGNvcnJlY3RseSBieSBpbm5lckhUTUxcbi8vIFRoaXMgcmVxdWlyZXMgYSB3cmFwcGVyIGVsZW1lbnQgaW4gSUVcbnZhciBpbm5lckhUTUxCdWcgPSAhZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaW5rJykubGVuZ3RoO1xuZGl2ID0gdW5kZWZpbmVkO1xuXG4vKipcbiAqIFdyYXAgbWFwIGZyb20ganF1ZXJ5LlxuICovXG5cbnZhciBtYXAgPSB7XG4gIGxlZ2VuZDogWzEsICc8ZmllbGRzZXQ+JywgJzwvZmllbGRzZXQ+J10sXG4gIHRyOiBbMiwgJzx0YWJsZT48dGJvZHk+JywgJzwvdGJvZHk+PC90YWJsZT4nXSxcbiAgY29sOiBbMiwgJzx0YWJsZT48dGJvZHk+PC90Ym9keT48Y29sZ3JvdXA+JywgJzwvY29sZ3JvdXA+PC90YWJsZT4nXSxcbiAgLy8gZm9yIHNjcmlwdC9saW5rL3N0eWxlIHRhZ3MgdG8gd29yayBpbiBJRTYtOCwgeW91IGhhdmUgdG8gd3JhcFxuICAvLyBpbiBhIGRpdiB3aXRoIGEgbm9uLXdoaXRlc3BhY2UgY2hhcmFjdGVyIGluIGZyb250LCBoYSFcbiAgX2RlZmF1bHQ6IGlubmVySFRNTEJ1ZyA/IFsxLCAnWDxkaXY+JywgJzwvZGl2PiddIDogWzAsICcnLCAnJ11cbn07XG5cbm1hcC50ZCA9XG5tYXAudGggPSBbMywgJzx0YWJsZT48dGJvZHk+PHRyPicsICc8L3RyPjwvdGJvZHk+PC90YWJsZT4nXTtcblxubWFwLm9wdGlvbiA9XG5tYXAub3B0Z3JvdXAgPSBbMSwgJzxzZWxlY3QgbXVsdGlwbGU9XCJtdWx0aXBsZVwiPicsICc8L3NlbGVjdD4nXTtcblxubWFwLnRoZWFkID1cbm1hcC50Ym9keSA9XG5tYXAuY29sZ3JvdXAgPVxubWFwLmNhcHRpb24gPVxubWFwLnRmb290ID0gWzEsICc8dGFibGU+JywgJzwvdGFibGU+J107XG5cbm1hcC5wb2x5bGluZSA9XG5tYXAuZWxsaXBzZSA9XG5tYXAucG9seWdvbiA9XG5tYXAuY2lyY2xlID1cbm1hcC50ZXh0ID1cbm1hcC5saW5lID1cbm1hcC5wYXRoID1cbm1hcC5yZWN0ID1cbm1hcC5nID0gWzEsICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2ZXJzaW9uPVwiMS4xXCI+JywnPC9zdmc+J107XG5cbi8qKlxuICogUGFyc2UgYGh0bWxgIGFuZCByZXR1cm4gYSBET00gTm9kZSBpbnN0YW5jZSwgd2hpY2ggY291bGQgYmUgYSBUZXh0Tm9kZSxcbiAqIEhUTUwgRE9NIE5vZGUgb2Ygc29tZSBraW5kICg8ZGl2PiBmb3IgZXhhbXBsZSksIG9yIGEgRG9jdW1lbnRGcmFnbWVudFxuICogaW5zdGFuY2UsIGRlcGVuZGluZyBvbiB0aGUgY29udGVudHMgb2YgdGhlIGBodG1sYCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGh0bWwgLSBIVE1MIHN0cmluZyB0byBcImRvbWlmeVwiXG4gKiBAcGFyYW0ge0RvY3VtZW50fSBkb2MgLSBUaGUgYGRvY3VtZW50YCBpbnN0YW5jZSB0byBjcmVhdGUgdGhlIE5vZGUgZm9yXG4gKiBAcmV0dXJuIHtET01Ob2RlfSB0aGUgVGV4dE5vZGUsIERPTSBOb2RlLCBvciBEb2N1bWVudEZyYWdtZW50IGluc3RhbmNlXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZShodG1sLCBkb2MpIHtcbiAgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiBodG1sKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdTdHJpbmcgZXhwZWN0ZWQnKTtcblxuICAvLyBkZWZhdWx0IHRvIHRoZSBnbG9iYWwgYGRvY3VtZW50YCBvYmplY3RcbiAgaWYgKCFkb2MpIGRvYyA9IGRvY3VtZW50O1xuXG4gIC8vIHRhZyBuYW1lXG4gIHZhciBtID0gLzwoW1xcdzpdKykvLmV4ZWMoaHRtbCk7XG4gIGlmICghbSkgcmV0dXJuIGRvYy5jcmVhdGVUZXh0Tm9kZShodG1sKTtcblxuICBodG1sID0gaHRtbC5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7IC8vIFJlbW92ZSBsZWFkaW5nL3RyYWlsaW5nIHdoaXRlc3BhY2VcblxuICB2YXIgdGFnID0gbVsxXTtcblxuICAvLyBib2R5IHN1cHBvcnRcbiAgaWYgKHRhZyA9PSAnYm9keScpIHtcbiAgICB2YXIgZWwgPSBkb2MuY3JlYXRlRWxlbWVudCgnaHRtbCcpO1xuICAgIGVsLmlubmVySFRNTCA9IGh0bWw7XG4gICAgcmV0dXJuIGVsLnJlbW92ZUNoaWxkKGVsLmxhc3RDaGlsZCk7XG4gIH1cblxuICAvLyB3cmFwIG1hcFxuICB2YXIgd3JhcCA9IG1hcFt0YWddIHx8IG1hcC5fZGVmYXVsdDtcbiAgdmFyIGRlcHRoID0gd3JhcFswXTtcbiAgdmFyIHByZWZpeCA9IHdyYXBbMV07XG4gIHZhciBzdWZmaXggPSB3cmFwWzJdO1xuICB2YXIgZWwgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGVsLmlubmVySFRNTCA9IHByZWZpeCArIGh0bWwgKyBzdWZmaXg7XG4gIHdoaWxlIChkZXB0aC0tKSBlbCA9IGVsLmxhc3RDaGlsZDtcblxuICAvLyBvbmUgZWxlbWVudFxuICBpZiAoZWwuZmlyc3RDaGlsZCA9PSBlbC5sYXN0Q2hpbGQpIHtcbiAgICByZXR1cm4gZWwucmVtb3ZlQ2hpbGQoZWwuZmlyc3RDaGlsZCk7XG4gIH1cblxuICAvLyBzZXZlcmFsIGVsZW1lbnRzXG4gIHZhciBmcmFnbWVudCA9IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gIHdoaWxlIChlbC5maXJzdENoaWxkKSB7XG4gICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoZWwucmVtb3ZlQ2hpbGQoZWwuZmlyc3RDaGlsZCkpO1xuICB9XG5cbiAgcmV0dXJuIGZyYWdtZW50O1xufVxuIiwiXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIGV2ZW50cyA9IHJlcXVpcmUoJ2NvbXBvbmVudC1ldmVudCcpO1xudmFyIGRlbGVnYXRlID0gcmVxdWlyZSgnZGVsZWdhdGUtZXZlbnRzJyk7XG52YXIgZm9yY2VDYXB0dXJlRXZlbnRzID0gWydmb2N1cycsICdibHVyJ107XG5cbi8qKlxuICogRXhwb3NlIGBFdmVudHNgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRzO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYW4gYEV2ZW50c2Agd2l0aCB0aGUgZ2l2ZW5cbiAqIGBlbGAgb2JqZWN0IHdoaWNoIGV2ZW50cyB3aWxsIGJlIGJvdW5kIHRvLFxuICogYW5kIHRoZSBgb2JqYCB3aGljaCB3aWxsIHJlY2VpdmUgbWV0aG9kIGNhbGxzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFdmVudHMoZWwsIG9iaikge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRXZlbnRzKSkgcmV0dXJuIG5ldyBFdmVudHMoZWwsIG9iaik7XG4gIGlmICghZWwpIHRocm93IG5ldyBFcnJvcignZWxlbWVudCByZXF1aXJlZCcpO1xuICBpZiAoIW9iaikgdGhyb3cgbmV3IEVycm9yKCdvYmplY3QgcmVxdWlyZWQnKTtcbiAgdGhpcy5lbCA9IGVsO1xuICB0aGlzLm9iaiA9IG9iajtcbiAgdGhpcy5fZXZlbnRzID0ge307XG59XG5cbi8qKlxuICogU3Vic2NyaXB0aW9uIGhlbHBlci5cbiAqL1xuXG5FdmVudHMucHJvdG90eXBlLnN1YiA9IGZ1bmN0aW9uKGV2ZW50LCBtZXRob2QsIGNiKXtcbiAgdGhpcy5fZXZlbnRzW2V2ZW50XSA9IHRoaXMuX2V2ZW50c1tldmVudF0gfHwge307XG4gIHRoaXMuX2V2ZW50c1tldmVudF1bbWV0aG9kXSA9IGNiO1xufTtcblxuLyoqXG4gKiBCaW5kIHRvIGBldmVudGAgd2l0aCBvcHRpb25hbCBgbWV0aG9kYCBuYW1lLlxuICogV2hlbiBgbWV0aG9kYCBpcyB1bmRlZmluZWQgaXQgYmVjb21lcyBgZXZlbnRgXG4gKiB3aXRoIHRoZSBcIm9uXCIgcHJlZml4LlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICBEaXJlY3QgZXZlbnQgaGFuZGxpbmc6XG4gKlxuICogICAgZXZlbnRzLmJpbmQoJ2NsaWNrJykgLy8gaW1wbGllcyBcIm9uY2xpY2tcIlxuICogICAgZXZlbnRzLmJpbmQoJ2NsaWNrJywgJ3JlbW92ZScpXG4gKiAgICBldmVudHMuYmluZCgnY2xpY2snLCAnc29ydCcsICdhc2MnKVxuICpcbiAqICBEZWxlZ2F0ZWQgZXZlbnQgaGFuZGxpbmc6XG4gKlxuICogICAgZXZlbnRzLmJpbmQoJ2NsaWNrIGxpID4gYScpXG4gKiAgICBldmVudHMuYmluZCgnY2xpY2sgbGkgPiBhJywgJ3JlbW92ZScpXG4gKiAgICBldmVudHMuYmluZCgnY2xpY2sgYS5zb3J0LWFzY2VuZGluZycsICdzb3J0JywgJ2FzYycpXG4gKiAgICBldmVudHMuYmluZCgnY2xpY2sgYS5zb3J0LWRlc2NlbmRpbmcnLCAnc29ydCcsICdkZXNjJylcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7U3RyaW5nfGZ1bmN0aW9ufSBbbWV0aG9kXVxuICogQHJldHVybiB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkV2ZW50cy5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKGV2ZW50LCBtZXRob2Qpe1xuICB2YXIgZSA9IHBhcnNlKGV2ZW50KTtcbiAgdmFyIGVsID0gdGhpcy5lbDtcbiAgdmFyIG9iaiA9IHRoaXMub2JqO1xuICB2YXIgbmFtZSA9IGUubmFtZTtcbiAgdmFyIG1ldGhvZCA9IG1ldGhvZCB8fCAnb24nICsgbmFtZTtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG5cbiAgLy8gY2FsbGJhY2tcbiAgZnVuY3Rpb24gY2IoKXtcbiAgICB2YXIgYSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5jb25jYXQoYXJncyk7XG5cbiAgICBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBtZXRob2QuYXBwbHkob2JqLCBhKTsgICAgXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWYgKCFvYmpbbWV0aG9kXSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWV0aG9kICsgJyBtZXRob2QgaXMgbm90IGRlZmluZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvYmpbbWV0aG9kXS5hcHBseShvYmosIGEpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGJpbmRcbiAgaWYgKGUuc2VsZWN0b3IpIHtcbiAgICBjYiA9IGRlbGVnYXRlLmJpbmQoZWwsIGUuc2VsZWN0b3IsIG5hbWUsIGNiKTtcbiAgfSBlbHNlIHtcbiAgICBldmVudHMuYmluZChlbCwgbmFtZSwgY2IpO1xuICB9XG5cbiAgLy8gc3Vic2NyaXB0aW9uIGZvciB1bmJpbmRpbmdcbiAgdGhpcy5zdWIobmFtZSwgbWV0aG9kLCBjYik7XG5cbiAgcmV0dXJuIGNiO1xufTtcblxuLyoqXG4gKiBVbmJpbmQgYSBzaW5nbGUgYmluZGluZywgYWxsIGJpbmRpbmdzIGZvciBgZXZlbnRgLFxuICogb3IgYWxsIGJpbmRpbmdzIHdpdGhpbiB0aGUgbWFuYWdlci5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgVW5iaW5kIGRpcmVjdCBoYW5kbGVyczpcbiAqXG4gKiAgICAgZXZlbnRzLnVuYmluZCgnY2xpY2snLCAncmVtb3ZlJylcbiAqICAgICBldmVudHMudW5iaW5kKCdjbGljaycpXG4gKiAgICAgZXZlbnRzLnVuYmluZCgpXG4gKlxuICogVW5iaW5kIGRlbGVnYXRlIGhhbmRsZXJzOlxuICpcbiAqICAgICBldmVudHMudW5iaW5kKCdjbGljaycsICdyZW1vdmUnKVxuICogICAgIGV2ZW50cy51bmJpbmQoJ2NsaWNrJylcbiAqICAgICBldmVudHMudW5iaW5kKClcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gW2V2ZW50XVxuICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb259IFttZXRob2RdXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkV2ZW50cy5wcm90b3R5cGUudW5iaW5kID0gZnVuY3Rpb24oZXZlbnQsIG1ldGhvZCl7XG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aGlzLnVuYmluZEFsbCgpO1xuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGhpcy51bmJpbmRBbGxPZihldmVudCk7XG5cbiAgLy8gbm8gYmluZGluZ3MgZm9yIHRoaXMgZXZlbnRcbiAgdmFyIGJpbmRpbmdzID0gdGhpcy5fZXZlbnRzW2V2ZW50XTtcbiAgdmFyIGNhcHR1cmUgPSAoZm9yY2VDYXB0dXJlRXZlbnRzLmluZGV4T2YoZXZlbnQpICE9PSAtMSk7XG4gIGlmICghYmluZGluZ3MpIHJldHVybjtcblxuICAvLyBubyBiaW5kaW5ncyBmb3IgdGhpcyBtZXRob2RcbiAgdmFyIGNiID0gYmluZGluZ3NbbWV0aG9kXTtcbiAgaWYgKCFjYikgcmV0dXJuO1xuXG4gIGV2ZW50cy51bmJpbmQodGhpcy5lbCwgZXZlbnQsIGNiLCBjYXB0dXJlKTtcbn07XG5cbi8qKlxuICogVW5iaW5kIGFsbCBldmVudHMuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuRXZlbnRzLnByb3RvdHlwZS51bmJpbmRBbGwgPSBmdW5jdGlvbigpe1xuICBmb3IgKHZhciBldmVudCBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICB0aGlzLnVuYmluZEFsbE9mKGV2ZW50KTtcbiAgfVxufTtcblxuLyoqXG4gKiBVbmJpbmQgYWxsIGV2ZW50cyBmb3IgYGV2ZW50YC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbkV2ZW50cy5wcm90b3R5cGUudW5iaW5kQWxsT2YgPSBmdW5jdGlvbihldmVudCl7XG4gIHZhciBiaW5kaW5ncyA9IHRoaXMuX2V2ZW50c1tldmVudF07XG4gIGlmICghYmluZGluZ3MpIHJldHVybjtcblxuICBmb3IgKHZhciBtZXRob2QgaW4gYmluZGluZ3MpIHtcbiAgICB0aGlzLnVuYmluZChldmVudCwgbWV0aG9kKTtcbiAgfVxufTtcblxuLyoqXG4gKiBQYXJzZSBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2UoZXZlbnQpIHtcbiAgdmFyIHBhcnRzID0gZXZlbnQuc3BsaXQoLyArLyk7XG4gIHJldHVybiB7XG4gICAgbmFtZTogcGFydHMuc2hpZnQoKSxcbiAgICBzZWxlY3RvcjogcGFydHMuam9pbignICcpXG4gIH1cbn1cbiIsInZhciBiaW5kID0gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgPyAnYWRkRXZlbnRMaXN0ZW5lcicgOiAnYXR0YWNoRXZlbnQnLFxuICAgIHVuYmluZCA9IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyID8gJ3JlbW92ZUV2ZW50TGlzdGVuZXInIDogJ2RldGFjaEV2ZW50JyxcbiAgICBwcmVmaXggPSBiaW5kICE9PSAnYWRkRXZlbnRMaXN0ZW5lcicgPyAnb24nIDogJyc7XG5cbi8qKlxuICogQmluZCBgZWxgIGV2ZW50IGB0eXBlYCB0byBgZm5gLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtCb29sZWFufSBjYXB0dXJlXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5iaW5kID0gZnVuY3Rpb24oZWwsIHR5cGUsIGZuLCBjYXB0dXJlKXtcbiAgZWxbYmluZF0ocHJlZml4ICsgdHlwZSwgZm4sIGNhcHR1cmUgfHwgZmFsc2UpO1xuICByZXR1cm4gZm47XG59O1xuXG4vKipcbiAqIFVuYmluZCBgZWxgIGV2ZW50IGB0eXBlYCdzIGNhbGxiYWNrIGBmbmAuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNhcHR1cmVcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnVuYmluZCA9IGZ1bmN0aW9uKGVsLCB0eXBlLCBmbiwgY2FwdHVyZSl7XG4gIGVsW3VuYmluZF0ocHJlZml4ICsgdHlwZSwgZm4sIGNhcHR1cmUgfHwgZmFsc2UpO1xuICByZXR1cm4gZm47XG59OyIsIi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgY2xvc2VzdCA9IHJlcXVpcmUoJ2Nsb3Nlc3QnKVxuICAsIGV2ZW50ID0gcmVxdWlyZSgnZXZlbnQnKTtcblxuLyoqXG4gKiBEZWxlZ2F0ZSBldmVudCBgdHlwZWAgdG8gYHNlbGVjdG9yYFxuICogYW5kIGludm9rZSBgZm4oZSlgLiBBIGNhbGxiYWNrIGZ1bmN0aW9uXG4gKiBpcyByZXR1cm5lZCB3aGljaCBtYXkgYmUgcGFzc2VkIHRvIGAudW5iaW5kKClgLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNhcHR1cmVcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG4vLyBTb21lIGV2ZW50cyBkb24ndCBidWJibGUsIHNvIHdlIHdhbnQgdG8gYmluZCB0byB0aGUgY2FwdHVyZSBwaGFzZSBpbnN0ZWFkXG4vLyB3aGVuIGRlbGVnYXRpbmcuXG52YXIgZm9yY2VDYXB0dXJlRXZlbnRzID0gWydmb2N1cycsICdibHVyJ107XG5cbmV4cG9ydHMuYmluZCA9IGZ1bmN0aW9uKGVsLCBzZWxlY3RvciwgdHlwZSwgZm4sIGNhcHR1cmUpe1xuICBpZiAoZm9yY2VDYXB0dXJlRXZlbnRzLmluZGV4T2YodHlwZSkgIT09IC0xKSBjYXB0dXJlID0gdHJ1ZTtcblxuICByZXR1cm4gZXZlbnQuYmluZChlbCwgdHlwZSwgZnVuY3Rpb24oZSl7XG4gICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcbiAgICBlLmRlbGVnYXRlVGFyZ2V0ID0gY2xvc2VzdCh0YXJnZXQsIHNlbGVjdG9yLCB0cnVlLCBlbCk7XG4gICAgaWYgKGUuZGVsZWdhdGVUYXJnZXQpIGZuLmNhbGwoZWwsIGUpO1xuICB9LCBjYXB0dXJlKTtcbn07XG5cbi8qKlxuICogVW5iaW5kIGV2ZW50IGB0eXBlYCdzIGNhbGxiYWNrIGBmbmAuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNhcHR1cmVcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy51bmJpbmQgPSBmdW5jdGlvbihlbCwgdHlwZSwgZm4sIGNhcHR1cmUpe1xuICBpZiAoZm9yY2VDYXB0dXJlRXZlbnRzLmluZGV4T2YodHlwZSkgIT09IC0xKSBjYXB0dXJlID0gdHJ1ZTtcblxuICBldmVudC51bmJpbmQoZWwsIHR5cGUsIGZuLCBjYXB0dXJlKTtcbn07XG4iLCJ2YXIgbWF0Y2hlcyA9IHJlcXVpcmUoJ21hdGNoZXMtc2VsZWN0b3InKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZWxlbWVudCwgc2VsZWN0b3IsIGNoZWNrWW9TZWxmKSB7XHJcbiAgdmFyIHBhcmVudCA9IGNoZWNrWW9TZWxmID8gZWxlbWVudCA6IGVsZW1lbnQucGFyZW50Tm9kZVxyXG5cclxuICB3aGlsZSAocGFyZW50ICYmIHBhcmVudCAhPT0gZG9jdW1lbnQpIHtcclxuICAgIGlmIChtYXRjaGVzKHBhcmVudCwgc2VsZWN0b3IpKSByZXR1cm4gcGFyZW50O1xyXG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGVcclxuICB9XHJcbn1cclxuIiwiXHJcbi8qKlxyXG4gKiBFbGVtZW50IHByb3RvdHlwZS5cclxuICovXHJcblxyXG52YXIgcHJvdG8gPSBFbGVtZW50LnByb3RvdHlwZTtcclxuXHJcbi8qKlxyXG4gKiBWZW5kb3IgZnVuY3Rpb24uXHJcbiAqL1xyXG5cclxudmFyIHZlbmRvciA9IHByb3RvLm1hdGNoZXNTZWxlY3RvclxyXG4gIHx8IHByb3RvLndlYmtpdE1hdGNoZXNTZWxlY3RvclxyXG4gIHx8IHByb3RvLm1vek1hdGNoZXNTZWxlY3RvclxyXG4gIHx8IHByb3RvLm1zTWF0Y2hlc1NlbGVjdG9yXHJcbiAgfHwgcHJvdG8ub01hdGNoZXNTZWxlY3RvcjtcclxuXHJcbi8qKlxyXG4gKiBFeHBvc2UgYG1hdGNoKClgLlxyXG4gKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWF0Y2g7XHJcblxyXG4vKipcclxuICogTWF0Y2ggYGVsYCB0byBgc2VsZWN0b3JgLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1hdGNoKGVsLCBzZWxlY3Rvcikge1xyXG4gIGlmICh2ZW5kb3IpIHJldHVybiB2ZW5kb3IuY2FsbChlbCwgc2VsZWN0b3IpO1xyXG4gIHZhciBub2RlcyA9IGVsLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7ICsraSkge1xyXG4gICAgaWYgKG5vZGVzW2ldID09IGVsKSByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59IiwibW9kdWxlLmV4cG9ydHMgPSBnZXQ7XG5cbmZ1bmN0aW9uIGdldCAoY29udGV4dCwgcGF0aCkge1xuICBpZiAocGF0aC5pbmRleE9mKCcuJykgPT0gLTEgJiYgcGF0aC5pbmRleE9mKCdbJykgPT0gLTEpIHtcbiAgICByZXR1cm4gY29udGV4dFtwYXRoXTtcbiAgfVxuXG4gIHZhciBjcnVtYnMgPSBwYXRoLnNwbGl0KC9cXC58XFxbfFxcXS9nKTtcbiAgdmFyIGkgPSAtMTtcbiAgdmFyIGxlbiA9IGNydW1icy5sZW5ndGg7XG4gIHZhciByZXN1bHQ7XG5cbiAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgIGlmIChpID09IDApIHJlc3VsdCA9IGNvbnRleHQ7XG4gICAgaWYgKCFjcnVtYnNbaV0pIGNvbnRpbnVlO1xuICAgIGlmIChyZXN1bHQgPT0gdW5kZWZpbmVkKSBicmVhaztcbiAgICByZXN1bHQgPSByZXN1bHRbY3J1bWJzW2ldXTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMyAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGFycmF5Q29weSA9IHJlcXVpcmUoJ2xvZGFzaC5fYXJyYXljb3B5JyksXG4gICAgYmFzZUNyZWF0ZSA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZWNyZWF0ZScpLFxuICAgIHJlcGxhY2VIb2xkZXJzID0gcmVxdWlyZSgnbG9kYXNoLl9yZXBsYWNlaG9sZGVycycpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB3cmFwcGVyIG1ldGFkYXRhLiAqL1xudmFyIEJJTkRfRkxBRyA9IDEsXG4gICAgQklORF9LRVlfRkxBRyA9IDIsXG4gICAgQ1VSUllfQk9VTkRfRkxBRyA9IDQsXG4gICAgQ1VSUllfRkxBRyA9IDgsXG4gICAgQ1VSUllfUklHSFRfRkxBRyA9IDE2LFxuICAgIFBBUlRJQUxfRkxBRyA9IDMyLFxuICAgIFBBUlRJQUxfUklHSFRfRkxBRyA9IDY0LFxuICAgIEFSWV9GTEFHID0gMTI4O1xuXG4vKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heCxcbiAgICBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IHRoYXQgaXMgdGhlIGNvbXBvc2l0aW9uIG9mIHBhcnRpYWxseSBhcHBsaWVkIGFyZ3VtZW50cyxcbiAqIHBsYWNlaG9sZGVycywgYW5kIHByb3ZpZGVkIGFyZ3VtZW50cyBpbnRvIGEgc2luZ2xlIGFycmF5IG9mIGFyZ3VtZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGFyZ3MgVGhlIHByb3ZpZGVkIGFyZ3VtZW50cy5cbiAqIEBwYXJhbSB7QXJyYXl9IHBhcnRpYWxzIFRoZSBhcmd1bWVudHMgdG8gcHJlcGVuZCB0byB0aG9zZSBwcm92aWRlZC5cbiAqIEBwYXJhbSB7QXJyYXl9IGhvbGRlcnMgVGhlIGBwYXJ0aWFsc2AgcGxhY2Vob2xkZXIgaW5kZXhlcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIGNvbXBvc2VkIGFyZ3VtZW50cy5cbiAqL1xuZnVuY3Rpb24gY29tcG9zZUFyZ3MoYXJncywgcGFydGlhbHMsIGhvbGRlcnMpIHtcbiAgdmFyIGhvbGRlcnNMZW5ndGggPSBob2xkZXJzLmxlbmd0aCxcbiAgICAgIGFyZ3NJbmRleCA9IC0xLFxuICAgICAgYXJnc0xlbmd0aCA9IG5hdGl2ZU1heChhcmdzLmxlbmd0aCAtIGhvbGRlcnNMZW5ndGgsIDApLFxuICAgICAgbGVmdEluZGV4ID0gLTEsXG4gICAgICBsZWZ0TGVuZ3RoID0gcGFydGlhbHMubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gQXJyYXkoYXJnc0xlbmd0aCArIGxlZnRMZW5ndGgpO1xuXG4gIHdoaWxlICgrK2xlZnRJbmRleCA8IGxlZnRMZW5ndGgpIHtcbiAgICByZXN1bHRbbGVmdEluZGV4XSA9IHBhcnRpYWxzW2xlZnRJbmRleF07XG4gIH1cbiAgd2hpbGUgKCsrYXJnc0luZGV4IDwgaG9sZGVyc0xlbmd0aCkge1xuICAgIHJlc3VsdFtob2xkZXJzW2FyZ3NJbmRleF1dID0gYXJnc1thcmdzSW5kZXhdO1xuICB9XG4gIHdoaWxlIChhcmdzTGVuZ3RoLS0pIHtcbiAgICByZXN1bHRbbGVmdEluZGV4KytdID0gYXJnc1thcmdzSW5kZXgrK107XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2UgYGNvbXBvc2VBcmdzYCBleGNlcHQgdGhhdCB0aGUgYXJndW1lbnRzIGNvbXBvc2l0aW9uXG4gKiBpcyB0YWlsb3JlZCBmb3IgYF8ucGFydGlhbFJpZ2h0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGFyZ3MgVGhlIHByb3ZpZGVkIGFyZ3VtZW50cy5cbiAqIEBwYXJhbSB7QXJyYXl9IHBhcnRpYWxzIFRoZSBhcmd1bWVudHMgdG8gYXBwZW5kIHRvIHRob3NlIHByb3ZpZGVkLlxuICogQHBhcmFtIHtBcnJheX0gaG9sZGVycyBUaGUgYHBhcnRpYWxzYCBwbGFjZWhvbGRlciBpbmRleGVzLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgb2YgY29tcG9zZWQgYXJndW1lbnRzLlxuICovXG5mdW5jdGlvbiBjb21wb3NlQXJnc1JpZ2h0KGFyZ3MsIHBhcnRpYWxzLCBob2xkZXJzKSB7XG4gIHZhciBob2xkZXJzSW5kZXggPSAtMSxcbiAgICAgIGhvbGRlcnNMZW5ndGggPSBob2xkZXJzLmxlbmd0aCxcbiAgICAgIGFyZ3NJbmRleCA9IC0xLFxuICAgICAgYXJnc0xlbmd0aCA9IG5hdGl2ZU1heChhcmdzLmxlbmd0aCAtIGhvbGRlcnNMZW5ndGgsIDApLFxuICAgICAgcmlnaHRJbmRleCA9IC0xLFxuICAgICAgcmlnaHRMZW5ndGggPSBwYXJ0aWFscy5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBBcnJheShhcmdzTGVuZ3RoICsgcmlnaHRMZW5ndGgpO1xuXG4gIHdoaWxlICgrK2FyZ3NJbmRleCA8IGFyZ3NMZW5ndGgpIHtcbiAgICByZXN1bHRbYXJnc0luZGV4XSA9IGFyZ3NbYXJnc0luZGV4XTtcbiAgfVxuICB2YXIgcGFkID0gYXJnc0luZGV4O1xuICB3aGlsZSAoKytyaWdodEluZGV4IDwgcmlnaHRMZW5ndGgpIHtcbiAgICByZXN1bHRbcGFkICsgcmlnaHRJbmRleF0gPSBwYXJ0aWFsc1tyaWdodEluZGV4XTtcbiAgfVxuICB3aGlsZSAoKytob2xkZXJzSW5kZXggPCBob2xkZXJzTGVuZ3RoKSB7XG4gICAgcmVzdWx0W3BhZCArIGhvbGRlcnNbaG9sZGVyc0luZGV4XV0gPSBhcmdzW2FyZ3NJbmRleCsrXTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHdyYXBzIGBmdW5jYCBhbmQgaW52b2tlcyBpdCB3aXRoIHRoZSBgdGhpc2BcbiAqIGJpbmRpbmcgb2YgYHRoaXNBcmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBiaW5kLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJvdW5kIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCaW5kV3JhcHBlcihmdW5jLCB0aGlzQXJnKSB7XG4gIHZhciBDdG9yID0gY3JlYXRlQ3RvcldyYXBwZXIoZnVuYyk7XG5cbiAgZnVuY3Rpb24gd3JhcHBlcigpIHtcbiAgICB2YXIgZm4gPSAodGhpcyAmJiB0aGlzICE9PSBnbG9iYWwgJiYgdGhpcyBpbnN0YW5jZW9mIHdyYXBwZXIpID8gQ3RvciA6IGZ1bmM7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG4gIH1cbiAgcmV0dXJuIHdyYXBwZXI7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcHJvZHVjZXMgYW4gaW5zdGFuY2Ugb2YgYEN0b3JgIHJlZ2FyZGxlc3Mgb2ZcbiAqIHdoZXRoZXIgaXQgd2FzIGludm9rZWQgYXMgcGFydCBvZiBhIGBuZXdgIGV4cHJlc3Npb24gb3IgYnkgYGNhbGxgIG9yIGBhcHBseWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IEN0b3IgVGhlIGNvbnN0cnVjdG9yIHRvIHdyYXAuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB3cmFwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVDdG9yV3JhcHBlcihDdG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGhpc0JpbmRpbmcgPSBiYXNlQ3JlYXRlKEN0b3IucHJvdG90eXBlKSxcbiAgICAgICAgcmVzdWx0ID0gQ3Rvci5hcHBseSh0aGlzQmluZGluZywgYXJndW1lbnRzKTtcblxuICAgIC8vIE1pbWljIHRoZSBjb25zdHJ1Y3RvcidzIGByZXR1cm5gIGJlaGF2aW9yLlxuICAgIC8vIFNlZSBodHRwczovL2VzNS5naXRodWIuaW8vI3gxMy4yLjIgZm9yIG1vcmUgZGV0YWlscy5cbiAgICByZXR1cm4gaXNPYmplY3QocmVzdWx0KSA/IHJlc3VsdCA6IHRoaXNCaW5kaW5nO1xuICB9O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHdyYXBzIGBmdW5jYCBhbmQgaW52b2tlcyBpdCB3aXRoIG9wdGlvbmFsIGB0aGlzYFxuICogYmluZGluZyBvZiwgcGFydGlhbCBhcHBsaWNhdGlvbiwgYW5kIGN1cnJ5aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ30gZnVuYyBUaGUgZnVuY3Rpb24gb3IgbWV0aG9kIG5hbWUgdG8gcmVmZXJlbmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgb2YgZmxhZ3MuIFNlZSBgY3JlYXRlV3JhcHBlcmAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge0FycmF5fSBbcGFydGlhbHNdIFRoZSBhcmd1bWVudHMgdG8gcHJlcGVuZCB0byB0aG9zZSBwcm92aWRlZCB0byB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHBhcmFtIHtBcnJheX0gW2hvbGRlcnNdIFRoZSBgcGFydGlhbHNgIHBsYWNlaG9sZGVyIGluZGV4ZXMuXG4gKiBAcGFyYW0ge0FycmF5fSBbcGFydGlhbHNSaWdodF0gVGhlIGFyZ3VtZW50cyB0byBhcHBlbmQgdG8gdGhvc2UgcHJvdmlkZWQgdG8gdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7QXJyYXl9IFtob2xkZXJzUmlnaHRdIFRoZSBgcGFydGlhbHNSaWdodGAgcGxhY2Vob2xkZXIgaW5kZXhlcy5cbiAqIEBwYXJhbSB7QXJyYXl9IFthcmdQb3NdIFRoZSBhcmd1bWVudCBwb3NpdGlvbnMgb2YgdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJ5XSBUaGUgYXJpdHkgY2FwIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJpdHldIFRoZSBhcml0eSBvZiBgZnVuY2AuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB3cmFwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVIeWJyaWRXcmFwcGVyKGZ1bmMsIGJpdG1hc2ssIHRoaXNBcmcsIHBhcnRpYWxzLCBob2xkZXJzLCBwYXJ0aWFsc1JpZ2h0LCBob2xkZXJzUmlnaHQsIGFyZ1BvcywgYXJ5LCBhcml0eSkge1xuICB2YXIgaXNBcnkgPSBiaXRtYXNrICYgQVJZX0ZMQUcsXG4gICAgICBpc0JpbmQgPSBiaXRtYXNrICYgQklORF9GTEFHLFxuICAgICAgaXNCaW5kS2V5ID0gYml0bWFzayAmIEJJTkRfS0VZX0ZMQUcsXG4gICAgICBpc0N1cnJ5ID0gYml0bWFzayAmIENVUlJZX0ZMQUcsXG4gICAgICBpc0N1cnJ5Qm91bmQgPSBiaXRtYXNrICYgQ1VSUllfQk9VTkRfRkxBRyxcbiAgICAgIGlzQ3VycnlSaWdodCA9IGJpdG1hc2sgJiBDVVJSWV9SSUdIVF9GTEFHO1xuXG4gIHZhciBDdG9yID0gIWlzQmluZEtleSAmJiBjcmVhdGVDdG9yV3JhcHBlcihmdW5jKSxcbiAgICAgIGtleSA9IGZ1bmM7XG5cbiAgZnVuY3Rpb24gd3JhcHBlcigpIHtcbiAgICAvLyBBdm9pZCBgYXJndW1lbnRzYCBvYmplY3QgdXNlIGRpc3F1YWxpZnlpbmcgb3B0aW1pemF0aW9ucyBieVxuICAgIC8vIGNvbnZlcnRpbmcgaXQgdG8gYW4gYXJyYXkgYmVmb3JlIHByb3ZpZGluZyBpdCB0byBvdGhlciBmdW5jdGlvbnMuXG4gICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgIGluZGV4ID0gbGVuZ3RoLFxuICAgICAgICBhcmdzID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlIChpbmRleC0tKSB7XG4gICAgICBhcmdzW2luZGV4XSA9IGFyZ3VtZW50c1tpbmRleF07XG4gICAgfVxuICAgIGlmIChwYXJ0aWFscykge1xuICAgICAgYXJncyA9IGNvbXBvc2VBcmdzKGFyZ3MsIHBhcnRpYWxzLCBob2xkZXJzKTtcbiAgICB9XG4gICAgaWYgKHBhcnRpYWxzUmlnaHQpIHtcbiAgICAgIGFyZ3MgPSBjb21wb3NlQXJnc1JpZ2h0KGFyZ3MsIHBhcnRpYWxzUmlnaHQsIGhvbGRlcnNSaWdodCk7XG4gICAgfVxuICAgIGlmIChpc0N1cnJ5IHx8IGlzQ3VycnlSaWdodCkge1xuICAgICAgdmFyIHBsYWNlaG9sZGVyID0gd3JhcHBlci5wbGFjZWhvbGRlcixcbiAgICAgICAgICBhcmdzSG9sZGVycyA9IHJlcGxhY2VIb2xkZXJzKGFyZ3MsIHBsYWNlaG9sZGVyKTtcblxuICAgICAgbGVuZ3RoIC09IGFyZ3NIb2xkZXJzLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggPCBhcml0eSkge1xuICAgICAgICB2YXIgbmV3QXJnUG9zID0gYXJnUG9zID8gYXJyYXlDb3B5KGFyZ1BvcykgOiBudWxsLFxuICAgICAgICAgICAgbmV3QXJpdHkgPSBuYXRpdmVNYXgoYXJpdHkgLSBsZW5ndGgsIDApLFxuICAgICAgICAgICAgbmV3c0hvbGRlcnMgPSBpc0N1cnJ5ID8gYXJnc0hvbGRlcnMgOiBudWxsLFxuICAgICAgICAgICAgbmV3SG9sZGVyc1JpZ2h0ID0gaXNDdXJyeSA/IG51bGwgOiBhcmdzSG9sZGVycyxcbiAgICAgICAgICAgIG5ld1BhcnRpYWxzID0gaXNDdXJyeSA/IGFyZ3MgOiBudWxsLFxuICAgICAgICAgICAgbmV3UGFydGlhbHNSaWdodCA9IGlzQ3VycnkgPyBudWxsIDogYXJncztcblxuICAgICAgICBiaXRtYXNrIHw9IChpc0N1cnJ5ID8gUEFSVElBTF9GTEFHIDogUEFSVElBTF9SSUdIVF9GTEFHKTtcbiAgICAgICAgYml0bWFzayAmPSB+KGlzQ3VycnkgPyBQQVJUSUFMX1JJR0hUX0ZMQUcgOiBQQVJUSUFMX0ZMQUcpO1xuXG4gICAgICAgIGlmICghaXNDdXJyeUJvdW5kKSB7XG4gICAgICAgICAgYml0bWFzayAmPSB+KEJJTkRfRkxBRyB8IEJJTkRfS0VZX0ZMQUcpO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXN1bHQgPSBjcmVhdGVIeWJyaWRXcmFwcGVyKGZ1bmMsIGJpdG1hc2ssIHRoaXNBcmcsIG5ld1BhcnRpYWxzLCBuZXdzSG9sZGVycywgbmV3UGFydGlhbHNSaWdodCwgbmV3SG9sZGVyc1JpZ2h0LCBuZXdBcmdQb3MsIGFyeSwgbmV3QXJpdHkpO1xuXG4gICAgICAgIHJlc3VsdC5wbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgdGhpc0JpbmRpbmcgPSBpc0JpbmQgPyB0aGlzQXJnIDogdGhpcztcbiAgICBpZiAoaXNCaW5kS2V5KSB7XG4gICAgICBmdW5jID0gdGhpc0JpbmRpbmdba2V5XTtcbiAgICB9XG4gICAgaWYgKGFyZ1Bvcykge1xuICAgICAgYXJncyA9IHJlb3JkZXIoYXJncywgYXJnUG9zKTtcbiAgICB9XG4gICAgaWYgKGlzQXJ5ICYmIGFyeSA8IGFyZ3MubGVuZ3RoKSB7XG4gICAgICBhcmdzLmxlbmd0aCA9IGFyeTtcbiAgICB9XG4gICAgdmFyIGZuID0gKHRoaXMgJiYgdGhpcyAhPT0gZ2xvYmFsICYmIHRoaXMgaW5zdGFuY2VvZiB3cmFwcGVyKSA/IChDdG9yIHx8IGNyZWF0ZUN0b3JXcmFwcGVyKGZ1bmMpKSA6IGZ1bmM7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNCaW5kaW5nLCBhcmdzKTtcbiAgfVxuICByZXR1cm4gd3JhcHBlcjtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCB3cmFwcyBgZnVuY2AgYW5kIGludm9rZXMgaXQgd2l0aCB0aGUgb3B0aW9uYWwgYHRoaXNgXG4gKiBiaW5kaW5nIG9mIGB0aGlzQXJnYCBhbmQgdGhlIGBwYXJ0aWFsc2AgcHJlcGVuZGVkIHRvIHRob3NlIHByb3ZpZGVkIHRvXG4gKiB0aGUgd3JhcHBlci5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcGFydGlhbGx5IGFwcGx5IGFyZ3VtZW50cyB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIG9mIGZsYWdzLiBTZWUgYGNyZWF0ZVdyYXBwZXJgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0geyp9IHRoaXNBcmcgVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7QXJyYXl9IHBhcnRpYWxzIFRoZSBhcmd1bWVudHMgdG8gcHJlcGVuZCB0byB0aG9zZSBwcm92aWRlZCB0byB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYm91bmQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVBhcnRpYWxXcmFwcGVyKGZ1bmMsIGJpdG1hc2ssIHRoaXNBcmcsIHBhcnRpYWxzKSB7XG4gIHZhciBpc0JpbmQgPSBiaXRtYXNrICYgQklORF9GTEFHLFxuICAgICAgQ3RvciA9IGNyZWF0ZUN0b3JXcmFwcGVyKGZ1bmMpO1xuXG4gIGZ1bmN0aW9uIHdyYXBwZXIoKSB7XG4gICAgLy8gQXZvaWQgYGFyZ3VtZW50c2Agb2JqZWN0IHVzZSBkaXNxdWFsaWZ5aW5nIG9wdGltaXphdGlvbnMgYnlcbiAgICAvLyBjb252ZXJ0aW5nIGl0IHRvIGFuIGFycmF5IGJlZm9yZSBwcm92aWRpbmcgaXQgYGZ1bmNgLlxuICAgIHZhciBhcmdzSW5kZXggPSAtMSxcbiAgICAgICAgYXJnc0xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgIGxlZnRJbmRleCA9IC0xLFxuICAgICAgICBsZWZ0TGVuZ3RoID0gcGFydGlhbHMubGVuZ3RoLFxuICAgICAgICBhcmdzID0gQXJyYXkoYXJnc0xlbmd0aCArIGxlZnRMZW5ndGgpO1xuXG4gICAgd2hpbGUgKCsrbGVmdEluZGV4IDwgbGVmdExlbmd0aCkge1xuICAgICAgYXJnc1tsZWZ0SW5kZXhdID0gcGFydGlhbHNbbGVmdEluZGV4XTtcbiAgICB9XG4gICAgd2hpbGUgKGFyZ3NMZW5ndGgtLSkge1xuICAgICAgYXJnc1tsZWZ0SW5kZXgrK10gPSBhcmd1bWVudHNbKythcmdzSW5kZXhdO1xuICAgIH1cbiAgICB2YXIgZm4gPSAodGhpcyAmJiB0aGlzICE9PSBnbG9iYWwgJiYgdGhpcyBpbnN0YW5jZW9mIHdyYXBwZXIpID8gQ3RvciA6IGZ1bmM7XG4gICAgcmV0dXJuIGZuLmFwcGx5KGlzQmluZCA/IHRoaXNBcmcgOiB0aGlzLCBhcmdzKTtcbiAgfVxuICByZXR1cm4gd3JhcHBlcjtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBlaXRoZXIgY3VycmllcyBvciBpbnZva2VzIGBmdW5jYCB3aXRoIG9wdGlvbmFsXG4gKiBgdGhpc2AgYmluZGluZyBhbmQgcGFydGlhbGx5IGFwcGxpZWQgYXJndW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ30gZnVuYyBUaGUgZnVuY3Rpb24gb3IgbWV0aG9kIG5hbWUgdG8gcmVmZXJlbmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgb2YgZmxhZ3MuXG4gKiAgVGhlIGJpdG1hc2sgbWF5IGJlIGNvbXBvc2VkIG9mIHRoZSBmb2xsb3dpbmcgZmxhZ3M6XG4gKiAgICAgMSAtIGBfLmJpbmRgXG4gKiAgICAgMiAtIGBfLmJpbmRLZXlgXG4gKiAgICAgNCAtIGBfLmN1cnJ5YCBvciBgXy5jdXJyeVJpZ2h0YCBvZiBhIGJvdW5kIGZ1bmN0aW9uXG4gKiAgICAgOCAtIGBfLmN1cnJ5YFxuICogICAgMTYgLSBgXy5jdXJyeVJpZ2h0YFxuICogICAgMzIgLSBgXy5wYXJ0aWFsYFxuICogICAgNjQgLSBgXy5wYXJ0aWFsUmlnaHRgXG4gKiAgIDEyOCAtIGBfLnJlYXJnYFxuICogICAyNTYgLSBgXy5hcnlgXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtBcnJheX0gW3BhcnRpYWxzXSBUaGUgYXJndW1lbnRzIHRvIGJlIHBhcnRpYWxseSBhcHBsaWVkLlxuICogQHBhcmFtIHtBcnJheX0gW2hvbGRlcnNdIFRoZSBgcGFydGlhbHNgIHBsYWNlaG9sZGVyIGluZGV4ZXMuXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJnUG9zXSBUaGUgYXJndW1lbnQgcG9zaXRpb25zIG9mIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyeV0gVGhlIGFyaXR5IGNhcCBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyaXR5XSBUaGUgYXJpdHkgb2YgYGZ1bmNgLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgd3JhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlV3JhcHBlcihmdW5jLCBiaXRtYXNrLCB0aGlzQXJnLCBwYXJ0aWFscywgaG9sZGVycywgYXJnUG9zLCBhcnksIGFyaXR5KSB7XG4gIHZhciBpc0JpbmRLZXkgPSBiaXRtYXNrICYgQklORF9LRVlfRkxBRztcbiAgaWYgKCFpc0JpbmRLZXkgJiYgdHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gcGFydGlhbHMgPyBwYXJ0aWFscy5sZW5ndGggOiAwO1xuICBpZiAoIWxlbmd0aCkge1xuICAgIGJpdG1hc2sgJj0gfihQQVJUSUFMX0ZMQUcgfCBQQVJUSUFMX1JJR0hUX0ZMQUcpO1xuICAgIHBhcnRpYWxzID0gaG9sZGVycyA9IG51bGw7XG4gIH1cbiAgbGVuZ3RoIC09IChob2xkZXJzID8gaG9sZGVycy5sZW5ndGggOiAwKTtcbiAgaWYgKGJpdG1hc2sgJiBQQVJUSUFMX1JJR0hUX0ZMQUcpIHtcbiAgICB2YXIgcGFydGlhbHNSaWdodCA9IHBhcnRpYWxzLFxuICAgICAgICBob2xkZXJzUmlnaHQgPSBob2xkZXJzO1xuXG4gICAgcGFydGlhbHMgPSBob2xkZXJzID0gbnVsbDtcbiAgfVxuICB2YXIgbmV3RGF0YSA9IFtmdW5jLCBiaXRtYXNrLCB0aGlzQXJnLCBwYXJ0aWFscywgaG9sZGVycywgcGFydGlhbHNSaWdodCwgaG9sZGVyc1JpZ2h0LCBhcmdQb3MsIGFyeSwgYXJpdHldO1xuXG4gIG5ld0RhdGFbOV0gPSBhcml0eSA9PSBudWxsXG4gICAgPyAoaXNCaW5kS2V5ID8gMCA6IGZ1bmMubGVuZ3RoKVxuICAgIDogKG5hdGl2ZU1heChhcml0eSAtIGxlbmd0aCwgMCkgfHwgMCk7XG5cbiAgaWYgKGJpdG1hc2sgPT0gQklORF9GTEFHKSB7XG4gICAgdmFyIHJlc3VsdCA9IGNyZWF0ZUJpbmRXcmFwcGVyKG5ld0RhdGFbMF0sIG5ld0RhdGFbMl0pO1xuICB9IGVsc2UgaWYgKChiaXRtYXNrID09IFBBUlRJQUxfRkxBRyB8fCBiaXRtYXNrID09IChCSU5EX0ZMQUcgfCBQQVJUSUFMX0ZMQUcpKSAmJiAhbmV3RGF0YVs0XS5sZW5ndGgpIHtcbiAgICByZXN1bHQgPSBjcmVhdGVQYXJ0aWFsV3JhcHBlci5hcHBseSh1bmRlZmluZWQsIG5ld0RhdGEpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9IGNyZWF0ZUh5YnJpZFdyYXBwZXIuYXBwbHkodW5kZWZpbmVkLCBuZXdEYXRhKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICB2YWx1ZSA9ICt2YWx1ZTtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuICByZXR1cm4gdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aDtcbn1cblxuLyoqXG4gKiBSZW9yZGVyIGBhcnJheWAgYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpZWQgaW5kZXhlcyB3aGVyZSB0aGUgZWxlbWVudCBhdFxuICogdGhlIGZpcnN0IGluZGV4IGlzIGFzc2lnbmVkIGFzIHRoZSBmaXJzdCBlbGVtZW50LCB0aGUgZWxlbWVudCBhdFxuICogdGhlIHNlY29uZCBpbmRleCBpcyBhc3NpZ25lZCBhcyB0aGUgc2Vjb25kIGVsZW1lbnQsIGFuZCBzbyBvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHJlb3JkZXIuXG4gKiBAcGFyYW0ge0FycmF5fSBpbmRleGVzIFRoZSBhcnJhbmdlZCBhcnJheSBpbmRleGVzLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIHJlb3JkZXIoYXJyYXksIGluZGV4ZXMpIHtcbiAgdmFyIGFyckxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIGxlbmd0aCA9IG5hdGl2ZU1pbihpbmRleGVzLmxlbmd0aCwgYXJyTGVuZ3RoKSxcbiAgICAgIG9sZEFycmF5ID0gYXJyYXlDb3B5KGFycmF5KTtcblxuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICB2YXIgaW5kZXggPSBpbmRleGVzW2xlbmd0aF07XG4gICAgYXJyYXlbbGVuZ3RoXSA9IGlzSW5kZXgoaW5kZXgsIGFyckxlbmd0aCkgPyBvbGRBcnJheVtpbmRleF0gOiB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdHlwZSA9PSAnZnVuY3Rpb24nIHx8ICghIXZhbHVlICYmIHR5cGUgPT0gJ29iamVjdCcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVdyYXBwZXI7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmNyZWF0ZWAgd2l0aG91dCBzdXBwb3J0IGZvciBhc3NpZ25pbmdcbiAqIHByb3BlcnRpZXMgdG8gdGhlIGNyZWF0ZWQgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvdG90eXBlIFRoZSBvYmplY3QgdG8gaW5oZXJpdCBmcm9tLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqL1xudmFyIGJhc2VDcmVhdGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIE9iamVjdCgpIHt9XG4gIHJldHVybiBmdW5jdGlvbihwcm90b3R5cGUpIHtcbiAgICBpZiAoaXNPYmplY3QocHJvdG90eXBlKSkge1xuICAgICAgT2JqZWN0LnByb3RvdHlwZSA9IHByb3RvdHlwZTtcbiAgICAgIHZhciByZXN1bHQgPSBuZXcgT2JqZWN0O1xuICAgICAgT2JqZWN0LnByb3RvdHlwZSA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQgfHwgZ2xvYmFsLk9iamVjdCgpO1xuICB9O1xufSgpKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgW2xhbmd1YWdlIHR5cGVdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHR5cGUgPT0gJ2Z1bmN0aW9uJyB8fCAoISF2YWx1ZSAmJiB0eXBlID09ICdvYmplY3QnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ3JlYXRlO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjIgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZWZsYXR0ZW4nKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJ2xvZGFzaC5faXNpdGVyYXRlZWNhbGwnKTtcblxuLyoqXG4gKiBGbGF0dGVucyBhIG5lc3RlZCBhcnJheS4gSWYgYGlzRGVlcGAgaXMgYHRydWVgIHRoZSBhcnJheSBpcyByZWN1cnNpdmVseVxuICogZmxhdHRlbmVkLCBvdGhlcndpc2UgaXQgaXMgb25seSBmbGF0dGVuZWQgYSBzaW5nbGUgbGV2ZWwuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGZsYXR0ZW4uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGZsYXR0ZW4uXG4gKiBAcGFyYW0tIHtPYmplY3R9IFtndWFyZF0gRW5hYmxlcyB1c2UgYXMgYSBjYWxsYmFjayBmb3IgZnVuY3Rpb25zIGxpa2UgYF8ubWFwYC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5mbGF0dGVuKFsxLCBbMiwgMywgWzRdXV0pO1xuICogLy8gPT4gWzEsIDIsIDMsIFs0XV1cbiAqXG4gKiAvLyB1c2luZyBgaXNEZWVwYFxuICogXy5mbGF0dGVuKFsxLCBbMiwgMywgWzRdXV0sIHRydWUpO1xuICogLy8gPT4gWzEsIDIsIDMsIDRdXG4gKi9cbmZ1bmN0aW9uIGZsYXR0ZW4oYXJyYXksIGlzRGVlcCwgZ3VhcmQpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgaWYgKGd1YXJkICYmIGlzSXRlcmF0ZWVDYWxsKGFycmF5LCBpc0RlZXAsIGd1YXJkKSkge1xuICAgIGlzRGVlcCA9IGZhbHNlO1xuICB9XG4gIHJldHVybiBsZW5ndGggPyBiYXNlRmxhdHRlbihhcnJheSwgaXNEZWVwKSA6IFtdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZsYXR0ZW47XG4iLCIvKipcbiAqIGxvZGFzaCAzLjEuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGJhc2VFYWNoID0gcmVxdWlyZSgnbG9kYXNoLl9iYXNlZWFjaCcpLFxuICAgIHJlc3RQYXJhbSA9IHJlcXVpcmUoJ2xvZGFzaC5yZXN0cGFyYW0nKTtcblxuLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIEludm9rZXMgdGhlIG1ldGhvZCBuYW1lZCBieSBgbWV0aG9kTmFtZWAgb24gZWFjaCBlbGVtZW50IGluIGBjb2xsZWN0aW9uYCxcbiAqIHJldHVybmluZyBhbiBhcnJheSBvZiB0aGUgcmVzdWx0cyBvZiBlYWNoIGludm9rZWQgbWV0aG9kLiBBbnkgYWRkaXRpb25hbFxuICogYXJndW1lbnRzIGFyZSBwcm92aWRlZCB0byBlYWNoIGludm9rZWQgbWV0aG9kLiBJZiBgbWV0aG9kTmFtZWAgaXMgYSBmdW5jdGlvblxuICogaXQgaXMgaW52b2tlZCBmb3IsIGFuZCBgdGhpc2AgYm91bmQgdG8sIGVhY2ggZWxlbWVudCBpbiBgY29sbGVjdGlvbmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbnxzdHJpbmd9IG1ldGhvZE5hbWUgVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCB0byBpbnZva2Ugb3JcbiAqICB0aGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHsuLi4qfSBbYXJnc10gVGhlIGFyZ3VtZW50cyB0byBpbnZva2UgdGhlIG1ldGhvZCB3aXRoLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmludm9rZShbWzUsIDEsIDddLCBbMywgMiwgMV1dLCAnc29ydCcpO1xuICogLy8gPT4gW1sxLCA1LCA3XSwgWzEsIDIsIDNdXVxuICpcbiAqIF8uaW52b2tlKFsxMjMsIDQ1Nl0sIFN0cmluZy5wcm90b3R5cGUuc3BsaXQsICcnKTtcbiAqIC8vID0+IFtbJzEnLCAnMicsICczJ10sIFsnNCcsICc1JywgJzYnXV1cbiAqL1xudmFyIGludm9rZSA9IHJlc3RQYXJhbShmdW5jdGlvbihjb2xsZWN0aW9uLCBtZXRob2ROYW1lLCBhcmdzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgaXNGdW5jID0gdHlwZW9mIG1ldGhvZE5hbWUgPT0gJ2Z1bmN0aW9uJyxcbiAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24gPyBjb2xsZWN0aW9uLmxlbmd0aCA6IDAsXG4gICAgICByZXN1bHQgPSBpc0xlbmd0aChsZW5ndGgpID8gQXJyYXkobGVuZ3RoKSA6IFtdO1xuXG4gIGJhc2VFYWNoKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIGZ1bmMgPSBpc0Z1bmMgPyBtZXRob2ROYW1lIDogKHZhbHVlICE9IG51bGwgJiYgdmFsdWVbbWV0aG9kTmFtZV0pO1xuICAgIHJlc3VsdFsrK2luZGV4XSA9IGZ1bmMgPyBmdW5jLmFwcGx5KHZhbHVlLCBhcmdzKSA6IHVuZGVmaW5lZDtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnZva2U7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuNy4wIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKipcbiAqIEdldHMgdGhlIGxhc3QgZWxlbWVudCBvZiBgYXJyYXlgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBsYXN0IGVsZW1lbnQgb2YgYGFycmF5YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5sYXN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiAzXG4gKi9cbmZ1bmN0aW9uIGxhc3QoYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgcmV0dXJuIGxlbmd0aCA/IGFycmF5W2xlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxhc3Q7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjEuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGJhc2VGbGF0dGVuID0gcmVxdWlyZSgnbG9kYXNoLl9iYXNlZmxhdHRlbicpLFxuICAgIGJpbmRDYWxsYmFjayA9IHJlcXVpcmUoJ2xvZGFzaC5fYmluZGNhbGxiYWNrJyksXG4gICAgcGlja0J5QXJyYXkgPSByZXF1aXJlKCdsb2Rhc2guX3BpY2tieWFycmF5JyksXG4gICAgcGlja0J5Q2FsbGJhY2sgPSByZXF1aXJlKCdsb2Rhc2guX3BpY2tieWNhbGxiYWNrJyksXG4gICAgcmVzdFBhcmFtID0gcmVxdWlyZSgnbG9kYXNoLnJlc3RwYXJhbScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gb2JqZWN0IGNvbXBvc2VkIG9mIHRoZSBwaWNrZWQgYG9iamVjdGAgcHJvcGVydGllcy4gUHJvcGVydHlcbiAqIG5hbWVzIG1heSBiZSBzcGVjaWZpZWQgYXMgaW5kaXZpZHVhbCBhcmd1bWVudHMgb3IgYXMgYXJyYXlzIG9mIHByb3BlcnR5XG4gKiBuYW1lcy4gSWYgYHByZWRpY2F0ZWAgaXMgcHJvdmlkZWQgaXQgaXMgaW52b2tlZCBmb3IgZWFjaCBwcm9wZXJ0eSBvZiBgb2JqZWN0YFxuICogcGlja2luZyB0aGUgcHJvcGVydGllcyBgcHJlZGljYXRlYCByZXR1cm5zIHRydXRoeSBmb3IuIFRoZSBwcmVkaWNhdGUgaXNcbiAqIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czogKHZhbHVlLCBrZXksIG9iamVjdCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufC4uLihzdHJpbmd8c3RyaW5nW10pfSBbcHJlZGljYXRlXSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXJcbiAqICBpdGVyYXRpb24gb3IgcHJvcGVydHkgbmFtZXMgdG8gcGljaywgc3BlY2lmaWVkIGFzIGluZGl2aWR1YWwgcHJvcGVydHlcbiAqICBuYW1lcyBvciBhcnJheXMgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYHByZWRpY2F0ZWAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgb2JqZWN0LlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAndXNlcic6ICdmcmVkJywgJ2FnZSc6IDQwIH07XG4gKlxuICogXy5waWNrKG9iamVjdCwgJ3VzZXInKTtcbiAqIC8vID0+IHsgJ3VzZXInOiAnZnJlZCcgfVxuICpcbiAqIF8ucGljayhvYmplY3QsIF8uaXNTdHJpbmcpO1xuICogLy8gPT4geyAndXNlcic6ICdmcmVkJyB9XG4gKi9cbnZhciBwaWNrID0gcmVzdFBhcmFtKGZ1bmN0aW9uKG9iamVjdCwgcHJvcHMpIHtcbiAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG4gIHJldHVybiB0eXBlb2YgcHJvcHNbMF0gPT0gJ2Z1bmN0aW9uJ1xuICAgID8gcGlja0J5Q2FsbGJhY2sob2JqZWN0LCBiaW5kQ2FsbGJhY2socHJvcHNbMF0sIHByb3BzWzFdLCAzKSlcbiAgICA6IHBpY2tCeUFycmF5KG9iamVjdCwgYmFzZUZsYXR0ZW4ocHJvcHMpKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBpY2s7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuNy4wIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCdsb2Rhc2guaXNmdW5jdGlvbicpO1xuXG4vKipcbiAqIFJlc29sdmVzIHRoZSB2YWx1ZSBvZiBwcm9wZXJ0eSBga2V5YCBvbiBgb2JqZWN0YC4gSWYgdGhlIHZhbHVlIG9mIGBrZXlgIGlzXG4gKiBhIGZ1bmN0aW9uIGl0IGlzIGludm9rZWQgd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgYG9iamVjdGAgYW5kIGl0cyByZXN1bHRcbiAqIGlzIHJldHVybmVkLCBlbHNlIHRoZSBwcm9wZXJ0eSB2YWx1ZSBpcyByZXR1cm5lZC4gSWYgdGhlIHByb3BlcnR5IHZhbHVlIGlzXG4gKiBgdW5kZWZpbmVkYCB0aGUgYGRlZmF1bHRWYWx1ZWAgaXMgdXNlZCBpbiBpdHMgcGxhY2UuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gcmVzb2x2ZS5cbiAqIEBwYXJhbSB7Kn0gW2RlZmF1bHRWYWx1ZV0gVGhlIHZhbHVlIHJldHVybmVkIGlmIHRoZSBwcm9wZXJ0eSB2YWx1ZVxuICogIHJlc29sdmVzIHRvIGB1bmRlZmluZWRgLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc29sdmVkIHZhbHVlLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAndXNlcic6ICdmcmVkJywgJ2FnZSc6IF8uY29uc3RhbnQoNDApIH07XG4gKlxuICogXy5yZXN1bHQob2JqZWN0LCAndXNlcicpO1xuICogLy8gPT4gJ2ZyZWQnXG4gKlxuICogXy5yZXN1bHQob2JqZWN0LCAnYWdlJyk7XG4gKiAvLyA9PiA0MFxuICpcbiAqIF8ucmVzdWx0KG9iamVjdCwgJ3N0YXR1cycsICdidXN5Jyk7XG4gKiAvLyA9PiAnYnVzeSdcbiAqXG4gKiBfLnJlc3VsdChvYmplY3QsICdzdGF0dXMnLCBfLmNvbnN0YW50KCdidXN5JykpO1xuICogLy8gPT4gJ2J1c3knXG4gKi9cbmZ1bmN0aW9uIHJlc3VsdChvYmplY3QsIGtleSwgZGVmYXVsdFZhbHVlKSB7XG4gIHZhciB2YWx1ZSA9IG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB2YWx1ZSA9IGRlZmF1bHRWYWx1ZTtcbiAgfVxuICByZXR1cm4gaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZS5jYWxsKG9iamVjdCkgOiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXN1bHQ7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMiAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpID4gNSkuICovXG52YXIgcmVIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYCBbc3BlY2lhbCBjaGFyYWN0ZXJzXShodHRwOi8vd3d3LnJlZ3VsYXItZXhwcmVzc2lvbnMuaW5mby9jaGFyYWN0ZXJzLmh0bWwjc3BlY2lhbCkuXG4gKiBJbiBhZGRpdGlvbiB0byBzcGVjaWFsIGNoYXJhY3RlcnMgdGhlIGZvcndhcmQgc2xhc2ggaXMgZXNjYXBlZCB0byBhbGxvdyBmb3JcbiAqIGVhc2llciBgZXZhbGAgdXNlIGFuZCBgRnVuY3Rpb25gIGNvbXBpbGF0aW9uLlxuICovXG52YXIgcmVSZWdFeHBDaGFycyA9IC9bLiorP14ke30oKXxbXFxdXFwvXFxcXF0vZyxcbiAgICByZUhhc1JlZ0V4cENoYXJzID0gUmVnRXhwKHJlUmVnRXhwQ2hhcnMuc291cmNlKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0Z1bmN0aW9uYCB3aXRob3V0IHN1cHBvcnQgZm9yIGVudmlyb25tZW50c1xuICogd2l0aCBpbmNvcnJlY3QgYHR5cGVvZmAgcmVzdWx0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNGdW5jdGlvbih2YWx1ZSkge1xuICAvLyBBdm9pZCBhIENoYWtyYSBKSVQgYnVnIGluIGNvbXBhdGliaWxpdHkgbW9kZXMgb2YgSUUgMTEuXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vamFzaGtlbmFzL3VuZGVyc2NvcmUvaXNzdWVzLzE2MjEgZm9yIG1vcmUgZGV0YWlscy5cbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nIHx8IGZhbHNlO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgaWYgaXQgaXMgbm90IG9uZS4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkXG4gKiBmb3IgYG51bGxgIG9yIGB1bmRlZmluZWRgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6ICh2YWx1ZSArICcnKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZuVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGVzY2FwZVJlZ0V4cChvYmpUb1N0cmluZylcbiAgLnJlcGxhY2UoL3RvU3RyaW5nfChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKiogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIFVpbnQ4QXJyYXkgPSBpc05hdGl2ZShVaW50OEFycmF5ID0gZ2xvYmFsLlVpbnQ4QXJyYXkpICYmIFVpbnQ4QXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0Z1bmN0aW9uID0gIShiYXNlSXNGdW5jdGlvbigveC8pIHx8IChVaW50OEFycmF5ICYmICFiYXNlSXNGdW5jdGlvbihVaW50OEFycmF5KSkpID8gYmFzZUlzRnVuY3Rpb24gOiBmdW5jdGlvbih2YWx1ZSkge1xuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gb2xkZXIgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBTYWZhcmkgd2hpY2ggcmV0dXJuICdmdW5jdGlvbicgZm9yIHJlZ2V4ZXNcbiAgLy8gYW5kIFNhZmFyaSA4IGVxdWl2YWxlbnRzIHdoaWNoIHJldHVybiAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXkgY29uc3RydWN0b3JzLlxuICByZXR1cm4gb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gZnVuY1RhZztcbn07XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNOYXRpdmUoQXJyYXkucHJvdG90eXBlLnB1c2gpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOYXRpdmUoXyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAob2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gZnVuY1RhZykge1xuICAgIHJldHVybiByZU5hdGl2ZS50ZXN0KGZuVG9TdHJpbmcuY2FsbCh2YWx1ZSkpO1xuICB9XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIHJlSG9zdEN0b3IudGVzdCh2YWx1ZSk7XG59XG5cbi8qKlxuICogRXNjYXBlcyB0aGUgYFJlZ0V4cGAgc3BlY2lhbCBjaGFyYWN0ZXJzIFwiXFxcIiwgXCIvXCIsIFwiXlwiLCBcIiRcIiwgXCIuXCIsIFwifFwiLCBcIj9cIixcbiAqIFwiKlwiLCBcIitcIiwgXCIoXCIsIFwiKVwiLCBcIltcIiwgXCJdXCIsIFwie1wiIGFuZCBcIn1cIiBpbiBgc3RyaW5nYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gZXNjYXBlLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgZXNjYXBlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZXNjYXBlUmVnRXhwKCdbbG9kYXNoXShodHRwczovL2xvZGFzaC5jb20vKScpO1xuICogLy8gPT4gJ1xcW2xvZGFzaFxcXVxcKGh0dHBzOlxcL1xcL2xvZGFzaFxcLmNvbVxcL1xcKSdcbiAqL1xuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cmluZykge1xuICBzdHJpbmcgPSBiYXNlVG9TdHJpbmcoc3RyaW5nKTtcbiAgcmV0dXJuIChzdHJpbmcgJiYgcmVIYXNSZWdFeHBDaGFycy50ZXN0KHN0cmluZykpXG4gICAgPyBzdHJpbmcucmVwbGFjZShyZVJlZ0V4cENoYXJzLCAnXFxcXCQmJylcbiAgICA6IHN0cmluZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHJvdG8gPSBFbGVtZW50LnByb3RvdHlwZTtcbnZhciB2ZW5kb3IgPSBwcm90by5tYXRjaGVzXG4gIHx8IHByb3RvLm1hdGNoZXNTZWxlY3RvclxuICB8fCBwcm90by53ZWJraXRNYXRjaGVzU2VsZWN0b3JcbiAgfHwgcHJvdG8ubW96TWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLm1zTWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLm9NYXRjaGVzU2VsZWN0b3I7XG5cbm1vZHVsZS5leHBvcnRzID0gbWF0Y2g7XG5cbi8qKlxuICogTWF0Y2ggYGVsYCB0byBgc2VsZWN0b3JgLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gbWF0Y2goZWwsIHNlbGVjdG9yKSB7XG4gIGlmICh2ZW5kb3IpIHJldHVybiB2ZW5kb3IuY2FsbChlbCwgc2VsZWN0b3IpO1xuICB2YXIgbm9kZXMgPSBlbC5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG5vZGVzW2ldID09IGVsKSByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59IiwiLypcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBFY29MZWFybmlhIHBsYXRmb3JtLlxuICpcbiAqIChjKSBZb3VuZyBTdWsgQWhuIFBhcmsgPHlzLmFobnBhcmtAbWF0aG5pYS5jb20+XG4gKlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICovXG5cblxuLyoqXG4gKiBFY29MZWFybmlhIHYwLjAuMVxuICpcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqICBUaGlzIGZpbGUgaW5jbHVkZXMgcmVmZXJlbmNlcyB0byBhbGwgaW50ZXJhY3RpdmUgY29tcG9uZW50cyBhbmQgY29yZSBkZXBlbmRlbmNpZXMuXG4gKlxuICogQGF1dGhvciBZb3VuZyBTdWsgQWhuIFBhcmtcbiAqIEBkYXRlIDUvMTQvMTVcbiAqL1xuXG52YXIgaXRlbWNvbnRleHQgPSByZXF1aXJlKCcuL2NvcmUvaXRlbWNvbnRleHQnKTtcbnZhciBQdWJTdWIgPSByZXF1aXJlKCcuLy4uL2NvbW1vbi9wdWJzdWInKS5QdWJTdWI7XG5cbi8vIEludGVyYWN0aXZlIENvbXBvbmVudHMuXG52YXIgQWN0aW9uQmFyID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2FjdGlvbmJhci5qc3gnKS5BY3Rpb25CYXJDb21wb25lbnQ7XG52YXIgRmVlZGJhY2sgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZmVlZGJhY2suanN4JykuRmVlZGJhY2tDb21wb25lbnQ7XG52YXIgU2VsZWN0UXVlc3Rpb24gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvcXVlc3Rpb25zL3NlbGVjdHF1ZXN0aW9uLmpzeCcpLlNlbGVjdFF1ZXN0aW9uQ29tcG9uZW50O1xudmFyIFRlbXBsYXRlQ29udGFpbmVyQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3RlbXBsYXRlY29udGFpbmVyJykuVGVtcGxhdGVDb250YWluZXJDb21wb25lbnQ7XG5cbi8vIEBub3RlIC0gdGhpcyBjYW4gYmUgZXh0ZXJuYWxpemVkIHRvIGFub3RoZXIganMgYnVuZGxlXG52YXIgTG9jYWxFdmFsdWF0b3IgPSByZXF1aXJlKCcuL2NvcmUvZXZhbHVhdG9yJykuTG9jYWxFdmFsdWF0b3I7XG5tb2R1bGUuZXhwb3J0cy5Mb2NhbEV2YWx1YXRvciA9IExvY2FsRXZhbHVhdG9yO1xudmFyIGV2YWx1YXRpb24gPSByZXF1aXJlKCcuL2V2YWx1YXRpb24vZXZhbHVhdGlvbicpO1xubW9kdWxlLmV4cG9ydHMuZXZhbHVhdGlvbiA9IGV2YWx1YXRpb247XG5cbm1vZHVsZS5leHBvcnRzLlB1YlN1YiA9IFB1YlN1Yjtcbm1vZHVsZS5leHBvcnRzLmNyZWF0ZUl0ZW1Db250ZXh0ID0gaXRlbWNvbnRleHQuY3JlYXRlSXRlbUNvbnRleHQ7XG5cbi8vIFRoZSBpbnRlcmFjdGl2ZSBjb21wb25lbnRzIG11c3QgYmUgZXhwb3J0ZWQsIG90aGVyd2lzZSB0aGUgQ29yZUNvbnRleHQgd2lsbFxuLy8gbm90IGJlIGFibGUgdG8gaW5zdGFudGlhdGUuXG5tb2R1bGUuZXhwb3J0cy5TZWxlY3RRdWVzdGlvbiA9IFNlbGVjdFF1ZXN0aW9uO1xubW9kdWxlLmV4cG9ydHMuVGVtcGxhdGVDb250YWluZXIgPSBUZW1wbGF0ZUNvbnRhaW5lckNvbXBvbmVudDtcbm1vZHVsZS5leHBvcnRzLkFjdGlvbkJhciA9IEFjdGlvbkJhcjtcbm1vZHVsZS5leHBvcnRzLkZlZWRiYWNrID0gRmVlZGJhY2s7XG5cbiJdfQ==
