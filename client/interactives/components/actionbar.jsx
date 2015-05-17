/**
 * Created by ysahn on 5/13/15.
 */
var React = require('react/addons');

/** @jsx React.DOM */

var internals = {};

internals.ActionBarComponent = React.createClass({

    getInitialState: function () {
        return {
            content: this.props.contentModel.toJSON()
        }
    },

    renderItem: function(type) {
        var retval = null;
        if (type == 'audio') {
            retval = <div><a href="audio">audio-icon</a></div>
        }
        return retval;
    },

    render: function() {

    	var actionbarItems = this.props.config.items.map(function(item) {
            return (
                <li>{renderItem(item)}</li>
            )
        });

		// The "eli" prefix in the className stands for EcoLearnia Interactive
        return (
            <div className="eli-actionbar">
                <ul >
	                <li className="eli-actionbar-item">
                        {actionbarItems}
	                </li>
                </ul>
            </div>
        );
    }
});


module.exports.ActionBarComponent = internals.ActionBarComponent;