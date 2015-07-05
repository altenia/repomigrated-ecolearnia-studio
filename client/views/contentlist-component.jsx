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
 *  This file includes definition of ContentListItemComponent.
 *
 * @author Young Suk Ahn Park
 * @date 4/13/15
 */
var React = require('react');

var internals = {};

internals.ContentListItemComponent = React.createClass({
    render: function() {
        var contentNode = this.props.contentNode;
        return <a href={contentNode.metadata.title}>{contentNode.uuid}</a>
    }
});

internals.ContentListComponent = React.createClass({

    getInitialState: function ()
    {
        return {editing: null};
    },

    render: function()
    {
        var contentNodes = this.props.contentNodes;

        var listItems = contentNodes.map(function(contentNode) {
            return (
                <li><internals.ContentListItemComponent
                    contentNode = {contentNode}
                /></li>
            )
        });

        return (
            <div>
                <header id="header">
                </header>
                <ul id="content-node-list">
                    {listItems}
                </ul>
            </div>
        );
    }
});

module.exports.ContentListComponent = internals.ContentListComponent;