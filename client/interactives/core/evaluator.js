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

var logger = require('../../common/logger');
var promiseutils = require('../../common/promiseutils');
var Events = require('./events').Events;

/**
 * @typedef {{
 *      fieldId: (number),
 *      answered: {
 *          key: (string | number),
 *          value: (string | number)
 *      }
 *      ?correctness: (number),  Applicable for evaluated response
 *      ?feedback: (string)
 * }} core.AnswerField
 *
 */

/**
 * @typedef {{
 *      timeSpent: (number),
 *      fields: (Array<core.AnswerField>)
 *
 *      ?score: (number),
 *      ?overallFeedback: (string)
 * }} core.AnswerSubmission
 *
 */


/**
 * @class Evaluator
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
export class LocalEvaluator
{
    constructor(settings)
    {
        /**
         * The logger
         */
        this.logger_ = logger.getLogger('Evaluator');

        this.pubsub = settings.pubsub;

        /**
         * Evaluation engines
         * @type {{}}
         * @private
         */
        this.engines_ = {};

        /**
         * evalRule
         * @type {{}}
         * @private
         */
        this.rules_ = {};

        // Subscribe to the submission action event
        this.pubsub.subscribe(Events.ANSWER_EVALUATE,
            this.handleEvaluateEvent_.bind(this)
        );
    }

    /**
     * Register an evaluator engine
     * @param name
     * @param engine
     */
    registerEngine(engine)
    {
        this.engines_[engine.name] = engine;
    }

    /**
     * Register rules per item
     * Applicable for in-memory evaluation (e.g. non remote)
     *
     * @param {string} itemId
     * @param {Object} rule
     */
    registerItem(itemContext)
    {
        var itemId = itemContext.getAssociationId();
        var rule = itemContext.getContent().evalRule;
        this.rules_[itemId] = rule;
    }

    /**
     * Retrieves a rule
     * @param itemId
     * @returns {Promise}
     */
    retrieveRule(itemId)
    {
        var promise = promiseutils.createPromise( function(resolve, reject) {
            if (itemId in this.rules_)
            {
                resolve(this.rules_[itemId]);
            } else {
                reject({error:'Eval rule for item ' + itemId + ' not found.'});
            }

        }.bind(this));

        return promise;
    }


    /**
     * Submits the staged for evaluation
     *
     * @param {string} itemId
     * @param {core.AnswerSubmission} payload
     *
     * @return {Promise}
     *      On Success: (core.AnswerSubmission)
     */
    evaluate(itemId, payload)
    {
        var promise = promiseutils.createPromise( function(resolve, reject) {

            // @todo - make rest call to the evaluatorUrl_
            // For remote call
            var evalArgs = {
                submissionContext: {
                    itemId: itemId
                },
                fields: payload.fields
            };

            // Local evaluation:
            this.retrieveRule(itemId)
                .then( function(rule) {

                    this.evaluateFields_(rule, payload.fields)
                        .then( function(result) {
                            // Retuning
                            var returnMessage = {
                                timeSpent: payload.timeSpent,
                                fields: result,
                                score: .5, // @todo
                                overallFeedback: '' // @todo
                            }
                            resolve(returnMessage);
                        }.bind(this))
                        .catch( function(error) {
                            reject(error);
                        });
                }.bind(this))
                .catch( function(error) {
                    reject(error);
                })
                .finally(function () {
                    this.logger_.info(
                        'LocalEvaluator.evaluate():completed'
                    );
                }.bind(this));

        }.bind(this));

        return promise;
    }

    /**
     * Evaluate all fields in the submitted answer
     *
     * @param {Object} rule
     * @param {Object} answer
     *
     * @returns {Promise}
     *      On Succss: (Array<core.AnswerField>)
     */
    evaluateFields_(rule, answer)
    {
        var promises = {};

        answer.forEach( function(answeredField) {
            var fieldRule = rule.fieldRules[answeredField.fieldId];

            promises[answeredField.fieldId] = this.engines_[fieldRule.engine].evaluate(fieldRule, answeredField.answered);
        }.bind(this));

        var promise = promiseutils.createPromise( function(resolve, reject) {

            promiseutils.props(promises)
                .then(function (result) {
                    var response = [];

                    answer.forEach( function(answeredField) {
                        // To the same answer structure, add  the correctness and feedback properties
                        var responseEntry = _.clone(answeredField, true);

                        responseEntry.correctness = result[answeredField.fieldId];
                        if (responseEntry.correctness) {
                            responseEntry.feedback = 'correct';
                        } else {
                            responseEntry.feedback = 'incorrect';
                        }
                        response.push(responseEntry);
                    }, this);

                    resolve(response);
                }.bind(this))
                .catch(function (error) {
                    reject(error);
                });

        }.bind(this));

        return promise;
    }


    /**
     * PubSub Event subscription handler
     *
     * @param message
     * @private
     */
    handleEvaluateEvent_(message)
    {
        var itemId = message.source.itemId;
        this.evaluate(itemId, message.payload)
            .then( function(result){
                this.pubsub.publish(
                    Events.ANSWER_EVALUATED,
                    itemId,
                    'evaluator',
                    'evaluation',
                    /** @type core.AnswerSubmission */ (result)
                );
                this.logger_.info({itemId: itemId}, 'Evaluation:published');
            }.bind(this))
            .catch( function (error) {
                this.logger_.info({itemId: itemId, error: error}, 'Evaluation:error');
            }.bind(this));
    }
}
