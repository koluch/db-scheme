// @flow
import type {TFontStyle} from './TFontStyle'
import type {TAttrStyle} from './TAttrStyle'
import type {TBorder} from './TBorder'
import type {TTableHeaderStyle} from './TTableHeaderStyle'

export type TTableStyle = {
    font: TFontStyle,
    header: TTableHeaderStyle,
    border: TBorder,
    attrs: TAttrStyle,
}
