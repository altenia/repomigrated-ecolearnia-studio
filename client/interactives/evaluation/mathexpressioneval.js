/*
 * This file is part of the EcoLearnia platform.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

//var math = require('mathjs');

var promiseutils = require('../../common/promiseutils');

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of MathExpressionEval class.
 *
 * @author Young Suk Ahn Park
 * @date 6/05/15
 */

/**
 * @class MathExpressionEval
 *
 * @module interactives/evaluation
 *
 * @classdesc
 *  Engine that evaluates Math expression.
 *  The internal engine is from http://mathjs.org/
 */
export class MathExpressionEval {

    constructor()
    {

    }

    /**
     *
     * @param params  - Evaluation rule param
     * @param input
     * @returns {boolean}
     */
    evaluate(params, input)
    {
        var promise = promiseutils.createPromise( function(resolve, reject) {
            if (!input || !input.value) {
                resolve(false);
            }
            var result = math.eval(params.epxression);

            resolve(result.toString() == input.value);
        }.bind(this));

        return promise;
    }
};

MathExpressionEval.prototype.name = 'mathexpression';