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
 * @date 6/02/15
 */
var React = require('react/addons');
var EliReactComponent = require('../elireactcomponent').EliReactComponent;

/**
 * @class QuestionComponent
 *
 * @module interactives/components/questions
 *
 * @classdesc
 *  React based abstract component that represents a question.
 *  A question has one or more input fields where user can enter answer.
 *  Input fields can be of any type, e.g. textbox, slider, dropdown, etc.
 *
 *
 * @todo - Submission handling: keep the state in models
 * @todo - Factor out the presenter: multiselect, multichoice, etc.
 */
export class AbstractQuestionComponent extends EliReactComponent
{
    constructor(props)
    {
        super(props);

        this.state = {
            submitted: false
        }
    }

    stageSubmissionField(fieldId, answeredKey, answeredValue)
    {
        this.props.submissionEvaluator_.stageField(fieldId, answredKey, answeredValue);
    }
}
