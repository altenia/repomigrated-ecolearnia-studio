/**
 * Created by ysahn on 5/14/15.
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

