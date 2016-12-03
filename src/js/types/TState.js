// @flow
import type {TTable} from './TTable'
import type {TLink} from './TLink'
import type {TPoint} from './TPoint'

export type TDndTargetType = 'TABLE'
export type TDndTarget = false | {
    type: 'TABLE',
    name: string,
    startPoint: TPoint,
    lastPoint: TPoint,
}

export type TTableState = {
    table: TTable,
    x: number,
    y: number,
    active: boolean,
}

export type TLinkState = {
    link: TLink,
}

export type TState = {
    tables: Array<TTableState>,
    links: Array<TLinkState>,
    dnd: TDndTarget,
}
