// @flow
import React from 'react'
import {Layer, Line, Stage, Group, Text} from 'react-konva'

import type {TLinkShape} from '~/types/TLinkShape'
import type {TTableShape} from '~/types/TTableShape'
import type {TTableStyle} from '~/types/TTableStyle'
import type {TBounds} from '~/types/TBounds'

import {createSelector} from 'reselect'

import * as tableMetrics from '~/metrics/table'

type TProps = {
    linkShape: TLinkShape,
    tableShapes: Array<TTableShape>,
    tableStyle: TTableStyle,
}


const calculatePath = (b1: TBounds, b2: TBounds): Array<[number, number]> => {
    const CONNECTION_LINE_WIDTH = 10
    const start = [b1.x, b1.y + b1.height / 2]
    const end = [b2.x, b2.y + b2.height / 2]

    //const c1 = [start[0] - CONNECTION_LINE_WIDTH, start[1]]
    //const c2 = [end[0] - CONNECTION_LINE_WIDTH, end[1]]
    const c1 = start
    const c2 = end

    const middle1 = [c1[0] + (c2[0] - c1[0]) / 2, c1[1]]
    const middle2 = [middle1[0], c2[1]]

    return [
        start,
        //c1,
        middle1,
        middle2,
        //c2,
        end,
    ]
}

class Link extends React.Component {
    props: TProps

    render(): React.Element<*> {
        const {linkShape, tableShapes, tableStyle} = this.props
        const {link: {from, to}} = linkShape

        const tableShapeFrom = tableShapes.filter((x) => x.table.name === from.table)[0]
        if (!tableShapeFrom) {
            throw new Error(`Table "${from.table}" doesn't exists, unable to draw link`)
        }

        const tableShapeTo = tableShapes.filter((x) => x.table.name === to.table)[0]
        if (!tableShapeTo) {
            throw new Error(`Table "${to.table}" doesn't exists, unable to draw link`)
        }

        const attrFrom = tableShapeFrom.table.attrs.filter((x) => x.name === from.attr)[0]
        if (!attrFrom) {
            throw new Error(`Attribute "${from.table}.${from.attr}" doesn't exists, unable to draw link`)
        }

        const attrTo = tableShapeFrom.table.attrs.filter((x) => x.name === to.attr)[0]
        if (!attrTo) {
            throw new Error(`Attribute "${to.table}.${to.attr}" doesn't exists, unable to draw link`)
        }

        const attrFromBounds = tableMetrics.getAttrBounds(tableShapeFrom, attrFrom, tableStyle)
        const attrToBounds = tableMetrics.getAttrBounds(tableShapeTo, attrTo, tableStyle)

        const path = calculatePath(attrFromBounds, attrToBounds)

        const points = []

        path.forEach(([x, y]) => {
            points.push(x)
            points.push(y)
        })

        return (
            <Group>
                <Line
                    points={points}
                    fill={'gray'}
                    stroke={'black'}
                />
            </Group>
        )
    }
}

export default Link
