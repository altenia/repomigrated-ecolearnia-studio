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
 *  This file includes utility functions.
 *
 * @author Young Suk Ahn Park
 * @date 5/15/15
 */

var internals = {};

/**
 * endsWith
 * Returns true if the str ends with the suffix, false otherwise.
 *
 * @param {string} str
 * @param {string} suffix
 */
module.exports.endsWith = function (str, suffix)
{
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};


/**
 * startsWith
 * Returns true if the str starts with the prefix, false otherwise.
 *
 * @param {string} str
 * @param {string} prefix
 * @param {number} position
 */
module.exports.startsWith = function (str, prefix, position)
{
    position = position || 0;
    return str.lastIndexOf(prefix, position) === position;
};


/**
 * Access an object using dot notation
 * When third parameter is provided, the function behaves as setter, otherwise behaves as getter
 *
 * Sample:
 *   utils.dotAccess(object, 'a.b.c', 'Hello World');
 *   var myval = utils.dotAccess(object, 'a.b.c');
 *   --> myval = 'Hello World'
 * source: http://stackoverflow.com/questions/6393943/convert-javascript-string-in-dot-notation-into-an-object-reference
 *
 * @param {object} obj  - The object to be accessed
 * @param {string} is  - The dot notation string
 * @param {*|undefined}  - if provided, this call is a setting call, otherwise getting call
 *
 * @return {*}   - The value
 */
module.exports.dotAccess = function (obj, is, value)
{
    if (typeof is == 'string')
        return module.exports.dotAccess(obj, is.split('.'), value);
    else if (is.length == 1 && value !==undefined)
        return obj[is[0]] = value;
    else if (is.length == 0)
        return obj;
    else
        return module.exports.dotAccess(obj[is[0]], is.slice(1), value);
};


/**
 * dotPopulate
 */
module.exports.dotPopulate = function (obj, values)
{
    for (var property in values) {
        if (values.hasOwnProperty(property)) {
            module.export.dotAccess(obj, property, values[property]);
        }
    }
};
