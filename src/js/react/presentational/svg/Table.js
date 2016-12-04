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
    onAddLinkClick: (tableShape: TTableShape, attr: TAttr) => void,
    onAttrClick: (tableShape: TTableShape, attr: TAttr) => void,
}

class Table extends React.Component {
    props: TProps

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

    handleAddLinkClick(tableShape: TTableShape, attr: TAttr): * {
        this.props.onAddLinkClick(tableShape, attr)
    }

    renderAttrs() {
        const {tableShape, style, onAttrClick, metrics} = this.props
        const {table: {attrs}, position: {x, y}} = tableShape
        return attrs.map((attr, i) => {
            const {size} = metrics.attrs.filter(({name}) => name === attr.name)[0].metrics //todo: check for existence
            const {width, height} = size
            return <g
                key={`attr-${attr.name}`}
                x={x}
                y={y}>
                <text
                    alignmentBaseline="hanging"
                    x={x}
                    y={y + size.height * i + metrics.header.size.height}
                    width={width}
                    height={height}
                    onClick={onAttrClick.bind(this, tableShape, attr)}
                    fontSize={style.attrs.font.size}>
                    {attr.name}
                </text>
                <rect
                    fill="green"
                    x={x + width}
                    y={y + size.height * i + metrics.header.size.height}
                    width={20}
                    height={20}
                />
                <text
                    x={x + width + 5}
                    y={y + size.height * i + size.height / 2 + metrics.header.size.height}
                >+</text>
                <rect
                    fill="transparent"
                    x={x + width}
                    y={y + size.height * i + metrics.header.size.height}
                    width={20}
                    height={20}
                    onClick={this.handleAddLinkClick.bind(this, tableShape, attr)}
                />
            </g>
        })
    }

    renderHeader() {
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
            />
        </g>
    }

}

export default Table
