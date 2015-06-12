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
 *  This file includes definition of ContentTableItemComponent.
 *
 * @author Young Suk Ahn Park
 * @date 4/13/15
 */
var React = require('react/addons');

var internals = {};

internals.ContentTableItemComponent = React.createClass({

    render: function()
    {
        var contentNode = this.props.contentNode;
        return ([
            <td>{contentNode.uuid}</td>,
            <td><a href={"#content/"+contentNode.metadata.uuid}>{contentNode.metadata.title}</a></td>
        ])
    }
});

internals.ContentTableComponent = React.createClass({

    getInitialState: function ()
    {
        return {editing: null};
    },

    render: function()
    {
        var contentNodes = this.props.contentNodes;

        var tableRows = contentNodes.map(function(contentNode) {
            return (
                <tr>
                    <td><a href={"#content/" + contentNode.uuid}>{contentNode.uuid}</a></td>
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