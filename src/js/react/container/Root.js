// @flow
import React from 'react'
import {connect} from 'react-redux'
import type {Dispatch, Store} from 'redux'

import type {TTableShape} from '~/types/TTableShape'
import type {TLinkShape} from '~/types/TLinkShape'
import type {TWorkareaStyle} from '~/types/TWorkareaStyle'
import type {TState, TTableState} from '~/types/TState'
import type {TAction} from '~/types/TAction'
import type {TAttr} from '~/types/TAttr'
import type {TBounds} from '~/types/TBounds'
import type {TPoint} from '~/types/TPoint'
import type {TWorkareaMetrics} from '~/types/TWorkareaMetrics'

import Workarea from './../presentational/svg/Workarea'
import * as tableMetrics from '~/metrics/table'
import * as metricsSelectors from '~/react/selectors/metrics'
import {workareaStyle} from '~/react/styles'

type TProps = {
    tables: Array<TTableShape>,
    links: Array<TLinkShape>,
    metrics: TWorkareaMetrics,

    onTableClick: (tableShape: TTableShape) => void,
    onTableMouseDown: (tableShape: TTableShape, point: TPoint) => void,
    onAttrMouseDown: (tableShape: TTableShape, attr: TAttr, point: TPoint) => void,
    onMouseUp: (point: TPoint) => void,
    onMouseMove: (point: TPoint) => void,
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

class Root extends React.Component {
    props: TProps

    render(): * {
        const {
            metrics,
            tables,
            links,
            onTableClick,
            onTableMouseDown,
            onMouseUp,
            onMouseMove,
            onAttrMouseDown,
            } = this.props

        const width = 800
        const height = 600

        return (
            <Workarea
                tables={tables}
                links={links}
                style={workareaStyle}
                metrics={metrics}
                size={{width, height}}
                onTableClick={onTableClick}
                onTableMouseDown={onTableMouseDown}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                onAttrMouseDown={onAttrMouseDown}
            />
        )
    }
}

const mapStateToProps = (state: TState): * => {
    const {tables, links} = state

    const {dnd} = state

    const metrics = metricsSelectors.workarea(state)
    return {
        metrics,
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

            const tableShapeFromMetrics = metrics.tables.filter(({name}) => name === tableShapeFrom.table.name)[0].metrics //todo: check
            const tableShapeToMetrics = metrics.tables.filter(({name}) => name === tableShapeTo.table.name)[0].metrics //todo: check

            const tableShapeFromPosition = {x: tableShapeFrom.position.x, y: tableShapeFrom.position.y}
            const tableShapeToPosition = {x: tableShapeTo.position.x, y: tableShapeTo.position.y}

            const attrFromBounds = tableMetrics.getAttrBounds(tableShapeFromMetrics, tableShapeFromPosition, attrFrom.name)
            const attrToBounds = tableMetrics.getAttrBounds(tableShapeToMetrics, tableShapeToPosition, attrTo.name)

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
        onTableClick: (tableShape: TTableShape) => { return },
        onTableMouseDown: (tableShape: TTableShape, point: TPoint) => {
            dispatch({
                type: 'START_DND',
                target: {
                    type: 'TABLE',
                    name: tableShape.table.name,
                },
                startPoint: point,
            })
        },
        onAttrMouseDown: (tableShape: TTableShape, attr: TAttr, point: TPoint) => {
            dispatch({
                type: 'START_DND',
                target: {
                    type: 'ATTR',
                    name: attr.name,
                    tableName: tableShape.table.name,
                },
                attrName: attr.name,
                startPoint: point,
            })
        },
        onMouseUp: (point: TPoint) => {
            dispatch({type: 'STOP_DND', point})
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
