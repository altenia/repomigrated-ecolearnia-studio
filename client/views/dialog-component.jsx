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
 * @date 6/12/15
 */
var React = require('react');
//var $ = require('jquery');


export class DialogComponent extends React.Component
{
    constructor(props)
    {
        super(props);
        //this.bind_('handleAction_');

        this.props.pubsub.subscribe('dialog', this.handleDialogMessage_.bind(this))

        this.state = {
            title: props.title,
            body: props.body,
        };

    }

    handleDialogMessage_(message)
    {
        var reveal = this.refs['foundationReveal'].getDOMNode();


        if (message.show){
            this.setState({
                title: message.title,
                body: message.body,
                show: true
            });
            $(reveal).foundation('reveal', 'open');
            var messageModal = $('#messageModal');
            messageModal.foundation('reveal', 'open');
        } else {
            this.setState({
                show: false
            });
            $('#messageModal').foundation('reveal', 'close');
        }
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
        this.props.pubsub.unsubscribe('dialog');
    }

    render()
    {
        return (
            <div ref="foundationReveal" id="messageModal" className="reveal-modal" data-reveal aria-labelledby="messageModalTitle" aria-hidden="true" role="dialog">
                <h2 id="messageModalTitle">{ this.state.title }</h2>
                <div id="messageModalBody">{ this.state.body }</div>
                <a className="close-reveal-modal" aria-label="Close">&#215;</a>
            </div>
        )
    }
};
