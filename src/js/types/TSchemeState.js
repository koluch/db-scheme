// @flow
import type {TTable} from './TTable'
import type {TLink} from './TLink'
import type {TPoint} from './TPoint'
import type {TSize} from './TSize'
import type {TSchemeStyle} from './styles/TSchemeStyle'

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

export type TSchemeState = {
    tables: Array<TTableState>,
    selected: TSelected,
    mousePosition: TPoint,
    dnd: TDndTarget,
    tco: TTco, // two-click operation
    style: TSchemeStyle,
    size: TSize,
}
