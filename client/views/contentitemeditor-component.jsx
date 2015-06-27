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
 *  This file includes ContentItemEditorComponent and its dependent components.
 *  The ContentEditorComponent is used to author (create/edit) a content item.
 *
 * @author Young Suk Ahn Park
 * @date 4/29/15
 */
var React = require('react/addons');
var AceEditorComponent = require('./aceeditor-component.jsx').AceEditorComponent;

var contenteditor = require('./contenteditor-component.jsx');

var interactives = require('../interactives/interactives');

var internals = {};


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
        };
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
            componentModule: interactives,
            pubsub: new interactives.PubSub()
        };

        var evaluator = new interactives.LocalEvaluator(settings);
        interactives.evaluation.registerEvalEngines(evaluator);

        var el = document.getElementById('interactive-preview');
        try {

            this.itemContext = interactives.createItemContext(settings);
            this.itemContext.render(el);
        } catch (interactiveError) {
            el.innerHTML = 'Cannot preview: ' + interactiveError.toString();
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
                    <contenteditor.MetadataEditorComponent content={this.props.content} onContentUpdate={this.props.onContentUpdate} />
                </div>
                <div className="col s12" id="panel_source" style={this.styleForTabContent_('source')}>
                    <contenteditor.SourceEditorComponent content={this.props.content} onContentUpdate={this.props.onContentUpdate}  />
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
internals.ContentItemEditorComponent = React.createClass({
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
                    <a href="#" className="btn" onClick={this.handleClickSave}>Save</a>
                    <a href="#" className="btn">Revert</a>
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

module.exports.ContentItemEditorComponent = internals.ContentItemEditorComponent;