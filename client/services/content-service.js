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


module.exports.ContentService = internals.ContentService;
