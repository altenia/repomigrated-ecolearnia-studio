/**
 * Created by ysahn on 4/9/15.
 *
 * Based on sample using Backbone View with React
 * http://www.thomasboyt.com/2013/12/17/using-reactjs-as-a-backbone-view.html
 */
var AmpersandView = require ('ampersand-view');
//var React = require('react');
var React = require('react/addons');
var ContentTreeComponent = require ('./contenttree-component.jsx').ContentTreeComponent;

var internals = {};

/** @jsx React.DOM */
internals.ContentTreeView = AmpersandView.extend({
    // Not needed:
    template: '<div data-hook="content_tree" class="content-tree"></div>',

    initialize: function(options) {
        console.log("ContentTreeView options are:", options);
        this.siteBaseUrl = options.siteBaseUrl
    },

    render: function () {
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