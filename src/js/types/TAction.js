// @flow
import type {TPoint} from './TPoint'
import type {TSize} from './TSize'
import type {TAttr} from './TAttr'
import type {TTable} from './TTable'
import type {TColor} from './TColor'
import type {TStrokeStyle} from './styles/TStrokeStyle'
import type {TSchemeState} from './TSchemeState'

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

export type TStyleChange = {field: 'TABLE_HEADER_BACKGROUND_COLOR', value: TColor}
    | {field: 'TABLE_HEADER_PADDING_TOP', value: number}
    | {field: 'TABLE_HEADER_PADDING_RIGHT', value: number}
    | {field: 'TABLE_HEADER_PADDING_BOTTOM', value: number}
    | {field: 'TABLE_HEADER_PADDING_LEFT', value: number}
    | {field: 'TABLE_HEADER_FONT_COLOR', value: TColor}
    | {field: 'TABLE_HEADER_FONT_SIZE', value: number}
    | {field: 'TABLE_HEADER_FONT_WEIGHT', value: string}
    | {field: 'TABLE_HEADER_FONT_FAMILY', value: string}
    | {field: 'TABLE_HEADER_FONT_STYLE', value: string}
    | {field: 'TABLE_ATTRS_PADDING_TOP', value: number}
    | {field: 'TABLE_ATTRS_PADDING_RIGHT', value: number}
    | {field: 'TABLE_ATTRS_PADDING_BOTTOM', value: number}
    | {field: 'TABLE_ATTRS_PADDING_LEFT', value: number}
    | {field: 'TABLE_ATTRS_FONT_COLOR', value: TColor}
    | {field: 'TABLE_ATTRS_FONT_SIZE', value: number}
    | {field: 'TABLE_ATTRS_FONT_WEIGHT', value: string}
    | {field: 'TABLE_ATTRS_FONT_FAMILY', value: string}
    | {field: 'TABLE_ATTRS_FONT_STYLE', value: string}
    | {field: 'TABLE_BORDER_COLOR', value: TColor}
    | {field: 'LINK_STROKE_STYLE', value: TStrokeStyle}

export type TAction = TActionInit
    | {type: 'SELECT', target: 'TABLE', table: string}
    | {type: 'SELECT', target: 'ATTR', table: string, attr: string}
    | {type: 'CANCEL_SELECT'}
    | {type: 'MOVE_TABLE', table: string, position: TPoint}
    | {type: 'SWITCH_ATTRS', table: string, attr1: string, attr2: string}
    | {type: 'START_DND', attrs: TDndAttrs, startPoint: TPoint}
    | {type: 'UPDATE_DND', lastPoint: TPoint}
    | {type: 'STOP_DND', point: TPoint}
    | {type: 'MOUSE_MOVE', point: TPoint}
    | {type: 'START_TCO', attrs: TTcoAttrs}
    | {type: 'STOP_TCO'}
    | {type: 'ADD_LINK', from: {table: string, attr: string}, to: {table: string, attr: string}}
    | {type: 'ADD_ATTR', table: string, attr: TAttr}
    | {type: 'UPDATE_ATTR', table: string, oldAttr: TAttr, newAttr: TAttr}
    | {type: 'ADD_TABLE', table: TTable}
    | {type: 'UPDATE_TABLE', oldTable: TTable, newTable: TTable}
    | {type: 'DELETE_LINK', table: string, attr: string}
    | {type: 'DELETE_ATTR', table: string, attr: string}
    | {type: 'DELETE_TABLE', table: string}
    | {type: 'ACTIVATE_HISTORY_RECORD', record: number}
    | {type: 'IMPORT_SCHEME_STATE', schemeState: TSchemeState}
    | {type: 'CHANGE_SCHEME_SIZE', size: TSize}
    | {type: 'CHANGE_STYLE', change: TStyleChange}
