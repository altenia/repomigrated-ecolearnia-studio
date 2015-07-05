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
 *  This file includes definition of ContentEditorView.
 *
 * @author Young Suk Ahn Park
 * @date 4/29/15
 */
var AmpersandView = require ('ampersand-view');
//var React = require('react');
var React = require('react');

var lodash = require ('lodash');

var BreadcrumbsComponent = require('./breadcrumbs-component.jsx').BreadcrumbsComponent;

var ContentItemEditorComponent = require ('./contentitemeditor-component.jsx').ContentItemEditorComponent;
var ContentNodeEditorComponent = require ('./contentnodeeditor-component.jsx').ContentNodeEditorComponent;


export class ContentEditorPaneComponent extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            content:  this.props.model.toJSON()
        };
    }

    /***** React methods *****/
    componentDidMount()
    {
    }

    componentWillUnmount ()
    {
    }

    render()
    {
        var props = {
            app: this.props.app,
            content: this.state.content,
            siteBaseUrl: this.props.siteBaseUrl,
            onSaveContent: this.saveContent_.bind(this),
            onChangeParent: this.changeParent_.bind(this),
            onItemSort: this.itemSort_.bind(this)
        };
        var component;
        // @todo - change comparison to 'node'
        if (this.state.content.kind === 'Assignment')
        {
            component = React.createElement(
                ContentNodeEditorComponent, props
            );
        } else {
            component = React.createElement(
                ContentItemEditorComponent, props
            );
        }

        var breadcrumbItems = this.props.app.getContentService().getBreadcrumbItems(this.state.content);

        return (
            <div>
                <div className="navbar-fixed">
                    <nav>
                        <BreadcrumbsComponent className="nav-wrapper" items={breadcrumbItems}>
                        </BreadcrumbsComponent>
                    </nav>
                </div>

                <div className="row full-width">
                    <div className="columns small-12" >
                        {component}
                    </div>
                </div>
            </div>
        );
    }

    saveContent_(content)
    {
        var self = this;

        var normalizedContent = lodash.cloneDeep(content);
        if (typeof normalizedContent.parent === 'object')
        {
            delete normalizedContent.parent;
            delete normalizedContent.__parentObject;
        }
        this.props.model.set(normalizedContent); // Is this necessary??
        this.props.model.save(normalizedContent, {
            success: function(result) {
                self.setState({content: self.state.content});
                self.props.app.showMessage('Save', 'Successful');
            }.bind(this),

            error: function(error) {
                self.props.app.showMessage('Save Error', JSON.stringify(error));
            }.bind(this)
        });
    }

    changeParent_(parentUuid)
    {
        var self = this;

        var to = {
            parentUuid: parentUuid
        };

        var method;
        var contentService = this.props.app.getContentService();
        if (this.state.content.kind === 'Assignment')
        {
            method = contentService.moveNode.bind(contentService);
        } else {
            method = contentService.moveItem.bind(contentService);
        }

        method(this.state.content.uuid, to)
        .then(function(contentModel){
                self.state.content.__parentObject = contentModel.__parentObject;
                self.setState({content: self.state.content});
        }).catch(function(error){
                self.props.app.showMessage('Change parent Error', JSON.stringify(error));
        });

    }

    itemSort_(oldIndex, newIndex)
    {
        var items = this.state.content.body.items;

        // Swap
        var itemHolder = items[newIndex];
        items[newIndex] = items[oldIndex];
        items[oldIndex] = itemHolder;

        this.setState({content: this.state.content});
    }
};
