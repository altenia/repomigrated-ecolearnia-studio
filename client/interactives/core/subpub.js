/**
 * Created by ysahn on 5/13/15.
 */


var internals = {};

/**
 * SubPub, message bus.
 *
 * @param config
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