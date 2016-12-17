// @flow
import type {TSchemeState} from '~/types/TSchemeState'
import type {TAction} from '~/types/TAction'
import type {THistoryState, THistoryStateRecord} from '~/types/THistoryState'
import type {TState} from '~/types/TState'
import type {TSchemeReducer} from './scheme'

import {initialState as schemeInitialState} from './scheme'

const historyInitialState = {
    seq: 0,
    records: [],
}

const initialState = {
    scheme: schemeInitialState,
    history: historyInitialState,
}

export type TReducer = (state: TState, action: TAction) => TState

export type TMergeAction = 'SKIP'
                         | 'ADD'
                         | 'REPLACE'

export type TMergeStrategy = (action: TAction, lastRecord: ?THistoryStateRecord) => TMergeAction

export const wrapSchemeReducer = (schemeReducer: TSchemeReducer, mergeStrategy: TMergeStrategy): TReducer => {
    return (state: TState = initialState, action: TAction): TState => {
        const {scheme, history} = state
        const newSchemeState = schemeReducer(scheme, action)
        const lastRecord = history.records.length > 0 ? history.records[history.records.length - 1] : null
        const newId = history.seq + 1

        const mergeAction = mergeStrategy(action, lastRecord)
        if (mergeAction === 'ADD' || (mergeAction === 'REPLACE' && !lastRecord)) {
            return {
                scheme: newSchemeState,
                history: {
                    seq: newId,
                    records: [...history.records, {
                        id: newId,
                        action,
                        state: scheme,
                    }],
                },
            }
        }
        else if (mergeAction === 'REPLACE') {
            if (lastRecord) {
                const filteredRecords = history.records.filter(({id}) => id !== lastRecord.id)
                return {
                    scheme: newSchemeState,
                    history: {
                        seq: newId,
                        records: [...filteredRecords, {
                            id: newId,
                            action,
                            state: scheme,
                        }],
                    },
                }
            }
        }
        return {
            scheme: newSchemeState,
            history,
        }
    }
}

