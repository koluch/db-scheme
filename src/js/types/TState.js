// @flow
import type {TTableShape} from './TTableShape'
import type {TLinkShape} from './TLinkShape'
import type {TPoint} from './TPoint'

export type TDndTargetType = 'TABLE'
export type TDndTarget = false | {type: 'TABLE', name: string, lastPoint: TPoint}

export type TState = {
    tableShapes: Array<TTableShape>,
    linkShapes: Array<TLinkShape>,
    dnd: TDndTarget,
    movingLastPoint: ?{x: number, y: number},
}
