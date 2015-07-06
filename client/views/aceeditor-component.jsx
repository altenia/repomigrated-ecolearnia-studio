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
 *  This file includes definition of AceEditorComponent.
 *
 * @author Young Suk Ahn Park
 * @date 5/18/15
 */
var React = require('react');
// Depends on ace, make sure that the hosting page has link to the ace editor js file

var internals = {};


internals.AceEditorComponent = React.createClass({
    propTypes: {
        elId : React.PropTypes.string, // ID or element
        mode  : React.PropTypes.string,
        theme : React.PropTypes.string,
        value: React.PropTypes.string,
        fontSize : React.PropTypes.number,
        showGutter : React.PropTypes.bool,
        maxLines : React.PropTypes.number,
        readOnly : React.PropTypes.bool,
        highlightActiveLine : React.PropTypes.bool,
        showPrintMargin : React.PropTypes.bool,
        height : React.PropTypes.string,
        width : React.PropTypes.string,
        onLoad: React.PropTypes.func,
        onChange: React.PropTypes.func,
        onBlur: React.PropTypes.func,
    },

    getDefaultProps: function()
    {
        return {
            elId   : 'ace-editor',
            mode   : '',
            theme  : '',
            value  : '',
            fontSize   : 12,
            showGutter : true,
            maxLines   : null,
            readOnly   : false,
            highlightActiveLine : true,
            showPrintMargin     : true,
            height : '500px',
            width  : '100%',
            border : '1px solid #888',
            onLoad     : null,
            onChange   : null,
            onBlur     : null
        };
    },

    getInitialState: function ()
    {
        console.log('getInitialState');
        return {
            value: this.props.value
        }
    },

    componentWillReceiveProps: function(nextProps)
    {
        // Update state when property change was propagated, even originated
        // from this same component
        //this.setState({contentText: JSON.stringify(nextProps.content, null, 4)});

        if (this.editor.getValue() !== nextProps.value) {
            this.editor.setValue(nextProps.value);
        }
        console.log('componentWillReceiveProps', nextProps);
    },

    componentDidMount: function()
    {
        this.editor = ace.edit(this.props.elId);
        this.editor.getSession().setMode('ace/mode/' + this.props.mode);
        this.editor.setTheme('ace/theme/' + this.props.theme);
        this.editor.setValue(this.props.value);
        this.editor.setFontSize(this.props.fontSize);
        this.editor.on('change', this.handleChange);
        this.editor.on('blur', this.handleBlur);
        this.editor.renderer.setShowGutter(this.props.showGutter);
        this.editor.setOption('maxLines', this.props.maxLines);
        this.editor.setOption('readOnly', this.props.readOnly);
        this.editor.setOption('highlightActiveLine', this.props.highlightActiveLine);
        this.editor.setShowPrintMargin(this.props.setShowPrintMargin);

        if (this.props.onLoad) {
            this.props.onLoad(this.editor);
        }
    },

    render: function()
    {

        var elStyle = {
            display: 'block',
            margin: 'auto',
            height: this.props.height,
            width: this.props.width,
            border: this.props.border
        };

        // If I use defaultValue updates from other component is no reflected here.
        // <textarea style={textAreaStyle} onChange={this.handleChange} onBlur={this.handleBlur} value={contentText} />
        return (
            <div>
                <div style={elStyle} id={this.props.elId} onChange={this.handleChange} onBlur={this.handleBlur}  />
            </div>
        );
    },

    handleChange: function()
    {
        var value = this.editor.getValue();
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    },

    handleBlur: function()
    {
        var value = this.editor.getValue();
        if (this.props.onBlur) {
            this.props.onBlur(value);
        }
    }

});


module.exports.AceEditorComponent = internals.AceEditorComponent;