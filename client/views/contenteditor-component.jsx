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
 *  This file includes ContentEditorComponent and its dependent components.
 *  The ContentEditorComponent is used to author (create/edit) a content
 *
 * @author Young Suk Ahn Park
 * @date 4/29/15
 */
var React = require('react/addons');
var AceEditorComponent = require('./aceeditor-component.jsx').AceEditorComponent;
var interactives = require('../interactives/interactives');

var internals = {};

/**
 * @class MetadataEditorComponent
 *
 * @classdesc
 *  React based class for editing content's metadata.
 *  Currently a simple JSON editor
 *
 * @todo - Make it a form based with validation
 */
internals.MetadataEditorComponent = React.createClass({

    getInitialState: function ()
    {
        return {
            metadataText: JSON.stringify(this.props.content.metadata, null, 4)
        };
    },

    componentWillReceiveProps: function(nextProps)
    {
        // Update state when property change was propagated
        this.setState({metadataText: JSON.stringify(nextProps.content.metadata, null, 4)});
        console.log('componentWillReceiveProps', nextProps);
    },

    render: function()
    {

        var metadataText = JSON.stringify(this.props.content.metadata, null, 4);
        if (this.state.metadataText !== metadataText)
        {
            metadataText = this.state.metadataText;
        }

        var elStyle = {
            height: '200px',
            border: '1px solid #888'
        };

        return (
            <div>
                <textarea style={elStyle} onChange={this.handleChange} onBlur={this.handleBlur}  value={metadataText} />
            </div>
        )
    },

    /**
     *
     * @param {Event} event
     */
    handleChange: function(event)
    {
        var metadataText = event.target.value;
        this.setState({metadataText: metadataText });
        try {
            var content = {
                metadata: JSON.parse(metadataText)
            };
            this.props.onContentUpdate(content);
        } catch (ex) {
            console.log(ex);
            return false;
        }
    },

    /**
     *
     * @param {Event} event
     */
    handleBlur: function(event)
    {
        var content = {
            metadata: JSON.parse(event.target.value)
        };
        this.props.onContentUpdate(content);
    }
});

/**
 * @class SourceEditorComponent
 *
 * @classdesc
 *  React based Component class for editing content (raw) source.
 *  Uses Ace editor.
 *
 * @todo - Disable navigating away when there is a syntax error in the source.
 */
internals.SourceEditorComponent = React.createClass({
    getInitialState: function ()
    {
        console.log('getInitialState');
        return {
            contentText: JSON.stringify(this.props.content, null, 4)
        }
    },

    componentWillReceiveProps: function(nextProps)
    {
        // Update state when property change was propagated, even originated 
        // from this same compontent
        this.setState({contentText: JSON.stringify(nextProps.content, null, 4)});
        console.log('componentWillReceiveProps', nextProps);
    },

    render: function()
    {

        var contentText = this.state.contentText;

        var elStyle = {
            display: 'block',
            margin: 'auto',
            width: '100%',
            height: '300px',
            border: '1px solid #888'
        };

        // If I use defaultValue updates from other component is no reflected here.
        // <textarea style={textAreaStyle} onChange={this.handleInputChange} onBlur={this.handleBlur} value={contentText} />
        return (
            <div>
                <AceEditorComponent  el="sourceBox" mode="javascript" onChange={this.handleInputChange} onBlur={this.handleInputBlur} value={contentText} />
            </div>
        );
    },

    /**
     * Handles the value change in the editor box
     * @param value
     */
    handleInputChange: function(value) {
        this.setState({contentText: value });
    },

    /**
     * Handles the editor blur in the editor box
     * @param value
     */
    handleInputBlur: function(value) {
        console.log('change');
        try {
            var content = JSON.parse(value);
            this.props.onContentUpdate(content);
        } catch (ex) {
            console.log(ex);
            return false;
        }
    }

});

/**
 * @class FormEditorComponent
 *
 * @classdesc
 *  React based compontent for editing using forms (Visual editor).
 *
 * @todo - Implement the form.
 */
internals.FormEditorComponent = React.createClass({
    render: function() {
        var body = this.props.content.body;

        var textAreaStyle = {
            height: '10em'
        }
        return (
            <div>
                <textarea style={textAreaStyle} onBlur={this.handleChange} value={JSON.stringify(body, null, 4)} />
            </div>
        )
    },
    handleChange: function(event) {
        var content = {
            body: JSON.parse(event.target.value)
        }
        this.props.onContentUpdate(content);
    }

});

/**
 * @class PreviewComponent
 *
 * @classdesc
 *  Component for previewing the Interactive UI
 *
 * @todo - Fix so the Backbone view based components are correctly synced.
 */
internals.PreviewComponent = React.createClass({

    componentDidMount: function() {
        var settings = {
            content: this.props.content.body,
            componentModule: interactives
        };

        var el = document.getElementById('interactive-preview');
        try {
            this.itemContext = interactives.createItemContext(settings);
            this.itemContext.render(el);
        } catch (interactiveError) {
            //el.innerHTML = 'Cannot preview: ' + interactiveError.toString();
        }
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.itemContext) {
            this.itemContext.setContent(nextProps.content.body);

            // This code syncs the React components but not BackboneView-based components
            // @todo - fix BackboneView-based components to sync
            var el = document.getElementById('interactive-preview');
            this.itemContext.render(el);
        }
    },

    render: function() {
        return (
            <div>
                <div id="interactive-preview"></div>
            </div>
        )
    }

});

/**
 * @class TabsComponent
 *
 * @classdesc
 *  Components that manages the tabs (Materialized-based)
 *  @see http://materializecss.com/tabs.html
 *
 */
internals.TabsComponent = React.createClass({

    getInitialState: function () {
        return {
            activeTab: this.props.activeTab ? this.props.activeTab : 'metadata'
        }
    },

    componentDidMount: function()
    {
        // @todo - insteadn of using selector, obtain the dom object directly from React
        //var el = this.getDOMNode();
        var tabsUl = $('ul.tabs');
        tabsUl.tabs();
    },

    additionalClassForTab_: function(tabName) {
        return (this.state.activeTab === tabName) ? ' active' : '';
    },

    styleForTabContent_: function(tabName) {
        var style = {
            display: (this.state.activeTab === tabName) ? 'block' : 'none'
        };
        return style;
    },

    handleClick: function(activateTab)
    {
        this.setState({activeTab: activateTab});
        return false;
    },

    render: function() {

        // Notice binding in onClick={this.handleClick.bind(this, 'metadata')
        // This is needed, otherwise the method will actually be called inline
        // instead of passing the function reference
        return (
            <div className="row">
                <div className="col s12">
                    <ul className="tabs">
                        <li className={ 'tab ' + this.additionalClassForTab_('metadata')}><a href  role="tab" onClick={this.handleClick.bind(this, 'metadata')} >Metadata</a></li>
                        <li className={ 'tab ' + this.additionalClassForTab_('source')}><a href  role="tab" onClick={this.handleClick.bind(this, 'source')} >Source</a></li>
                        <li className={ 'tab ' + this.additionalClassForTab_('form')}><a href={null} role="tab" onClick={this.handleClick.bind(this, 'form')} >Form</a></li>
                        <li className={ 'tab ' + this.additionalClassForTab_('preview')}><a href role="tab" onClick={this.handleClick.bind(this, 'preview')} >Preview</a></li>
                    </ul>
                </div>
                <div className="col s12" id="panel_metadata" style={this.styleForTabContent_('metadata')} >
                    <internals.MetadataEditorComponent content={this.props.content} onContentUpdate={this.props.onContentUpdate} />
                </div>
                <div className="col s12" id="panel_source" style={this.styleForTabContent_('source')}>
                    <internals.SourceEditorComponent content={this.props.content} onContentUpdate={this.props.onContentUpdate}  />
                </div>
                <div className="col s12" id="panel_form" style={this.styleForTabContent_('form')}>
                    <internals.FormEditorComponent content={this.props.content} onContentUpdate={this.props.onContentUpdate}  />
                </div>
                <div className="col s12" id="panel_preview" style={this.styleForTabContent_('preview')}>
                    <internals.PreviewComponent content={this.props.content}  />
                </div>
            </div>
        );
    }
});

/**
 * @class ContentEditorComponent
 *
 * @classdesc
 *  Component that encapsulates the overall content editing capabilities
 *  presented in different tabs.
 *
 * @type {*|Function}
 */
internals.ContentEditorComponent = React.createClass({
    getInitialState: function () {
        return {
            content: this.props.content
        }
    },

    render: function() {

        return (
            <div>
                <internals.TabsComponent content={this.state.content} onContentUpdate={this.updateContent} />
                <div>
                    <a href="#" className="button" onClick={this.handleClickSave}>Save</a> <a href="#" className="button">Revert</a>
                </div>
            </div>
        );
    },

    /* Content related event handlers: */

    /**
     * Update content in the state.
     */
    updateContent: function(partialContent)
    {
        // You may add callback as las parameter
        var content = this.state.content;

        for(var key in partialContent) {
            if (partialContent[key] !== undefined && partialContent[key] !== null) {
                content[key] = partialContent[key];
            }
        }

        this.setState({content: content});
    },

    /**
     * Handle "save" button click 
     */
    handleClickSave: function(e)
    {
        e.preventDefault();
        //var temp = this.props.contentModel.toJSON();
        //this.props.contentModel.save();
        this.props.onSaveContent(this.state.content);
    }

});

module.exports.ContentEditorComponent = internals.ContentEditorComponent;