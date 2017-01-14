// @flow

import type {TSchemeState, TTableState} from '~/types/TSchemeState'
import type {TAction} from '~/types/TAction'
import type {TPoint} from '~/types/TPoint'
import type {TBounds} from '~/types/TBounds'

export const initialState = {
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
    dnd: false,
    tco: false,
    selected: false,
    mousePosition: {x: 0, y: 0},
    size: {width: 800, height: 600},
}

export type TSchemeReducer = (state: TSchemeState, action: TAction) => TSchemeState

const reducer: TSchemeReducer = (state: TSchemeState = initialState, action: TAction): TSchemeState => {
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
            const selectedTable = state.tables.filter(({table: {name}}) => name === table)
            const restTables = state.tables.filter(({table: {name}}) => name !== table)
            return {
                ...state,
                tables: selectedTable.concat(restTables),
                selected: {type: 'TABLE', table},
            }
        }
        else if (action.target === 'ATTR') {
            const {table, attr} = action
            const selectedTable = state.tables.filter(({table: {name}}) => name === table)
            const restTables = state.tables.filter(({table: {name}}) => name !== table)
            return {
                ...state,
                tables: selectedTable.concat(restTables),
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
    else if (action.type === 'UPDATE_ATTR') {
        const {table, oldAttr, newAttr} = action

        let newSelected = state.selected
        if (newSelected !== false && newSelected.type === 'ATTR'
            && newSelected.table === table && newSelected.attr === oldAttr.name) {
            newSelected = {
                type: 'ATTR',
                table,
                attr: newAttr.name,
            }
        }

        const newState = {
            ...state,
            tables: state.tables.map((tableState: TTableState) => {
                if (tableState.table.name === table) {
                    return {
                        ...tableState,
                        table: {
                            ...tableState.table,
                            attrs: tableState.table.attrs.map((attr) => {
                                if (attr.name === oldAttr.name) {
                                    return {...oldAttr,
                                        name: newAttr.name,
                                    }
                                }
                                return attr
                            }),
                            foreignKeys: tableState.table.foreignKeys.map((key) => {
                                if (key.from.attr === oldAttr.name) {
                                    return {...key,
                                        from: {...key.to,
                                            attr: newAttr.name,
                                        },
                                    }
                                }
                                return key
                            }),
                        },
                    }
                }
                else {
                    return {...tableState,
                        table: {...tableState.table,
                            foreignKeys: tableState.table.foreignKeys.map((key) => {
                                if (key.to.table === table && key.to.attr === oldAttr.name) {
                                    return {...key,
                                        to: {...key.to,
                                            attr: newAttr.name,
                                        },
                                    }
                                }
                                return key
                            }),
                        },
                    }
                }
            }),
            selected: newSelected,
        }
        return newState
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
    else if (action.type === 'UPDATE_TABLE') {
        const {oldTable, newTable} = action

        let newSelected = state.selected
        if (newSelected !== false && newSelected.type === 'TABLE' && newSelected.table === oldTable.name) {
            newSelected = {
                type: 'TABLE',
                table: newTable.name,
            }
        }
        else if (newSelected !== false && newSelected.type === 'ATTR' && newSelected.table === oldTable.name) {
            newSelected = {
                type: 'ATTR',
                attr: newSelected.attr,
                table: newTable.name,
            }
        }

        return {
            ...state,
            tables: state.tables.map((tableState: TTableState) => {
                if (tableState.table.name === oldTable.name) {
                    return {
                        ...tableState,
                        table: {
                            ...tableState.table,
                            name: newTable.name,
                        },
                    }
                }
                else {
                    return {...tableState,
                        table: {...tableState.table,
                            foreignKeys: tableState.table.foreignKeys.map((key) => {
                                if (key.to.table === oldTable.name) {
                                    return {...key,
                                        to: {...key.to,
                                            table: newTable.name,
                                        },
                                    }
                                }
                                return key
                            }),
                        },
                    }
                }
            }),
            selected: newSelected,
        }
    }
    else if (action.type === 'IMPORT_SCHEME_STATE') {
        return action.schemeState
    }
    else if (action.type === 'CHANGE_SCHEME_SIZE') {
        return {
            ...state,
            size: action.size,
        }
    }
    return state
}

export default reducer
