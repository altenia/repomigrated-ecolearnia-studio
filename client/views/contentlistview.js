/**
 * Created by ysahn on 4/9/15.
 *
 * Sample using Backbone View with React
 * http://www.thomasboyt.com/2013/12/17/using-reactjs-as-a-backbone-view.html
 */
var View = require ('ampersand-view');
var React = require('react');
var ContentListComponent = require ('contentlistcomponent').ContentListComponent;

var internals = {};

/** @jsx React.DOM */
internals.ContentListView = AmpersandCollectionView.extend({
    //template: _.template(_.template($('#content-root-list-template').html()),
    template: '<div data-hook="content_root_list" class="content-root-list"></div>',

    render: function () {
        this.renderWithTemplate(this);
        React.renderComponent(new ContentListComponent({ contentNodes: this.collection}), this.$('.content-root-list').get(0));
        return this;
    },

});

module.exports.ContentListView = internals.ContentListView;