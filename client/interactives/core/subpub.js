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
 *  This file includes the definition of SubPub class.
 *
 * @author Young Suk Ahn Park
 * @date 5/13/15
 */

var internals = {};

/**
 * @class SubPub
 *
 * @module interactives/core
 *
 * @classdesc
 *  SubPub, the message bus.
 *  It wraps a third party subpub library.
 *
 * @todo - Implement!
 *
 * @constructor
 */
internals.SubPub = function(settings)
{
};


/**
 * Add subscription
 *
 * @param {string} topic
 * @param {function} handler
 */
internals.SubPub.prototype.subscribe = function(topic, handler) {
};

/**
 * Removes subscription
 *
 * @param {string} topic
 * @param {function} handler
 */
internals.SubPub.prototype.unsubscribe = function(topic, handler) {
};

/**
 * Publish message
 *
 * @param {string} topic
 * @param {object} message
 */
internals.SubPub.prototype.publish = function(topic, message) {
};

module.exports.SubPub = internals.SubPub;