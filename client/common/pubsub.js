/*
 * This file is part of the EcoLearnia platform.
 *
 * (c) Young Suk Ahn Park <ys.ahnpark@mathnia.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

var Events = require('ampersand-events');

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of PubSub class.
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
 *  PubSub, the message bus.
 *  It wraps a third party subpub library.
 *
 * @todo - Implement!
 *
 * @constructor
 */
internals.PubSub = function(settings)
{
    // Using Backbone's event
    this.pubSub = Events.createEmitter();
};


/**
 * Add subscription
 *
 * @param {string} topic
 * @param {function} handler
 */
internals.PubSub.prototype.subscribe = function(topic, handler)
{
    this.pubSub.on(topic, handler);
}

/**
 * Removes subscription
 *
 * @param {string} topic
 * @param {function} handler
 */
internals.PubSub.prototype.unsubscribe = function(topic, handler)
{
    this.pubSub.off(topic, handler);
};

/**
 * Publish message
 *
 * @param {string} topic
 * @param {object} message
 */
internals.PubSub.prototype.publishRaw = function(topic, message)
{
    this.pubSub.trigger(topic, message);
};

/**
 * Publish message
 *
 * @param {string} topic
 * @param {string} sourceItemId
 * @param {string} sourceComponent
 * @param {object} payload
 */
internals.PubSub.prototype.publish = function(topic, sourceItemId, sourceComponentId, type, payload) {
    var message = {
        timestamp: new Date(),
        source: {
            itemId: sourceItemId,
            componentId: sourceComponentId
        },
        type: type,
        payload: payload
    };
    this.publishRaw(topic, message);
};

module.exports.PubSub = internals.PubSub;