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

var React = require('react');

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
export class EliReactComponent extends React.Component
{
    constructor(props)
    {
        super(props);

        this.itemAssociationId_ = props.itemAssociationId;
        this.componentId_ = props.componentId;
    }

}

/**
 * Binds each of the methods to the this context
 * @see http://www.newmediacampaigns.com/blog/refactoring-react-components-to-es6-classes
 */
EliReactComponent.prototype.bind_ = function(...methods)
{
    methods.forEach( (method) => this[method] = this[method].bind(this) );
};

/**
 * Returns the ID of the item that this component pertains
 */
EliReactComponent.prototype.itemAssociationId = function()
{
    return this.itemAssociationId_;
};

/**
 * Returns the ID of this component instance
 */
EliReactComponent.prototype.componentId = function()
{
    return this.componentId_;
};

/**
 * Returns the kind of this component (react)
 * @returns {string}
 */
EliReactComponent.prototype.componentKind = function()
{
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

