/**
 * Created by ysahn on 4/29/15.
 */
var React = require('react/addons');

/** @jsx React.DOM */

var internals = {};


internals.MetadataEditorComponent = React.createClass({
    getInitialState: function () {
        return {
            metadataText: JSON.stringify(this.props.content.metadata, null, 4)
        }
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

        return (
            <div>
                <textarea onChange={this.handleChange} onBlur={this.handleBlur}  value={metadataText} />
            </div>
        )
    },
    handleChange: function(event) {
        var metadataText = event.target.value;
        this.setState({metadataText: metadataText });
        try {
            var content = {
                metadata: JSON.parse(metadataText)
            }
            this.props.onContentUpdate(content);
        } catch (ex) {
            console.log(ex);
            return false;
        }
    },
    handleBlur: function(event) {
        var content = {
            metadata: JSON.parse(event.target.value)
        }
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

    render: function() {

        var contentText = this.state.contentText;
        
        var textAreaStyle = {
            height: '10em'
        }

        // If I use defaultValue updates from other component is no reflected here.
        return (
            <div>
                <textarea style={textAreaStyle} onChange={this.handleChange} onBlur={this.handleBlur} value={contentText} />
            </div>
        )
    },
    handleChange: function(event) {
        var contentText = event.target.value;
        this.setState({contentText: contentText });
        
    },
    handleBlur: function(event) {
        console.log('change');
        try {
            var content = JSON.parse(this.state.contentText);
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
    render: function() {
        var textAreaStyle = {
            height: '10em'
        }
        return (
            <div>
                <textarea style={textAreaStyle} readOnly="true" value={JSON.stringify(this.props.content, null, 4)} />
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
            content: this.props.contentModel.toJSON()
        }
    },

    render: function() {

        return (
            <div>
                <internals.TabsComponent content={this.state.content} onContentUpdate={this.updateContent} />
                <div>
                    <a href="#" className="button">Save</a> <a href="#" className="button">Revert</a>
                </div>
            </div>
        );
    },

    // Content related event handlers:

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

    saveContent: function(content)
    {
        this.props.contentModel.save();
    }

});

module.exports.ContentEditorComponent = internals.ContentEditorComponent;