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
 *  This file includes the definition of CoreContext class.
 *
 * @author Young Suk Ahn Park
 * @date 5/13/15
 */

var utils = require('../../common/utils');
var SubPub = require('./subpub');

var React = require('react/addons');

var internals = {};


/**
 * @class CoreContext
 *
 * @module interactives/core
 *
 * @classdesc
 *  Content Runtime Environment's (Core) Context.
 *  A CoreContext manages the overall lifecycle and interaction of the
 *  components specified in the content.
 *  Based on the content specification, it creates the components and renders
 *  them as needed.
 *  Besides the components, it also has the references to the subpub for event
 *  delivery.
 *
 *  The object of this class is created using the factory method createCoreContext().
 *
 * @constructor
 *
 * @param {object} settings
 *
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
    if (settings.componentModule) {
        this.componentModule_ = settings.componentModule;
    }
    else if (settings.componentNamespace) {
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

/*** Static methods ***/

/**
 *
 * @param fqn
 * @returns {object}
 *      Format: { domain: <models|components>, id: (string) }
 */
internals.CoreContext.parseFqn = function(fqn)
{
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
 * Sets the content.
 * Triggers re-rendering.
 *
 * @todo - Trigger re-rendering
 *
 * @param {object} content
 */
internals.CoreContext.prototype.setContent = function(content)
{
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
internals.CoreContext.prototype.getValue = function(param)
{
    var retval = param;
    // If it contains a local reference, get the object it points to.
    if (param._lref)
    {
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
internals.CoreContext.prototype.resolveObject = function(fqn)
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
 * mapifyComponentSpecs_
 * @private
 *
 * Initializes the componentSpec map. Converts the content.components array into map
 * @param content
 *
 * @return {Object.<string, Object>}
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
 *
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
        contentModels: this.content_.models,
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
 * renderComponent
 *
 * Renders the component to specific DOM element
 *
 * @param {string} param  - The component or the component id
 * @param {DOM} el  - DOM element to render the component
 * @return {DOM}  - The el
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
 * render
 *
 * Renders the main component on the element
 *
 * @param {DOM} el
 *
 * @returns {DOM}
 */
internals.CoreContext.prototype.render = function(el)
{
    if (!this.content_ || !this.content_.components) {
        throw Error('No component was specified');
    }
    var mainComponentId = this.content_.components[0].id;
    return this.renderComponent(mainComponentId, el);
};

/**
 * createCoreContext
 *
 * Factory method to create a CoreContext
 *
 * @return {CoreContext}
 */
internals.createCoreContext = function(settings)
{
    return new internals.CoreContext(settings);
};

module.exports.CoreContext = internals.CoreContext;

module.exports.createCoreContext = internals.createCoreContext;