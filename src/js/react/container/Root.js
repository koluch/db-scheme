// @flow
import React from 'react'
import {connect} from 'react-redux'
import type {Dispatch} from 'redux'
import cn from 'bem-cn'

import type {TTableShape} from '~/types/TTableShape'
import type {TLinkShape} from '~/types/TLinkShape'
import type {TSchemeState, TTableState, TSelected, TDndTarget, TTco} from '~/types/TSchemeState'
import type {TState} from '~/types/TState'
import type {TAction, TStyleChange} from '~/types/TAction'
import type {TAttr} from '~/types/TAttr'
import type {TBounds} from '~/types/TBounds'
import type {TSize} from '~/types/TSize'
import type {TPoint} from '~/types/TPoint'
import type {TTable} from '~/types/TTable'
import type {TPath} from '~/types/TPath'
import type {TSchemeMetrics} from '~/types/TSchemeMetrics'
import type {THistoryStateRecord} from '~/types/THistoryState'
import type {TSchemeStyle} from '~/types/styles/TSchemeStyle'

import * as tableMetricsHelper from '~/metrics/table'
import * as metricsSelectors from '~/react/selectors/metrics'

import {isAttrProperForeignKeyTarget} from '~/react/helpers/tco'

import Scheme from '~/react/presentational/svg/Scheme'
import Controls from '~/react/presentational/Controls'
import AttrPropsModal from '~/react/presentational/modals/AttrPropsModal'
import TablePropsModal from '~/react/presentational/modals/TablePropsModal'
import JsonExportModal from '~/react/presentational/modals/JsonExportModal'
import JsonImportModal from '~/react/presentational/modals/JsonImportModal'
import ToolPanel from '~/react/presentational/tools/ToolPanel'
import ToolPanelGroup from '~/react/presentational/tools/ToolPanelGroup'
import Scroll from '~/react/presentational/Scroll'
import History from '~/react/presentational/History'
import Button from '~/react/presentational/Button'
import NumberInput from '~/react/presentational/inputs/NumberInput'
import TextInput from '~/react/presentational/inputs/TextInput'
import ColorInput from '~/react/presentational/inputs/ColorInput'
import FieldSet from '~/react/presentational/tools/FieldSet'

const calcConnections = (p1: TPoint, p2: TPoint, direct: boolean): Array<TPath> => {
    if (direct) {
        return [
            [p1, {x: p1.x, y: p2.y}, p2],
            [p1, {x: p2.x, y: p1.y}, p2],
        ]
    }
    else {
        return [[
            p1,
            {x: p1.x + (p2.x - p1.x) / 2, y: p1.y},
            {x: p1.x + (p2.x - p1.x) / 2, y: p2.y},
            p2,
        ]]
    }
}

const isPointInBounds = (p: TPoint, b: TBounds): boolean => {
    return p.x > b.x
        && p.x < b.x + b.width
        && p.y > b.y
        && p.y < b.y + b.height
}

const isPathCrossBound = (path: TPath, b: TBounds): boolean => {
    for (let i = 0; i < path.length - 1; ++i) {
        const p1 = path[i]
        const p2 = path[i + 1]

        if (isPointInBounds(p1, b)) {
            return true
        }
        if (isPointInBounds(p2, b)) {
            return true
        }

        if (p1.y >= b.y && p1.y <= b.y + b.height
            && p2.y >= b.y && p2.y <= b.y + b.height) {
            if (p1.x < b.x && p2.x > b.x + b.width) {
                return true
            }
        }
        if (p1.x >= b.x && p1.x <= b.x + b.width
            && p2.x >= b.x && p2.x <= b.x + b.width) {
            if (p1.y < b.y && p2.y > b.y + b.height) {
                return true
            }
        }
    }
    return false
}

const calcPathLength = (path: TPath): number => {
    let len = 0
    for (let i = 0; i < path.length - 1; ++i) {
        const p1 = path[i]
        const p2 = path[i + 1]

        if (p1.x === p2.x) {
            len += p1.y > p2.y ? p1.y - p2.y : p2.y - p1.y
        }
        else {
            len += p1.x > p2.x ? p1.x - p2.x : p2.x - p1.x
        }
    }
    return len
}

const calculatePath = (b1: TBounds, b2: TBounds): Array<TPoint> => {
    if (b1.x === b2.x && b1.y === b2.y && b1.width === b2.width && b1.height === b2.height) {
        return []
    }

    // Link connection should be placed in some distance from attribute bounds
    const MARGIN = 15

    // Build attribute bounds, considering margins
    const b1m = {x: b1.x - MARGIN, y: b1.y, width: b1.width + (MARGIN * 2), height: b1.height}
    const b2m = {x: b2.x - MARGIN, y: b2.y, width: b2.width + (MARGIN * 2), height: b2.height}

    // Build left/right connection points, considering or not margins
    const b1left = {x: b1.x, y: b1.y + b1.height / 2}
    const b1right = {x: b1.x + b1.width, y: b1.y + b1.height / 2}
    const b2left = {x: b2.x, y: b2.y + b2.height / 2}
    const b2right = {x: b2.x + b2.width, y: b2.y + b2.height / 2}

    const b1leftm = {x: b1m.x, y: b1m.y + b1m.height / 2}
    const b1rightm = {x: b1m.x + b1m.width, y: b1m.y + b1m.height / 2}
    const b2leftm = {x: b2m.x, y: b2m.y + b2m.height / 2}
    const b2rightm = {x: b2m.x + b2m.width, y: b2m.y + b2m.height / 2}

    // Calculate pathes, adding to each finishing points
    const pathes: Array<TPath> = [
        ...(calcConnections(b1leftm, b2rightm, false).map((path: TPath) => [b1left, ...path, b2right])),
        ...(calcConnections(b1rightm, b2leftm, false).map((path: TPath) => [b1right, ...path, b2left])),
        ...(calcConnections(b1leftm, b2leftm, true).map((path: TPath) => [b1left, ...path, b2left])),
        ...(calcConnections(b1rightm, b2rightm, true).map((path: TPath) => [b1right, ...path, b2right])),
    ]

    // Take only pathes which are not cross extended bounds
    let filteredPathes = pathes
        .filter((path) => (
            // check if path is crossing some bound (cutting first and last point, becouse they do cross bounds)
            !isPathCrossBound(path.slice(1, path.length - 1), b1m)
            && !isPathCrossBound(path.slice(1, path.length - 1), b2m)
        ))

    // Sometimes, there are not appropriate pathes (bounds can overlap, for example)
    if (filteredPathes.length === 0) {
        filteredPathes = pathes
    }

    const bestPath: TPath = filteredPathes
        // Calculate length for each path
        .map((path) => ({path, length: calcPathLength(path)}))
        // Take shorted path
        .reduce((minPath, nextPath) => nextPath.length < minPath.length ? nextPath : minPath).path

    return bestPath
}

const mapStateToProps = (state: TState): * => {
    const {scheme: schemeState, history} = state
    const {tables, dnd, tco, mousePosition, size, style} = schemeState
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
        fullSchemeState: schemeState,
        metrics,
        selected: schemeState.selected,
        tables: schemeState.tables.map((tableState: TTableState): TTableShape => tableState),
        newLink,
        links: linkShapes,
        historyRecords: history.records,
        historyActiveRecord: history.active,
        dnd,
        tco,
        size,
        style,
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
        onImportSchemeState: (schemeState: TSchemeState) => {
            dispatch({
                type: 'IMPORT_SCHEME_STATE',
                schemeState,
            })
        },
        onChangeSchemeSize: (size: TSize) => {
            dispatch({
                type: 'CHANGE_SCHEME_SIZE',
                size,
            })
        },

        changeStyle: (change: TStyleChange) => {
            dispatch({
                type: 'CHANGE_STYLE',
                change,
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
    fullSchemeState: TSchemeState,
    tables: Array<TTableShape>,
    links: Array<TLinkShape>,
    newLink: ?TPath,
    metrics: TSchemeMetrics,
    selected: TSelected,
    dnd: TDndTarget,
    tco: TTco,
    historyRecords: Array<THistoryStateRecord>,
    historyActiveRecord: number,
    style: TSchemeStyle,

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
    onImportSchemeState: (schemeState: TSchemeState) => void,
    onChangeSchemeSize: (size: TSize) => void,
    changeStyle: (action: TStyleChange) => void,
    size: TSize,
}

type TRootState = {
    attrCreateModal: false | {table: string},
    attrEditModal: false | {table: string, attr: TAttr},
    tableCreateModal: boolean,
    tableEditModal: false | {table: TTable},
    jsonExportModal: false | {json: string},
    jsonImportModal: boolean,
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(class extends React.Component {
    props: TProps

    state: TRootState = {
        attrCreateModal: false,
        tableCreateModal: false,
        tableEditModal: false,
        jsonExportModal: false,
        jsonImportModal: false,
        attrEditModal: false,
    }

    absoluteContainerEl: *

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

    handleExportToPngButton = () => {
        const download = (filename: string, dataUrl: string) => {
            const elem = window.document.createElement('a')
            elem.href = dataUrl
            elem.download = filename
            document.body.appendChild(elem)
            elem.click()
            document.body.removeChild(elem)
        }

        const canvas = document.createElement('canvas')
        canvas.setAttribute('width', `${this.props.size.width}`)
        canvas.setAttribute('height', `${this.props.size.height}`)
        const ctx = canvas.getContext('2d')
        if (ctx) {
            const img = new Image()
            img.onload = () => {
                ctx.drawImage(img, 0, 0)
                const dataUrl = canvas.toDataURL('image/png')
                download('scheme.png', dataUrl)
            }

            const svgNode = document.querySelector('#for_export svg')
            if (svgNode) {
                const body = new XMLSerializer().serializeToString(svgNode)
                const encoded = window.btoa(body)
                img.src = 'data:image/svg+xml;base64,' + encoded
            }
        }
    }

    handleExportToJsonButton = () => {
        const {fullSchemeState} = this.props
        const data = {
            version: null,
            scheme: fullSchemeState,
        }
        this.setState({
            jsonExportModal: {json: JSON.stringify(data)},
        })
    }

    handleImportFromJsonButton = () => {
        this.setState({
            jsonImportModal: true,
        })
    }

    handleImportJson = (schemeState: TSchemeState) => {
        this.setState({
            jsonImportModal: false,
        })
        this.props.onImportSchemeState(schemeState)
    }

    renderSettingsStyle() {
        const {style} = this.props
        const {changeStyle} = this.props
        return (
            <ToolPanelGroup>
                <ToolPanel title="Tables" opened={false}>
                    <ToolPanelGroup>
                        <ToolPanel title="Attributes" opened={false}>
                            <ToolPanelGroup>
                                <ToolPanel title="Font" opened={false}>
                                    <FieldSet fields={[
                                        ['Color', <ColorInput size="10" value={style.table.attrs.font.color} onChange={(value) => { changeStyle({field: 'TABLE_ATTRS_FONT_COLOR', value}) }}/>],
                                        ['Size', <NumberInput size="10" value={style.table.attrs.font.size} onChange={(value) => { changeStyle({field: 'TABLE_ATTRS_FONT_SIZE', value}) }}/>],
                                        ['Style', <TextInput size="10" value={style.table.attrs.font.style} onChange={(value) => { changeStyle({field: 'TABLE_ATTRS_FONT_STYLE', value}) }}/>],
                                        ['Weight', <TextInput size="10" value={style.table.attrs.font.weight} onChange={(value) => { changeStyle({field: 'TABLE_ATTRS_FONT_WEIGHT', value}) }}/>],
                                        ['Family', <TextInput size="10" value={style.table.attrs.font.family} onChange={(value) => { changeStyle({field: 'TABLE_ATTRS_FONT_FAMILY', value}) }}/>],
                                    ]}/>
                                </ToolPanel>
                                <ToolPanel title="Paddings" opened={false}>
                                    <FieldSet fields={[
                                        ['Top', <NumberInput size="10" value={style.table.attrs.padding.top} onChange={(value) => { changeStyle({field: 'TABLE_ATTRS_PADDING_TOP', value}) }}/>],
                                        ['Right', <NumberInput size="10" value={style.table.attrs.padding.right} onChange={(value) => { changeStyle({field: 'TABLE_ATTRS_PADDING_RIGHT', value}) }}/>],
                                        ['Bottom', <NumberInput size="10" value={style.table.attrs.padding.bottom} onChange={(value) => { changeStyle({field: 'TABLE_ATTRS_PADDING_BOTTOM', value}) }}/>],
                                        ['Left', <NumberInput size="10" value={style.table.attrs.padding.left} onChange={(value) => { changeStyle({field: 'TABLE_ATTRS_PADDING_LEFT', value}) }}/>],
                                    ]}/>
                                </ToolPanel>
                            </ToolPanelGroup>
                        </ToolPanel>

                        <ToolPanel title="Header" opened={false}>
                            <label>
                                <FieldSet fields={[
                                    ['Background color', <ColorInput value={style.table.header.backgroundColor} size="10" onChange={(value) => { changeStyle({field: 'TABLE_HEADER_BACKGROUND_COLOR', value}) }}/>],
                                ]}/>
                            </label>
                            <ToolPanelGroup>
                                <ToolPanel title="Font" opened={false}>
                                    <FieldSet fields={[
                                        ['Color', <ColorInput size="10" value={style.table.header.font.color} onChange={(value) => { changeStyle({field: 'TABLE_HEADER_FONT_COLOR', value}) }}/>],
                                        ['Size', <NumberInput size="10" value={style.table.header.font.size} onChange={(value) => { changeStyle({field: 'TABLE_HEADER_FONT_SIZE', value}) }}/>],
                                        ['Style', <TextInput size="10" value={style.table.header.font.style} onChange={(value) => { changeStyle({field: 'TABLE_HEADER_FONT_STYLE', value}) }}/>],
                                        ['Weight', <TextInput size="10" value={style.table.header.font.weight} onChange={(value) => { changeStyle({field: 'TABLE_HEADER_FONT_WEIGHT', value}) }}/>],
                                        ['Family', <TextInput size="10" value={style.table.header.font.family} onChange={(value) => { changeStyle({field: 'TABLE_HEADER_FONT_FAMILY', value}) }}/>],
                                    ]}/>
                                </ToolPanel>
                                <ToolPanel title="Paddings" opened={false}>
                                    <FieldSet fields={[
                                        ['Top', <NumberInput size="10" value={style.table.header.padding.top} onChange={(value) => { changeStyle({field: 'TABLE_HEADER_PADDING_TOP', value}) }}/>],
                                        ['Right', <NumberInput size="10" value={style.table.header.padding.right} onChange={(value) => { changeStyle({field: 'TABLE_HEADER_PADDING_RIGHT', value}) }}/>],
                                        ['Bottom', <NumberInput size="10" value={style.table.header.padding.bottom} onChange={(value) => { changeStyle({field: 'TABLE_HEADER_PADDING_BOTTOM', value}) }}/>],
                                        ['Left', <NumberInput size="10" value={style.table.header.padding.left} onChange={(value) => { changeStyle({field: 'TABLE_HEADER_PADDING_LEFT', value}) }}/>],
                                    ]}/>
                                </ToolPanel>
                            </ToolPanelGroup>
                        </ToolPanel>
                        <ToolPanel title="Border" opened={false}>
                            <FieldSet fields={[
                                ['Color', <ColorInput value={style.table.border.color} onChange={(value) => { changeStyle({field: 'TABLE_BORDER_COLOR', value}) }}/>],
                            ]}/>
                        </ToolPanel>
                    </ToolPanelGroup>
                </ToolPanel>
                <ToolPanel title="Links" opened={false}>
                    <label>{'Stroke style: '}<input size="10"/></label>
                </ToolPanel>
            </ToolPanelGroup>
        )
    }

    renderSettingsPanel() {
        return (
            <ToolPanel title={'Settings'} opened={false}>
                <Scroll>
                    <div style={{padding: '10px'}}>
                        <FieldSet fields={[
                            [
                                'Size',
                                <div>
                                    <NumberInput
                                        size="5"
                                        value={this.props.size.width}
                                        onChange={(value) => { this.props.onChangeSchemeSize({...this.props.size, width: value}) }}
                                    />
                                    {' x '}
                                    <NumberInput
                                        size="5"
                                        value={this.props.size.height}
                                        onChange={(value) => { this.props.onChangeSchemeSize({...this.props.size, height: value}) }}
                                    />
                                </div>,
                            ],
                        ]}/>
                        {this.renderSettingsStyle()}
                    </div>
                </Scroll>
            </ToolPanel>
        )
    }

    render(): * {
        const bem = cn('root')

        const {width, height} = this.props.size

        return (
            <div className={bem()}>
                <div style={{display: 'none'}} id="for_export">
                    <Scheme
                        style={this.props.style}
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
                            style={this.props.style}
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

                <div className={bem('tools')}>
                    <ToolPanelGroup mode="SINGLE">
                        <ToolPanel title="Export / Import" opened={false}>
                            <p><b>{'Export'}</b></p>
                            <div style={{display: 'flex'}}>
                                <Button onClick={this.handleExportToPngButton}>{'PNG'}</Button>
                                <Button onClick={this.handleExportToJsonButton}>{'JSON'}</Button>
                            </div>
                            <br/>
                            <p><b>{'Import'}</b></p>
                            <div style={{display: 'flex'}}>
                                <Button onClick={this.handleImportFromJsonButton}>{'JSON'}</Button>
                            </div>
                        </ToolPanel>
                        {this.renderSettingsPanel()}
                        <ToolPanel title="History">
                            <Scroll>
                                <History
                                    records={this.props.historyRecords}
                                    active={this.props.historyActiveRecord}
                                    onRecordClick={this.props.onHistoryRecordActivate}
                                />
                            </Scroll>
                        </ToolPanel>
                    </ToolPanelGroup>
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

                {this.state.jsonExportModal !== false && <JsonExportModal
                    json={this.state.jsonExportModal.json}
                    onCancel={() => this.setState({jsonExportModal: false})}
                />}
                {this.state.jsonImportModal !== false && <JsonImportModal
                    onSave={this.handleImportJson}
                    onCancel={() => this.setState({jsonImportModal: false})}
                />}
                {this.state.jsonExportModal !== false && <JsonExportModal
                    json={this.state.jsonExportModal.json}
                    onCancel={() => this.setState({jsonExportModal: false})}
                />}
                {this.state.jsonImportModal !== false && <JsonImportModal
                    onSave={this.handleImportJson}
                    onCancel={() => this.setState({jsonImportModal: false})}
                />}
            </div>
        )
    }
})

