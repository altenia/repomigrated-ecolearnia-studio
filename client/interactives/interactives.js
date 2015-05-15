/**
 * Created by ysahn on 5/14/15.
 */

var corecontext = require('./core/corecontext');

// Inteactive Components

var ActionBar = require('./components/actionbar.jsx').ActionBarComponent;
var Feedback = require('./components/feedback.jsx').FeedbackComponent;
var MultiValueQuestion = require('./components/questions/multivaluequestion.jsx').MultiValueQuestionComponent;

module.exports.MultiValueQuestion = MultiValueQuestion;
module.exports.createCoreContext = corecontext.createCoreContext;

