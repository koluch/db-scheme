// @flow
import type {TSchemeState} from '~/types/TSchemeState'
import type {TAction} from '~/types/TAction'
import type {THistoryState, THistoryStateRecord} from '~/types/THistoryState'
import type {TState} from '~/types/TState'
import type {TSchemeReducer} from './scheme'

import {initialState as schemeInitialState} from './scheme'

const historyInitialState = {
    seq: 0,
    active: 0,
    records: [
        {id: 0, action: {type: '@@redux/INIT'}, state: schemeInitialState},
    ],
}

const initialState = {
    scheme: schemeInitialState,
    history: historyInitialState,
}

export type TReducer = (state: TState, action: TAction) => TState

export type TMergeAction = 'SKIP'
                         | 'ADD'
                         | 'REPLACE'

export type TMergeStrategy = (action: TAction, lastRecord: THistoryStateRecord) => TMergeAction


const HISTORY_LIMIT = 25
const cutHistory = (records: Array<THistoryStateRecord>) => {
    return records.length > HISTORY_LIMIT
        ? [...records.slice(records.length - HISTORY_LIMIT)]
        : records
}

export const wrapSchemeReducer = (schemeReducer: TSchemeReducer, mergeStrategy: TMergeStrategy): TReducer => {
    return (state: TState = initialState, action: TAction): TState => {
        const {scheme, history} = state
        if (action.type === 'ACTIVATE_HISTORY_RECORD') {
            const record2 = action.record // todo: flowtype bug
            const record = history.records.filter(({id}) => id === record2)[0]
            if (record) {
                // restore state, reseting TCO and DND
                return {
                    scheme: {...record.state,
                        tco: false,
                        dnd: false,
                    },
                    history: {...history,
                        active: record.id,
                    },
                }
            }
            return {
                scheme,
                history,
            }
        }
        else {
            const newSchemeState = schemeReducer(scheme, action)
            const lastRecord = history.records.filter(({id}) => id === history.active)[0]
            if (!lastRecord) {
                throw new Error(`Active record (${history.active}) not found, invalid state`)
            }
            const newId = history.seq + 1

            const mergeAction = mergeStrategy(action, lastRecord)

            if (mergeAction !== 'SKIP') {
                const activeRecords = []
                for (let i = 0; i < history.records.length; ++i) {
                    const next = history.records[i]
                    activeRecords.push(next)
                    if (next.id === history.active) {
                        break
                    }
                }

                if (mergeAction === 'ADD') {
                    return {
                        scheme: newSchemeState,
                        history: {
                            seq: newId,
                            active: newId,
                            records: cutHistory([...activeRecords, {
                                id: newId,
                                action,
                                state: newSchemeState,
                            }]),
                        },
                    }
                }
                else if (mergeAction === 'REPLACE') {
                    if (lastRecord) {
                        const filteredRecords = activeRecords.filter(({id}) => id !== lastRecord.id)
                        return {
                            scheme: newSchemeState,
                            history: {
                                seq: newId,
                                active: newId,
                                records: cutHistory([...filteredRecords, {
                                    id: newId,
                                    action,
                                    state: newSchemeState,
                                }]),
                            },
                        }
                    }
                }
            }

            return {
                scheme: newSchemeState,
                history,
            }
        }
    }
}

