/*
 * This file is part of the EcoLearnia platform.
 *
 * (c) Young Suk Ahn Park <ys.ahnpark@mathnia.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

_ = require('lodash');


/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of SubmissionHandler class.
 *
 * @author Young Suk Ahn Park
 * @date 6/02/15
 */

/**
 * @class SubmissionHandler
 *
 * @module interactives/core
 *
 * @classdesc
 *  An object of this class is handles the submission data by:
 *  - saving the question field data to staging for submission
 *  - evaluating the submission using remote service
 *  - constraining submission based on policy
 *
 */
export class SubmissionHandler
{
    constructor(settings)
    {
        /**
         * The logger
         */
        this.logger_ = logger.getLogger('SubmissionHandler');

        /**
         * Object that includes fields staged for submission
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

        // initialize staged by creating empty slots for the fields
        if (settings.models.question && settings.models.question.fields)
        {
            this.staged_ = [];
            settings.models.question.fields.forEach( function(element, index) {
                this.staged_.push( { fieldId: element.id } );
            });

            this.history_ = [];
        }

        /**
         * Evaluator
         */
        this.evaluator_ = settings.evaluator;

        /**
         * Number of attempts allowed
         * @type {number}
         * @private
         */
        this.maxAttempts_ = settings.policy.maxAttempts;

        /**
         * For elapsed time (time-on-task) calculation
         * @type {Date}
         * @private
         */
        this.taskStartTime_ = new Date();

        this.logger_.info(
            {
                maxAttempts: this.maxAttempts_,
                taskStartTime: this.taskStartTime_
            },
            'SubmissionHandler constructor'
        );
    }


    /**
     * Save the input field to staging. At the moment of submission,
     *
     * The answeredKey is applicable for inputs which has associacion key,
     * E.g. select.
     *
     * @param fieldId       - the id of the field
     * @param answeredKey   - the key that student answered.
     * @param answeredValue - the value that student answered.
     */
    stageField(fieldId, answeredKey, answeredValue);
    {
        if (this.staged_ === null)
        {
            throw new Error('Model does not contain a question description');
        }

        var field = getStagedField(id);
        field.answeredKey = answeredKey;
        field.answeredValue = answeredValue;
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

    submit()
    {
        var promise = promiseutils.createPromise( function(resolve, reject) {
            var timestamp = new Date();
            var fields:_.clone
            (this.staged_, true);
            // @todo - make rest call to the evaluatorUrl_
            var timeSpent = (this.taskStartTime_ - timestamp) * 1000; // in seconds

            var evalArgs = {

                fields: fields
            };
            this.evaluator_.evaluate(evalArgs)
                .then(function (response) {

                    var submissionEntry = {
                        timestamp: timestamp.toISOString(),
                        timeSpent: timeSpent,
                        score: response.score,
                        fields: fields
                    };
                    this.history_.push(submissionEntry);
                    // Reset task start time
                    this.taskStartTime_ = new Date();

                    resolve(submissionEntry);
                })
                .catch(function (error) {
                    reject(error);
                })
                .finally(function () {
                    this.logger_.info(
                        'SubmissionHandler.submit():completed'
                    );
                });
        }.bind(this));

        return promise;
    }

}