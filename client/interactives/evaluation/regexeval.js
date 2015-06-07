/*
 * This file is part of the EcoLearnia platform.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

var promiseutils = require('../../common/promiseutils');

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of EvalRegex class.
 *
 * @author Young Suk Ahn Park
 * @date 6/05/15
 */

/**
 * @class EvalRegex
 *
 * @module interactives/evaluation
 *
 * @classdesc
 *  Engine that evaluates regex expression.
 *
 */
export class RegexEval {

    constructor()
    {
        
    }

    /**
     *
     * @param params  - Evaluation rule param
     * @param {Object{key, value}} input
     *
     * @returns {Promise(boolean)}
     */
    evaluate(params, input)
    {
        var promise = promiseutils.createPromise( function(resolve, reject) {
            if (!input || !input.value) {
                resolve(false);
            }
            var re = RegExp('^' + params.pattern + '');
            var result = re.test(input.value);
            resolve(result);
        }.bind(this));

        return promise;
    }
}

RegexEval.prototype.name = 'regex';