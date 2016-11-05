// @flow

import type {TAttr} from '~/types/TAttr'
import type {TTable} from '~/types/TTable'
import type {TTableShape} from '~/types/TTableShape'
import type {TTableStyle} from '~/types/TTableStyle'
import type {TTableAttrStyle} from '~/types/TTableAttrStyle'
import type {TSize} from '~/types/TSize'
import type {TBounds} from '~/types/TBounds'

import * as TAttrMethods from '~/types/TAttr'

import {getTextSize} from './text'

export const getHeaderSize = (table: TTable, style: TTableStyle): TSize => {
    return getTextSize(table.name, style.font)
}

export const getHeaderBounds = (tableShape: TTableShape, style: TTableStyle): TBounds => {
    return {
        ...getTextSize(tableShape.table.name, style.font),
        x: tableShape.x,
        y: tableShape.y,
    }
}

export const getAttrsSize = (attrs: Array<TAttr>, style: TTableAttrStyle): TSize => {
    const {font} = style
    const sizes = attrs.map((attr) => getTextSize(attr.name, font))
    return {
        width: Math.max(...sizes.map((x) => x.width)),
        height: sizes.map((x) => x.height).reduce((acc, x) => acc + x, 0),
    }
}

export const getAttrSize = (attrs: Array<TAttr>, style: TTableAttrStyle): TSize => {
    const {width, height} = getAttrsSize(attrs, style)
    return {
        width,
        height: height / attrs.length,
    }
}

export const getAttrsBounds = (tableShape: TTableShape, style: TTableStyle): TBounds => {
    const headerBounds = getHeaderBounds(tableShape, style)
    const {height, width} = getAttrsSize(tableShape.table.attrs, style.attrs)

    return {
        x: tableShape.x,
        y: tableShape.y + headerBounds.height,
        height,
        width,
    }
}

export const getAttrBounds = (tableShape: TTableShape, attr: TAttr, style: TTableStyle): TBounds => {
    const {x, y} = getAttrsBounds(tableShape, style)

    const {width, height} = getAttrSize(tableShape.table.attrs, style.attrs)

    const {table: {attrs}} = tableShape

    for (let i = 0; i < attrs.length; ++i) {
        const nextAttr = attrs[i]
        if (TAttrMethods.equals(nextAttr, attr)) {
            return {
                x,
                y,
                width,
                height,
            }
        }
    }
    throw new Error(`Attribute "${attr.name}" is not defined in table "${tableShape.table.name}"`)
}

export const getShapeSize = (tableShape: TTableShape, style: TTableStyle): TSize => {
    const headerSize = getHeaderSize(tableShape.table, style)
    const attrsSize = getAttrsSize(tableShape.table.attrs, style)

    return {
        width: Math.max(headerSize.width, attrsSize.width),
        height: headerSize.height + attrsSize.height,
    }
}

export const getShapeBounds = (tableShape: TTableShape, style: TTableStyle): TBounds => {
    const headerSize = getHeaderSize(tableShape.table, style)
    const attrsSize = getAttrsSize(tableShape.table.attrs, style)

    return {
        x: tableShape.x,
        y: tableShape.y,
        width: Math.max(headerSize.width, attrsSize.width),
        height: headerSize.height + attrsSize.height,
    }
}
