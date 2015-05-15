/**
 * Created by ysahn on 5/13/15.
 */

    // This class' functionality was subsumed by CoreContext
var internals = {};

/**
 * The factory class that builds instances of components.
 *
 * @param config
 * @constructor
 */
internals.Factory = function(settings)
{
    /**
     * The namespace to look ro
     */
    this.comonentModule_ = global;
    if (settings.componentNamespace) {
        this.comonentModule_ = global[settings.componentNamespace];
    }

    this.content_ = settings.content; // the content body

    this.componentSpecs_ = {};

    /**
     * Reference to components
     * @type {Object} Map wher keys are component ids and value are the Components
     */
    this.componentReferences_ = {};

    this.mapifyComponentSpecs_(this.content_);
};

/**
 * Initializes the componentSpec map. Converts the content.components array into map
 * @param content
 * @returns {{}|*}
 * @private
 */
internals.Factory.prototype.mapifyComponentSpecs_ = function(content) {
    content.components.forEach(function(element, index, array) {
        if (element.id in this.componentSpecs_) {
            throw Error('Duplicate component ID');
        }
        this.componentSpecs_[element.id] = element;
    });
    return this.componentSpecs_;
};

/**
 * Builds the components as specified in the spec
 *
 * @param {object} spec  - The specification of the components
 * @return {object}  The component instance (a React element)
 */
internals.Factory.prototype.createComponent = function(spec) {
    if (!spec.type in this.comonentModule_) {
        throw Error('Component ' + spec.type + ' not found in module');
    }
    var componentClass = this.comonentModule_[spec.type];

    return React.createElement(componentClass, {
        models: this.content.models,
        siteBaseUrl: this.siteBaseUrl
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
internals.Factory.prototype.getComponent = function(id) {
    if (!id in this.componentReferences_) {
        if (!id in this.componentSpecs_) {
            throw Error('Component ID not found');
        }
        this.componentReferences_[id] = this.buildComponent(this.componentSpecs_[id]);
    }
    return this.componentReferences_[id];
};

module.exports.Factory = internals.Factory;