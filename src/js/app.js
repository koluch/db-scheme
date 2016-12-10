// @flow
import ReactDOM from 'react-dom'
import React from 'react'
import {Provider} from 'react-redux'
import {applyMiddleware, createStore} from 'redux'
import createLogger from 'redux-logger'

import type {TState, TTableState, TLinkState} from '~/types/TState'
import type {TAction} from '~/types/TAction'
import type {TPoint} from '~/types/TPoint'
import type {TBounds} from '~/types/TBounds'
import type {TTable} from '~/types/TTable'

import Root from '~/react/container/Root'
import * as metricsSelectors from '~/react/selectors/metrics'
import {getAttrBounds, getTableBounds, getHeaderBounds} from '~/metrics/table'

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
    selected: false,
    mousePosition: {x: 0, y: 0},
}

//todo: move to helper
const isInBounds = (point: TPoint, bounds: TBounds): boolean => {
    return point.x >= bounds.x
        && point.y >= bounds.y
        && point.x <= bounds.x + bounds.width
        && point.y <= bounds.y + bounds.height
}

type TClickTarget = {
    type: 'TABLE',
    table: string,
} | {
    type: 'TABLE_HEADER',
    table: string,
} | {
    type: 'ATTR',
    table: string,
    attr: string,
} | {
    type: 'NONE',
}


const reducer = (state: TState = initialState, action: TAction): TState => {
    if (action.type === 'MOVE_TABLE') {
        const {dnd} = state
        const {table, position} = action
        return {
            ...state,
            tables: state.tables.map((nextTableState): TTableState => {
                if (nextTableState.table.name === table) {
                    return {
                        ...nextTableState,
                        position,
                    }
                }
                else {
                    return {
                        ...nextTableState,
                    }
                }
            }),
        }
    }
    else if (action.type === 'MOUSE_MOVE') {
        const {point} = action
        return {
            ...state,
            mousePosition: point,
        }
    }
    else if (action.type === 'SWITCH_ATTRS') {
        const {dnd} = state
        const {table, attr1, attr2} = action
        return {
            ...state,
            tables: state.tables.map((nextTableState): TTableState => {
                if (nextTableState.table.name === table) {
                    const attrIndex = nextTableState.table.attrs
                        .map(({name}, i) => ({name, i}))
                        .filter(({name}) => name === attr1)
                        .map(({i}) => i)[0]
                    const hoveredAttrIndex = nextTableState.table.attrs
                        .map(({name}, i) => ({name, i}))
                        .filter(({name}) => name === attr2)
                        .map(({i}) => i)[0]

                    const newAttrList = [...nextTableState.table.attrs]
                    const [removed] = newAttrList.splice(attrIndex, 1)
                    newAttrList.splice(hoveredAttrIndex, 0, removed)

                    return {
                        ...nextTableState,
                        table: {
                            ...nextTableState.table,
                            attrs: newAttrList,
                        },
                    }
                }
                else {
                    return {
                        ...nextTableState,
                    }
                }
            }),
        }
    }
    else if (action.type === 'START_DND') {
        const {attrs} = action
        if (attrs.type === 'TABLE') {
            const {table} = attrs
            const {startPoint} = action
            return {
                ...state,
                dnd: {
                    type: 'TABLE',
                    table,
                    lastPoint: startPoint,
                },
            }
        }
        else if (attrs.type === 'ATTR') {
            const {attr, table} = attrs
            const {startPoint} = action
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
    else if (action.type === 'UPDATE_DND') {
        const {dnd} = state
        const {lastPoint} = action
        if (dnd !== false) {
            if (dnd.type === 'TABLE') {
                return {
                    ...state,
                    dnd: {
                        type: 'TABLE',
                        table: dnd.table,
                        lastPoint,
                    },
                }
            }
            else if (dnd.type === 'ATTR') {
                return {
                    ...state,
                    dnd: {
                        type: 'ATTR',
                        attr: dnd.attr,
                        table: dnd.table,
                        lastPoint,
                    },
                }
            }
        }
    }
    else if (action.type === 'STOP_DND') {
        const {dnd, tables} = state
        const {point} = action
        if (dnd !== false) {
            return {
                ...state,
                dnd: false,
            }
        }
        return state
    }
    else if (action.type === 'SELECT') {
        if (action.target === 'TABLE') {
            const {table} = action
            return {
                ...state,
                selected: {type: 'TABLE', table},
            }
        }
        else if (action.target === 'ATTR') {
            const {table, attr} = action
            return {
                ...state,
                selected: {type: 'ATTR', table, attr},
            }
        }
    }
    else if (action.type === 'CANCEL_SELECT') {
        return {
            ...state,
            selected: false,
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
    else if (action.type === 'DELETE_LINK') {
        const {table, attr} = action
        return {
            ...state,
            links: state.links.filter(({link}) => (
                !(link.from.table === table && link.from.attr === attr)
            )),
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
