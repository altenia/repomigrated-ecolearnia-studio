/**
 * Created by ysahn on 4/7/15.
 */
var $ = require('jquery');
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
 * Retrieves content nodes
 * @param criteria
 * @returns {Promise}
 */
internals.ContentService.prototype.queryNodes = function(criteria)
{

    var deferred = $.Deferred();

    var contentNodes = contentnodemodel.createContentNodeCollection(this.rootUrl + '/nodes');
    
    function successCallback(collection, response, options) {
        deferred.resolve(collection);
    }

    function errorCallback(collection, response, options) {
        deferred.reject(collection);
    }

    contentNodes.fetch({ 
        //data: {page: 3},
        success: successCallback,
        error: errorCallback
    });

    return deferred.promise();

    /*
    // criteriaToQueryString(criteria);
    return $.ajax({
        url: this.rootUrl + '/nodes'
    })
        /*
        .done(function( data ) {
            if ( console && console.log ) {
                console.log( data );
            }
            deferred.resolve(data);
        });
        */
};

/**
 * Fetches a node and its descendants
 * @param uuid
 * @returns {*}
 */
internals.ContentService.prototype.fetchNode = function(uuid) {

    var deferred = $.Deferred();

    var contentNode = contentnodemodel.createContentNode(this.rootUrl + '/nodes', uuid);

    function successCallback(model, response, options) {
        deferred.resolve(model);
    }

    function errorCallback(model, response, options) {
        deferred.reject(model);
    }

    contentNode.fetch({
        success: successCallback,
        error: errorCallback
    });

    return deferred.promise();
}

/**
 * Retrieves content items
 * @param {Object} criteria
 * @param {!string} parentNodeUuid
 * @returns {*}
 */
internals.ContentService.prototype.queryItems = function(criteria, parentNodeUuid) {

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
}

/**
 *
 * @param {string} uuid
 * @param {!string} parentNodeUuid
 * @returns {Promise}
 */
internals.ContentService.prototype.fetchItem = function(uuid, parentNodeUuid) {

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
}

module.exports.ContentService = internals.ContentService;
