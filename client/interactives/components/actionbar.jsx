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
 *  This file includes the definition of ActionBarComponent class.
 *
 * @author Young Suk Ahn Park <ys.ahnpark@mathnia.com>
 * @date 5/13/15
 */
var React = require('react/addons');

/** @jsx React.DOM */

var internals = {};

/**
 * @class ActionBarComponent
 *
 * @module interactives/components
 *
 * @classdesc
 *  React based component that represents the action bar.
 *  An action bar is the the interactive which user use to trigger actions
 *  such as submitting, text to speech, requesting hint, navigating to related
 *  learning contents, etc.
 *
 * @todo - Implement!
 */
internals.ActionBarComponent = React.createClass({

    getInitialState: function ()
    {
        return {
            content: this.props.contentModel.toJSON()
        }
    },

    renderItem: function(type)
    {
        var retval = null;
        if (type == 'audio') {
            retval = <div><a href="audio">audio-icon</a></div>
        }
        return retval;
    },

    render: function()
    {
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