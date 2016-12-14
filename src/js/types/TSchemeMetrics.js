// @flow
import type {TSize} from '~/types/TSize'

type TAttrMetrics = {
    size: TSize,
}

type TTableHeaderMetrics = {
    size: TSize,
}

export type TTableMetrics = {
    size: TSize,
    header: TTableHeaderMetrics,
    attrs: Array<{name: string, metrics: TAttrMetrics}>,
}

export type TSchemeMetrics = {
    tables: Array<{name: string, metrics: TTableMetrics}>,
}
