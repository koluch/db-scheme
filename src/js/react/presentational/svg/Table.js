// @flow
import React from 'react'

import type {TTableShape} from '~/types/TTableShape'
import type {TTableStyle} from '~/types/styles/TTableStyle'
import type {TPoint} from '~/types/TPoint'
import type {TAttr} from '~/types/TAttr'
import type {TTableMetrics} from '~/types/TSchemeMetrics'

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
    onAttrClick: (tableShape: TTableShape, attr: TAttr) => void,
}


class Table extends React.Component {
    props: TProps

    handleHeaderMouseDown(tableShape: TTableShape, e: *): * {
        const point = {x: e.clientX, y: e.clientY}
        this.props.onHeaderMouseDown.call(this, tableShape, point)
    }

    renderAttrs() {
        const {tableShape, style, metrics, selected} = this.props
        const {table: {attrs}, position: {x, y}} = tableShape

        return attrs.map((attr, i) => {
            const {size} = metrics.attrs.filter(({name}) => name === attr.name)[0].metrics //todo: check for existence

            return (
                <Attr
                    key={attr.name}
                    name={attr.name}
                    style={style.attrs}
                    active={selected !== false && selected.type === 'ATTR' && selected.name === attr.name}
                    size={size}
                    position={{x, y: y + size.height * i + metrics.header.size.height}}
                    onMouseDown={this.props.onAttrMouseDown.bind(this, tableShape, attr)}
                    onClick={this.props.onAttrClick.bind(this, tableShape, attr)}
                />
            )
        })
    }

    renderHeader() {
        const {tableShape, style, metrics, onHeaderClick, selected} = this.props
        const {table, position: {x, y}} = tableShape
        const {size: {width, height}} = metrics.header

        const {padding} = style.header

        const textHeight = height - padding.top - padding.bottom

        return (<g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={style.header.backgroundColor}
            />
            <text
                dominantBaseline="middle"
                fontFamily={style.header.font.family}
                x={x + padding.left}
                y={y + padding.top + textHeight / 2}
                width={width}
                height={height}
                fontSize={style.header.font.size}
                fontStyle={style.header.font.style}
                fontWeight={style.header.font.weight}
                fill={style.header.font.color}
            >
                {table.name}
            </text>
            <FixClick onClick={onHeaderClick.bind(this, tableShape)}>
                <rect
                    x={x} y={y} width={width} height={height}
                    fill="transparent"
                    onMouseDown={this.handleHeaderMouseDown.bind(this, tableShape)}
                />
            </FixClick>
        </g>)
    }

    render() {
        const {tableShape, style, metrics, selected} = this.props
        const {position: {x, y}} = tableShape

        const {width, height} = metrics.size

        const isTableActive = selected !== false && selected.type === 'TABLE'

        return (
            <g>
                {isTableActive && <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill="black"
                                  />}

                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={'white'}
                    stroke={style.border.color}
                    strokeWidth={'1'}
                />
                {this.renderHeader()}
                {this.renderAttrs()}
            </g>
        )
    }
}

export default Table
