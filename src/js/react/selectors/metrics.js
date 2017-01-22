// @flow
import type {TSchemeState, TTableState} from '~/types/TSchemeState'
import type {TSchemeStyle} from '~/types/styles/TSchemeStyle'
import type {TTable} from '~/types/TTable'
import type {TSchemeMetrics, TTableMetrics} from '~/types/TSchemeMetrics'

import {createSelector, createSelectorCreator, defaultMemoize} from 'reselect'
import {getMetrics} from '~/metrics/table'

const memoizeTablesAndStyle = (resultFunc) => {
    const listsEq = (ar1, ar2) => {
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

    let tablesOld = null
    let styleOld = null
    let memoized = null
    return (tables, style) => {
        if (memoized === null || tablesOld === null || styleOld === null) {
            memoized = resultFunc(tables, style)
        }
        else if (!listsEq(tables, tablesOld) || styleOld !== style) {
            memoized = resultFunc(tables, style)
        }
        tablesOld = tables
        styleOld = style
        return memoized
    }
}

const tablesSelector = (state: TSchemeState): Array<TTable> => state.tables.map(({table}) => table)
const styleSelector = (state: TSchemeState): TSchemeStyle => state.style
const tablesMetricsSelector = createSelectorCreator(memoizeTablesAndStyle)(
    tablesSelector,
    styleSelector,
    (tables: Array<TTable>, schemeStyle: TSchemeStyle): Array<{name: string, metrics: TTableMetrics}> => {
        return tables.map((table) => {
            return {
                name: table.name,
                metrics: getMetrics(table, schemeStyle.table),
            }
        })
    }
)

export const scheme: (state: TSchemeState) => TSchemeMetrics = createSelector(
    tablesMetricsSelector,
    (tablesBounds) => {
        return {
            tables: tablesBounds,
        }
    }
)
