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
internals.ItemContext = function(settings)
{
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
    }
    else if (settings.componentNamespace) {
        this.componentModule_ = global[settings.componentNamespace];
        this.logger_.info({ componentNamespace: settings.componentNamespace} );
    }


    /**
     * ID used to retrieve the LearnerAssignmentItem, the content instance
     * with associated user/course.
     * The server uses the retrieved LearnerAssignmentItem to evaluate the
     * submission and append the result (activity).
     */
    this.associationId_ = settings.associationId || (Math.floor((Math.random() * 1000) + 1)).toString();

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
internals.ItemContext.parseFqn = function(fqn)
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
 * Gets the item association Id (aka itemId).
 *
 * @param {string} content
 */
internals.ItemContext.prototype.getAssociationId = function()
{
    return this.associationId_;
};


/**
 * Gets the content.
 *
 * @param {object} content
 */
internals.ItemContext.prototype.getContent = function()
{
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
internals.ItemContext.prototype.setContent = function(content)
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
internals.ItemContext.prototype.getValue = function(param)
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
internals.ItemContext.prototype.resolveObject = function(fqn)
{
    var retval;
    // if it starts with '.definition' returns the JSON object,
    if (utils.startsWith(fqn, '.definition'))
    {
        var refPath = fqn.substring('.definition'.length + 1);
        retval = utils.dotAccess(this.content_.definition, refPath);
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
internals.ItemContext.prototype.mapifyComponentSpecs_ = function(content)
{
    content.components.forEach(function(element, index, array) {
        if (element.id in this.componentSpecs_) {
            throw new Error('Duplicate component ID');
        }
        this.componentSpecs_[element.id] = element;
    }.bind(this));

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
internals.ItemContext.prototype.createComponent = function(spec, id)
{
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
    this.logger_.info(
        { componentKind: componentKind, type: spec.type, id: id},
        'Component created'
    );

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
internals.ItemContext.prototype.getComponent = function(id) {
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
internals.ItemContext.prototype.renderComponent = function(param, el)
{
    // We are assuming that if the param is a string, then it is the
    // component id; otherwise is the component itself;
    var component = param;
    if (typeof param === 'string') {
        component = this.getComponent(param);
    }

    // Little hack so I can get the component type from Backbone's view or React.
    // React provides componentKind() method through mixin
    var componentKind = (component.componentKind) ? component.componentKind() : component.type.prototype.componentKind();

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
internals.ItemContext.prototype.render = function(el)
{
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
internals.createItemContext = function(settings)
{
    return new internals.ItemContext(settings);
};

module.exports.ItemContext = internals.ItemContext;

module.exports.createItemContext = internals.createItemContext;