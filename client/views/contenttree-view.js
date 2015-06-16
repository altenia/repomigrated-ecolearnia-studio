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
 *  This file includes definition of ContentTreeView.
 * @see http://jsfiddle.net/ssorallen/XX8mw/
 *
 * @author Young Suk Ahn Park
 * @date 4/9/15
 */
var AmpersandView = require ('ampersand-view');
//var React = require('react');
var React = require('react/addons');
var ContentTreeComponent = require ('./contenttree-component.jsx').ContentTreeComponent;

var internals = {};

internals.ContentTreeView = AmpersandView.extend({
    // Not needed:
    template: '<div data-hook="content_tree" class="content-tree"></div>',

    initialize: function(options) {
        console.log("ContentTreeView options are:", options);
        this.siteBaseUrl = options.siteBaseUrl
    },

    render: function ()
    {
        //this.renderWithTemplate(this);
        var contentComponent = React.createElement(
            ContentTreeComponent,
            {
                node: this.model.toJSON(),
                siteBaseUrl: this.siteBaseUrl
            }
        );
        React.render(contentComponent, this.el);
        return this;
    },

});

module.exports.ContentTreeView = internals.ContentTreeView;