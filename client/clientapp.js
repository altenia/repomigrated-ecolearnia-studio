/**
 * Created by ysahn on 4/7/15.
 */

var Router = require('ampersand-router');

var internals = {};

internals.ContentBrowserRouter = Router.extend({
    routes: {
        '': 'home',
        'content/:uuid': 'content',
    },

    home: function() {

    },

    content: function(uuid) {
        console.log('route:content-', uuid);

    }

});


module.exports.ContentBrowserRouter = internals.ContentBrowserRouter;

// Configure underscore template to use {{ }} instead of <% %>
//_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;