// @flow
import React from 'react'

import type {TTableShape} from '~/types/TTableShape'
import type {TTableStyle} from '~/types/TTableStyle'
import type {TPoint} from '~/types/TPoint'
import type {TAttr} from '~/types/TAttr'
import type {TTableMetrics} from '~/types/TWorkareaMetrics'

import FixClick from './FixClick'

type TProps = {
    metrics: TTableMetrics,
    style: TTableStyle,
    tableShape: TTableShape,
    selected: false | {type: 'TABLE'} | {type: 'ATTR', name: string},
    onHeaderClick: (tableShape: TTableShape) => void,
    onHeaderMouseDown: (tableShape: TTableShape, point: TPoint) => void,
    onAttrMouseDown: (tableShape: TTableShape, attr: TAttr, point: TPoint) => void,
    onAddLinkClick: (tableShape: TTableShape, attr: TAttr) => void,
    onAttrClick: (tableShape: TTableShape, attr: TAttr) => void,
}


class Table extends React.Component {
    props: TProps

    handleHeaderMouseDown(tableShape: TTableShape, e: *): * {
        const point = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}
        this.props.onHeaderMouseDown.call(this, tableShape, point)
    }

    render() {
        const {tableShape, metrics, selected} = this.props
        const {position: {x, y}} = tableShape

        const {width, height} = metrics.size

        const isTableActive = selected !== false && selected.type === 'TABLE'

        return (
            <g>
                <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={'white'}
                      stroke={isTableActive ? 'black' : 'gray'}
                      strokeWidth={isTableActive ? '2' : '1'}
                />
                {this.renderHeader()}
                {this.renderAttrs()}
            </g>
        )
    }

    handleAttrMouseDown(tableShape: TTableShape, attr: TAttr, e: *): * {
        const point = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}
        this.props.onAttrMouseDown(tableShape, attr, point)
    }

    handleAddLinkClick(tableShape: TTableShape, attr: TAttr): * {
        this.props.onAddLinkClick(tableShape, attr)
    }

    renderAttrs() {
        const {tableShape, style, onAttrMouseDown, onAttrClick, metrics, selected} = this.props
        const {table: {attrs}, position: {x, y}} = tableShape
        return attrs.map((attr, i) => {
            const {size} = metrics.attrs.filter(({name}) => name === attr.name)[0].metrics //todo: check for existence
            const {width, height} = size
            const isAttrActive = selected !== false && selected.type === 'ATTR' && selected.name === attr.name

            const onMouseDown = this.handleAttrMouseDown.bind(this, tableShape, attr)
            const ADD_LINK_BUTTON_MARGIN = 5
            return <g
                key={`attr-${attr.name}`}
                x={x}
                y={y}
                onMouseDown={onMouseDown}>
                <FixClick onClick={onAttrClick.bind(this, tableShape, attr)}>
                    <text
                        alignmentBaseline="hanging"
                        x={x}
                        y={y + size.height * i + metrics.header.size.height}
                        width={width}
                        height={height}
                        onMouseDown={onMouseDown}
                        fill={isAttrActive ? 'red' : 'black'}
                        fontSize={style.attrs.font.size}>
                        {attr.name}
                    </text>
                </FixClick>
                {isAttrActive && <rect
                    fill="green"
                    x={x + width}
                    y={y + size.height * i + metrics.header.size.height}
                    width={20}
                    height={20}
                />}
                {isAttrActive && <text
                    x={x + width + ADD_LINK_BUTTON_MARGIN}
                    y={y + size.height * i + size.height / 2 + metrics.header.size.height}
                >+</text>}
                {isAttrActive && <rect
                    fill="transparent"
                    x={x + width}
                    y={y + size.height * i + metrics.header.size.height}
                    width={20}
                    height={20}
                    onClick={this.handleAddLinkClick.bind(this, tableShape, attr)}
                />}
            </g>
        })
    }

    renderHeader() {
        const {tableShape, style, metrics, onHeaderClick} = this.props
        const {table, position: {x, y}} = tableShape
        const {size: {width, height}} = metrics.header

        return <g>
            <rect
                x={x} y={y} width={width} height={height}
                fill="gray"
            />
            <text
                alignmentBaseline="hanging"
                x={x}
                y={y}
                width={width}
                height={height}
                fontSize={style.font.size}>
                {table.name}
            </text>
            <FixClick onClick={onHeaderClick.bind(this, tableShape)}>
                <rect
                    x={x} y={y} width={width} height={height}
                    fill="transparent"
                    onMouseDown={this.handleHeaderMouseDown.bind(this, tableShape)}
                />
            </FixClick>
        </g>
    }
}

export default Table
