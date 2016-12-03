// @flow
import React from 'react'

import type {TTableShape} from '~/types/TTableShape'
import type {TTableStyle} from '~/types/TTableStyle'
import type {TPoint} from '~/types/TPoint'
import {Rect, Group, Text} from 'react-konva'

import {getHeaderSize, getAttrsSize, getShapeSize} from '~/metrics/table'

type TProps = {
    style: TTableStyle,
    tableShape: TTableShape,
    onClick: (tableShape: TTableShape) => void,
    onMouseDown: (tableShape: TTableShape, point: TPoint) => void,
}

class Table extends React.Component {
    props: TProps

    renderAttrs(): Array<React.Element<*>> {
        const {tableShape: {table: {attrs}, x, y}, style} = this.props
        const {width, height} = getAttrsSize(attrs, style.attrs)

        const singleHeight = height / attrs.length
        return attrs.map((attr, i) => (
            <Text key={`attr-${attr.name}`}
                  x={x}
                  y={y + (singleHeight * (i + 1))}
                  width={width}
                  height={singleHeight}
                  fontSize={style.attrs.font.size}
                  text={attr.name}/>
        ))
    }

    render() {
        const {tableShape, style, onClick, onMouseDown} = this.props
        const {table, x, y, active} = tableShape

        const headerSize = getHeaderSize(tableShape.table, style)

        const {height: fontHeight} = headerSize
        const {width, height} = getShapeSize(tableShape, style)

        const SHADOW_BLUR_ACTIVE = 10
        const SHADOW_BLUR_INACTIVE = 1
        return (
            <Group
                onClick={onClick.bind(this, tableShape)}
                onMouseDown={(e) => onMouseDown(tableShape, {x: e.evt.offsetX, y: e.evt.offsetY})}>
                <Rect
                      x={x} y={y} width={width} height={height}
                      fill={'white'}
                      shadowBlur={active ? SHADOW_BLUR_ACTIVE : SHADOW_BLUR_INACTIVE}
                />
                <Rect
                    key={tableShape.table.name}
                    x={x} y={y} width={width} height={headerSize.height}
                    fill={'gray'}
                />
                <Text
                    x={x}
                    y={y}
                    width={width}
                    height={fontHeight}
                    fontSize={style.font.size}
                    text={table.name}/>
                {this.renderAttrs()}
            </Group>
        )
    }
}

export default Table
