// @flow
import React from 'react'

import type {TTableShape} from '~/types/TTableShape'
import type {TTableStyle} from '~/types/TTableStyle'
import type {TPoint} from '~/types/TPoint'
import type {TAttr} from '~/types/TAttr'
import type {TTableMetrics} from '~/types/TWorkareaMetrics'

type TProps = {
    metrics: TTableMetrics,
    style: TTableStyle,
    tableShape: TTableShape,
    onHeaderClick: (tableShape: TTableShape) => void,
    onHeaderMouseDown: (tableShape: TTableShape, point: TPoint) => void,
    onAttrMouseDown: (tableShape: TTableShape, attr: TAttr, point: TPoint) => void,
}

class Table extends React.Component {
    props: TProps

    handleHeaderMouseDown(tableShape: TTableShape, e: *): * {
        const point = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}
        this.props.onHeaderMouseDown.call(this, tableShape, point)
    }

    render() {
        const {tableShape, metrics} = this.props
        const {active, position: {x, y}} = tableShape

        const {width, height} = metrics.size

        return (
            <g>
                <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={'white'}
                      stroke={active ? 'black' : 'gray'}
                      strokeWidth={active ? '2' : '1'}
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

    renderAttrs() {
        const {tableShape, style, onAttrMouseDown, metrics} = this.props
        const {table: {attrs}, position: {x, y}} = tableShape
        return attrs.map((attr) => {
            const {size, offset} = metrics.attrs.filter(({name}) => name === attr.name)[0].metrics //todo: check for existence
            const {width, height} = size
            const onMouseDown = this.handleAttrMouseDown.bind(this, tableShape, attr)
            return <g
                key={`attr-${attr.name}`}
                x={x}
                y={y}
                onMouseDown={onMouseDown}>
                <text
                    alignmentBaseline="hanging"
                    x={x + offset.x}
                    y={y + offset.y}
                    width={width}
                    height={height}
                    onMouseDown={onMouseDown}
                    fontSize={style.attrs.font.size}>
                    {attr.name}
                </text>
            </g>
        })
    }

    renderHeader() {
        const {onHeaderClick} = this.props
        const {tableShape, style, metrics} = this.props
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
            <rect
                x={x} y={y} width={width} height={height}
                fill="transparent"
                onClick={onHeaderClick.bind(this, tableShape)}
                onMouseDown={this.handleHeaderMouseDown.bind(this, tableShape)}
            />
        </g>
    }

}

export default Table
