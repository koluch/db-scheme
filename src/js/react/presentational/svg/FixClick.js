// @flow
import React from 'react'

import type {TPoint} from '~/types/TPoint'

type TProps = {
    onClick: () => void,
    children?: *,
}

type TState = {
    start: ?TPoint,
}

const ALOWED_MOUSE_SHIFT = 3

class FixClick extends React.Component {
    state: TState = {start: null}

    props: TProps

    handleMouseDown = (e: *) => {
        this.setState({
            start: {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
        })
    }

    handleMouseLeave = () => {
        if (this.state.start !== null) {
            this.setState({
                start: null,
            })
        }
    }

    handleMouseUp = (e: *) => {
        const point = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}
        const {start} = this.state
        if (start) {
            if (Math.abs(point.x - start.x) < ALOWED_MOUSE_SHIFT && Math.abs(point.y - start.y) < ALOWED_MOUSE_SHIFT) {
                this.props.onClick()
            }
        }
    }

    render() {
        return (
            <g
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onMouseLeave={this.handleMouseLeave}
            >
                {this.props.children}
            </g>
        )
    }
}


export default FixClick
