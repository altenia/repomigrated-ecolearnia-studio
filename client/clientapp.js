/**
 * Created by ysahn on 4/7/15.
 */

/*
var ContentService = require('./services/content-service').ContentService;

var contentService = new ContentService({baseUrl: 'http://localhost:9099'});
contentService.queryNodes()
    .done(function(data){
        console.log(data);
    });
*/
console.log("done");

// Configure underscore template to use {{ }} instead of <% %>
_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;