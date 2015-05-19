/**
 * Created by ysahn on 4/29/15.
 */
var React = require('react/addons');
var AceEditorComponent = require('./aceeditor-component.jsx').AceEditorComponent;
var interactives = require('../interactives/interactives');

/** @jsx React.DOM */

var internals = {};


internals.MetadataEditorComponent = React.createClass({
    getInitialState: function () {
        return {
            metadataText: JSON.stringify(this.props.content.metadata, null, 4)
        };
    },
    componentWillReceiveProps: function(nextProps) {
        // Update state when property change was propagated
        this.setState({metadataText: JSON.stringify(nextProps.content.metadata, null, 4)});
        console.log('componentWillReceiveProps', nextProps);
    },

    render: function() {

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

    handleChange: function(event) {
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
    handleBlur: function(event) {
        var content = {
            metadata: JSON.parse(event.target.value)
        };
        this.props.onContentUpdate(content);
    }
});

internals.SourceEditorComponent = React.createClass({
    getInitialState: function () {
        console.log('getInitialState');
        return {
            contentText: JSON.stringify(this.props.content, null, 4)
        }
    },

    componentWillReceiveProps: function(nextProps) {
        // Update state when property change was propagated, even originated 
        // from this same compontent
        this.setState({contentText: JSON.stringify(nextProps.content, null, 4)});
        console.log('componentWillReceiveProps', nextProps);
    },

    componentDidMount: function() {
    },

    render: function() {

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

internals.PreviewComponent = React.createClass({

    componentDidMount: function() {
        var settings = {
            content: this.props.content.body,
            componentModule: interactives
        };

        this.coreContext = interactives.createCoreContext(settings);

        var el = document.getElementById('interactive-preview');
        this.coreContext.render(el);
    },

    componentWillReceiveProps: function(nextProps) {
        this.coreContext.setContent(nextProps.content.body);

        var el = document.getElementById('interactive-preview');
        this.coreContext.render(el);
    },

    render: function() {
        var textAreaStyle = {
            height: '10em'
        };
        return (
            <div>
                <div id="interactive-preview"></div>
            </div>
        )
    }

});

/**
 * Zurb Foundation based tabs
 * @type {*|Function}
 */
internals.TabsComponent = React.createClass({

    getInitialState: function () {
        return {
            activeTab: this.props.activeTab ? this.props.activeTab : 'metadata'
        }
    },

    additionalClassForTab: function(tabName) {
        return (this.state.activeTab === tabName) ? ' active' : '';
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
            <div>
                <dl className="tabs">
                    <dd className={ 'tab-title' + this.additionalClassForTab('metadata')}><a href role="tab" onClick={this.handleClick.bind(this, 'metadata')} >Metadata</a></dd>
                    <dd className={ 'tab-title' + this.additionalClassForTab('source')}><a href  role="tab" onClick={this.handleClick.bind(this, 'source')} >Source</a></dd>
                    <dd className={ 'tab-title' + this.additionalClassForTab('form')}><a href={null} role="tab" onClick={this.handleClick.bind(this, 'form')} >Form</a></dd>
                    <dd className={ 'tab-title' + this.additionalClassForTab('preview')}><a href role="tab" onClick={this.handleClick.bind(this, 'preview')} >Preview</a></dd>
                </dl>
                <div className="tabs-content">
                    <div className={ 'content' + this.additionalClassForTab('metadata')} id="panel_metadata">
                        <internals.MetadataEditorComponent content={this.props.content} onContentUpdate={this.props.onContentUpdate} />
                    </div>
                    <div className={ 'content' + this.additionalClassForTab('source')} id="panel_source">
                        <internals.SourceEditorComponent content={this.props.content} onContentUpdate={this.props.onContentUpdate}  />
                    </div>
                    <div className={ 'content' + this.additionalClassForTab('form')} id="panel_form">
                        <internals.FormEditorComponent content={this.props.content} onContentUpdate={this.props.onContentUpdate}  />
                    </div>
                    <div className={ 'content' + this.additionalClassForTab('preview')} id="panel_preview">
                        <internals.PreviewComponent content={this.props.content}  />
                    </div>
                </div>
            </div>
        );
    }
});


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