// @flow
import type {TDndTargetType} from './TState'
import type {TPoint} from './TPoint'

type TActionInit = {type: "@@redux/INIT"}

export type TAction =
    TActionInit
        | {type: 'SET_ACTIVE_TABLE', name: string}
        | {type: 'START_DND', targetType: TDndTargetType, name: string, startPoint: TPoint}
        | {type: 'STOP_DND'}
        | {type: 'MOUSE_MOVE', point: TPoint}
