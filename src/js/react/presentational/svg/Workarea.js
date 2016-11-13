// @flow
import React from 'react'

import type {TTableShape} from '~/types/TTableShape'
import type {TLinkShape} from '~/types/TLinkShape'
import type {TSize} from '~/types/TSize'
import type {TWorkareaStyle} from '~/types/TWorkareaStyle'
import type {TLink} from '~/types/TLink'
import type {TPoint} from '~/types/TPoint'
import Table from './Table'
import Link from './Link'


type PropsType = {
    tables: Array<TTableShape>,
    links: Array<TLinkShape>,
    style: TWorkareaStyle,
    size: TSize,
    onTableClick: (tableShape: TTableShape) => void,
    onTableMouseDown: (tableShape: TTableShape, point: TPoint) => void,
    onMouseUp: (point: TPoint) => void,
    onMouseMove: (point: TPoint) => void,
}

class Workarea extends React.Component {
    props: PropsType

    render(): React.Element<*> {
        const {
            tables,
            links,
            style,
            size,
            } = this.props

        const {
            onTableClick,
            onTableMouseDown,
            onMouseUp,
            onMouseMove,
            } = this.props

        const {width, height} = size

        return (
            <svg
                className="workarea"
                viewBox={`0 0 ${width} ${height}`}
                width={width}
                height={height}
                onMouseUp={(e) => onMouseUp({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY})}
                onMouseMove={(e) => onMouseMove({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY})}>
                {links.map((linkShape: TLinkShape) => {
                    const {link: {from, to}} = linkShape
                    const key = `link-${from.table}-${from.attr}-${to.table}-${to.attr}`
                    return <Link
                        tableStyle={style.table}
                        key={key}
                        tables={tables}
                        linkShape={linkShape}
                    />
                })}
                {tables.map((tableShape: TTableShape) => (
                    <Table
                        style={style.table}
                        key={tableShape.table.name}
                        tableShape={tableShape}
                        onClick={onTableClick}
                        onMouseDown={onTableMouseDown}
                    />
                ))}
            </svg>
        )
    }
}

export default Workarea
