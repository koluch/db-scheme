// @flow
import React from 'react'

import type {TTableShape} from '~/types/TTableShape'
import type {TLinkShape} from '~/types/TLinkShape'
import type {TSize} from '~/types/TSize'
import type {TSchemeStyle} from '~/types/styles/TSchemeStyle'
import type {TPath} from '~/types/TPath'
import type {TPoint} from '~/types/TPoint'
import type {TAttr} from '~/types/TAttr'
import type {TSchemeMetrics} from '~/types/TSchemeMetrics'
import type {TSelected} from '~/types/TState'

import Table from './Table'
import Link from './Link'

type TProps = {
    selected: TSelected,
    metrics: TSchemeMetrics,
    tables: Array<TTableShape>,
    newLink: ?TPath,
    links: Array<TLinkShape>,
    style: TSchemeStyle,
    size: TSize,
    onTableClick: (tableShape: TTableShape) => void,
    onTableMouseDown: (tableShape: TTableShape, point: TPoint) => void,
    onAttrMouseDown: (tableShape: TTableShape, attr: TAttr, point: TPoint) => void,
    onAttrClick: (tableShape: TTableShape, attr: TAttr) => void,
    onMouseMove: (point: TPoint) => void,
    onMouseUp: (point: TPoint) => void,
    onClick: () => void,
}

class Scheme extends React.Component {
    props: TProps

    schemeEl: *

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
                className="scheme"
                viewBox={`0 0 ${width} ${height}`}
                width={width}
                height={height}
                onMouseUp={(e) => this.props.onMouseUp({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY})}
                onMouseMove={(e) => this.props.onMouseMove({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY})}
                ref={(el) => { this.schemeEl = el }}
                onClick={(e) => { if (e.target === this.schemeEl) { this.props.onClick() } }}
            >
                {links.map((linkShape: TLinkShape): * => {
                    const {path} = linkShape
                    const key = `link-${path.map(({x, y}) => `${x},${y}`).join(';')}`
                    return (<Link
                        key={key}
                        path={linkShape.path}
                        style={style.link}
                            />)
                })}
                {tables.map((tableShape: TTableShape) => {
                    const tableMetrics = metrics.tables.filter(({name}) => name === tableShape.table.name)[0].metrics //todo: check
                    let selectedValue = false
                    if (selected !== false && selected.type === 'TABLE' && selected.table === tableShape.table.name) {
                        selectedValue = {type: 'TABLE'}
                    }
                    else if (selected !== false && selected.type === 'ATTR' && selected.table === tableShape.table.name) {
                        selectedValue = {type: 'ATTR', name: selected.attr}
                    }
                    return (<Table
                        selected={selectedValue}
                        metrics={tableMetrics}
                        style={style.table}
                        key={tableShape.table.name}
                        tableShape={tableShape}
                        onHeaderClick={this.props.onTableClick}
                        onHeaderMouseDown={this.props.onTableMouseDown}
                        onAttrMouseDown={this.props.onAttrMouseDown}
                        onAttrClick={this.props.onAttrClick}
                            />)
                })}
                {newLink && <Link
                    path={newLink}
                    style={style.newLink}
                            />}
            </svg>
        )
    }
}

export default Scheme
