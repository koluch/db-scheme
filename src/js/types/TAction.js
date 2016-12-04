// @flow
import type {TPoint} from './TPoint'

type TActionInit = {type: "@@redux/INIT"}

type TDndAttrs = {
    type: 'TABLE',
    table: string,
} | {
    type: 'ATTR',
    attr: string,
    table: string,
}

type TTcoAttrs = {
    type: 'ADD_LINK',
    table: string,
    attr: string,
}

export type TAction =
    TActionInit
        | {type: 'SET_ACTIVE_TABLE', name: string}
        | {type: 'START_DND', target: TDndAttrs, startPoint: TPoint}
        | {type: 'STOP_DND', point: TPoint}
        | {type: 'MOUSE_MOVE', point: TPoint}
        | {type: 'START_TCO', attrs: TTcoAttrs}
        | {type: 'STOP_TCO'}
        | {type: 'ADD_LINK', from: {table: string, attr: string}, to: {table: string, attr: string}}
