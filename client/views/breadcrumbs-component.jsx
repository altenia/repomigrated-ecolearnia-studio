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
 *  This file includes definition of DialogComponent.
 *
 * @author Young Suk Ahn Park
 * @date 6/20/15
 */
var React = require('react');

export class BreadcrumbsComponent extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            active: null,
        };
    }

    /***** React methods *****/
    componentDidMount()
    {
        //var el = this.getDOMNode();
        if (this.state.show) {
            $('#messageModal').foundation('reveal', 'open');
        }
    }

    componentWillUnmount () {
        this.props.pubsub.unsubscribe('breadcrumbs');
    }

    render()
    {
        var items = this.props.items.map(function(item, index) {
            return (
                <li key={index}><a href={item.href} >{item.name}</a></li>
            )
        }.bind(this));

        return (
            <ul className="breadcrumbs">
                { items }
            </ul>
        )
    }
};
