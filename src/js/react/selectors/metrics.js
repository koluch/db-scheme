// @flow
import type {TState, TTableState} from '~/types/TState'
import type {TSchemeMetrics, TTableMetrics} from '~/types/TSchemeMetrics'

import {createSelector} from 'reselect'
import {schemeStyle} from '~/react/styles'
import {getMetrics} from '~/metrics/table'

const tablesSelector = (state: TState): Array<TTableState> => state.tables

const tablesMetricsSelector = createSelector(tablesSelector, (tableStates: Array<TTableState>): Array<{name: string, metrics: TTableMetrics}> => {
    return tableStates.map(({table}) => {
        return {
            name: table.name,
            metrics: getMetrics(table, schemeStyle.table),
        }
    })
})

export const scheme: (state: TState) => TSchemeMetrics = createSelector(tablesMetricsSelector, (tablesBounds) => {
    return {
        tables: tablesBounds,
    }
})
