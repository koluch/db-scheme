// @flow
import type {TPoint} from './TPoint'

type TActionInit = {type: "@@redux/INIT"}

type TDndAttrs = {
    type: 'TABLE',
    name: string,
} | {
    type: 'ATTR',
    name: string,
    tableName: string,
}

export type TAction =
    TActionInit
        | {type: 'SET_ACTIVE_TABLE', name: string}
        | {type: 'START_DND', target: TDndAttrs, startPoint: TPoint}
        | {type: 'STOP_DND', point: TPoint}
        | {type: 'MOUSE_MOVE', point: TPoint}
