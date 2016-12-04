// @flow
import type {TBounds} from './TBounds.js'
import type {TSize} from '~/types/TSize'
import type {TPoint} from '~/types/TPoint'

type TAttrMetrics = {
    size: TSize,
    offset: TPoint,
}

type TTableHeaderMetrics = {
    size: TSize,
}

export type TTableMetrics = {
    size: TSize,
    header: TTableHeaderMetrics,
    attrs: Array<{name: string, metrics: TAttrMetrics}>,
}

export type TWorkareaMetrics = {
    tables: Array<{name: string, metrics: TTableMetrics}>,
}
