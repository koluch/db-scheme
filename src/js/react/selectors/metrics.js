// @flow
import type {TState, TTableState} from '~/types/TState'
import type {TWorkareaMetrics, TTableMetrics} from '~/types/TWorkareaMetrics'

import {createSelector} from 'reselect'
import {workareaStyle} from '~/react/styles'
import {getMetrics} from '~/metrics/table'

const tablesSelector = (state: TState): Array<TTableState> => state.tables

const tablesMetricsSelector = createSelector(tablesSelector, (tableStates: Array<TTableState>): Array<{name: string, metrics: TTableMetrics}> => {
    return tableStates.map(({table}) => {
        return {
            name: table.name,
            metrics: getMetrics(table, workareaStyle.table),
        }
    })
})

export const workarea: (state: TState) => TWorkareaMetrics = createSelector(tablesMetricsSelector, (tablesBounds) => {
    return {
        tables: tablesBounds,
    }
})
