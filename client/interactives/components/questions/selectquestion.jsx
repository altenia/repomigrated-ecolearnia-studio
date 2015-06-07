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
 *  This file includes the definition of MultiValueQuestionComponent class.
 *
 * @author Young Suk Ahn Park
 * @date 5/13/15
 */
var React = require('react/addons');
var AbstractQuestionComponent = require('./question.jsx').AbstractQuestionComponent;

var internals = {};

/**
 * @class MultiValueQuestionComponent
 *
 * @module interactives/components/questions
 *
 * @classdesc
 *  React based component that represents a generic multiValue question.
 *  A multivalue quesions are those which the question can ask for multiple
 *  values.
 *  Therefore the submission has the structure of
 *  Object.<key: string, value: Object>
 *
 * @todo - Submission handling: keep the state in models
 * @todo - Factor out the presenter: multiselect, multichoice, etc.
 */
export class SelectQuestionComponent extends AbstractQuestionComponent
{
    /*
    propTypes: {
        // Content Runtime Environment's context
        itemContext: React.PropTypes.object.isRequired,
        // Content models
        contentModels: React.PropTypes.object.isRequired,
        // Component's settings
        config: React.PropTypes.object.isRequired
    },*/
    constructor(props)
    {
        super(props);

        this.state = {
            submitted: false
        }

        this.bind_('handleChange_');
    }

    handleChange_(fieldId, key, e)
    {
        var checked = event.target.checked;
        var question = this.props.itemContext.getValue(this.props.config.question);

        if (checked) {
            var value = this.getOptionValue(question, fieldId, key);
            this.props.itemContext.answerModel.addStagedAnswer(fieldId, key, value);
        } else {
            this.props.itemContext.answerModel.removeStagedAnswer(fieldId, key);
        }
    }

    render()
    {
        // Returns the object either from the config question value itself
        // Or from the reference to the model.
        var question = this.props.itemContext.getValue(this.props.config.question);

        var optionsSet = [];
        question.fields.forEach( function(element, index){
            var options = element.options.map(function(option) {
                return (
                    <li className="eli-question-option">
                        <input type="checkbox" name={element.id} onChange={this.handleChange_.bind(this, element.id, option.key)} value={option.value} />
                        {option.value}
                    </li>
                )
            }.bind(this));
            optionsSet.push(
                <ul>
                    {options}
                </ul>);
        }.bind(this));


        // The "eli" prefix in the className stands for EcoLearnia Interactive
        return (
            <div className="eli-question">
                <span className="eli-question-prompt">{question.prompt}</span>
                {optionsSet}
            </div>
        );
    }
}
