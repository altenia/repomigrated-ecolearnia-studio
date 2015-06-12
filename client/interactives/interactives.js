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
 *  This file includes references to all interactive components and core dependencies.
 *
 * @author Young Suk Ahn Park
 * @date 5/14/15
 */

var itemcontext = require('./core/itemcontext');
var PubSub = require('./../common/pubsub').PubSub;

// Interactive Components.
var ActionBar = require('./components/actionbar.jsx').ActionBarComponent;
var Feedback = require('./components/feedback.jsx').FeedbackComponent;
var SelectQuestion = require('./components/questions/selectquestion.jsx').SelectQuestionComponent;
var TemplateContainerComponent = require('./components/templatecontainer').TemplateContainerComponent;

// @note - this can be externalized to another js bundle
var LocalEvaluator = require('./core/evaluator').LocalEvaluator;
module.exports.LocalEvaluator = LocalEvaluator;
var evaluation = require('./evaluation/evaluation');
module.exports.evaluation = evaluation;

module.exports.PubSub = PubSub;
module.exports.createItemContext = itemcontext.createItemContext;

// The interactive components must be exported, otherwise the CoreContext will
// not be able to instantiate.
module.exports.SelectQuestion = SelectQuestion;
module.exports.TemplateContainer = TemplateContainerComponent;
module.exports.ActionBar = ActionBar;
module.exports.Feedback = Feedback;

