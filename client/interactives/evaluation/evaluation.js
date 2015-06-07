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
 *  This file includes references to dependencies for evaluation.
 *
 * @author Young Suk Ahn Park
 * @date 6/05/15
 */

var MathExpressionEval = require('./mathexpressioneval').MathExpressionEval;
var RegexEval = require('./regexeval').RegexEval;

var internals = {};

internals.registerEvalEngines = function(evaluator)
{
	var matheval = new MathExpressionEval()
    evaluator.registerEngine(matheval);
    var regexeval = new RegexEval()
    evaluator.registerEngine(regexeval);
};


module.exports.registerEvalEngines = internals.registerEvalEngines;



