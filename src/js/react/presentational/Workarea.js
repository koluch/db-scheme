// @flow
import React from 'react'
import {Layer, Rect, Stage, Group} from 'react-konva'

import type {TTableShape} from '~/types/TTableShape'
import type {TLinkShape} from '~/types/TLinkShape'
import type {TSize} from '~/types/TSize'
import type {TWorkareaStyle} from '~/types/TWorkareaStyle'
import type {TLink} from '~/types/TLink'
import Table from './Table'
import Link from './Link'


type PropsType = {
    tables: Array<TTableShape>,
    links: Array<TLinkShape>,
    style: TWorkareaStyle,
    size: TSize,
    onTableClick: (tableShape: TTableShape) => void,
    onTableMouseDown: (tableShape: TTableShape) => void,
    onMouseUp: () => void,
    onMouseMove: () => void,
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
            <Stage
                className="workarea"
                width={width}
                height={height}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}>
                <Layer ref="canvas">
                    <Rect x="0" y="0" width={width} height={height} fill="#eeffed"/>
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
                </Layer>
            </Stage>
        )
    }
}

export default Workarea
