/**
 * Created by ysahn on 4/13/15.
 */
var React = require('react/addons');

/** @jsx React.DOM */
var internals = {};

internals.ContentListItemComponent = React.createClass({
    render: function() {
        var contentNode = this.props.contentNode;
        return <a href={contentNode.metadata.title}>{contentNode.uuid}</a>
    }
});

internals.ContentListComponent = React.createClass({
    getInitialState: function () {
        return {editing: null};
    },
    render: function() {
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