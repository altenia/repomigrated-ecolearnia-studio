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

var AmpersandView = require ('ampersand-view');

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
        // Content Runtime Environment's context
        coreContext: 'object',
        // Content models
        contentModels: 'object',
        // Component's settings
        config: 'object'
    },

    /**
     * Returns the type of this component (view)
     * @returns {string}
     */
    componentType: function()
    {
        return 'view';
    }
});

module.exports.EliViewComponent = internals.EliViewComponent;
