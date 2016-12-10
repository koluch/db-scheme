// @flow
import React from 'react'

import type {TTableShape} from '~/types/TTableShape'
import type {TTableStyle} from '~/types/TTableStyle'
import type {TAttrStyle} from '~/types/TAttrStyle'
import type {TPoint} from '~/types/TPoint'
import type {TSize} from '~/types/TSize'
import type {TAttr} from '~/types/TAttr'
import type {TTableMetrics} from '~/types/TWorkareaMetrics'

import FixClick from './FixClick'


type TProps = {
    name: string,
    style: TAttrStyle,
    active: boolean,
    hasLink: boolean,
    size: TSize,
    position: TPoint,
    onMouseDown: (point: TPoint) => void,
    onClick: () => void,
    onAddLinkClick: () => void,
    onDeleteLinkClick: () => void,
}

const ADD_LINK_BUTTON_MARGIN = 5

class Attr extends React.Component {
    props: TProps

    handleMouseDown = (e: *): * => {
        this.props.onMouseDown({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY})
    }

    renderAddLinkButton() {
        const {
            size: {width, height},
            position: {x, y},
        } = this.props
        return <g>
            <rect
                fill="green"
                x={x + width}
                y={y}
                width={20}
                height={20}
            />
            <text
                x={x + width + ADD_LINK_BUTTON_MARGIN}
                y={y + height / 2}
            >+</text>
            <rect
                fill="transparent"
                x={x + width}
                y={y}
                width={20}
                height={20}
                onClick={this.props.onAddLinkClick}
            />
        </g>
    }

    renderDeleteLinkButton() {
        const {
            size: {width, height},
            position: {x, y},
        } = this.props
        return <g>
            <rect
                fill="red"
                x={x + width}
                y={y}
                width={20}
                height={20}
            />
            <text
                x={x + width + ADD_LINK_BUTTON_MARGIN}
                y={y + height / 2}
            >-</text>
            <rect
                fill="transparent"
                x={x + width}
                y={y}
                width={20}
                height={20}
                onClick={this.props.onDeleteLinkClick}
            />
        </g>
    }

    render() {
        const {
            name,
            style,
            active,
            hasLink,
            size: {width, height},
            position: {x, y},
        } = this.props

        return <g
            key={`attr-${name}`}
            x={x}
            y={y}
            onMouseDown={this.handleMouseDown}>
            <FixClick onClick={this.props.onClick}>
                <text
                    alignmentBaseline="hanging"
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    onMouseDown={this.handleMouseDown}
                    fill={active ? 'red' : 'black'}
                    fontSize={style.font.size}>
                    {name}
                </text>
            </FixClick>
            {active && !hasLink && this.renderAddLinkButton()}
            {active && hasLink && this.renderDeleteLinkButton()}
        </g>
    }
}

export default Attr
