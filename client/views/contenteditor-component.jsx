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
 *  This file includes MetadataEditorComponent and SourceEditorComponent.
 *  These components are shared used by ContentItemEditor and ContentNodeEditor
 *  components.
 *
 * @author Young Suk Ahn Park
 * @date 4/29/15
 */
var React = require('react/addons');
var deepEqual = require('deep-equal');
var utils = require('../common/utils');

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
            metadata: this.props.content.metadata,
            metadataText: JSON.stringify(this.props.content.metadata, null, 4)
        };
    },

    componentWillReceiveProps: function(nextProps)
    {
        // Update state when property change was propagated from outside
        this.setState({metadataText: JSON.stringify(nextProps.content.metadata, null, 4)});
        this.setState({metadata: nextProps.content.metadata});
        console.log('componentWillReceiveProps', nextProps);
    },

    render: function()
    {
        var metadata = this.props.content.metadata || {};
        if (!deepEqual(this.state.metadata, this.props.content.metadata))
        {
            metadata = this.state.metadata;
        }

        var metadataText = JSON.stringify(this.props.content.metadata, null, 4);
        // Keep the edited metadata
        if (this.state.metadataText !== metadataText)
        {
            metadataText = this.state.metadataText;
        }

        var elStyle = {
            height: '200px',
            border: '1px solid #888'
        };

        return (
            <div className="row">
                <h4>{metadata.title}</h4>
                <form className="col s12">
                    <div className="row">
                        <div className="input-field col s12">
                            <input value={metadata.title} type="text" onChange={this.handleChange_.bind(this, false, 'title')}
                                   className="validate" placeholder="The title of the content" />
                            <label for="title" className={this.activeLabel_('title')} >Title</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6">
                            <input value={metadata.license} type="text" onChange={this.handleChange_.bind(this, false, 'license')}
                                   className="validate" placeholder="License" />
                            <label for="license" className={this.activeLabel_('license')} >License</label>
                        </div>
                        <div className="input-field col s6">
                            <input value={metadata.locale} type="text" onChange={this.handleChange_.bind(this, false, 'locale')}
                                   className="validate" placeholder="Locale"/>
                            <label for="locale" className={this.activeLabel_('locale')} >Locale</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input value={metadata.authors} type="text" onChange={this.handleChange_.bind(this, true, 'authors')}
                                   className="validate" placeholder="Authors of this content" />
                            <label for="authors" className={this.activeLabel_('authors')} >Authors of this content</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input value={metadata.tags} type="text" onChange={this.handleChange_.bind(this, true, 'tags')}
                                   className="validate" placeholder="Tags" />
                            <label for="tags" className={this.activeLabel_('tags')} >Tags</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input value={metadata.preRecommendations} type="email" onChange={this.handleChange_.bind(this, true, 'preRecommendations')}
                                   className="validate" placeholder="Pre Requisites" />
                            <label for="preRequisites" className={this.activeLabel_('preRecommendations')} >Pre Requisites</label>
                        </div>
                    </div>

                    <hr />
                    <div className="row">
                        <div className="input-field col s6">
                            <input value={metadata.learningArea.subject} type="text" onChange={this.handleChange_.bind(this, false, 'learningArea.subject')}
                                   className="validate" placeholder="Subject" />
                            <label for="Subject" className={this.activeLabel_('learningArea.subject')} >Subject</label>
                        </div>
                        <div className="input-field col s6">
                            <input value={metadata.learningArea.subjectArea} type="text" onChange={this.handleChange_.bind(this, false, 'learningArea.subjectArea')}
                                   className="validate" placeholder="Area within the subject" />
                            <label for="subjectArea" className={this.activeLabel_('learningArea.subjectArea')} >Area within the subject</label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="input-field col s6">
                            <input value={metadata.learningArea.domainCodeSource} type="text" onChange={this.handleChange_.bind(this, false, 'learningArea.domainCodeSource')}
                                   className="validate" placeholder="Source of Domain Code (e.g. Common Core)" />
                            <label for="domainCodeSource" className={this.activeLabel_('learningArea.domainCodeSource')} >Source of Domain Code (e.g. Common Core)</label>
                        </div>
                        <div className="input-field col s6">
                            <input value={metadata.learningArea.domainCode} type="text" onChange={this.handleChange_.bind(this, false, 'learningArea.domainCode')}
                                   className="validate" placeholder="Domain Code" />
                            <label for="domainCode" className={this.activeLabel_('learningArea.domainCode')} >Domain Code</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input value={metadata.learningArea.topicHierarchy} type="text" onChange={this.handleChange_.bind(this, true, 'learningArea.topicHierarchy')}
                                   className="validate" />
                            <label for="topicHierarchy" className={this.activeLabel_('learningArea.topicHierarchy')} >Pre topicHierarchy</label>
                        </div>
                    </div>

                </form>
            </div>
            /*
            <div>
                <textarea style={elStyle} onChange={this.handleChange} onBlur={this.handleBlur}  value={metadataText} />
            </div>
            */

        )
    },

    activeLabel_(propName)
    {
        if (utils.dotAccess(this.state.metadata, propName))
        {
            return 'active';
        }
        return '';
    },

    /**
     * Handles changes on form field
     * Propagate chantes to the other components
     *
     * @param isArray  - Whehter or not the field is of type array
     * @param propName  - The name of the property within metadata, dot notation
     * @param event  - The Javascript event
     * @private
     */
    handleChange_: function(isArray, propName, event)
    {
        var metadata = this.state.metadata;
        var value = event.target.value;
        if (isArray)
        {
            value = value.split(',');
        }
        utils.dotAccess(metadata, propName, value);

        this.setState({ metadata: metadata }, function(){
            try {
                var content = {
                    metadata: this.state.metadata
                };
                this.props.onContentUpdate(content);
            } catch (ex) {
                console.log(ex);
                return false;
            }
        });
    },

    /**
     * @deprecated
     * @param {Event} event
     */
    handleChangeText_: function(event)
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
     * @deprecated
     * @param {Event} event
     */
    handleTextBlur_: function(event)
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
            height: '150px',
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


module.exports.MetadataEditorComponent = internals.MetadataEditorComponent;
module.exports.SourceEditorComponent = internals.SourceEditorComponent;