/**
 * Created by ysahn on 4/7/15.
 */
var $ = require('jquery');
var contentnodemodel = require('../models/contentnode');

/** Declaration of internal namespace */
var internals = {};

/**
 *
 * @constructor
 */
internals.ContentService = function(config)
{
    this.baseUrl = config.baseUrl;

};

internals.ContentService.prototype.queryNodes = function(criteria)
{

    var deferred = $.Deferred();

    var contentNodes = contentnodemodel.createContentNodeCollection(this.baseUrl + '/nodes');
    
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
        url: this.baseUrl + '/nodes'
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


internals.ContentService.prototype.fetchNode = function(uuid) {

    var deferred = $.Deferred();

    var contentNode = contentnodemodel.createContentNode(this.baseUrl + '/nodes', uuid);

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

module.exports.ContentService = internals.ContentService;
