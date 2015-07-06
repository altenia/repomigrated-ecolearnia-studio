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
 *  It displays a content in a collapsible tree form.
 * @see http://jsfiddle.net/ssorallen/XX8mw/
 *
 * @author Young Suk Ahn Park
 * @date 4/13/15
 */
var React = require('react');
var classNames = require('classnames');
//var $ = require('jquery');

var internals = {};

class ContentItemComponent extends React.Component
{

    render ()
    {
        var contentItem = this.props.item.item;

        var domainCodeStyle = {
            marginRight: '0.2em'
        };

        // For the submenu target name generation
        //var objUuid = contentItem.uuid;
        var objUuid = (Math.floor((Math.random() * 1000) + 1)).toString();

        var displayHandle = contentItem.metadata.learningArea.domainCode || contentItem.uuid.substring(0,8);
        return (
            <div>
                <span style={domainCodeStyle}>[{displayHandle}]</span>
                <span><a href={this.props.siteBaseUrl + "/content-edit.html#item/"+contentItem.uuid}>{contentItem.metadata.title}</a></span>
                    <ul className="eli-item-actions">
                        <li title="bookmark"><i className={this.props.iconBookmark}></i></li>
                        <li title="edit"><a href={this.props.siteBaseUrl + "/content-edit.html#item/"+contentItem.uuid}><i className={this.props.iconEdit}></i></a></li>
                        <li title="copy"><a href={"content-edit.html#item/_new_/parent=" + this.props.parent.uuid + ';copyOf=' + contentItem.uuid}><i className={this.props.iconCopy}></i></a></li>
                        <li title="delete"><a  onClick={this.props.onDelete}><i className={this.props.iconDelete}></i></a></li>
                        <li title="add" >
                            <a href="#" className="dropdown-button" data-activates={"add-submenu" + objUuid}><i className={this.props.iconAdd}></i></a>
                            <ul id={"add-submenu" + objUuid} className="dropdown-content" >
                                <li title="add before"><a href={"content-edit.html#item/_new_/parent=" + this.props.parent.uuid}>Before</a></li>
                                <li title="add after"><a href={"content-edit.html#item/_new_/parent=" + this.props.parent.uuid}>After</a></li>
                            </ul>
                        </li>
                    </ul>
            </div>
        )
    }
};
ContentItemComponent.defaultProps = {
    iconBookmark: 'mdi-action-bookmark',
    iconEdit: 'mdi-content-create',
    iconCopy: 'mdi-content-content-copy',
    iconAdd: 'mdi-content-add',
    iconDelete: 'mdi-action-delete',
};


export class ContentTreeComponent extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {visible: true};
    }

    /***** React Lifecycle *****/

    componentDidMount()
    {
        // @todo - insteadn of using selector, obtain the dom object directly from React
        //var el = this.getDOMNode();

        $('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrain_width: false, // Does not change width of dropdown to that of the activator
                hover: true, // Activate on hover
                gutter: 0, // Spacing from edge
                belowOrigin: false // Displays dropdown below the button
            }
        );
    }

    render()
    {
        var childNodes;
        var classObj;

        var currNode = this.props.node;
        if (currNode.body.subnodes != null) {
            childNodes = currNode.body.subnodes.map(function(node, index) {
                return (
                    <li key={index}>
                        <ContentTreeComponent node={node} siteBaseUrl={this.props.siteBaseUrl} service={this.props.service}/>
                    </li>
                )
            }.bind(this));

            classObj = {
                togglable: true,
                "togglable-down": this.state.visible,
                "togglable-up": !this.state.visible
            };
        }

        if (currNode.body.items != null &&
            currNode.body.items.length > 0) {
            childNodes = currNode.body.items.map(function(item, index) {
                return (
                    <li key={index} >
                        <ContentItemComponent parent={currNode} item={item}
                                              siteBaseUrl={this.props.siteBaseUrl}
                                              service={this.props.service}
                                              onDelete={this.deleteItem_.bind(this, currNode, item)}
                            />
                    </li>
                );
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

        // For the submenu target name generation
        //var objUuid = this.props.node.uuid;
        var objUuid = (Math.floor((Math.random() * 1000) + 1)).toString();

        var displayHandle = currNode.metadata.learningArea.domainCode || currNode.uuid.substring(0,8);
        if (!currNode.parentUuid) {
            // Root node is not contractable
            return (
                <div>
                    <span >
                    [{currNode.uuid}] {currNode.metadata.title} (Root)
                    </span>
                    <ul style={style} className="hierarchical" >
                        {childNodes}
                    </ul>
                </div>
            );
        } else {
            // Inner nodes are contractable
            return (
                <div>
                    <span onClick={this.toggle_.bind(this)} className={classNames(classObj)}>
                    [{displayHandle}] {currNode.metadata.title} ({currNode.kind})
                    </span>
                    <ul className="eli-item-actions">
                        <li title="bookmark"><i className={this.props.iconBookmark}></i></li>
                        <li title="edit"><a href={this.props.siteBaseUrl + "/content-edit.html#node/"+currNode.uuid}><i className={this.props.iconEdit}></i></a></li>
                        <li title="copy"><i className={this.props.iconCopy}></i></li>
                        <li title="delete"><i className={this.props.iconDelete}></i></li>
                        <li title="add" >
                            <a href="#" className="dropdown-button" data-activates={"add-submenu" + objUuid}><i className={this.props.iconAdd}></i></a>
                            <ul id={"add-submenu" + objUuid} className="dropdown-content" >
                                <li title="add before"><a href={"content-edit.html#node/_new_/parent=" + currNode.parentUuid}>Before</a></li>
                                <li title="add after"><a href={"#node/_new_/" + currNode.parentUuid}>After</a></li>
                            </ul>
                        </li>
                    </ul>

                    <ul style={style} className="hierarchical" >
                        {childNodes}
                    </ul>
                </div>
            );
        }

    }

    /**
     * Toggles the expand/contract of the hierarchical tree node elements
     * @private
     */
    toggle_()
    {
        this.setState({visible: !this.state.visible});
    }

    deleteItem_(parent, item)
    {
        //alert("deleting " + parent.uuid + '/' + item.item.uuid);
        for(var i=0; i < parent.body.items.length; i++)
        {
            if (parent.body.items[i].itemUuid === item.item.uuid)
            {
                parent.body.items.splice(i, 1);

                this.props.service.deleteItem(item.item.uuid, parent.uuid)
                .then(function(result){
                        // @todo - use ContentService to delete the item,
                        // When delete is successful, do the line below
                        // To trigger re-rendering;
                        this.forceUpdate();
                    }.bind(this))
                .catch(function(error){
                        // @todo - publish error message
                        Materialize.toast('Error while deleting: ' + JSON.stringify(error), 4000);
                    }.bind(this));


                return;
            }
        }
    }

};

ContentTreeComponent.defaultProps = {
    iconBookmark: 'mdi-action-bookmark',
    iconEdit: 'mdi-content-create',
    iconCopy: 'mdi-content-content-copy',
    iconAdd: 'mdi-content-add',
    iconDelete: 'mdi-action-delete'
};
