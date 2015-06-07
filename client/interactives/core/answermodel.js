/*
 * This file is part of the EcoLearnia platform.
 *
 * (c) Young Suk Ahn Park <ys.ahnpark@mathnia.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of SubmissionHandler class.
 *
 * @author Young Suk Ahn Park
 * @date 6/02/15
 */

var _ = require('lodash');

var polyfills = require('../../common/polyfills');
var logger = require('../../common/logger');
var Events = require('./events').Events;


/**
 * @class AnswerModel
 *
 * @module interactives/core
 *
 * @classdesc
 *  Object of this class deals with student answer by:
 *  - saving the student answered fields to staging for submission
 *  - invoking the evaluator for the staged answer
 *
 */
export class AnswerModel
{
    constructor(settings)
    {
        /**
         * The logger
         */
        this.logger_ = logger.getLogger('AnswerModel');

        this.itemContext = settings.itemContext;

        this.pubsub = settings.itemContext.pubsub;


        /**
         * Object that includes fields staged for submission
         * [
         *  {
         *      fieldId: (string),
         *      answered: { key: (string), value: (string) } | []
         *  }
         * ]
         *
         * @type {Object}
         * @private
         */
        this.staged_ = null;

        /**
         * Array of objects that represents submissions
         * @type {Array<Object>}
         * @private
         */
        this.history_ = null;

        /**
         * Maximum number of allowed attempts
         * @type {number}
         * @private
         */
        this.maxAttempts_ = this.itemContext.content_.policy.maxAttempts || 3;

        // initialize staged_ property by creating empty slots for the fields
        if (settings.definition.question && settings.definition.question.fields)
        {
            this.staged_ = [];
            settings.definition.question.fields.forEach( function(element, index) {
                this.staged_.push( { fieldId: element.id } );
            }.bind(this));

            this.history_ = settings.submissions || [];
        }


        /**
         * For elapsed time (time-on-task) calculation
         * @type {Date}
         * @private
         */
        this.taskStartTime_ = new Date();

        // Subscribe to the submission action event
        this.pubsub.subscribe(Events.ACTION_SUBMIT,
            this.handleSubmitEvent_.bind(this)
        );

        // Subscribe to the evaluated event
        this.pubsub.subscribe(Events.ANSWER_EVALUATED,
            this.handleEvaluatedEvent_.bind(this)
        );

        this.logger_.info(
            {
                maxAttempts: this.maxAttempts_,
                taskStartTime: this.taskStartTime_
            },
            'SubmissionHandler constructed'
        );
    }


    /**
     * Add field answers to staging.
     *
     * The answeredKey is applicable for inputs which has association key,
     * E.g. select.
     *
     * @param fieldId       - the id of the field
     * @param answeredKey   - the key that student answered.
     * @param answeredValue - the value that student answered.
     */
    addStagedAnswer(fieldId, answeredKey, answeredValue)
    {
        if (this.staged_ === null)
        {
            throw new Error('Model does not contain a question description');
        }

        var field = this.getStagedField(fieldId);
        // @todo - Make it an array to accomodate multiple answers
        field.answered = {
            key: answeredKey,
            value: answeredValue
        };

        return field;
    }

    /**
     * Remove field answers from staging.
     *
     * @param fieldId
     * @param answeredKey
     * @returns {*}
     */
    removeStagedAnswer(fieldId, answeredKey)
    {
        if (this.staged_ === null)
        {
            throw new Error('Model does not contain a question description');
        }

        var field = this.getStagedField(fieldId);
        if (field.answered.key == answeredKey)

        // @todo - Make it an array to accomodate multiple answers
        field.answered = null;

        return field;
    }

    /**
     * Gets the staged fields
     *
     * @returns {Array<{fieldId: (string|number), answeredKey: (string|number), answeredValue: (string|number)
     *
     */
    getStagedFields()
    {
        return this.staged_;
    }

    getStagedField(id)
    {
        var field = this.staged_.find( function(element, index) {
            return (element.fieldId === id);
        });
        return field;
    }

    /**
     * Number of times the learner has attempted so far
     * @returns {number}
     */
    getNumAttempted()
    {
        return this.history_.length;
    }

    /**
     *
     */
    handleSubmitEvent_(message)
    {
        var itemId = message.source.itemId;

        if (this.getNumAttempted() >= this.maxAttempts_)
        {
            reject('NoMoreAllowedAttempts');
        }
        var timestamp = new Date();
        var payload = {
            fields: _.clone(this.getStagedFields(), true),
            timeSpent: (timestamp - this.taskStartTime_) * 1000 // in seconds
        };
        this.pubsub.publish(
            Events.ANSWER_EVALUATE,
            this.itemContext.getAssociationId(),
            'answerModel',
            'answer',
            payload
            );
    }

    handleEvaluatedEvent_(message)
    {
        var payload = message.payload;
        var submissionEntry = {
            timestamp: (new Date()).toISOString(),
            timeSpent: payload.timeSpent,
            score: payload.score,
            fields: payload.fields, // fields with feedback
            feedback: payload.overallFeedback
        };
        this.history_.push(submissionEntry);
        // Reset task start time
        this.taskStartTime_ = new Date();
    }
}