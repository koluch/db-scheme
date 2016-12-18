// @flow
import type {TSchemeState} from './TSchemeState'
import type {TAction} from './TAction'

export type THistoryStateRecord = {
    id: number,
    action: TAction,
    state: TSchemeState,
}

export type THistoryState = {
    seq: number,
    active: number,
    records: Array<THistoryStateRecord>,
}
