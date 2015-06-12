/**
 * Created by ysahn on 4/7/15.
 */

var React = require('react/addons');

var PubSub = require('./common/pubsub').PubSub;

var DialogComponent = require('./views/dialog-component.jsx').DialogComponent;
var ContentService = require('./services/content-service').ContentService;


var internals = {};


internals.appInstance = null;

internals.App = function(settings)
{
    this.settings = settings;
    this.rootUrl = this.settings.rootUrl || 'http://localhost:9099';

    this.contentService_ = null;

    this.pubsub = new PubSub();
}

internals.App.prototype.initMessageDialog = function(el)
{
    var messageDialogComponent = React.createElement(DialogComponent, { pubsub: this.pubsub});
    var messageDialogEl = document.getElementById('message-dialog');
    React.render(messageDialogComponent, messageDialogEl);

    return messageDialogComponent;
};

internals.App.prototype.showMessageDialog = function(title, body)
{
    this.pubsub.publishRaw('dialog', {show:true, title:title, body: body});
};

internals.App.prototype.hideMessageDialog = function()
{
    this.pubsub.publishRaw('dialog', {show:false});
};

internals.App.prototype.getContentService = function()
{
    if (!this.contentService_) {
        this.contentService_ = new ContentService({rootUrl: this.rootUrl});
    }
    return this.contentService_;
};

internals.init = function(settings)
{
    internals.appInstance = new internals.App(settings);
    return internals.appInstance;
};

module.exports.init = internals.init;


module.exports.instance = internals.appInstance;
