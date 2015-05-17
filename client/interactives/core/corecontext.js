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
    this.componentModule_ = global;
    if (settings.componentNamespace) {
        this.componentModule_ = global[settings.componentNamespace];
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

// Static method

/**
 *
 * @param fqn
 * @returns {object}
 *      Format: { domain: <models|components>, id: (string) }
 */
internals.CoreContext.parseFqn = function(fqn) {
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

/**
 * getValue
 *
 * Returns the parameter itself unless it contains a local reference which is
 * a fully qualified name (fqn) of a model object or component object
 *
 * @param param  - the parameter which could be the value itself
 *      or may be an object which contains "_lref" denoting a local fully
 *      qualified name to where the actual value is.
 */
internals.CoreContext.prototype.getValue = function(param)
{
    var retval = param;
    // If it contains a local reference, get the object it points to.
    if (param._lref)
    {
        retval = this.getObjectFromFqn(param._lref);
    }
    return retval;
};

/**
 * getObjectFromFqn
 * Returns the model object or component object
 *
 * @param fqn  - the Fully Qualified Name of the object
 */
internals.CoreContext.prototype.getObjectFromFqn = function(fqn)
{
    var retval;
    // if it starts with '.model' returns the JSON object,
    if (utils.startsWith(fqn, '.model'))
    {
        var refPath = fqn.substring(8);
        retval = utils.dotAccess(this.content_.models, refPath);
    }

    // if it starts with '.component' returns the Component object\
    else if (utils.startsWith(fqn, '.component'))
    {
        var componentId = fqn.substring(12);
        retval = this.getComponent(componentId);
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
    if (!(spec.type in this.componentModule_)) {
        throw Error('Component ' + spec.type + ' not found in module');
    }
    var componentClass = this.componentModule_[spec.type];

    var componentType = componentClass.prototype.componentType();

    var constructorArg = {
        coreContext: this,
        models: this.content_.models,
        config: spec.config
    };

    var retval = null;
    if (componentType === 'react') {
        retval = React.createElement(componentClass, constructorArg);
    } else {
        retval = new componentClass(constructorArg);
    }

    return retval;
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
internals.CoreContext.prototype.renderComponent = function(param, el)
{
    // We are assuming that if the param is a string, then it is the
    // component id; otherwise is the component itself;
    var component = param;
    if (typeof param === 'string') {
        component = this.getComponent(param);
    }

    // Little hack so I can get the component type from Backbone's view or React.
    // React provides componentType() method through mixin
    var componentType = (component.componentType) ? component.componentType() : component.type.prototype.componentType();

    // @todo - Implement strategy pattern to handle different componentTypes
    if (componentType === 'react') {
        React.render(component, el);
    } else {
        component.render();
        el.appendChild(component.el);
    }

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