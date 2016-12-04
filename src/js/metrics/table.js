// @flow
import type {TAttr} from '~/types/TAttr'
import type {TTable} from '~/types/TTable'
import type {TTableShape} from '~/types/TTableShape'
import type {TTableStyle} from '~/types/TTableStyle'
import type {TAttrStyle} from '~/types/TAttrStyle'
import type {TSize} from '~/types/TSize'
import type {TBounds} from '~/types/TBounds'
import type {TPoint} from '~/types/TPoint'

import type {TTableMetrics} from '~/types/TWorkareaMetrics'

import * as TAttrMethods from '~/types/TAttr'

import {getTextSize} from './text'

export const getAttrBounds = (tableMetrics: TTableMetrics, position: TPoint, attr: string): ?TBounds => {
    const {attrs, header} = tableMetrics
    for (let i = 0; i < attrs.length; ++i) {
        const {name, metrics} = attrs[i]
        if (name === attr) {
            return {
                ...metrics.size,
                x: position.x,
                y: metrics.size.height * i + position.y + header.size.height,
            }
        }
    }

    return null
}

export const getTableBounds = (tableMetrics: TTableMetrics, position: TPoint): ?TBounds => {
    const {attrs, header} = tableMetrics
    return {
        ...position,
        width: header.size.width,
        height: header.size.height + attrs.reduce((acc, attr) => acc + attr.metrics.size.height, 0),
    }
}

export const getHeaderBounds = (metrics: TTableMetrics, position: TPoint): ?TBounds => {
    const {header} = metrics
    return {
        ...position,
        width: header.size.width,
        height: header.size.height,
    }
}

export const getMetrics = (table: TTable, style: TTableStyle): TTableMetrics => {
    const headerTextSize = getTextSize(table.name, style.font)
    const attrTextSizes = table.attrs.map(({name}) => getTextSize(name, style.font))

    const tableWidth = Math.max(headerTextSize.width, ...attrTextSizes.map(({width}) => width));
    return {
        size: {
            width: tableWidth,
            height: headerTextSize.height + attrTextSizes.map(({height}) => height).reduce((acc, x) => acc + x, 0),
        },
        header: {
            size: {
                width: tableWidth,
                height: headerTextSize.height,
            },
        },
        attrs: table.attrs.map((attr, i) => {
            return {
                name: attr.name,
                metrics: {
                    size: {
                        width: tableWidth,
                        height: attrTextSizes[i].height,
                    },
                },
            }
        }),
    }
}
