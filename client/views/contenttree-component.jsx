/**
 * Created by ysahn on 4/13/15.
 *
 * @see http://jsfiddle.net/ssorallen/XX8mw/
 */
var React = require('react/addons');

/** @jsx React.DOM */

var internals = {};

internals.ContentItemComponent = React.createClass({
    render: function() {
        var contentItem = this.props.item.item;
        return (
            <div>
                <span>{contentItem.uuid}</span>
                <span><a href={"#content/"+contentItem.metadata.uuid}>{contentItem.metadata.title}</a></span>
                <span title="bookmark"><i className="fa fa-bookmark"></i></span>
                <span title="copy"><i className="fa fa-copy"></i></span>
                <span title="add"><i className="fa fa-plus"></i></span>
            </div>
        )
    }
});

internals.ContentTreeNode = React.createClass({
    getInitialState: function () {
        return {
            visible: true
        };
    },
    render: function() {
        var childNodes;
        var classObj;

        if (this.props.node.body.subnodes != null) {
            childNodes = this.props.node.body.subnodes.map(function(node, index) {
                return (
                    <li key={index}>
                        <internals.ContentTreeNode node={node} />
                    </li>
                )
            });

            classObj = {
                togglable: true,
                "togglable-down": this.state.visible,
                "togglable-up": !this.state.visible
            };
        }

        if (this.props.node.body.items != null &&
            this.props.node.body.items.length > 0) {
            childNodes = this.props.node.body.items.map(function(item, index) {
                return <li key={index}><internals.ContentItemComponent item={item} /></li>
            });

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
                <span title="bookmark"><i className="fa fa-bookmark"></i></span>
                <span title="edit"><i className="fa fa-edit"></i></span>
                <span title="copy"><i className="fa fa-copy"></i></span>
                <span title="add"><i className="fa fa-plus"></i></span>
                <ul style={style}>
                    {childNodes}
                </ul>
            </div>
        );
    },
    toggle: function() {
        this.setState({visible: !this.state.visible});
    }
});

module.exports.ContentTreeComponent = internals.ContentTreeNode;