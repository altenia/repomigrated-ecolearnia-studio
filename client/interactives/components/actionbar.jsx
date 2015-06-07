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
var EliReactComponent = require('./elireactcomponent').EliReactComponent;
var Events = require('../core/events').Events;


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
export class ActionBarComponent extends EliReactComponent
{
    constructor(props)
    {
        super(props);
        //this.bind_('handleAction_');

        this.state = {
            submitted: false
        }
    }

    handleAction_(type, e)
    {
        // e.preventDefault();
        this.props.itemContext.pubsub.publish(
            'action:' + type,
            this.itemAssociationId(),
            this.componentId(),
            type);
    }

    renderItem_(type)
    {
        var retval = null;
        if (type == 'tts') {
            retval = <div><a onClick={this.handleAction_.bind(this, 'tts')} >audio-icon</a></div>
        }
        if (type == 'submit') {
            retval = <div><button onClick={this.handleAction_.bind(this, 'submit')} >Submit</button></div>
        }
        if (type == 'reset') {
            retval = <div><a onClick={this.handleAction_.bind(this, 'reset')} >Reset</a></div>
        }
        if (type == 'hint') {
            retval = <div><a onClick={this.handleAction_.bind(this, 'hint')} >Hint</a></div>
        }
        return retval;
    }

    render()
    {
    	var actionbarItems = this.props.config.items.map(function(item) {
            return (
                <li>{this.renderItem_(item)}</li>
            )
        }.bind(this));

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
};
