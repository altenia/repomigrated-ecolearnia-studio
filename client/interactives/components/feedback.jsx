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
 *  This file includes the definition of FeedbackComponent class.
 *
 * @author Young Suk Ahn Park
 * @date 5/13/15
 */

var React = require('react/addons');

/** @jsx React.DOM */

var internals = {};

/**
 * @class FeedbackComponent
 *
 * @module interactives/components
 *
 * @classdesc
 *  React based component that represents the feedback.
 *  The feedback component is where the feedback messages including hints are
 *  displayed upon specific action.
 *
 * @todo - Implement!
 */
internals.FeedbackComponent = React.createClass({

    getInitialState: function ()
    {
        return {
            content: this.props.contentModel.toJSON()
        }
    },

    render: function()
    {

    }
});


module.exports.FeedbackComponent = internals.FeedbackComponent;