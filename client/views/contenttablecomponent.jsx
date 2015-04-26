/**
 * Created by ysahn on 4/13/15.
 */
var React = require('react/addons');

/** @jsx React.DOM */
var internals = {};

internals.ContentTableItemComponent = React.createClass({
    render: function() {
        var contentNode = this.props.contentNode;
        return ([
            <td>{contentNode.uuid}</td>,
            <td>{contentNode.metadata.title}</td>
        ])
    }
});

internals.ContentTableComponent = React.createClass({
    getInitialState: function () {
        return {editing: null};
    },
    render: function() {
        var contentNodes = this.props.contentNodes;

        var tableRows = contentNodes.map(function(contentNode) {
            return (
                <tr>
                    <td>{contentNode.uuid}</td>
                    <td>{contentNode.metadata.title}</td>
                </tr>
            )
        });

        return (
            <table>
                <thead>
                    <tr>
                        <th width="20">Lc</th>
                        <th>Title</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </table>
        );
    }
});

module.exports.ContentTableComponent = internals.ContentTableComponent;