// @flow
import React from 'react'

import type {TTableShape} from '~/types/TTableShape'
import type {TTableStyle} from '~/types/TTableStyle'
import type {TPoint} from '~/types/TPoint'
import type {TAttr} from '~/types/TAttr'
import type {TLinkShape} from '~/types/TLinkShape'
import type {TTableMetrics} from '~/types/TWorkareaMetrics'

import FixClick from './FixClick'
import Attr from './Attr'

type TProps = {
    metrics: TTableMetrics,
    style: TTableStyle,
    tableShape: TTableShape,
    selected: false | {type: 'TABLE'} | {type: 'ATTR', name: string},
    onHeaderClick: (tableShape: TTableShape) => void,
    onHeaderMouseDown: (tableShape: TTableShape, point: TPoint) => void,
    onAttrMouseDown: (tableShape: TTableShape, attr: TAttr, point: TPoint) => void,
    onAddLinkClick: (tableShape: TTableShape, attr: TAttr) => void,
    onDeleteLinkClick: (tableShape: TTableShape, attr: TAttr) => void,
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

    renderAttrs() {
        const {tableShape, style, metrics, selected} = this.props
        const {table: {attrs}, position: {x, y}} = tableShape

        return attrs.map((attr, i) => {
            const {size} = metrics.attrs.filter(({name}) => name === attr.name)[0].metrics //todo: check for existence

            return <Attr
                key={attr.name}
                name={attr.name}
                style={style.attrs}
                active={selected !== false && selected.type === 'ATTR' && selected.name === attr.name}
                hasLink={tableShape.table.foreignKeys.some(({from}) => from.attr === attr.name)}
                size={size}
                position={{x, y: y + size.height * i + metrics.header.size.height}}
                onMouseDown={this.props.onAttrMouseDown.bind(this, tableShape, attr)}
                onClick={this.props.onAttrClick.bind(this, tableShape, attr)}
                onAddLinkClick={this.props.onAddLinkClick.bind(this, tableShape, attr)}
                onDeleteLinkClick={this.props.onDeleteLinkClick.bind(this, tableShape, attr)}
            />
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
