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
 *  This file includes MetadataEditorComponent and SourceEditorComponent.
 *  These components are shared used by ContentItemEditor and ContentNodeEditor
 *  components.
 *
 * @author Young Suk Ahn Park
 * @date 4/29/15
 */

var React = require('react');

/**
 * Requires page to have loaded
 * https://github.com/RubaXa/Sortable#react
 */


var internals = {};

const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move'
};

internals.SortableList = React.createClass({
    mixins: [SortableMixin],

    getInitialState: function() {
        return {
            items: this.props.items
        };
    },

    handleSort: function (/** Event */evt)
    {
        console.log(evt.oldIndex, evt.newIndex);
        this.props.onSort(evt.oldIndex, evt.newIndex);
    },

    render: function() {
        return <ul>{
            this.state.items.map(function (item) {
                return <li>{item.itemUuid}</li>
            })
        }</ul>
    }
});

module.exports = internals.SortableList;