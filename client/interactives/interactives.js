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

var corecontext = require('./core/corecontext');

// Interactive Components.
var ActionBar = require('./components/actionbar.jsx').ActionBarComponent;
var Feedback = require('./components/feedback.jsx').FeedbackComponent;
var MultiValueQuestion = require('./components/questions/multivaluequestion.jsx').MultiValueQuestionComponent;
var TemplateContainerComponent = require('./components/templatecontainer').TemplateContainerComponent;

// The interactive components must be exported, otherwise the CoreContext will
// not be able to instantiate.
module.exports.MultiValueQuestion = MultiValueQuestion;
module.exports.TemplateContainer = TemplateContainerComponent;
module.exports.createCoreContext = corecontext.createCoreContext;

