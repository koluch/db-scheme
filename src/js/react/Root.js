// @flow
import React from 'react'

import type {TTableShape} from '~/types/TTableShape'
import type {TLinkShape} from '~/types/TLinkShape'
import Table from './Table'
import Link from './Link'
import {Layer, Rect, Stage, Group} from 'react-konva'



type PropsType = {}
type StateType = {
    tables: Array<TTableShape>,
    links: Array<TLinkShape>,
    movingTable: boolean,
    movingLastPoint: ?{x: number, y: number},
}

const fontStyle = {
    size: 16,
    style: 'normal',
    weight: 'normal',
    family: 'Arial',
};
const tableStyle = {
    font: fontStyle,
    attrs: {
        font: fontStyle,
    },
}

class Root extends React.Component {
    props: PropsType
    state: StateType

    constructor(props: PropsType) {
        super(props)
        this.state = {
            tables: [
                {
                    table: {
                        name: 'posts', attrs: [
                            {name: 'id'},
                            {name: 'title'},
                            {name: 'body'},
                        ],
                    },
                    x: 0,
                    y: 0,
                    active: true,
                },
                {
                    table: {
                        name: 'comments', attrs: [
                            {name: 'id'},
                            {name: 'post_id'},
                            {name: 'user_id'},
                            {name: 'title'},
                            {name: 'visible'},
                        ],
                    },
                    x: 300,
                    y: 200,
                    active: false,
                },
            ],
            links: [
                {
                    link: {from: {table: 'comments', attr: 'post_id'}, to: {table: 'posts', attr: 'id'}},
                },
            ],
            movingTable: false,
            movingLastPoint: null,
        }
    }


    handleTableClick = (tableShape: TTableShape) => {
        this.setState({
            ...this.state,
            tables: this.state.tables.map((nextTableShape) => ({
                ...nextTableShape,
                active: nextTableShape.table.name === tableShape.table.name,
            })),
        })
    }

    handleTableMouseDown = (tableShape: TTableShape, e: any) => {
        this.setState({
            ...this.state,
            movingTable: tableShape.active,
            movingLastPoint: {x: e.evt.offsetX, y: e.evt.offsetY},
        })
    }

    handleStageMouseUp = () => {
        this.setState({
            ...this.state,
            movingTable: false,
            movingLastPoint: null,
        })
    }

    handleStageMouseMove = (e: any) => {
        const newPoint = {x: e.evt.offsetX, y: e.evt.offsetY}
        const {movingTable, movingLastPoint} = this.state
        if (movingTable) {
            let dif = {x: 0, y: 0}
            if (movingLastPoint != null) {
                dif = {
                    x: newPoint.x - movingLastPoint.x,
                    y: newPoint.y - movingLastPoint.y,
                }
            }
            this.setState({
                ...this.state,
                tables: this.state.tables.map((nextTableShape) => {
                    if (nextTableShape.active === true) {
                        return {
                            ...nextTableShape,
                            x: nextTableShape.x + dif.x,
                            y: nextTableShape.y + dif.y,
                        }
                    }
                    else {
                        return nextTableShape
                    }
                }),
                movingLastPoint: newPoint,
            })
        }
        //console.log("e", e)
    }

    render(): React.Element<*> {
        const {tables, links} = this.state

        const width = 800
        const height = 600

        return (
            <Stage
                className="workarea"
                width={width}
                height={height}
                onMouseUp={this.handleStageMouseUp}
                onMouseMove={this.handleStageMouseMove}>
                <Layer ref="canvas">
                    <Rect x="0" y="0" width={width} height={height} fill="#eeffed"/>
                    {links.map((linkShape: TLinkShape) => {
                        const {link: {from, to}} = linkShape
                        const key = `link-${from.table}-${from.attr}-${to.table}-${to.attr}`
                        return <Link
                            tableStyle={tableStyle}
                            key={key}
                            tableShapes={tables}
                            linkShape={linkShape}
                        />
                    })}
                    {tables.map((tableShape: TTableShape) => (
                        <Table
                            style={tableStyle}
                            key={tableShape.table.name}
                            tableShape={tableShape}
                            onClick={this.handleTableClick}
                            onMouseDown={this.handleTableMouseDown}
                        />
                    ))}
                </Layer>
            </Stage>
        )
    }
}

export default Root
