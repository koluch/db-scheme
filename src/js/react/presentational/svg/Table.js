// @flow
import React from 'react'

import type {TTableShape} from '~/types/TTableShape'
import type {TTableStyle} from '~/types/TTableStyle'
import type {TPoint} from '~/types/TPoint'

import {getHeaderSize, getAttrsSize, getShapeSize} from '~/metrics/table'

type PropsType = {
    style: TTableStyle,
    tableShape: TTableShape,
    onClick: (tableShape: TTableShape) => void,
    onMouseDown: (tableShape: TTableShape, point: TPoint) => void,
}

class Table extends React.Component {
    props: PropsType

    renderAttrs(): Array<React.Element<*>> {
        const {tableShape: {table: {attrs}, x, y}, style} = this.props
        const {width, height} = getAttrsSize(attrs, style.attrs)

        const singleHeight = height / attrs.length
        return attrs.map((attr, i) => (
            <text key={`attr-${attr.name}`}
                  alignmentBaseline="hanging"
                  x={x}
                  y={y + (singleHeight * (i + 1))}
                  width={width}
                  height={singleHeight}
                  fontSize={style.attrs.font.size}
                  >
                {attr.name}
            </text>
        ))
    }

    renderHeader(): React.Element<*> {
        const {tableShape, style} = this.props
        const {table, x, y} = tableShape
        const {width} = getShapeSize(tableShape, style)
        const headerSize = getHeaderSize(tableShape.table, style)
        const {height: headerHeight} = headerSize
        return <g>
            <rect
                key="header_bg"
                x={x} y={y} width={width} height={headerSize.height}
                fill="gray"
            />
            <text
                key="header_text"
                alignmentBaseline="hanging"
                x={x}
                y={y}
                width={width}
                height={headerHeight}
                fontSize={style.font.size}>
                {table.name}
            </text>
        </g>
    }

    handleMouseDown(tableShape: TTableShape, e: any): void {
        const point = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}
        this.props.onMouseDown.call(this, tableShape, point)
    }

    render(): React.Element<*> {
        const {tableShape, style, onClick, onMouseDown} = this.props
        const {table, x, y, active} = tableShape

        const {width, height} = getShapeSize(tableShape, style)

        return (
            <g
                onClick={onClick.bind(this, tableShape)}
                onMouseDown={this.handleMouseDown.bind(this, tableShape)}>
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
}

export default Table
