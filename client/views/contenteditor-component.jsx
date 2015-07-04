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
var lodash = require('lodash');

var utils = require('../common/utils');

var AceEditorComponent = require('./aceeditor-component.jsx').AceEditorComponent;
var interactives = require('../interactives/interactives');

var internals = {};

function contentPath(content) {
    var path = [];
    var currNode = content;
    do {
        path.unshift(currNode.metadata.title);
        currNode = currNode.__parentObject;
    } while (currNode);
    return path.join(' / ');
}

/**
 * @class ParentChangerDialog
 *
 * @classdesc
 *  React based class for changing parent
 *
 * @todo - Make it a form based with validation
 */
internals.ParentChangerDialog = React.createClass({
    getInitialState: function ()
    {
        return {
            parentUuid: this.props.parentUuid
        };
    },

    render: function() {
        return (
            <div id="parent-changer-dialog" className="modal">
                <div className="modal-content">
                    <h4>Change Parent</h4>

                    <form className="col s12">
                        <div className="row">
                            <div className="input-field col s12">
                                <input value={this.state.parentUuid} type="text" onChange={this.handleChange_}
                                       className="validate" placeholder="Parent" />
                                <label for="Subject" className="active" >Parent</label>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <a className="modal-action modal-close waves-effect waves-green btn-flat ">Cancel</a>
                    <a className="modal-action waves-effect waves-green btn-flat"
                        onClick={this.handleClickChange_}>Change</a>
                </div>
            </div>
        );
    },

    handleChange_: function()
    {
        this.setState({parentUuid: event.target.value});
    },

    handleClickChange_: function() {
        this.props.parentChange(this.state.parentUuid, function(){
            //$('#parent-changer-dialog').closeModal();
        })
    }
});

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
        //this.setState({metadataText: JSON.stringify(nextProps.content.metadata, null, 4)});
        this.setState({structural: nextProps.content.structural});

        this.setState({metadata: nextProps.content.metadata});
        console.log('componentWillReceiveProps', nextProps);
    },

    componentDidMount()
    {
        $('.collapsible').collapsible({
            accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    },

    render: function()
    {
        var structural = this.props.content.structural || {};
        if (!deepEqual(this.state.structural, this.props.content.structural))
        {
            metadata = this.state.structural;
        }
        var metadata = this.props.content.metadata || {};
        if (!deepEqual(this.state.metadata, this.props.content.metadata))
        {
            metadata = this.state.metadata;
        }

        // @deprecated
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

        var parentPath = this.props.content.__parentObject ? contentPath(this.props.content.__parentObject) : '';

        return (
            <div className="row">
                <h4>{metadata.title}</h4>
                <ul className="collapsible" data-collapsible="accordion">

                    <li>
                        <div className="collapsible-header">Structural</div>
                        <div className="collapsible-body">
                            <div className="row">
                                <div className="input-field col s6">
                                    <input value={this.props.content.uuid} type="text"
                                            />
                                    <label for="uuid" className="active" >Uuid</label>
                                </div>
                                <div className="input-field col s6">
                                    <input value={this.props.content.refName} type="text"
                                           />
                                    <label for="refName" className="active" >refName</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s6">
                                    <input value={this.props.content.createdBy} type="text"
                                        />
                                    <label for="createdBy" className="active" >createdBy</label>
                                </div>
                                <div className="input-field col s6">
                                    <input value={this.props.content.createdAt} type="text"
                                        />
                                    <label for="createdAt" className="active" >createdAt</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input value={parentPath} type="text" onClick={this.handleParentClick_}
                                        />
                                    <label for="parent" className="active" >parent</label>
                                </div>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className="collapsible-header">Metadata</div>
                        <div className="collapsible-body">
                            <form className="col s12">
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input value={metadata.title} type="text" onChange={this.handleChange_.bind(this, false, 'metadata', 'title')}
                                               className="validate" placeholder="The title of the content" />
                                        <label for="title" className={this.activeLabel_('metadata', 'title')} >Title</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s6">
                                        <input value={metadata.license} type="text" onChange={this.handleChange_.bind(this, false, 'metadata', 'license')}
                                               className="validate" placeholder="License" />
                                        <label for="license" className={this.activeLabel_('metadata', 'license')} >License</label>
                                    </div>
                                    <div className="input-field col s6">
                                        <input value={metadata.locale} type="text" onChange={this.handleChange_.bind(this, false, 'metadata', 'locale')}
                                               className="validate" placeholder="Locale"/>
                                        <label for="locale" className={this.activeLabel_('metadata', 'locale')} >Locale</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input value={metadata.authors} type="text" onChange={this.handleChange_.bind(this, true, 'metadata', 'authors')}
                                               className="validate" placeholder="Authors of this content" />
                                        <label for="authors" className={this.activeLabel_('metadata', 'authors')} >Authors of this content</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input value={metadata.tags} type="text" onChange={this.handleChange_.bind(this, true, 'tags')}
                                               className="validate" placeholder="Tags" />
                                        <label for="tags" className={this.activeLabel_('metadata', 'tags')} >Tags</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input value={metadata.preRecommendations} type="email" onChange={this.handleChange_.bind(this, true, 'metadata', 'preRecommendations')}
                                               className="validate" placeholder="Pre Requisites" />
                                        <label for="preRequisites" className={this.activeLabel_('metadata', 'preRecommendations')} >Pre Requisites</label>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </li>

                    <li>
                        <div className="collapsible-header">Learn Area</div>
                        <div className="collapsible-body">
                            <form className="col s12">

                                <div className="row">
                                    <div className="input-field col s6">
                                        <input value={metadata.learningArea.subject} type="text" onChange={this.handleChange_.bind(this, false, 'metadata', 'learningArea.subject')}
                                               className="validate" placeholder="Subject" />
                                        <label for="Subject" className={this.activeLabel_('metadata', 'learningArea.subject')} >Subject</label>
                                    </div>
                                    <div className="input-field col s6">
                                        <input value={metadata.learningArea.subjectArea} type="text" onChange={this.handleChange_.bind(this, false, 'metadata', 'learningArea.subjectArea')}
                                               className="validate" placeholder="Area within the subject" />
                                        <label for="subjectArea" className={this.activeLabel_('metadata', 'learningArea.subjectArea')} >Area within the subject</label>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="input-field col s6">
                                        <input value={metadata.learningArea.domainCodeSource} type="text" onChange={this.handleChange_.bind(this, false, 'metadata', 'learningArea.domainCodeSource')}
                                               className="validate" placeholder="Source of Domain Code (e.g. Common Core)" />
                                        <label for="domainCodeSource" className={this.activeLabel_('metadata', 'learningArea.domainCodeSource')} >Source of Domain Code (e.g. Common Core)</label>
                                    </div>
                                    <div className="input-field col s6">
                                        <input value={metadata.learningArea.domainCode} type="text" onChange={this.handleChange_.bind(this, false, 'metadata', 'learningArea.domainCode')}
                                               className="validate" placeholder="Domain Code" />
                                        <label for="domainCode" className={this.activeLabel_('metadata', 'learningArea.domainCode')} >Domain Code</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input value={metadata.learningArea.topicHierarchy} type="text" onChange={this.handleChange_.bind(this, true, 'metadata', 'learningArea.topicHierarchy')}
                                               className="validate" />
                                        <label for="topicHierarchy" className={this.activeLabel_('metadata', 'learningArea.topicHierarchy')} >Pre topicHierarchy</label>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </li>
                </ul>

                <internals.ParentChangerDialog parentUuid={this.props.content.parentUuid}
                                               parentChange={this.props.onChangeParent} />
            </div>
            /*
            <div>
                <textarea style={elStyle} onChange={this.handleChange} onBlur={this.handleBlur}  value={metadataText} />
            </div>
            */

        )
    },

    // Called by DialogComponent
    /*
    parentChange_(parentUuid)
    {
        alert('changing [' +this.props.content.uuid + '] to parent : ' + parentUuid);
        //this.props.onChangeParent(parentUuid);
    },*/

    handleParentClick_()
    {
        // @todo - pass the id as parameter to the component
        $('#parent-changer-dialog').openModal();
    },

    activeLabel_(part, propName)
    {
        if (utils.dotAccess(this.state[part], propName))
        {
            return 'active';
        }
        return '';
    },

    /**
     * Handles changes on form field
     * Propagate changes to the other components
     *
     * @param isArray  - Whether or not the field is of type array
     * @param part  - The part within the content construct: structual, metadata, body
     * @param propName  - The name of the property within metadata, dot notation
     * @param event  - The Javascript event
     * @private
     */
    handleChange_: function(isArray, part, propName, event)
    {
        var partObj = this.state[part];
        var value = event.target.value;
        if (isArray)
        {
            value = value.split(',');
        }
        utils.dotAccess(partObj, propName, value);

        this.setState({ metadata: partObj }, function(){
            try {
                var content = {};
                content[part] = partObj;
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
        // Is cloning really necessary?
        var normalizedContent =  lodash.cloneDeep(this.props.content);
        delete normalizedContent.__parentObject;
        return {
            contentText: JSON.stringify(normalizedContent, null, 4)
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