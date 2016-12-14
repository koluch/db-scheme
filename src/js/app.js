// @flow
import ReactDOM from 'react-dom'
import React from 'react'
import {Provider} from 'react-redux'
import {createStore} from 'redux'

import type {TState, TTableState} from '~/types/TState'
import type {TAction} from '~/types/TAction'
import type {TPoint} from '~/types/TPoint'
import type {TBounds} from '~/types/TBounds'

import Root from '~/react/container/Root'

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
                foreignKeys: [],
            },
            position: {
                x: 50,
                y: 50,
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
                foreignKeys: [],
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
                foreignKeys: [],
            },
            position: {
                x: 300,
                y: 400,
            },
        },
    ],
    // links: [
    //     {
    //         link: {from: {table: 'comments', attr: 'post_id'}, to: {table: 'posts', attr: 'id'}},
    //     },
    //     {
    //         link: {from: {table: 'posts', attr: 'user_id'}, to: {table: 'users', attr: 'id'}},
    //     },
    //     {
    //         link: {from: {table: 'comments', attr: 'user_id'}, to: {table: 'users', attr: 'id'}},
    //     },
    // ],
    dnd: false,
    tco: false,
    selected: false,
    mousePosition: {x: 0, y: 0},
}

const reducer = (state: TState = initialState, action: TAction): TState => {
    if (action.type === 'MOVE_TABLE') {
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
        const {dnd} = state
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

        return {
            ...state,
            tables: state.tables.map((tableState) => {
                if (tableState.table.name === from.table) {
                    const filteredForeignKeys = tableState.table.foreignKeys.filter((key) => (
                        !(key.from.attr === from.attr)
                    ))

                    return {
                        ...tableState,
                        table: {
                            ...tableState.table,
                            foreignKeys: filteredForeignKeys.concat([{
                                from: {
                                    attr: from.attr,
                                },
                                to,
                            }]),
                        },
                    }
                }
                return tableState
            }),
        }
    }
    else if (action.type === 'DELETE_LINK') {
        const {table, attr} = action

        return {
            ...state,
            tables: state.tables.map((tableState) => {
                if (tableState.table.name === table) {
                    return {
                        ...tableState,
                        table: {
                            ...tableState.table,
                            foreignKeys: tableState.table.foreignKeys.filter((key) => (
                                !(key.from.attr === attr)
                            )),
                        },
                    }
                }
                return tableState
            }),
        }
    }
    else if (action.type === 'DELETE_ATTR') {
        const {selected} = state
        const {table, attr} = action

        // todo: bad, rewrite
        const newSelected = (selected !== false && selected.type === 'ATTR' && selected.table === table
            && selected.table === table && selected.attr === attr) ? false : selected

        return {
            ...state,
            tables: state.tables.map((tableState) => {
                if (tableState.table.name === table) {
                    return {
                        ...tableState,
                        table: {
                            ...tableState.table,
                            attrs: tableState.table.attrs.filter(({name}) => name !== attr),
                            foreignKeys: tableState.table.foreignKeys.filter(({from}) => (
                                !(from.attr === attr)
                            )),
                        },
                    }
                }
                else {
                    return {
                        ...tableState,
                        table: {
                            ...tableState.table,
                            foreignKeys: tableState.table.foreignKeys.filter(({to}) => (
                                !(to.table === table && to.attr === attr)
                            )),
                        },
                    }
                }
            }),
            selected: newSelected,
        }
    }
    else if (action.type === 'DELETE_TABLE') {
        const {selected} = state
        const {table} = action

        const filteredTables = state.tables.filter((tableState) => {
            return tableState.table.name !== table
        })

        const newSelected = (selected !== false && selected.type === 'TABLE' && selected.table === table)
            ? false
            : selected

        return {
            ...state,
            tables: filteredTables.map((tableState) => ({
                ...tableState,
                table: {
                    ...tableState.table,
                    foreignKeys: tableState.table.foreignKeys.filter(({to}) => to.table !== table),
                },
            })),
            selected: newSelected,
        }
    }
    else if (action.type === 'ADD_ATTR') {
        const {table, attr} = action

        return {
            ...state,
            tables: state.tables.map((tableState) => {
                if (tableState.table.name === table) {
                    return {
                        ...tableState,
                        table: {
                            ...tableState.table,
                            attrs: tableState.table.attrs.filter(({name}) => name !== attr.name).concat([attr]),
                        },
                    }
                }
                return tableState
            }),
        }
    }
    else if (action.type === 'ADD_TABLE') {
        const {table} = action

        return {
            ...state,
            tables: state.tables.filter(({table: {name}}) => name !== table.name).concat([{
                position: {x: 0, y: 0},
                table,
            }]),
        }
    }
    return state
}

//import {applyMiddleware} from 'redux'
//import createLogger from 'redux-logger'
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
