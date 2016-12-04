// @flow
import type {TPoint} from './TPoint'

type TActionInit = {type: "@@redux/INIT"}

type TTcoAttrs = {
    type: 'ADD_LINK',
    table: string,
    attr: string,
}

export type TAction =
    TActionInit
        | {type: 'MOUSE_MOVE', point: TPoint}
        | {type: 'START_TCO', attrs: TTcoAttrs}
        | {type: 'STOP_TCO'}
        | {type: 'ADD_LINK', from: {table: string, attr: string}, to: {table: string, attr: string}}
        | {type: 'MOUSE_DOWN', point: TPoint}
        | {type: 'MOUSE_UP', point: TPoint}
