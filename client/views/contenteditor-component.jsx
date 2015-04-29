/**
 * Created by ysahn on 4/29/15.
 */
var React = require('react/addons');

/** @jsx React.DOM */

var internals = {};


internals.MetadataEditorComponent = React.createClass({
    render: function() {
        var content = this.props.content;
        return (
            <div>
                <textarea onChange={this.handleChange} value={JSON.stringify(this.props.content, null, 4)} />
            </div>
        )
    },
    handleChange: function(event) {
        var content = JSON.parse(event.target.value);
        this.props.onContentUpdate(content);
    }
});

internals.SourceEditorComponent = React.createClass({
    render: function() {
        var content = this.props.content;
        return (
            <div>
                <textarea onChange={this.handleChange} value={JSON.stringify(this.props.content, null, 4)} />
            </div>
        )
    },
    handleChange: function(event) {
        var content = JSON.parse(event.target.value);
        this.props.onContentUpdate(content);
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
                        <p>Form based</p>
                    </div>
                    <div className={ 'content' + this.additionalClassForTab('preview')} id="panel_preview">
                        <p>Preview of the content (rendered using the presenters)</p>
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
                <internals.TabsComponent content={this.props.contentModel.toJSON()} onContentUpdate={this.updateContent} />
                <div>
                    <a href="#" className="button">Save</a> <a href="#" className="button">Revert</a>
                </div>
            </div>
        );
    },

    // Content related event handlers:

    updateContent: function(content)
    {
        // You may add callback as las parameter
        this.setState({content: content});
    },

    saveContent: function(content)
    {
        this.props.contentModel.save();
    }

});

module.exports.ContentEditorComponent = internals.ContentEditorComponent;