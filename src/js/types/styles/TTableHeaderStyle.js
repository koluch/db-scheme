// @flow
import type {TColor} from '../TColor'
import type {TFontStyle} from './TFontStyle'
import type {TIndentStyle} from './TIndentStyle'

export type TTableHeaderStyle = {
    backgroundColor: TColor,
    font: TFontStyle,
    padding: TIndentStyle,
}
