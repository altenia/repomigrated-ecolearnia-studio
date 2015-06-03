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
var EliReactComponent = require('../elireactcomponent').EliReactComponent;

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
export class SelectQuestionComponent extends EliReactComponent
{
    /*
    propTypes: {
        // Content Runtime Environment's context
        coreContext: React.PropTypes.object.isRequired,
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
    }

    render()
    {
        // Returns the object either from the config question value itself
        // Or from the reference to the model.
        var question = this.props.coreContext.getValue(this.props.config.question);

        var options = question.fields[0].options.map(function(option) {
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
}
