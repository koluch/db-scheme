// @flow

import type {TAttr} from './TAttr'

export type TForeignKey = {
    from: {
        attr: string,
    },
    to: {
        table: string,
        attr: string,
    },
}


export type TTable = {
    name: string,
    attrs: Array<TAttr>,
    foreignKeys: Array<TForeignKey>,
}
