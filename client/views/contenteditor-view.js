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
 *  This file includes definition of ContentEditorView.
 *
 * @author Young Suk Ahn Park
 * @date 4/29/15
 */
var AmpersandView = require ('ampersand-view');
//var React = require('react');
var React = require('react/addons');
var ContentEditorComponent = require ('./contenteditor-component.jsx').ContentEditorComponent;

var internals = {};

/** @jsx React.DOM */

internals.ContentEditorView = AmpersandView.extend({
    // Not needed:
    template: '<div data-hook="content_editor" class="content-tree"></div>',

    initialize: function(options)
    {
        console.log("ContentEditorView options are:", options);
        this.siteBaseUrl = options.siteBaseUrl
    },

    render: function ()
    {
        //this.renderWithTemplate(this);
        var component = React.createElement(
            ContentEditorComponent,
            {
                content: this.model.toJSON(),
                siteBaseUrl: this.siteBaseUrl,
                onSaveContent: this.saveContent.bind(this)
            }
        );
        React.render(component, this.el);
        return this;
    },

    saveContent: function(content)
    {
        this.model.set(content);
        this.model.save();
    }

});

module.exports.ContentEditorView = internals.ContentEditorView;