// @flow
import React from 'react'
import {connect} from 'react-redux'
import type {Dispatch} from 'redux'
import cn from 'bem-cn'

import type {TTableShape} from '~/types/TTableShape'
import type {TLinkShape} from '~/types/TLinkShape'
import type {TSchemeState, TTableState, TSelected, TDndTarget, TTco} from '~/types/TSchemeState'
import type {TState} from '~/types/TState'
import type {TAction} from '~/types/TAction'
import type {TAttr} from '~/types/TAttr'
import type {TBounds} from '~/types/TBounds'
import type {TSize} from '~/types/TSize'
import type {TPoint} from '~/types/TPoint'
import type {TTable} from '~/types/TTable'
import type {TPath} from '~/types/TPath'
import type {TSchemeMetrics} from '~/types/TSchemeMetrics'
import type {THistoryStateRecord} from '~/types/THistoryState'

import * as tableMetricsHelper from '~/metrics/table'
import * as metricsSelectors from '~/react/selectors/metrics'
import {schemeStyle} from '~/react/styles'

import {isAttrProperForeignKeyTarget} from '~/react/helpers/tco'

import Scheme from '~/react/presentational/svg/Scheme'
import Controls from '~/react/presentational/Controls'
import AttrPropsModal from '~/react/presentational/AttrPropsModal'
import TablePropsModal from '~/react/presentational/TablePropsModal'
import ToolPanel from '~/react/presentational/ToolPanel'
import Scroll from '~/react/presentational/Scroll'
import History from '~/react/presentational/History'
import Button from '~/react/presentational/Button'

const calculatePath = (b1: TBounds, b2: TBounds): Array<TPoint> => {
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
    const {scheme: schemeState, history} = state
    const {tables, dnd, tco, mousePosition} = schemeState
    const metrics = metricsSelectors.scheme(schemeState)

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
            const attrFromBounds = tableMetricsHelper.getAttrBounds(tableShapeFromMetrics, tableShapeFrom.position, attrFrom.name)
            if (!attrFromBounds) {
                throw new Error(`Unable to get attribue bounds for
                 attribute "${table}.${attr}": attribute doesnt exists`)
            }
            const attrToBounds = {...mousePosition, width: 0, height: 0}

            newLink = calculatePath(attrFromBounds, attrToBounds)
        }
    }


    const linkShapes = schemeState.tables.map(({table}) => (
        table.foreignKeys.map(({from, to}) => ({
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

            const attrFromBounds = tableMetricsHelper.getAttrBounds(tableShapeFromMetrics, tableShapeFromPosition, attrFrom.name)
            if (!attrFromBounds) {
                throw new Error(`Unable to get attribue bounds for
                 attribute "${from.table}.${from.attr}": attribute doesnt exists`)
            }

            const attrToBounds = tableMetricsHelper.getAttrBounds(tableShapeToMetrics, tableShapeToPosition, attrTo.name)
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
        selected: schemeState.selected,
        tables: schemeState.tables.map((tableState: TTableState): TTableShape => tableState),
        newLink,
        links: linkShapes,
        historyRecords: history.records,
        historyActiveRecord: history.active,
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
        onSchemeClick: () => {
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
                        const attrBounds = tableMetricsHelper.getAttrBounds(tableMetrics, tableShape.position, name)
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
                    const tableFrom = tables.filter((tableShape) => tableShape.table.name === tco.table)[0].table //todo: check
                    const attrFrom = tableFrom.attrs.filter(({name}) => name === tco.attr)[0]
                    if (isAttrProperForeignKeyTarget(tableFrom, attrFrom, tableShape.table, attr)) {
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
        onTableEdit: (oldTable: TTable, newTable: TTable) => {
            dispatch({
                type: 'UPDATE_TABLE',
                oldTable,
                newTable,
            })
        },
        onAttrEdit: (table: string, oldAttr: TAttr, newAttr: TAttr) => {
            dispatch({
                type: 'UPDATE_ATTR',
                table,
                oldAttr,
                newAttr,
            })
        },
        onHistoryRecordActivate: (record: THistoryStateRecord) => {
            dispatch({
                type: 'ACTIVATE_HISTORY_RECORD',
                record: record.id,
            })
        },
    }
}

type TProps = {
    tables: Array<TTableShape>,
    links: Array<TLinkShape>,
    newLink: ?TPath,
    metrics: TSchemeMetrics,
    selected: TSelected,
    dnd: TDndTarget,
    tco: TTco,
    historyRecords: Array<THistoryStateRecord>,
    historyActiveRecord: number,

    onTableClick: (tableShape: TTableShape) => void,
    onTableDeleteClick: (tableShape: TTableShape) => void,
    onSchemeClick: () => void,
    onTableMouseDown: (tableShape: TTableShape, point: TPoint) => void,
    onAttrClick: (tableShape: TTableShape, attr: TAttr) => void,
    onLinkAddClick: (tableShape: TTableShape, attr: TAttr) => void,
    onLinkDeleteClick: (tableShape: TTableShape, attr: TAttr) => void,
    onAttrDeleteClick: (tableShape: TTableShape, attr: TAttr) => void,
    onAttrMouseDown: (tableShape: TTableShape, attr: TAttr, point: TPoint) => void,
    onAttrCreate: (table: string, attr: TAttr) => void,
    onAttrEdit: (table: string, oldAttr: TAttr, newAttr: TAttr) => void,
    onTableCreate: (table: TTable) => void,
    onTableEdit: (oldTable: TTable, newTable: TTable) => void,
    onMouseMove: (point: TPoint) => void,
    onMouseUp: (point: TPoint) => void,
    onHistoryRecordActivate: (record: THistoryStateRecord) => void,
}

type TRootState = {
    attrCreateModal: false | {table: string},
    attrEditModal: false | {table: string, attr: TAttr},
    size: TSize,
    tableCreateModal: boolean,
    tableEditModal: false | {table: TTable},
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(class extends React.Component {
    props: TProps

    state: TRootState = {
        attrCreateModal: false,
        tableCreateModal: false,
        tableEditModal: false,
        attrEditModal: false,
        size: {width: 800, height: 600},
    }

    absoluteContainerEl: *
    resizeListener: *

    componentDidMount() {
        const handler = () => {
            const {width, height} = this.absoluteContainerEl.getBoundingClientRect()
            this.setState({
                size: {width, height},
            })
        }
        this.resizeListener = window.addEventListener('resize', handler)
        handler()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeListener)
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

    handleAttrCreateCancel = () => {
        this.setState({
            attrCreateModal: false,
        })
    }

    handleAttrEditClick = (tableShape: TTableShape, attr: TAttr) => {
        this.setState({
            attrEditModal: {
                table: tableShape.table.name,
                attr,
            },
        })
    }

    handleAttrEdit = (table: string, newAttr: TAttr) => {
        if (this.state.attrEditModal !== false) {
            const {table, attr: oldAttr} = this.state.attrEditModal
            this.setState({
                attrEditModal: false,
            }, () => {
                this.props.onAttrEdit(table, oldAttr, newAttr)
            })
        }
    }


    handleAttrEditCancel = () => {
        this.setState({
            attrEditModal: false,
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

    handleTableEditClick = (tableShape: TTableShape) => {
        this.setState({
            tableEditModal: {table: tableShape.table},
        })
    }

    handleTableEdit = (newTable: TTable) => {
        if (this.state.tableEditModal !== false) {
            const {table: oldTable} = this.state.tableEditModal
            this.setState({
                tableEditModal: false,
            }, () => {
                this.props.onTableEdit(oldTable, newTable)
            })
        }
    }

    handleTableEditCancel = () => {
        this.setState({
            tableEditModal: false,
        })
    }

    handleTableCreateCancel = () => {
        this.setState({
            tableCreateModal: false,
        })
    }

    handleExportToPng = () => {
        const download = (filename: string, dataUrl: string) => {
            const elem = window.document.createElement('a')
            elem.href = dataUrl
            elem.download = filename
            document.body.appendChild(elem)
            elem.click()
            document.body.removeChild(elem)
        }

        const canvas = document.createElement('canvas')
        canvas.setAttribute('width', `${this.state.size.width}`)
        canvas.setAttribute('height', `${this.state.size.height}`)
        const ctx = canvas.getContext('2d')
        if (ctx) {
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
    }

    render(): * {
        const bem = cn('root')

        const {width, height} = this.state.size

        return (
            <div className={bem()}>
                <div style={{display: 'none'}} id="for_export">
                    <Scheme
                        style={schemeStyle}
                        size={{width, height}}
                        tables={this.props.tables}
                        links={this.props.links}
                        selected={false}
                        metrics={this.props.metrics}
                        onClick={() => {}}
                        onMouseMove={() => {}}
                        onAttrClick={() => {}}
                        onAttrMouseDown={() => {}}
                        onTableClick={() => {}}
                        onTableMouseDown={() => {}}
                        onMouseUp={() => {}}
                        newLink={null}
                    />
                </div>
                <div className={bem('scheme-container')}>
                    <div className={bem('scheme-container-absolute')} ref={(el) => { this.absoluteContainerEl = el }}>
                        <Controls
                            isDnd={this.props.dnd !== false}
                            tco={this.props.tco}
                            size={{width, height}}
                            selected={this.props.selected}
                            metrics={this.props.metrics}
                            tables={this.props.tables}
                            onMouseMove={this.props.onMouseMove}
                            onAttrClick={this.props.onAttrClick}
                            onLinkAddClick={this.props.onLinkAddClick}
                            onLinkDeleteClick={this.props.onLinkDeleteClick}
                            onAttrDeleteClick={this.props.onAttrDeleteClick}
                            onAttrEditClick={this.handleAttrEditClick}
                            onTableDeleteClick={this.props.onTableDeleteClick}
                            onTableEditClick={this.handleTableEditClick}
                            onTableCreateClick={this.handleTableCreateClick}
                            onMouseUp={this.props.onMouseUp}
                            onAttrCreateClick={this.handleAttrCreateClick}
                        />
                        <Scheme
                            style={schemeStyle}
                            size={{width, height}}
                            tables={this.props.tables}
                            links={this.props.links}
                            selected={this.props.selected}
                            metrics={this.props.metrics}
                            onClick={this.props.onSchemeClick}
                            onMouseMove={this.props.onMouseMove}
                            onAttrClick={this.props.onAttrClick}
                            onAttrMouseDown={this.props.onAttrMouseDown}
                            onTableClick={this.props.onTableClick}
                            onTableMouseDown={this.props.onTableMouseDown}
                            onMouseUp={this.props.onMouseUp}
                            newLink={this.props.newLink}
                        />
                    </div>
                </div>
                {this.state.attrCreateModal !== false && <AttrPropsModal
                    table={this.state.attrCreateModal.table}
                    onSave={this.handleAttrCreate}
                    onCancel={this.handleAttrCreateCancel}
                                                         />}
                {this.state.attrEditModal !== false && <AttrPropsModal
                    edit
                    table={this.state.attrEditModal.table}
                    name={this.state.attrEditModal.attr.name}
                    onSave={this.handleAttrEdit}
                    onCancel={this.handleAttrEditCancel}
                                                       />}
                {this.state.tableCreateModal !== false && <TablePropsModal
                    onSave={this.handleTableCreate}
                    onCancel={this.handleTableCreateCancel}
                                                          />}
                {this.state.tableEditModal !== false && <TablePropsModal
                    edit
                    name={this.state.tableEditModal.table.name}
                    onSave={this.handleTableEdit}
                    onCancel={this.handleTableEditCancel}
                                                        />}
                <div className={bem('tools')}>
                    <ToolPanel title={'Export'}>
                        <div style={{padding: '20px', display: 'flex'}}>
                            <Button onClick={this.handleExportToPng}>{'Export to PNG'}</Button>
                        </div>
                    </ToolPanel>
                    <ToolPanel title={'History'}>
                        <Scroll>
                            <History
                                records={this.props.historyRecords}
                                active={this.props.historyActiveRecord}
                                onRecordClick={this.props.onHistoryRecordActivate}
                            />
                        </Scroll>
                    </ToolPanel>
                </div>
            </div>
        )
    }
})

