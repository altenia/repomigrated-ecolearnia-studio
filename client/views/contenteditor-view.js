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
 *  This file includes definition of ContentEditorView.
 * @deprecated use conenteditorpante-component instead
 *
 * @author Young Suk Ahn Park
 * @date 4/29/15
 */
var AmpersandView = require ('ampersand-view');
//var React = require('react');
var React = require('react');

var lodash = require ('lodash');

var ContentItemEditorComponent = require ('./contentitemeditor-component.jsx').ContentItemEditorComponent;
var ContentNodeEditorComponent = require ('./contentnodeeditor-component.jsx').ContentNodeEditorComponent;

var internals = {};

internals.ContentEditorView = AmpersandView.extend({
    // Not needed:
    template: '<div data-hook="content_editor" class="content-tree"></div>',

    initialize: function(options)
    {
        console.log("ContentEditorView options are:", options);
        this.app = options.app;
        this.siteBaseUrl = options.siteBaseUrl;
    },

    render: function ()
    {
        var content =  this.model.toJSON();

        var component;
        if (content.kind === 'Assignment')
        {
            component = React.createElement(
                ContentNodeEditorComponent,
                {
                    app: this.app,
                    content: content,
                    siteBaseUrl: this.siteBaseUrl,
                    onSaveContent: this.saveContent.bind(this)
                }
            );
        } else {
            component = React.createElement(
                ContentItemEditorComponent,
                {
                    app: this.app,
                    content: content,
                    siteBaseUrl: this.siteBaseUrl,
                    onSaveContent: this.saveContent.bind(this)
                }
            );
        }

        React.render(component, this.el);
        return this;
    },

    saveContent: function(content)
    {
        var normalizedContent = lodash.cloneDeep(content);
        if (typeof normalizedContent.parent === 'object')
        {
            delete normalizedContent.parent;
            delete normalizedContent.__parentObject;
        }
        this.model.set(normalizedContent);
        this.model.save(normalizedContent, {
            success: function(result) {
                    this.app.showMessage('Save', 'Successful');
                }.bind(this),

            error: function(error) {
                    this.app.showMessage('Save Error', JSON.stringify(error));
                }.bind(this)
        });
    }

});

module.exports.ContentEditorView = internals.ContentEditorView;