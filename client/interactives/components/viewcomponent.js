/**
 * Created by ysahn on 5/15/15.
 */

var AmpersandView = require ('ampersand-view');

var internals = {};

internals.ViewComponent = AmpersandView.extend({

    props: {
        // Content Runtime Environment's context
        coreContext: 'object',
        // Content models
        contentModels: 'object',
        // Component's settings
        config: 'object'
    },

    componentType: function() {
        return 'view';
    }
});

module.exports.ViewComponent = internals.ViewComponent;