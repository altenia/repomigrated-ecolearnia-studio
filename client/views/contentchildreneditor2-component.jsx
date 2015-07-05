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

import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import { DragSource, DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';

const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move'
};

const cardSource = {
    beginDrag(props) {
        return { id: props.id };
    }
};

const cardTarget = {
    hover(props, monitor) {
        const draggedId = monitor.getItem().id;

        if (draggedId !== props.id) {
            props.moveCard(draggedId, props.id);
        }
    }
};

@DropTarget('card', cardTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))
@DragSource('card', cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
class Card {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        id: PropTypes.any.isRequired,
        text: PropTypes.string.isRequired,
        moveCard: PropTypes.func.isRequired
    };

    render() {
        const { text, isDragging, connectDragSource, connectDropTarget } = this.props;
        const opacity = isDragging ? 0 : 1;

        return connectDragSource(connectDropTarget(
            <div style={{ ...style, opacity }}>
                {text}
            </div>
        ));
    }
}

/********
 * Container
 */
const containerStyle = {
    width: 400
};

@DragDropContext(HTML5Backend)
export default class Container extends Component {
    constructor(props) {
        super(props);
        this.moveCard = this.moveCard.bind(this);
        this.state = {
            cards: [{
                id: 1,
                text: 'Write a cool JS library'
            }, {
                id: 2,
                text: 'Make it generic enough'
            }, {
                id: 3,
                text: 'Write README'
            }, {
                id: 4,
                text: 'Create some examples'
            }, {
                id: 5,
                text: 'Spam in Twitter and IRC to promote it'
            }, {
                id: 6,
                text: '???'
            }, {
                id: 7,
                text: 'PROFIT'
            }]
        };
    }

    moveCard(id, afterId) {
        const { cards } = this.state;

        const card = cards.filter(c => c.id === id)[0];
        const afterCard = cards.filter(c => c.id === afterId)[0];
        const cardIndex = cards.indexOf(card);
        const afterIndex = cards.indexOf(afterCard);

        this.setState(update(this.state, {
            cards: {
                $splice: [
                    [cardIndex, 1],
                    [afterIndex, 0, card]
                ]
            }
        }));
    }

    render() {
        const { cards } = this.state;

        return (
            <div style={style}>
                {cards.map(card => {
                    return (
                        <Card key={card.id}
                              id={card.id}
                              text={card.text}
                              moveCard={this.moveCard} />
                    );
                })}
            </div>
        );
    }
}