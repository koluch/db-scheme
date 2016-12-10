// @flow
import React from 'react'

import type {TTableShape} from '~/types/TTableShape'
import type {TLinkShape} from '~/types/TLinkShape'
import type {TSize} from '~/types/TSize'
import type {TWorkareaStyle} from '~/types/TWorkareaStyle'
import type {TLink} from '~/types/TLink'
import type {TPoint} from '~/types/TPoint'
import type {TAttr} from '~/types/TAttr'
import type {TWorkareaMetrics} from '~/types/TWorkareaMetrics'
import type {TSelected} from '~/types/TState'

import Table from './Table'
import Link from './Link'


type TProps = {
    selected: TSelected,
    metrics: TWorkareaMetrics,
    tables: Array<TTableShape>,
    links: Array<TLinkShape>,
    style: TWorkareaStyle,
    size: TSize,
    onTableClick: (tableShape: TTableShape) => void,
    onTableMouseDown: (tableShape: TTableShape, point: TPoint) => void,
    onAttrMouseDown: (tableShape: TTableShape, attr: TAttr, point: TPoint) => void,
    onMouseMove: (point: TPoint) => void,
    onAddLinkClick: (tableShape: TTableShape, attr: TAttr) => void,
    onAttrClick: (tableShape: TTableShape, attr: TAttr) => void,
    onMouseUp: (point: TPoint) => void,
}

class Workarea extends React.Component {
    props: TProps

    render() {
        const {
            tables,
            links,
            style,
            size,
            metrics,
            selected,
            } = this.props

        const {
            onTableClick,
            onTableMouseDown,
            onAttrMouseDown,
            onMouseMove,
            onAddLinkClick,
            onAttrClick,
            onMouseUp,
            } = this.props

        const {width, height} = size


        return (
            <svg
                className="workarea"
                viewBox={`0 0 ${width} ${height}`}
                width={width}
                height={height}
                onMouseUp={(e) => onMouseUp({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY})}
                onMouseMove={(e) => onMouseMove({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY})}
            >
                {links.map((linkShape: TLinkShape): * => {
                    const {link: {from, to}} = linkShape
                    const key = `link-${from.table}-${from.attr}-${to.table}-${to.attr}`
                    return <Link
                        tableStyle={style.table}
                        key={key}
                        tables={tables}
                        linkShape={linkShape}
                    />
                })}
                {tables.map((tableShape: TTableShape) => {
                    const tableMetrics = metrics.tables.filter(({name}) => name === tableShape.table.name)[0].metrics //todo: check
                    let tableSelected = false
                    if (selected !== false && selected.type === 'TABLE' && selected.table === tableShape.table.name) {
                        tableSelected = {type: 'TABLE'}
                    }
                    else if (selected !== false && selected.type === 'ATTR' && selected.table === tableShape.table.name) {
                        tableSelected = {type: 'ATTR', name: selected.attr}
                    }
                    return <Table
                        selected={tableSelected}
                        metrics={tableMetrics}
                        style={style.table}
                        key={tableShape.table.name}
                        tableShape={tableShape}
                        onHeaderClick={onTableClick}
                        onHeaderMouseDown={onTableMouseDown}
                        onAttrMouseDown={onAttrMouseDown}
                        onAddLinkClick={onAddLinkClick}
                        onAttrClick={onAttrClick}
                    />
                })}
            </svg>
        )
    }
}

export default Workarea
