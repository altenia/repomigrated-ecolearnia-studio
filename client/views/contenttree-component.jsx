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
 *  This file includes definition of ContentItemComponent.
 * @see http://jsfiddle.net/ssorallen/XX8mw/
 *
 * @author Young Suk Ahn Park
 * @date 4/13/15
 */
var React = require('react/addons');

var internals = {};

internals.ContentItemComponent = React.createClass({

    render: function()
    {
        var contentItem = this.props.item.item;

        var domainCodeStyle = {
            marginRight: '0.2em'
        };
        return (
            <div>
                <span style={domainCodeStyle}>[{contentItem.metadata.learningArea.domainCode}]</span>
                <span><a href={this.props.siteBaseUrl + "/content-edit.html/#item/"+contentItem.uuid}>{contentItem.metadata.title}</a></span>
                 <span className="eli-item-actions">
                    <ul>
                        <li title="bookmark"><i className="fa fa-bookmark"></i></li>
                        <li title="copy"><i className="fa fa-copy"></i></li>
                        <li title="add"><i className="fa fa-plus"></i></li>
                    </ul>
                 </span>
            </div>
        )
    }
});

internals.ContentTreeNode = React.createClass({

    getInitialState: function ()
    {
        return {
            visible: true
        };
    },

    render: function()
    {
        var childNodes;
        var classObj;

        if (this.props.node.body.subnodes != null) {
            childNodes = this.props.node.body.subnodes.map(function(node, index) {
                return (
                    <li key={index}>
                        <internals.ContentTreeNode node={node} siteBaseUrl={this.props.siteBaseUrl} />
                    </li>
                )
            }.bind(this));

            classObj = {
                togglable: true,
                "togglable-down": this.state.visible,
                "togglable-up": !this.state.visible
            };
        }

        if (this.props.node.body.items != null &&
            this.props.node.body.items.length > 0) {
            childNodes = this.props.node.body.items.map(function(item, index) {
                return <li key={index}><internals.ContentItemComponent item={item} siteBaseUrl={this.props.siteBaseUrl} /></li>
            }.bind(this));

            classObj = {
                togglable: true,
                "togglable-down": this.state.visible,
                "togglable-up": !this.state.visible
            };
        }

        var style;
        if (!this.state.visible) {
            style = {display: "none"};
        }

        return (
            <div>
                <span onClick={this.toggle} className={React.addons.classSet(classObj)}>
                {this.props.node.metadata.title} ({this.props.node.kind})
                </span>
                <span className="eli-item-actions" >
                    <ul >
                        <li title="bookmark"><i className="fa fa-bookmark"></i></li>
                        <li title="edit"><i className="fa fa-edit"></i></li>
                        <li title="copy"><i className="fa fa-copy"></i></li>
                        <li title="add">
                            <a href="#" data-dropdown="hover1" data-options="is_hover:true; hover_timeout:5000"><i className="fa fa-plus"></i></a>
                            <ul id="hover1" class="f-dropdown" data-dropdown-content>
                                <li title="add">Before</li>
                                <li title="add">After</li>
                            </ul>
                        </li>
                    </ul>

                </span>
                <ul style={style}>
                    {childNodes}
                </ul>
            </div>
        );
    },

    toggle: function()
    {
        this.setState({visible: !this.state.visible});
    }
});

module.exports.ContentTreeComponent = internals.ContentTreeNode;