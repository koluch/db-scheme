// @flow
import type {TTable} from './TTable'
import type {TLink} from './TLink'
import type {TPoint} from './TPoint'

export type TDndTargetType = 'TABLE'
export type TDndTarget = false | {
    type: 'TABLE',
    table: string,
    lastPoint: TPoint,
} | {
    type: 'ATTR',
    attr: string,
    table: string,
    lastPoint: TPoint,
}

export type TTableState = {
    table: TTable,
    position: TPoint,
}

export type TLinkState = {
    link: TLink,
}

export type TTco = false | {
    type: 'ADD_LINK',
    table: string,
    attr: string,
}

export type TMouseState = {type: 'MOUSE_DOWN', point: TPoint} | {type: 'MOUSE_UP'}

export type TSelected = false | {
    type: 'TABLE',
    table: string,
} | {
    type: 'ATTR',
    table: string,
    attr: string,
} | {
    type: 'LINK',
    from: {
        table: string,
        attr: string,
    },
    to: {
        table: string,
        attr: string,
    },
}

export type TState = {
    tables: Array<TTableState>,
    links: Array<TLinkState>,
    selected: TSelected,
    mouseState: TMouseState,
    dnd: TDndTarget,
    tco: TTco, // two-click operation
}
