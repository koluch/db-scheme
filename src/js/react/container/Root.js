// @flow
import React from 'react'
import {connect} from 'react-redux'
import type {Dispatch, Store} from 'redux'

import type {TTableShape} from '~/types/TTableShape'
import type {TLinkShape} from '~/types/TLinkShape'
import type {TWorkareaStyle} from '~/types/TWorkareaStyle'
import type {TState, TTableState, TLinkState} from '~/types/TState'
import type {TAction} from '~/types/TAction'
import type {TAttr} from '~/types/TAttr'
import type {TBounds} from '~/types/TBounds'
import type {TPoint} from '~/types/TPoint'
import type {TTable} from '~/types/TTable'
import type {TPath} from '~/types/TPath'
import type {TWorkareaMetrics} from '~/types/TWorkareaMetrics'
import type {TSelected} from '~/types/TState'

import Workarea from '~/react/presentational/svg/Workarea'
import AttrAddModal from '~/react/presentational/AttrAddModal'
import TableAddModal from '~/react/presentational/TableAddModal'
import * as tableMetrics from '~/metrics/table'
import * as metricsSelectors from '~/react/selectors/metrics'
import {workareaStyle} from '~/react/styles'
import {getAttrBounds, getTableBounds, getHeaderBounds} from '~/metrics/table'



const calculatePath = (b1: TBounds, b2: TBounds): Array<TPoint> => {
    const CONNECTION_LINE_WIDTH = 10

    let start = null
    let end = null
    // let end
    if (b1.x < b2.x) {
        start = {x: b1.x + b1.width, y: b1.y + b1.height / 2}
        end = {x: b2.x, y: b2.y + b2.height / 2}
    }
    else {
        start = {x: b1.x, y: b1.y + b1.height / 2}
        end = {x: b2.x + b2.width, y: b2.y + b2.height / 2}
    }


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

const mapStateToProps = (state: TState): * => {
    const {tables, dnd, tco, mousePosition} = state
    const metrics = metricsSelectors.workarea(state)

    let newLink = null
    if (tco !== false) {
        if (tco.type === 'ADD_LINK') {
            const {table, attr} = tco

            const tableShapeFrom = tables.filter((x) => x.table.name === table)[0]
            if (!tableShapeFrom) {
                throw new Error(`Table "${table}" doesn't exists, unable to draw link`)
            }

            const attrFrom = tableShapeFrom.table.attrs.filter((x) => x.name === attr)[0]
            if (!attrFrom) {
                throw new Error(`Attribute "${table}.${attr}" doesn't exists, unable to draw link`)
            }

            const tableShapeFromMetrics = metrics.tables.filter(({name}) => name === tableShapeFrom.table.name)[0].metrics //todo: check
            const attrFromBounds = tableMetrics.getAttrBounds(tableShapeFromMetrics, tableShapeFrom.position, attrFrom.name)
            if (!attrFromBounds) {
                throw new Error(`Unable to get attribue bounds for
                 attribute "${table}.${attr}": attribute doesnt exists`)
            }
            const attrToBounds = {...mousePosition, width: 0, height: 0}

            newLink = calculatePath(attrFromBounds, attrToBounds)
        }
    }


    const linkShapes = state.tables.map(({table}) => (
        table.foreignKeys.map(({from,to}) => ({
            from: {
                ...from,
                table: table.name,
            },
            to,
        })).map((link) => {
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
        })
    )).reduce((acc, links) => acc.concat(links), [])


    return {
        metrics,
        selected: state.selected,
        tables: state.tables.map((tableState: TTableState): TTableShape => tableState),
        newLink,
        links: linkShapes,
        dnd,
        tco,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<TAction>): * => {
    return {
        dispatch,
        onTableClick: (tableShape: TTableShape) => {
            dispatch({
                type: 'SELECT',
                target: 'TABLE',
                table: tableShape.table.name,
            })
        },
        onTableMouseDown: (tableShape: TTableShape, point: TPoint) => {
            dispatch({
                type: 'START_DND',
                attrs: {
                    type: 'TABLE',
                    table: tableShape.table.name,
                },
                startPoint: point,
            })
        },
        onMouseUp: (point: TPoint) => {
            dispatch({
                type: 'STOP_DND',
                point,
            })
        },
        onAttrMouseDown: (tableShape: TTableShape, attr: TAttr, point: TPoint) => {
            dispatch({
                type: 'START_DND',
                attrs: {
                    type: 'ATTR',
                    attr: attr.name,
                    table: tableShape.table.name,
                },
                startPoint: point,
            })
        },
        onLinkAddClick: (tableShape: TTableShape, attr: TAttr) => {
            dispatch({
                type: 'START_TCO',
                attrs: {
                    type: 'ADD_LINK',
                    attr: attr.name,
                    table: tableShape.table.name,
                },
            })
        },
        onLinkDeleteClick: (tableShape: TTableShape, attr: TAttr) => {
            dispatch({
                type: 'DELETE_LINK',
                attr: attr.name,
                table: tableShape.table.name,
            })
        },
        onAttrDeleteClick: (tableShape: TTableShape, attr: TAttr) => {
            dispatch({
                type: 'DELETE_ATTR',
                attr: attr.name,
                table: tableShape.table.name,
            })
        },
        onTableDeleteClick: (tableShape: TTableShape) => {
            dispatch({
                type: 'DELETE_TABLE',
                table: tableShape.table.name,
            })
        },
    }
}

const mergeProps = (stateProps, dispatchProps): * => {
    const {tco, dnd, tables, metrics} = stateProps
    const {dispatch} = dispatchProps

    return {
        ...stateProps,
        ...dispatchProps,
        onWorkareaClick: () => {
            if (tco !== false) {
                dispatch({
                    type: 'STOP_TCO',
                })
            }
            else {
                dispatch({
                    type: 'CANCEL_SELECT',
                })
            }
        },
        onMouseMove: (point: TPoint) => {
            dispatch({
                type: 'MOUSE_MOVE',
                point,
            })

            if (dnd !== false) {
                if (dnd.type === 'TABLE') {
                    const {lastPoint, table} = dnd

                    const tableState = tables.filter((tableState) => tableState.table.name === table)[0]
                    if (tableState) {
                        const dif = {
                            x: point.x - lastPoint.x,
                            y: point.y - lastPoint.y,
                        }
                        dispatch({
                            type: 'MOVE_TABLE',
                            table,
                            position: {
                                x: tableState.position.x + dif.x,
                                y: tableState.position.y + dif.y,
                            },
                        })
                    }
                }
                else if (dnd.type === 'ATTR') {
                    const {attr, table} = dnd
                    const tableShape = tables.filter((tableShape) => tableShape.table.name === table)[0] //todo: check
                    const tableMetrics = metrics.tables.filter(({name}) => name === table)[0].metrics //todo: check

                    const hoveredAttr = tableShape.table.attrs.filter(({name}) => {
                        const attrBounds = getAttrBounds(tableMetrics, tableShape.position, name)
                        if (attrBounds) {
                            return point.y > attrBounds.y
                                && point.y < attrBounds.y + attrBounds.height
                                && point.x > attrBounds.x
                                && point.x < attrBounds.x + attrBounds.width
                        }
                        return false
                    })[0]

                    if (hoveredAttr && hoveredAttr.name !== attr) {
                        dispatch({
                            type: 'SWITCH_ATTRS',
                            table,
                            attr1: attr,
                            attr2: hoveredAttr.name,
                        })
                    }
                }
                dispatch({
                    type: 'UPDATE_DND',
                    lastPoint: point,
                })
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
            else {
                dispatch({
                    type: 'SELECT',
                    target: 'ATTR',
                    table: tableShape.table.name,
                    attr: attr.name,
                })
            }
        },
        onAttrCreate: (table: string, attr: TAttr) => {
            dispatch({
                type: 'ADD_ATTR',
                table,
                attr,
            })
        },
        onTableCreate: (table: TTable) => {
            dispatch({
                type: 'ADD_TABLE',
                table,
            })
        },
    }
}

type TProps = {
    tables: Array<TTableShape>,
    links: Array<TLinkShape>,
    newLink: ?TPath,
    metrics: TWorkareaMetrics,
    selected: TSelected,

    onTableClick: (tableShape: TTableShape) => void,
    onTableDeleteClick: (tableShape: TTableShape) => void,
    onWorkareaClick: () => void,
    onTableMouseDown: (tableShape: TTableShape, point: TPoint) => void,
    onAttrClick: (tableShape: TTableShape, attr: TAttr) => void,
    onLinkAddClick: (tableShape: TTableShape, attr: TAttr) => void,
    onLinkDeleteClick: (tableShape: TTableShape, attr: TAttr) => void,
    onAttrDeleteClick: (tableShape: TTableShape, attr: TAttr) => void,
    onAttrMouseDown: (tableShape: TTableShape, attr: TAttr, point: TPoint) => void,
    onAttrCreate: (table: string, attr: TAttr) => void,
    onTableCreate: (table: TTable) => void,
    onMouseMove: (point: TPoint) => void,
    onMouseUp: (point: TPoint) => void,
}

type TRootState = {
    attrCreateModal: false | {table: string},
    tableCreateModal: boolean,
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(class extends React.Component {
    props: TProps

    state: TRootState = {
        attrCreateModal: false,
        tableCreateModal: false,
    }

    handleAttrCreateClick = (tableShape: TTableShape) => {
        this.setState({
            attrCreateModal: {
                table: tableShape.table.name,
            },
        })
    }

    handleAttrCreate = (table: string, attr: TAttr) => {
        this.setState({
            attrCreateModal: false,
        }, () => {
            this.props.onAttrCreate(table, attr)
        })
    }

    handleAttrCancel = () => {
        this.setState({
            attrCreateModal: false,
        })
    }

    handleTableCreateClick = () => {
        this.setState({
            tableCreateModal: true,
        })
    }

    handleTableCreate = (table: TTable) => {
        this.setState({
            tableCreateModal: false,
        }, () => {
            this.props.onTableCreate(table)
        })
    }

    handleTableCancel = () => {
        this.setState({
            tableCreateModal: false,
        })
    }

    exportToPng = () => {
        const download = (filename: string, dataUrl: string) => {
            const elem = window.document.createElement('a')
            elem.href = dataUrl
            elem.download = filename
            document.body.appendChild(elem)
            elem.click()
            document.body.removeChild(elem)
        }

        const canvas = document.createElement('canvas')
        canvas.setAttribute('width', 800)
        canvas.setAttribute('height', 600)
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.onload = () => {
            ctx.drawImage(img, 0, 0)
            const dataUrl = canvas.toDataURL('image/png')
            download('scheme.png', dataUrl)
        }

        const body = new XMLSerializer().serializeToString(document.querySelector('#for_export svg'))
        const encoded = window.btoa(body)
        img.src = 'data:image/svg+xml;base64,' + encoded
    }

    render(): * {
        const width = 800
        const height = 600

        return (
            <div>
                <div><button onClick={this.handleTableCreateClick}>Create table</button></div>
                <div><button onClick={this.exportToPng}>Export to PNG</button></div>
                <div style={{display: 'none'}} id="for_export">
                    <Workarea
                        style={workareaStyle}
                        size={{width, height}}
                        tables={this.props.tables}
                        links={this.props.links}
                        selected={false}
                        metrics={this.props.metrics}
                        onClick={() => {}}
                        onMouseMove={() => {}}
                        onAttrClick={() => {}}
                        onLinkAddClick={() => {}}
                        onLinkDeleteClick={() => {}}
                        onAttrDeleteClick={() => {}}
                        onAttrMouseDown={() => {}}
                        onTableClick={() => {}}
                        onTableMouseDown={() => {}}
                        onTableDeleteClick={() => {}}
                        onMouseUp={() => {}}
                        onAttrCreateClick={() => {}}
                        newLink={null}
                    />
                </div>
                <Workarea
                    style={workareaStyle}
                    size={{width, height}}
                    tables={this.props.tables}
                    links={this.props.links}
                    selected={this.props.selected}
                    metrics={this.props.metrics}
                    onClick={this.props.onWorkareaClick}
                    onMouseMove={this.props.onMouseMove}
                    onAttrClick={this.props.onAttrClick}
                    onLinkAddClick={this.props.onLinkAddClick}
                    onLinkDeleteClick={this.props.onLinkDeleteClick}
                    onAttrDeleteClick={this.props.onAttrDeleteClick}
                    onAttrMouseDown={this.props.onAttrMouseDown}
                    onTableClick={this.props.onTableClick}
                    onTableMouseDown={this.props.onTableMouseDown}
                    onTableDeleteClick={this.props.onTableDeleteClick}
                    onMouseUp={this.props.onMouseUp}
                    onAttrCreateClick={this.handleAttrCreateClick}
                    newLink={this.props.newLink}
                />
                {this.state.attrCreateModal !== false && <AttrAddModal
                    table={this.state.attrCreateModal.table}
                    onSave={this.handleAttrCreate}
                    onCancel={this.handleAttrCancel}
                />}
                {this.state.tableCreateModal !== false && <TableAddModal
                    onSave={this.handleTableCreate}
                    onCancel={this.handleTableCancel}
                />}
            </div>
        )
    }
})

