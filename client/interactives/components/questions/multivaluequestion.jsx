/**
 * Created by ysahn on 5/13/15.
 */
var React = require('react/addons');
var ReactEliComponentMixin = require('../reactmixin').ReactEliComponentMixin;

/** @jsx React.DOM */

var internals = {};

internals.MultiValueQuestionComponent = React.createClass({

    mixins: [ReactEliComponentMixin],

    propTypes: {
        // Content Runtime Environment's context
        coreContext: React.PropTypes.object.isRequired,
        // Content models
        contentModels: React.PropTypes.object.isRequired,
        // Component's settings
        config: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        return {
            models: this.props.contentModels
        }
    },

    render: function() {

        // Returns the object either from the config question value itself
        // Or from the reference to the model.
        var question = this.props.coreContext.getValue(this.props.config.question);

        var options = question.options.map(function(option) {
            return (
                <li className="eli-question-option"><input type="checkbox" name="answers" value={option.value} />{option.label}</li>
            )
        });

        // The "eli" prefix in the className stands for EcoLearnia Interactive
        return (
            <div className="eli-question">
                <span className="eli-question-prompt">{question.prompt}</span>
                <ul>
                    {options}
                </ul>
            </div>
        );
    }
});


module.exports.MultiValueQuestionComponent = internals.MultiValueQuestionComponent;