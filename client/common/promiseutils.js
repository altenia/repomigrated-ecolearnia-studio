/*
 * This file is part of the EcoLearnia platform.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes promise factory function.
 *  The createPromise() function provides abstraction to the promise implementation.
 *
 *  Usage example:
 *  var promise = promiseutils.createPromise(function(resolve, reject) {
 *      resolve(successObj);
 *      ...
 *      reject(errorObj);
 *  }.bind(this));
 *  return promise;
 *
 * @author Young Suk Ahn Park
 * @date 6/02/15
 */

// Declare internals namespace
var internals = {};

var Bluebird = require('bluebird');
internals.createBluebirdPromise = function(func)
{
    return new Bluebird(func);
};

/*
var when = require('when');
internals.createWhenPromise = function(func)
{
    return when.promise(func);
};

var Promise = require('promise');
internals.createSimplePromise = function(func)
{
    return new Promise(func);
};
*/

module.exports.createPromise = internals.createBluebirdPromise;

module.exports.props = Bluebird.props;