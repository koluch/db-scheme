// @flow
import React from 'react'

import type {TTableShape} from '~/types/TTableShape'
import type {TLinkShape} from '~/types/TLinkShape'
import type {TSize} from '~/types/TSize'
import type {TWorkareaStyle} from '~/types/styles/TWorkareaStyle'
import type {TPath} from '~/types/TPath'
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
    newLink: ?TPath,
    links: Array<TLinkShape>,
    style: TWorkareaStyle,
    size: TSize,
    onTableClick: (tableShape: TTableShape) => void,
    onTableMouseDown: (tableShape: TTableShape, point: TPoint) => void,
    onTableDeleteClick: (tableShape: TTableShape) => void,
    onAttrMouseDown: (tableShape: TTableShape, attr: TAttr, point: TPoint) => void,
    onAttrDeleteClick: (tableShape: TTableShape, attr: TAttr) => void,
    onAttrCreateClick: (tableShape: TTableShape) => void,
    onAttrClick: (tableShape: TTableShape, attr: TAttr) => void,
    onMouseMove: (point: TPoint) => void,
    onLinkAddClick: (tableShape: TTableShape, attr: TAttr) => void,
    onLinkDeleteClick: (tableShape: TTableShape, attr: TAttr) => void,
    onMouseUp: (point: TPoint) => void,
    onClick: () => void,
}

class Workarea extends React.Component {
    props: TProps

    workareaEl: *

    render() {
        const {
            tables,
            links,
            style,
            size,
            metrics,
            selected,
            newLink,
            } = this.props

        const {width, height} = size

        return (
            <svg
                className="workarea"
                viewBox={`0 0 ${width} ${height}`}
                width={width}
                height={height}
                onMouseUp={(e) => this.props.onMouseUp({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY})}
                onMouseMove={(e) => this.props.onMouseMove({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY})}
                ref={(el) => { this.workareaEl = el }}
                onClick={(e) => { if (e.target === this.workareaEl) { this.props.onClick() } } }>
                {links.map((linkShape: TLinkShape): * => {
                    const {path} = linkShape
                    const key = `link-${path.map(({x, y}) => `${x},${y}`).join(';')}`
                    return <Link
                        key={key}
                        path={linkShape.path}
                        style={style.link}
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
                        onDeleteClick={this.props.onTableDeleteClick}
                        onHeaderClick={this.props.onTableClick}
                        onHeaderMouseDown={this.props.onTableMouseDown}
                        onAttrMouseDown={this.props.onAttrMouseDown}
                        onLinkAddClick={this.props.onLinkAddClick}
                        onLinkDeleteClick={this.props.onLinkDeleteClick}
                        onAttrDeleteClick={this.props.onAttrDeleteClick}
                        onAttrClick={this.props.onAttrClick}
                        onAttrCreateClick={this.props.onAttrCreateClick}
                    />
                })}
                {newLink && <Link
                    path={newLink}
                    style={style.newLink}
                />}
            </svg>
        )
    }
}

export default Workarea
