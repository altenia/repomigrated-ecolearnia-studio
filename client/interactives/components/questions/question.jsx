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
var React = require('react');
var EliReactComponent = require('../elireactcomponent').EliReactComponent;
var Events = require('../../core/events').Events;

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
        this.bind_('handleEvaluatedEvent_');

        this.props.itemContext.pubsub.subscribe(
            Events.ANSWER_EVALUATED,
            this.handleEvaluatedEvent_.bind(this)
        );

        this.state = {
            evaluation: {}
        };

    }

    handleEvaluatedEvent_(message)
    {
        if(message.source.itemId === this.itemAssociationId())
        {
            // do something
        }
    }

    /**
     * returns the option's value of a chosen field
     * @param question
     * @param fieldId
     * @param key
     * @returns {*}
     */
    getOptionValue(question, fieldId, key)
    {
        var field = question.fields.find( function(element, index) {
            return (element.id === fieldId);
        });
        if (!field) {
            return null;
        }
        var option = field.options.find( function(element, index) {
            return (element.key === key);
        });
        return option.value;
    }
}
