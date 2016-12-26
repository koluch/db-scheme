// @flow
import type {TSchemeState, TTableState} from '~/types/TSchemeState'
import type {TTable} from '~/types/TTable'
import type {TSchemeMetrics, TTableMetrics} from '~/types/TSchemeMetrics'

import {createSelector, createSelectorCreator, defaultMemoize} from 'reselect'
import {schemeStyle} from '~/react/styles'
import {getMetrics} from '~/metrics/table'

const tablesSelector = (state: TSchemeState): Array<TTable> => state.tables.map(({table}) => table)

const tableListsEquals = (ar1, ar2) => {
    if (ar1.length === ar2.length) {
        for (let i = 0; i < ar1.length; ++i) {
            if (ar1[i] !== ar2[i]) {
                return false
            }
        }
        return true
    }
    return false
}

const createDeepEqualSelector = createSelectorCreator(
    defaultMemoize,
    tableListsEquals
)


const tablesMetricsSelector = createDeepEqualSelector(tablesSelector, (tables: Array<TTable>): Array<{name: string, metrics: TTableMetrics}> => {
    return tables.map((table) => {
        return {
            name: table.name,
            metrics: getMetrics(table, schemeStyle.table),
        }
    })
})

export const scheme: (state: TSchemeState) => TSchemeMetrics = createSelector(tablesMetricsSelector, (tablesBounds) => {
    return {
        tables: tablesBounds,
    }
})
