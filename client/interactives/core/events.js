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
 *  This file includes the definition of Event constants.
 *
 * @author Young Suk Ahn Park
 * @date 6/06/15
 */

var Events = {
    // When user clicks 'submit' button
    ACTION_SUBMIT: 'action:submit',
    // When AnswerModel request evaluation
    ANSWER_EVALUATE: 'answer:evaluate',
    // WHen Evaluator completed evaluation
    ANSWER_EVALUATED: 'answer:evaluated'
};

module.exports.Events = Events;