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
 *  This file includes definition of ContentService proxy class.
 *
 * @author Young Suk Ahn Park
 * @date 4/7/15
 */
//var $ = require('jquery');
var promiseutils = require('../common/promiseutils');
var contentnodemodel = require('../models/contentnode');
var contentitemmodel = require('../models/contentitem');

/** Declaration of internal namespace */
var internals = {};

/**
 *
 * @param config
 * @constructor
 */
internals.ContentService = function(config)
{
    this.rootUrl = config.rootUrl;

};

/**
 * queryNodes
 *
 * Retrieves content nodes
 *
 * @param criteria
 * @returns {Promise}
 */
internals.ContentService.prototype.queryNodes = function(criteria)
{
    var promise = promiseutils.createPromise( function(resolve, reject) {

        var contentNodes = contentnodemodel.createContentNodeCollection(this.rootUrl + '/nodes');

        function successCallback(collection, response, options) {
            resolve(collection);
        }

        function errorCallback(collection, response, options) {
            if (response.body)
            {
                reject(response);
            } else {
                var error = new Error('Communication error');
                reject(error);
            }
        }

        contentNodes.fetch({
            //data: {page: 3},
            success: successCallback,
            error: errorCallback
        });

    }.bind(this));

    return promise;
};

/**
 * fetchNode
 *
 * Fetches a node and its descendants
 *
 * @param uuid
 * @returns {Promise}
 */
internals.ContentService.prototype.fetchNode = function(uuid)
{

    var promise = promiseutils.createPromise( function(resolve, reject) {

        var contentNode = contentnodemodel.createContentNode(this.rootUrl + '/nodes', uuid);

        function successCallback(model, response, options)
        {
            resolve(model);
        }

        function errorCallback(model, response, options)
        {
            if (response.body)
            {
                reject(response);
            } else {
                var error = new Error('Communication error');
                reject(error);
            }
        }

        contentNode.fetch({
            success: successCallback,
            error: errorCallback
        });

    }.bind(this));

    return promise;
};

/**
 * queryItems
 *
 * Retrieves content items
 *
 * @param {Object} criteria
 * @param {!string} parentNodeUuid
 *
 * @return {Promise}
 */
internals.ContentService.prototype.queryItems = function(criteria, parentNodeUuid)
{
    var deferred = $.Deferred();

    var baseUrl;
    if (parentNodeUuid) {
        baseUrl = this.rootUrl + '/nodes' + parentNodeUuid + '/items';
    } else {
        baseUrl = this.rootUrl + '/contentitems';
    }

    var contentItem = contentitemmodel.createContentItem(this.rootUrl + '/nodes', uuid);

    function successCallback(model, response, options) {
        deferred.resolve(model);
    }

    function errorCallback(model, response, options) {
        deferred.reject(model);
    }

    contentItem.fetch({
        success: successCallback,
        error: errorCallback
    });

    return deferred.promise();
};

/**
 * fetchItem
 *
 * Retrieves a single content item
 *
 * @param {string} uuid
 * @param {!string} parentNodeUuid
 *
 * @return {Promise}
 */
internals.ContentService.prototype.fetchItem = function(uuid, parentNodeUuid)
{
    var deferred = $.Deferred();

    var baseUrl;
    if (parentNodeUuid) {
        baseUrl = this.rootUrl + '/nodes' + parentNodeUuid + '/items';
    } else {
        baseUrl = this.rootUrl + '/contentitems';
    }
    var contentItem = contentitemmodel.createContentItem(baseUrl, uuid);

    function successCallback(model, response, options) {
        deferred.resolve(model);
    }

    function errorCallback(model, response, options) {
        deferred.reject(model);
    }

    contentItem.fetch({
        success: successCallback,
        error: errorCallback
    });

    return deferred.promise();
};

module.exports.ContentService = internals.ContentService;
