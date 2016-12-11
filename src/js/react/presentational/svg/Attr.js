// @flow
import React from 'react'

import type {TTableShape} from '~/types/TTableShape'
import type {TTableStyle} from '~/types/styles/TTableStyle'
import type {TAttrStyle} from '~/types/styles/TAttrStyle'
import type {TPoint} from '~/types/TPoint'
import type {TSize} from '~/types/TSize'
import type {TAttr} from '~/types/TAttr'
import type {TTableMetrics} from '~/types/TWorkareaMetrics'

import FixClick from './FixClick'
import Button from './Button'

type TProps = {
    name: string,
    style: TAttrStyle,
    active: boolean,
    hasLink: boolean,
    size: TSize,
    position: TPoint,
    onMouseDown: (point: TPoint) => void,
    onClick: () => void,
    onLinkAddClick: () => void,
    onLinkDeleteClick: () => void,
    onDeleteClick: () => void,
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
            style: {padding},
            position: {x, y},
        } = this.props

        return <Button
            title={'\u2194'}
            x={x + width + ADD_LINK_BUTTON_MARGIN + 20}
            y={y + height / 2}
            width={20}
            height={20}
            onClick={this.props.onLinkAddClick}
        />
    }

    renderDeleteLinkButton() {
        const {
            size: {width, height},
            position: {x, y},
        } = this.props

        return <Button
            title={'\u2718'}
            x={x + width + ADD_LINK_BUTTON_MARGIN + 20}
            y={y + height / 2}
            width={20}
            height={20}
            onClick={this.props.onLinkDeleteClick}
        />
    }

    renderDeleteButton() {
        const {
            size: {width, height},
            position: {x, y},
        } = this.props

        return <Button
            title={'\u2716'}
            color="red"
            x={x + width + ADD_LINK_BUTTON_MARGIN + 50}
            y={y + height / 2}
            width={20}
            height={20}
            onClick={this.props.onDeleteClick}
        />
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
            <defs>
                <filter id="active_attr_filter" x="-50%" y="-50%" width="200%" height="200%">
                    <feOffset result="offOut" in="SourceAlpha" dx="0" dy="0" />
                    <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
                    <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.2"/>
                    </feComponentTransfer>
                </filter>
            </defs>
            <FixClick onClick={this.props.onClick}>
                {active && <rect
                    filter="url(#active_attr_filter)"
                    x={x + 1}
                    y={y}
                    width={width - 2}
                    height={height}
                    fill="black"
                />}
                {active && <rect
                    x={x + 1}
                    y={y}
                    width={width - 2}
                    height={height}
                    fill="white"
                />}
                <text
                    fontFamily={style.font.family}
                    fontWeight={active ? 'bold' : 'normal'}
                    alignmentBaseline="middle"
                    x={x + style.padding.left}
                    y={y + height / 2}
                    fontSize={style.font.size}>
                    {name}
                </text>
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill="transparent"
                    onMouseDown={this.handleMouseDown}
                />
            </FixClick>
            {active && !hasLink && this.renderAddLinkButton()}
            {active && hasLink && this.renderDeleteLinkButton()}
            {active && this.renderDeleteButton()}
        </g>
    }
}

export default Attr
