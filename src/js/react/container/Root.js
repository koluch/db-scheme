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
import type {TSelected} from '~/types/TState'

import Workarea from './../presentational/svg/Workarea'
import * as tableMetrics from '~/metrics/table'
import * as metricsSelectors from '~/react/selectors/metrics'
import {workareaStyle} from '~/react/styles'

type TProps = {
    tables: Array<TTableShape>,
    links: Array<TLinkShape>,
    metrics: TWorkareaMetrics,
    selected: TSelected,

    onAttrClick: (tableShape: TTableShape, attr: TAttr) => void,
    onAddLinkClick: (tableShape: TTableShape, attr: TAttr) => void,
    onMouseUp: (point: TPoint) => void,
    onMouseDown: (point: TPoint) => void,
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
            selected,
            onMouseUp,
            onMouseMove,
            onMouseDown,
            onAttrClick,
            onAddLinkClick,
            } = this.props

        const width = 800
        const height = 600

        return (
            <Workarea
                tables={tables}
                links={links}
                selected={selected}
                style={workareaStyle}
                metrics={metrics}
                size={{width, height}}
                onMouseUp={onMouseUp}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onAttrClick={onAttrClick}
                onAddLinkClick={onAddLinkClick}
            />
        )
    }
}

const mapStateToProps = (state: TState): * => {
    const {tables, links, dnd, tco} = state

    const metrics = metricsSelectors.workarea(state)
    return {
        metrics,
        selected: state.selected,
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

            const attrTo = tableShapeTo.table.attrs.filter((x) => x.name === to.attr)[0]
            if (!attrTo) {
                throw new Error(`Attribute "${to.table}.${to.attr}" doesn't exists, unable to draw link`)
            }

            const tableShapeFromMetrics = metrics.tables.filter(({name}) => name === tableShapeFrom.table.name)[0].metrics //todo: check
            const tableShapeToMetrics = metrics.tables.filter(({name}) => name === tableShapeTo.table.name)[0].metrics //todo: check

            const tableShapeFromPosition = {x: tableShapeFrom.position.x, y: tableShapeFrom.position.y}
            const tableShapeToPosition = {x: tableShapeTo.position.x, y: tableShapeTo.position.y}

            const attrFromBounds = tableMetrics.getAttrBounds(tableShapeFromMetrics, tableShapeFromPosition, attrFrom.name)
            if (!attrFromBounds) {
                throw new Error(`Unable to get attribue bounds for
                 attribute "${from.table}.${from.attr}": attribute doesnt exists`)
            }

            const attrToBounds = tableMetrics.getAttrBounds(tableShapeToMetrics, tableShapeToPosition, attrTo.name)
            if (!attrToBounds) {
                throw new Error(`Unable to get attribue bounds for
                 attribute "${to.table}.${to.attr}": attribute doesnt exists`)
            }

            const path = calculatePath(attrFromBounds, attrToBounds)

            return {
                link,
                path,
            }
        }),
        isDnd: dnd !== false,
        tco,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<TAction>): * => {
    return {
        dispatch,
        onTableClick: (tableShape: TTableShape) => { return },
        onMouseUp: (point: TPoint) => {
            dispatch({type: 'MOUSE_UP', point})
        },
        onMouseDown: (point: TPoint) => {
            dispatch({type: 'MOUSE_DOWN', point})
        },
        onAddLinkClick: (tableShape: TTableShape, attr: TAttr) => {
            dispatch({
                type: 'START_TCO',
                attrs: {
                    type: 'ADD_LINK',
                    attr: attr.name,
                    table: tableShape.table.name,
                },
            })
        },
    }
}

const mergeProps = (stateProps, dispatchProps): * => {
    const {isDnd, tco} = stateProps
    const {dispatch} = dispatchProps

    return {
        ...stateProps,
        ...dispatchProps,
        onMouseMove: (point: TPoint) => {
            if (isDnd) {
                dispatch({type: 'MOUSE_MOVE', point})
            }
        },
        onAttrClick: (tableShape: TTableShape, attr: TAttr) => {
            if (tco !== false) {
                if (tco.type === 'ADD_LINK') {
                    dispatch({type: 'STOP_TCO'})
                    dispatch({
                        type: 'ADD_LINK',
                        from: {
                            table: tco.table,
                            attr: tco.attr,
                        },
                        to: {
                            table: tableShape.table.name,
                            attr: attr.name,
                        },
                    })
                }
            }
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Root)
