// @flow
import React from 'react'

import type {TTableShape} from '~/types/TTableShape'
import type {TTableStyle} from '~/types/styles/TTableStyle'
import type {TPoint} from '~/types/TPoint'
import type {TAttr} from '~/types/TAttr'
import type {TTableMetrics} from '~/types/TWorkareaMetrics'

import FixClick from './FixClick'
import Attr from './Attr'
import Button from './Button'

type TProps = {
    metrics: TTableMetrics,
    style: TTableStyle,
    tableShape: TTableShape,
    selected: false | {type: 'TABLE'} | {type: 'ATTR', name: string},
    onDeleteClick: (tableShape: TTableShape) => void,
    onHeaderClick: (tableShape: TTableShape) => void,
    onHeaderMouseDown: (tableShape: TTableShape, point: TPoint) => void,
    onAttrMouseDown: (tableShape: TTableShape, attr: TAttr, point: TPoint) => void,
    onLinkAddClick: (tableShape: TTableShape, attr: TAttr) => void,
    onAttrDeleteClick: (tableShape: TTableShape, attr: TAttr) => void,
    onAttrCreateClick: (tableShape: TTableShape) => void,
    onLinkDeleteClick: (tableShape: TTableShape, attr: TAttr) => void,
    onAttrClick: (tableShape: TTableShape, attr: TAttr) => void,
}


class Table extends React.Component {
    props: TProps

    handleHeaderMouseDown(tableShape: TTableShape, e: *): * {
        const point = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}
        this.props.onHeaderMouseDown.call(this, tableShape, point)
    }

    render() {
        const {tableShape, style, metrics, selected} = this.props
        const {position: {x, y}} = tableShape

        const {width, height} = metrics.size

        const isTableActive = selected !== false && selected.type === 'TABLE'

        return (
            <g>
                <defs>
                    <filter id="active_table_filter" x="-50%" y="-50%" width="200%" height="200%">
                        <feOffset result="offOut" in="SourceAlpha" dx="0" dy="0" />
                        <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
                        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.2"/>
                        </feComponentTransfer>
                    </filter>
                </defs>

                {isTableActive && <rect
                    filter={'url(#active_table_filter)'}
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
                onLinkAddClick={this.props.onLinkAddClick.bind(this, tableShape, attr)}
                onLinkDeleteClick={this.props.onLinkDeleteClick.bind(this, tableShape, attr)}
                onDeleteClick={this.props.onAttrDeleteClick.bind(this, tableShape, attr)}
            />
        })
    }

    renderControls() {
        const {tableShape} = this.props
        const {position: {x, y}} = tableShape
        const {metrics} = this.props
        const {width, height} = metrics.size
        const BUTTON_MARGIN = 10
        const BUTTON_HEIGHT = 20
        return (
            <g>
                <Button
                    title="Delete"
                    x={x + width / 2}
                    y={y + height + BUTTON_HEIGHT / 2 + BUTTON_MARGIN}
                    color="red"
                    width={60} height={BUTTON_HEIGHT}
                    onClick={this.props.onDeleteClick.bind(this, tableShape)}
                />
                <Button
                    title="+ Attribute"
                    x={x + width / 2}
                    y={y + height + BUTTON_HEIGHT + BUTTON_MARGIN + BUTTON_MARGIN + BUTTON_MARGIN }
                    width={80} height={BUTTON_HEIGHT}
                    onClick={this.props.onAttrCreateClick.bind(this, tableShape)}
                />
            </g>
        )
    }

    renderHeader() {
        const {tableShape, style, metrics, onHeaderClick, selected} = this.props
        const {table, position: {x, y}} = tableShape
        const {size: {width, height}} = metrics.header
        const isTableActive = selected !== false && selected.type === 'TABLE'

        const {padding} = style.header

        return <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={style.header.backgroundColor}
            />
            <text
                alignmentBaseline="middle"
                fontFamily={style.font.family}
                x={x + padding.left}
                y={y + height / 2}
                width={width}
                height={height}
                fontSize={style.header.font.size}
                fill={style.header.font.color}>
                {table.name}
            </text>
            <FixClick onClick={onHeaderClick.bind(this, tableShape)}>
                <rect
                    x={x} y={y} width={width} height={height}
                    fill="transparent"
                    onMouseDown={this.handleHeaderMouseDown.bind(this, tableShape)}
                />
            </FixClick>
            {isTableActive && this.renderControls()}
        </g>
    }
}

export default Table
