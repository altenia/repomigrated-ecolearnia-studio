/**
 * Created by ysahn on 4/9/15.
 *
 * Sample using Backbone View with React
 * http://www.thomasboyt.com/2013/12/17/using-reactjs-as-a-backbone-view.html
 */
var AmpersandCollectionView = require ('ampersand-collection-view');
//var React = require('react');
var React = require('react/addons');
var ContentListComponent = require ('./contentlistcomponent.jsx').ContentListComponent;
var ContentTableComponent = require ('./contenttablecomponent.jsx').ContentTableComponent;

var internals = {};

/** @jsx React.DOM */
internals.ContentCollectionView = AmpersandCollectionView.extend({
    //template: _.template(_.template($('#content-root-list-template').html()),
    template: '<div data-hook="content_root_list" class="content-root-list"></div>',

    initialize: function(options) {
        console.log("ContentCollectionView options are:", options);
        this.componentType = options.componentType || 'list';
    },

    render: function () {
        //this.renderWithTemplate(this);
        var contentComponent;
        if (this.componentType == 'list') {
            contentComponent = React.createElement(ContentListComponent, { contentNodes: this.collection.toJSON()});
        } else {
            contentComponent = React.createElement(ContentTableComponent, { contentNodes: this.collection.toJSON()});
        }
        React.render(contentComponent, this.el);
        return this;
    },

});

module.exports.ContentCollectionView = internals.ContentCollectionView;