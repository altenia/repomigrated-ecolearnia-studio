/**
 * Created by ysahn on 5/13/15.
 */

var utils = require('../../common/utils');
var SubPub = require('./subpub');

var React = require('react/addons');

var internals = {};

/**
 * Content Runtime Environment's (Core) Context
 *
 * @param config
 * @constructor
 */
internals.CoreContext = function(settings)
{

    /**
     * SubPub: component than handles events
     */
    this.subpub_ = null;

    /**
     * Submission Evaluator: Handles submission for evaluation.
     */
    this.submissionEvaluator_ = null;

    /**
     * Decorator: Decorates UI components by adding styles.
     * @type {null}
     */
    this.decorator_ = null;

    /**
     * The namespace to look ro
     */
    this.comonentModule_ = global;
    if (settings.componentNamespace) {
        this.comonentModule_ = global[settings.componentNamespace];
    }

    /**
     * THe content which this context is operating on
     * @type {Object}
     */
    this.content_ = settings.content; // the content body

    /**
     *
     * @type {{}}
     * @private
     */
    this.componentSpecs_ = {};

    /**
     * Reference to components
     * @type {Object} Map wher keys are component ids and value are the Components
     */
    this.componentReferences_ = {};

    // Convert component spec from array to Object map
    // For efficient retrieval
    this.mapifyComponentSpecs_(this.content_);
};


/**
 * getObject
 * Returns the object by creating it or from reference from existing
 *
 * @param param
 */
internals.CoreContext.prototype.getObject = function(param)
{
    var retval = param;
    // If it contains a local reference, get the object it points to.
    if (param._lref)
    {
        // parse the dot notation

        // if it starts with '.model' returns the JSON object,
        if (utils.startsWith(param._lref, '.model'))
        {
            var refPath = param._lref.substring(8);
            retval = utils.dotAccess(this.content_.models, refPath);
        }

        // if it starts with '.component' returns the Component object\
        else if (utils.startsWith(param._lref, '.component'))
        {
            var componentId = param._lref.substring(12);
            retval = this.getComponent(componentId);
        }
    }
    return retval;
};


/**
 * Initializes the componentSpec map. Converts the content.components array into map
 * @param content
 * @returns {{}|*}
 * @private
 */
internals.CoreContext.prototype.mapifyComponentSpecs_ = function(content)
{
    content.components.forEach(function(element, index, array) {
        if (element.id in this.componentSpecs_) {
            throw Error('Duplicate component ID');
        }
        this.componentSpecs_[element.id] = element;
    }.bind(this));
    return this.componentSpecs_;
};

/**
 * Builds the components as specified in the spec
 *
 * @param {object} spec  - The specification of the components
 * @return {object}  The component instance (a React element)
 */
internals.CoreContext.prototype.createComponent = function(spec)
{
    if (!(spec.type in this.comonentModule_)) {
        throw Error('Component ' + spec.type + ' not found in module');
    }
    var componentClass = this.comonentModule_[spec.type];

    return React.createElement(componentClass, {
        coreContext: this,
        models: this.content_.models,
        config: spec.config
    });
};

/**
 * Returns the component instance.
 * Either returns the existing objec in the reference table, or creates
 * one, registers it and returns it.
 *
 * @param id
 * @returns {Object} The component instance (a React element)
 */
internals.CoreContext.prototype.getComponent = function(id) {
    if (!(id in this.componentReferences_)) {
        if (!(id in this.componentSpecs_)) {
            throw Error('Component ID not found');
        }
        this.componentReferences_[id] = this.createComponent(this.componentSpecs_[id]);
    }
    return this.componentReferences_[id];
};

/**
 * Renders the component to specific DOM element
 *
 * @param {string} id  - The component id
 * @param {DOM} el  - DOM element to render the component
 * @returns the el
 */
internals.CoreContext.prototype.renderComponent = function(id, el)
{
    var component = this.getComponent(id);

    React.render(component, el);

    return el;
};

/**
 * Factory method
 *
 * return context
 */
internals.createCoreContext = function(settings)
{
    return new internals.CoreContext(settings);
};

module.exports.CoreContext = internals.CoreContext;

module.exports.createCoreContext = internals.createCoreContext;