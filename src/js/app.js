// @flow
import ReactDOM from 'react-dom'
import React from 'react'
import {Provider} from 'react-redux'
import {createStore} from 'redux'

import Root from '~/react/container/Root'
import schemeReducer from '~/reducers/scheme'
import {wrapSchemeReducer} from '~/reducers/history'

import type {TMergeStrategy} from '~/reducers/history'
import type {TAction} from '~/types/TAction'
import type {THistoryStateRecord} from '~/types/THistoryState'

const mergeStrategy: TMergeStrategy = (action: TAction, lastRecord: THistoryStateRecord): * => {
    // Don't record some actions at all
    switch (action.type) {
        case 'START_DND':
        case 'UPDATE_DND':
        case 'STOP_DND':
        case 'MOUSE_MOVE':
        case 'START_TCO':
        case 'STOP_TCO':
            return 'SKIP'
        default:
    }

    const lastAction = lastRecord.action
    // If last action type doesn't equals to current action - always add it
    if (lastAction.type !== action.type) {
        return 'ADD'
    }
    else {
        // Depending on action type and it's attrs, add or replace record
        if (action.type === 'SELECT' && lastAction.type === 'SELECT') {
            if (action.target !== lastAction.target) {
                return 'ADD'
            }
            else if (action.target === 'TABLE' && lastAction.target === 'TABLE') {
                return action.table === lastAction.table ? 'REPLACE' : 'ADD'
            }
            else if (action.target === 'ATTR' && lastAction.target === 'ATTR') {
                return action.table === lastAction.table && action.attr === lastAction.attr ? 'REPLACE' : 'ADD'
            }
        }
        if (action.type === 'MOVE_TABLE' && lastAction.type === 'MOVE_TABLE') {
            return action.table === lastAction.table ? 'REPLACE' : 'ADD'
        }
        if (action.type === 'SWITCH_ATTRS' && lastAction.type === 'SWITCH_ATTRS') {
            return (action.table === lastAction.table && action.attr1 === lastAction.attr1) ? 'REPLACE' : 'ADD'
        }
        if (action.type === 'CANCEL_SELECT' && lastAction.type === 'CANCEL_SELECT') {
            return 'REPLACE'
        }
        if (action.type === 'ADD_LINK' && lastAction.type === 'ADD_LINK') {
            return 'ADD'
        }
        if (action.type === 'ADD_ATTR' && lastAction.type === 'ADD_ATTR') {
            return 'ADD'
        }
        if (action.type === 'ADD_TABLE' && lastAction.type === 'ADD_TABLE') {
            return 'ADD'
        }
        if (action.type === 'DELETE_LINK' && lastAction.type === 'DELETE_LINK') {
            return 'ADD'
        }
        if (action.type === 'DELETE_ATTR' && lastAction.type === 'DELETE_ATTR') {
            return 'ADD'
        }
        if (action.type === 'DELETE_TABLE' && lastAction.type === 'DELETE_TABLE') {
            return 'ADD'
        }
        return 'SKIP'
    }
}

const reducer = wrapSchemeReducer(schemeReducer, mergeStrategy)

// import {applyMiddleware} from 'redux'
// import createLogger from 'redux-logger'
// const logger = createLogger()
// const store = createStore(
//    reducer,
//    applyMiddleware(logger)
// )

const store = createStore(reducer)

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Provider store={store}>
            <Root/>
        </Provider>,
        document.getElementById('react')
    )
})
