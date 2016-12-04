// @flow
import ReactDOM from 'react-dom'
import React from 'react'
import {Provider} from 'react-redux'
import {applyMiddleware, createStore} from 'redux'
import createLogger from 'redux-logger'

import type {TState} from '~/types/TState'
import type {TAction} from '~/types/TAction'
import type {TTableShape} from '~/types/TTableShape'
import type {TLinkShape} from '~/types/TLinkShape'

import Root from '~/react/container/Root'
import * as metricsSelectors from '~/react/selectors/metrics'
import {getAttrBounds} from '~/metrics/table'

const initialState = {
    tables: [
        {
            table: {
                name: 'posts', attrs: [
                    {name: 'id'},
                    {name: 'title'},
                    {name: 'user_id'},
                    {name: 'body'},
                ],
            },
            position: {
                x: 0,
                y: 0,
            },
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
            position: {
                x: 500,
                y: 200,
            },
            active: false,
        },
        {
            table: {
                name: 'users', attrs: [
                    {name: 'id'},
                    {name: 'name'},
                ],
            },
            position: {
                x: 300,
                y: 400,
            },
            active: false,
        },
    ],
    links: [
        {
            link: {from: {table: 'comments', attr: 'post_id'}, to: {table: 'posts', attr: 'id'}},
        },
        {
            link: {from: {table: 'posts', attr: 'user_id'}, to: {table: 'users', attr: 'id'}},
        },
        {
            link: {from: {table: 'comments', attr: 'user_id'}, to: {table: 'users', attr: 'id'}},
        },
    ],
    dnd: false,
    tco: false,
}

const reducer = (state: TState = initialState, action: TAction): TState => {
    if (action.type === 'SET_ACTIVE_TABLE') {
        const {name} = action
        return {
            ...state,
            tables: state.tables.map((tableShape) => ({
                ...tableShape,
                active: tableShape.table.name === name,
            })),
        }
    }
    else if (action.type === 'START_DND') {
        if (action.target.type === 'TABLE') {
            const {target: {table}, startPoint} = action
            return {
                ...state,
                dnd: {
                    type: 'TABLE',
                    table,
                    startPoint,
                    lastPoint: startPoint,
                },
            }
        }
        else if (action.target.type === 'ATTR') {
            const {target, startPoint} = action
            const {attr, table} = target
            return {
                ...state,
                dnd: {
                    type: 'ATTR',
                    attr,
                    table,
                    startPoint,
                    lastPoint: startPoint,
                },
            }
        }
    }
    else if (action.type === 'STOP_DND') {
        const {dnd, tables} = state
        const {point} = action
        if (dnd !== false) {
            if (dnd.type === 'TABLE') {
                const {startPoint} = dnd
                const setActive = point.x === startPoint.x && point.y === startPoint.y
                if (setActive) {
                    return {
                        ...state,
                        dnd: false,
                        tables: tables.map((tableState) => ({
                            ...tableState,
                            active: tableState.table.name === dnd.table,
                        })),
                    }
                }
            }
            return {
                ...state,
                dnd: false,
            }
        }
        return state
    }
    else if (action.type === 'MOUSE_MOVE') {
        const {point} = action
        const {dnd} = state
        if (dnd !== false) {
            if (dnd.type === 'TABLE') {
                const {lastPoint, table} = dnd
                const dif = {
                    x: point.x - lastPoint.x,
                    y: point.y - lastPoint.y,
                }
                return {
                    ...state,
                    tables: state.tables.map((nextTableShape): TTableShape => {
                        if (nextTableShape.table.name === table) {
                            return {
                                ...nextTableShape,
                                position: {
                                    x: nextTableShape.position.x + dif.x,
                                    y: nextTableShape.position.y + dif.y,
                                },
                            }
                        }
                        else {
                            return {
                                ...nextTableShape,
                            }
                        }
                    }),
                    dnd: {
                        ...dnd,
                        type: 'TABLE',
                        table: dnd.table,
                        startPoint: dnd.startPoint,
                        lastPoint: point,
                    },
                }
            }
            else if (dnd.type === 'ATTR') {
                const {attr, table} = dnd
                const tableShape = state.tables.filter((tableShape) => tableShape.table.name === table)[0] //todo: check

                const metrics = metricsSelectors.workarea(state)
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
                    const attrIndex = tableShape.table.attrs
                        .map(({name}, i) => ({name, i}))
                        .filter(({name}) => name === attr)
                        .map(({i}) => i)[0]
                    const hoveredAttrIndex = tableShape.table.attrs
                        .map(({name}, i) => ({name, i}))
                        .filter(({name}) => name === hoveredAttr.name)
                        .map(({i}) => i)[0]

                    const newAttrList = [...tableShape.table.attrs]
                    const [removed] = newAttrList.splice(attrIndex, 1)
                    newAttrList.splice(hoveredAttrIndex, 0, removed)

                    return {
                        ...state,
                        tables: state.tables.map((nextTableShape): TTableShape => {
                            if (nextTableShape.table.name === table) {
                                return {
                                    ...nextTableShape,
                                    table: {
                                        ...nextTableShape.table,
                                        attrs: newAttrList,
                                    },
                                }
                            }
                            else {
                                return {
                                    ...nextTableShape,
                                }
                            }
                        }),
                        dnd: {
                            type: 'ATTR',
                            attr: dnd.attr,
                            table: dnd.table,
                            startPoint: dnd.startPoint,
                            lastPoint: point,
                        },
                    }
                }
            }
        }
    }
    else if (action.type === 'START_TCO') {
        if (action.attrs.type === 'ADD_LINK') {
            const {attr, table} = action.attrs
            return {
                ...state,
                tco: {
                    type: 'ADD_LINK',
                    attr,
                    table,
                },
            }
        }
    }
    else if (action.type === 'STOP_TCO') {
        return {
            ...state,
            tco: false,
        }
    }
    else if (action.type === 'ADD_LINK') {
        const {from, to} = action
        const filteredLinks = state.links.filter(({link}) => {
            return !(link.from.table === from.table
                && link.from.attr === from.attr
                && link.to.table === to.table
                && link.to.attr === to.attr)
        })
        return {
            ...state,
            links: filteredLinks.concat([
                {link: {from, to}},
            ]),
        }
    }
    return state
}

//const logger = createLogger()
//const store = createStore(
//    reducer,
//    applyMiddleware(logger)
//);

const store = createStore(reducer)

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Provider store={store}>
            <Root/>
        </Provider>,
        document.getElementById('react')
    )
})
