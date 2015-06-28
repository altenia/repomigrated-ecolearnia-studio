/**
 * Created by ysahn on 4/7/15.
 */

var React = require('react/addons');
var Router = require('ampersand-router');

var PubSub = require('./common/pubsub').PubSub;

var BreadcrumbsComponent = require('./views/breadcrumbs-component.jsx').BreadcrumbsComponent;
var DialogComponent = require('./views/dialog-component.jsx').DialogComponent;
var ContentService = require('./services/content-service').ContentService;


var internals = {};


internals.appInstance = null;

/**
 *
 * @param settings
 * @constructor
 */
internals.App = function(settings)
{
    this.settings = settings;
    this.rootUrl = this.settings.rootUrl || 'http://localhost:9099';

    this.contentService_ = null;

    this.pubsub = new PubSub();
};

/**
 * Creates a router which parses the URL after the # symbol
 *
 * @param extension
 * @returns {*}
 */
internals.App.prototype.createRouter = function(extension)
{
    var RouterClass = Router.extend(extension);
    return new RouterClass();
};

/**
 * NOT USED
 * @param el
 */
internals.App.prototype.initMessageDialog = function(el)
{
    var messageDialogComponent = React.createElement(DialogComponent, { pubsub: this.pubsub});
    var messageDialogEl = document.getElementById('message-dialog');
    React.render(messageDialogComponent, messageDialogEl);

    return messageDialogComponent;
};

/**
 * Registers a function that handles message rendering
 * @param {Function(message)} subscriber
 */
internals.App.prototype.registerMessageRenderer = function( subscriber )
{
    this.pubsub.subscribe('ui-message', function(message){
        subscriber(message.title, message.body, message.params);
    });
}

/**
 * Fires an event to show a message in the UI
 * @param {string} title  - The title of the message
 * @param {string} body  - The body of the message
 * @param {Object=} params  - Optional parameters
 */
internals.App.prototype.showMessage = function(title, body, params)
{
    this.pubsub.publishRaw('ui-message', {show:true, title:title, body: body, params: params});
};

/**
 * Fires an event to hide all the messages in the UI
 */
internals.App.prototype.hideMessage = function()
{
    this.pubsub.publishRaw('ui-message', {show:false});
};

/**
 * Cretaes breadcrumb component with given array of items
 * @param el
 * @param {Array<Object>} items
 */
internals.App.prototype.createBreadcrumbs = function(el, items)
{
    var breadcrumbsComponent = React.createElement(
        BreadcrumbsComponent,
        {
            items: items
        }
    );
    React.render(breadcrumbsComponent, el);
};

/**
 * Returns the content service
 * @returns {ContentService}
 */
internals.App.prototype.getContentService = function()
{
    if (!this.contentService_) {
        this.contentService_ = new ContentService({rootUrl: this.rootUrl});
    }
    return this.contentService_;
};

/***** static functions *****/

internals.init = function(settings)
{
    internals.appInstance = new internals.App(settings);
    return internals.appInstance;
};

module.exports.init = internals.init;


module.exports.instance = internals.appInstance;
