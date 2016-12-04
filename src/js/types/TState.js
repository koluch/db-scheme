// @flow
import type {TTable} from './TTable'
import type {TLink} from './TLink'
import type {TPoint} from './TPoint'

export type TDndTargetType = 'TABLE'
export type TDndTarget = false | {
    type: 'TABLE',
    table: string,
    startPoint: TPoint,
    lastPoint: TPoint,
} | {
    type: 'ATTR',
    attr: string,
    table: string,
    startPoint: TPoint,
    lastPoint: TPoint,
}

export type TTableState = {
    table: TTable,
    position: TPoint,
    active: boolean,
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

export type TState = {
    tables: Array<TTableState>,
    links: Array<TLinkState>,
    mouseState: TMouseState,
    dnd: TDndTarget,
    tco: TTco, // two-click operation
}
