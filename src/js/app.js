// @flow
import ReactDOM from 'react-dom'
import React from 'react'
import {Provider} from 'react-redux'
import {applyMiddleware, createStore} from 'redux'
import createLogger from 'redux-logger';

import type {TState} from '~/types/TState'
import type {TAction} from '~/types/TAction'
import type {TTableShape} from '~/types/TTableShape'
import type {TLinkShape} from '~/types/TLinkShape'

import Root from '~/react/Root'

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
            x: 0,
            y: 0,
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
            x: 500,
            y: 200,
            active: false,
        },
        {
            table: {
                name: 'users', attrs: [
                    {name: 'id'},
                    {name: 'name'},
                ],
            },
            x: 300,
            y: 400,
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
    movingTable: false,
    movingLastPoint: null,
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
        if (action.targetType === 'TABLE') {
            const {name, startPoint} = action
            return {
                ...state,
                dnd: {
                    type: 'TABLE',
                    name,
                    lastPoint: startPoint,
                },
            }
        }
    }
    else if (action.type === 'STOP_DND') {
        return {
            ...state,
            dnd: false,
        }
    }
    else if (action.type === 'MOUSE_MOVE') {
        const {point} = action
        const {dnd} = state
        if (dnd !== false && dnd.type === 'TABLE') {
            const {lastPoint, name} = dnd
            const dif = {
                x: point.x - lastPoint.x,
                y: point.y - lastPoint.y,
            }
            return {
                ...state,
                tables: state.tables.map((nextTableShape): TTableShape => {
                    if (nextTableShape.table.name === name) {
                        return {
                            ...nextTableShape,
                            active: true,
                            x: nextTableShape.x + dif.x,
                            y: nextTableShape.y + dif.y,
                        }
                    }
                    else {
                        return {
                            ...nextTableShape,
                            active: false,
                        }
                    }
                }),
                dnd: {
                    ...dnd,
                    lastPoint: point,
                },
            }
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
