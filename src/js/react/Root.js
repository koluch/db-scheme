// @flow
import React from 'react'
import {connect} from 'react-redux'
import {createSelector} from 'reselect'

import type {TTableShape} from '~/types/TTableShape'
import type {TLinkShape} from '~/types/TLinkShape'
import type {TWorkareaStyle} from '~/types/TWorkareaStyle'
import type {TState} from '~/types/TState'
import type {TAction} from '~/types/TAction'
import type {TBounds} from '~/types/TBounds'
import type {TPoint} from '~/types/TPoint'

import Workarea from './presentational/svg/Workarea'
import type {Dispatch, Store} from 'redux'
import * as tableMetrics from '~/metrics/table'


type TProps = {
    tables: Array<TTableShape>,
    links: Array<TLinkShape>,

    onTableClick: (tableShape: TTableShape) => void,
    onTableMouseDown: (tableShape: TTableShape, point: TPoint) => void,
    onMouseUp: () => void,
    onMouseMove: (point: TPoint) => void,
}

const fontStyle = {
    size: 24,
    style: 'normal',
    weight: 'normal',
    family: 'Arial',
}

const tableStyle = {
    font: fontStyle,
    attrs: {
        font: fontStyle,
    },
}


const calculatePath = (b1: TBounds, b2: TBounds): Array<TPoint> => {
    const CONNECTION_LINE_WIDTH = 10
    const start = {x: b1.x, y: b1.y + b1.height / 2}
    const end = {x: b2.x, y: b2.y + b2.height / 2}

    //const c1 = [start[0] - CONNECTION_LINE_WIDTH, start[1]]
    //const c2 = [end[0] - CONNECTION_LINE_WIDTH, end[1]]
    const c1 = start
    const c2 = end

    const middle1 = {x: c1.x + (c2.x - c1.x) / 2, y: c1.y}
    const middle2 = {x: middle1.x, y: c2.y}

    return [
        start,
        //c1,
        middle1,
        middle2,
        //c2,
        end,
    ]
}

const workareaStyle: TWorkareaStyle = {
    table: tableStyle,
}

class Root extends React.Component {
    props: TProps
    constructor(props: TProps) {
        super(props)
    }

    render(): React.Element<*> {
        const {
            tables,
            links,
            onTableClick,
            onTableMouseDown,
            onMouseUp,
            onMouseMove,
            } = this.props

        const width = 800
        const height = 600

        return (
            <Workarea
                tables={tables}
                links={links}
                style={workareaStyle}
                size={{width, height}}
                onTableClick={onTableClick}
                onTableMouseDown={onTableMouseDown}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
            />
        )
    }
}

const mapStateToProps = (state: TState): * => {
    const {tables, links} = state

    const {dnd} = state
    return {
        tables: state.tables,
        links: state.links.map((linkState): TLinkShape => {
            const {link} = linkState
            const {from, to} = link

            const tableShapeFrom = tables.filter((x) => x.table.name === from.table)[0]
            if (!tableShapeFrom) {
                throw new Error(`Table "${from.table}" doesn't exists, unable to draw link`)
            }

            const tableShapeTo = tables.filter((x) => x.table.name === to.table)[0]
            if (!tableShapeTo) {
                throw new Error(`Table "${to.table}" doesn't exists, unable to draw link`)
            }

            const attrFrom = tableShapeFrom.table.attrs.filter((x) => x.name === from.attr)[0]
            if (!attrFrom) {
                throw new Error(`Attribute "${from.table}.${from.attr}" doesn't exists, unable to draw link`)
            }

            const attrTo = tableShapeFrom.table.attrs.filter((x) => x.name === to.attr)[0]
            if (!attrTo) {
                throw new Error(`Attribute "${to.table}.${to.attr}" doesn't exists, unable to draw link`)
            }

            const attrFromBounds = tableMetrics.getAttrBounds(tableShapeFrom, attrFrom, tableStyle)
            const attrToBounds = tableMetrics.getAttrBounds(tableShapeTo, attrTo, tableStyle)

            const path = calculatePath(attrFromBounds, attrToBounds)

            return {
                link,
                path,
            }
        }),
        isDnd: dnd !== false,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<TAction>): * => {
    return {
        dispatch,
        onTableClick: (tableShape: TTableShape): * => {
            dispatch({type: 'SET_ACTIVE_TABLE', name: tableShape.table.name})
        },
        onTableMouseDown: (tableShape: TTableShape, point: TPoint) => {
            dispatch({
                type: 'START_DND',
                targetType: 'TABLE',
                name: tableShape.table.name,
                startPoint: point,
            })
        },
        onMouseUp: () => {
            dispatch({type: 'STOP_DND'})
        },
    }
}

const mergeProps = (stateProps, dispatchProps): * => {
    const {isDnd} = stateProps
    const {dispatch} = dispatchProps

    return {
        ...stateProps,
        ...dispatchProps,
        onMouseMove: (point: TPoint) => {
            if (isDnd) {
                dispatch({type: 'MOUSE_MOVE', point})
            }
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Root)
