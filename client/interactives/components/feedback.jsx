/**
 * Created by ysahn on 5/13/15.
 */
var React = require('react/addons');

/** @jsx React.DOM */

var internals = {};

internals.FeedbackComponent = React.createClass({
    getInitialState: function () {
        return {
            content: this.props.contentModel.toJSON()
        }
    },

    render: function() {

    }
});


module.exports.FeedbackComponent = internals.FeedbackComponent;