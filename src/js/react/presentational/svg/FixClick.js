// @flow
import React from 'react'
import {Layer, Line, Stage, Group, Text} from 'react-konva'

import type {TLinkShape} from '~/types/TLinkShape'
import type {TTableShape} from '~/types/TTableShape'
import type {TTableStyle} from '~/types/TTableStyle'
import type {TBounds} from '~/types/TBounds'
import type {TPoint} from '~/types/TPoint'

import {createSelector} from 'reselect'

type TProps = {
    onClick: () => void,
    children?: *,
}

type TState = {
    start: ?TPoint,
}


class FixClick extends React.Component {
    props: TProps

    state: TState = {start: null}

    handleMouseDown = (e: *) => {
        this.setState({
            start: {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
        })
    }

    handleMouseMove = () => {
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
            if (point.x === start.x && point.y === start.y) {
                this.props.onClick()
            }
        }
    }

    render() {
        return (
            <g
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onMouseMove={this.handleMouseMove}
            >
                {this.props.children}
            </g>
        )
    }
}


export default FixClick
