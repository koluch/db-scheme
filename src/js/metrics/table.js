// @flow
import type {TTable} from '~/types/TTable'
import type {TTableStyle} from '~/types/styles/TTableStyle'
import type {TBounds} from '~/types/TBounds'
import type {TPoint} from '~/types/TPoint'
import type {TTableMetrics} from '~/types/TSchemeMetrics'

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
    const headerTextSize = getTextSize(table.name, style.header.font)
    const attrTextSizes = table.attrs.map(({name}) => getTextSize(name, style.attrs.font))

    const headerSize = {
        width: headerTextSize.width + style.header.padding.left + style.header.padding.right,
        height: headerTextSize.height + style.header.padding.top + style.header.padding.bottom,
    }

    const attrSizes = attrTextSizes.map(({width, height}) => ({
        width: width + style.attrs.padding.left + style.attrs.padding.right,
        height: height + style.attrs.padding.top + style.attrs.padding.bottom,
    }))

    const tableWidth = Math.max(headerSize.width, ...attrSizes.map(({width}) => width))

    return {
        size: {
            width: tableWidth,
            height: headerSize.height + attrSizes.map(({height}) => height).reduce((acc, x) => acc + x, 0),
        },
        header: {
            size: {
                width: tableWidth,
                height: headerSize.height,
            },
        },
        attrs: table.attrs.map((attr, i) => {
            return {
                name: attr.name,
                metrics: {
                    size: {
                        width: tableWidth,
                        height: attrSizes[i].height,
                    },
                },
            }
        }),
    }
}
