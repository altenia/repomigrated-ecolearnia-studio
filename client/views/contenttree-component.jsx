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

        if (this.props.node.body.subnodes != null) {
            childNodes = this.props.node.body.subnodes.map(function(node, index) {
                return (
                    <li key={index}>
                        <ContentTreeComponent node={node} siteBaseUrl={this.props.siteBaseUrl} />
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
                return <li key={index} ><ContentItemComponent item={item} siteBaseUrl={this.props.siteBaseUrl} /></li>
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
                <span onClick={this.toggle_.bind(this)} className={React.addons.classSet(classObj)}>
                {this.props.node.metadata.title} ({this.props.node.kind})
                </span>
                <span className="eli-item-actions" >
                    <ul >
                        <li title="bookmark"><i className={this.props.iconBookmark}></i></li>
                        <li title="edit"><i className={this.props.iconEdit}></i></li>
                        <li title="copy"><i className={this.props.iconCopy}></i></li>
                        <li title="add" >
                            <a href="#" className="dropdown-button" data-activates='add-submenu'><i className={this.props.iconAdd}></i></a>
                            <ul id="add-submenu" className="dropdown-content" >
                                <li title="add before"><a href="#">Before</a></li>
                                <li title="add after"><a href="#">After</a></li>
                            </ul>
                        </li>
                    </ul>

                </span>
                <ul style={style} className="hierarchical" >
                    {childNodes}
                </ul>
            </div>
        );
    }

    /**
     * Toggles the expand/contract of the hierarchical tree node elements
     * @private
     */
    toggle_()
    {
        this.setState({visible: !this.state.visible});
    }
};

ContentTreeComponent.defaultProps = {
    iconBookmark: 'mdi-action-bookmark',
    iconEdit: 'mdi-content-create',
    iconCopy: 'mdi-content-content-copy',
    iconAdd: 'mdi-content-add'
};
