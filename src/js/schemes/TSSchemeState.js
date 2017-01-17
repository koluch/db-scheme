// @flow
import {object, string, number, enumeration, oneOf, boolean, constant, arrayOf} from 'validated/schema'

export const TSForeignKey = object({
    from: object({
        attr: string,
    }),
    to: object({
        table: string,
        attr: string,
    }),
})

export const TSAttr = object({
    name: string,
})

export const TSPoint = object({
    x: number,
    y: number,
})

export const TSTable = object({
    name: string,
    attrs: arrayOf(TSAttr),
    foreignKeys: arrayOf(TSForeignKey),
})

export const TSTableState = object({
    table: TSTable,
    position: TSPoint,
})

export const TSSelected = oneOf(
    constant(false),
    object({
        type: constant('TABLE'),
        table: string,
    }),
    object({
        type: constant('ATTR'),
        table: string,
        attr: string,
    }),
    object({
        type: constant('LINK'),
        from: object({
            table: string,
            attr: string,
        }),
        to: object({
            table: string,
            attr: string,
        }),
    })
)

export const TSDndTarget = oneOf(
    constant(false),
    object({
        type: constant('TABLE'),
        table: string,
        lastPoint: TSPoint,
    }),
    object({
        type: constant('ATTR'),
        attr: string,
        table: string,
        lastPoint: TSPoint,
    })
)

export const TSTco = oneOf(
    constant(false),
    object({
        type: constant('ADD_LINK'),
        table: string,
        attr: string,
    })
)

export const TSSize = object({
    width: number,
    height: number,
})


export const TSColor = string

export const TSIndentStyle = object({
    top: number,
    right: number,
    bottom: number,
    left: number,
})

export const TSFontStyle = object({
    color: TSColor,
    size: number,
    weight: string,
    family: string,
    style: string,
})

export const TSTableHeaderStyle = object({
    backgroundColor: TSColor,
    font: TSFontStyle,
    padding: TSIndentStyle,
})

export const TSBorder = object({
    color: TSColor,
})

export const TSLinkStyle = oneOf(
    constant('solid'),
    constant('dashed')
)

export const TSAttrStyle = object({
    font: TSFontStyle,
    padding: TSIndentStyle,
})

export const TSTableStyle = object({
    font: TSFontStyle,
    header: TSTableHeaderStyle,
    border: TSBorder,
    attrs: TSAttrStyle,
})

export const TSSchemeStyle = object({
    table: TSTableStyle,
    link: TSLinkStyle,
    newLink: TSLinkStyle,
})

export const TSSchemeState = object({
    tables: arrayOf(TSTableState),
    selected: TSSelected,
    mousePosition: TSPoint,
    dnd: TSDndTarget,
    tco: TSTco,
    size: TSSize,
    style: TSSchemeStyle,
})

