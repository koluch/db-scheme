// @flow
import React from 'react'
import {connect} from 'react-redux'

import type {TTableShape} from '~/types/TTableShape'
import type {TLinkShape} from '~/types/TLinkShape'
import type {TWorkareaStyle} from '~/types/TWorkareaStyle'
import type {TState} from '~/types/TState'
import type {TAction} from '~/types/TAction'

import Workarea from './presentational/Workarea'
import {Layer, Rect, Stage, Group} from 'react-konva'
import type { Dispatch, Store } from 'redux'


type TProps = {
    tableShapes: Array<TTableShape>,
    linkShapes: Array<TLinkShape>,

    onTableClick: (tableShape: TTableShape) => void,
    onTableMouseDown: (tableShape: TTableShape, e: any) => void,
    onMouseUp: () => void,
    onMouseMove: (e: any) => void,

}

const fontStyle = {
    size: 16,
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

const workareaStyle: TWorkareaStyle = {
    table: tableStyle,
}

class Root extends React.Component {
    props: TProps
    constructor(props: TProps) {
        super(props)
    }

    //handleTableClick = (tableShape: TTableShape) => {
    //    this.setState({
    //        ...this.state,
    //        tables: this.state.tables.map((nextTableShape) => ({
    //            ...nextTableShape,
    //            active: nextTableShape.table.name === tableShape.table.name,
    //        })),
    //    })
    //}
    //
    //handleTableMouseDown = (tableShape: TTableShape, e: any) => {
    //    this.setState({
    //        ...this.state,
    //        movingTable: tableShape.active,
    //        movingLastPoint: {x: e.evt.offsetX, y: e.evt.offsetY},
    //    })
    //}
    //
    //handleStageMouseUp = () => {
    //    this.setState({
    //        ...this.state,
    //        movingTable: false,
    //        movingLastPoint: null,
    //    })
    //}
    //
    //handleStageMouseMove = (e: any) => {
    //    const newPoint = {x: e.evt.offsetX, y: e.evt.offsetY}
    //    const {movingTable, movingLastPoint} = this.state
    //    if (movingTable) {
    //        let dif = {x: 0, y: 0}
    //        if (movingLastPoint != null) {
    //            dif = {
    //                x: newPoint.x - movingLastPoint.x,
    //                y: newPoint.y - movingLastPoint.y,
    //            }
    //        }
    //        this.setState({
    //            ...this.state,
    //            tables: this.state.tables.map((nextTableShape) => {
    //                if (nextTableShape.active === true) {
    //                    return {
    //                        ...nextTableShape,
    //                        x: nextTableShape.x + dif.x,
    //                        y: nextTableShape.y + dif.y,
    //                    }
    //                }
    //                else {
    //                    return nextTableShape
    //                }
    //            }),
    //            movingLastPoint: newPoint,
    //        })
    //    }
    //}

    render(): React.Element<*> {
        const {
            tableShapes,
            linkShapes,
            onTableClick,
            onTableMouseDown,
            onMouseUp,
            onMouseMove,
            } = this.props

        const width = 800
        const height = 600

        return (
            <Workarea
                tables={tableShapes}
                links={linkShapes}
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
    const {dnd} = state
    return {
        tableShapes: state.tableShapes,
        linkShapes: state.linkShapes,
        isDnd: dnd !== false,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<TAction>): * => {
    return {
        dispatch,
        onTableClick: (tableShape:TTableShape) => {
            dispatch({type: 'SET_ACTIVE_TABLE', name: tableShape.table.name})
        },
        onTableMouseDown: (tableShape: TTableShape, e: any) => {
            dispatch({
                type: 'START_DND',
                targetType: 'TABLE',
                name: tableShape.table.name,
                startPoint: {x: e.evt.offsetX, y: e.evt.offsetY},
            })
        },
        onMouseUp: () => {
            dispatch({type: 'STOP_DND'})
        },
    }
}

const mergeProps = (stateProps, dispatchProps) => {
    const {isDnd} = stateProps
    const {dispatch} = dispatchProps

    return {
        ...stateProps,
        ...dispatchProps,
        onMouseMove: (e) => {
            if (isDnd) {
                dispatch({type: 'MOUSE_MOVE', point: {x: e.evt.offsetX, y: e.evt.offsetY}})
            }
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Root)
