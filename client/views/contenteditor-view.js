/**
 * Created by ysahn on 4/29/15.
 *
 * Content editor view
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

    initialize: function(options) {
        console.log("ContentEditorView options are:", options);
        this.siteBaseUrl = options.siteBaseUrl
    },

    render: function () {
        //this.renderWithTemplate(this);
        var component = React.createElement(
            ContentEditorComponent,
            {
                contentModel: this.model,
                siteBaseUrl: this.siteBaseUrl
            }
        );
        React.render(component, this.el);
        return this;
    },

});

module.exports.ContentEditorView = internals.ContentEditorView;