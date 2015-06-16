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
 *  This file includes definition of ContentCollectionView.
 *
 * @author Young Suk Ahn Park
 * @date 4/9/15
 */
var AmpersandCollectionView = require ('ampersand-collection-view');
var React = require('react/addons');
var ContentListComponent = require ('./contentlist-component.jsx').ContentListComponent;
var ContentTableComponent = require ('./contenttable-component.jsx').ContentTableComponent;

var internals = {};


internals.ContentCollectionView = AmpersandCollectionView.extend({
    //template: _.template(_.template($('#content-root-list-template').html()),
    template: '<div data-hook="content_root_list" class="content-root-list"></div>',

    initialize: function(options)
    {
        console.log("ContentCollectionView options are:", options);
        this.componentType = options.componentType || 'list';
    },

    render: function ()
    {
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