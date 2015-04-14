/**
 * Created by ysahn on 4/13/15.
 */
var React = require('react');

/** @jsx React.DOM */
var internals = {};

internals.ContentListItemComponent = React.createClass({
    render: function() {
        return <a href="http://venmo.com">Venmo</a>
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
                <ContentListItemComponent
                    contentNode = {contentNode}
                />
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