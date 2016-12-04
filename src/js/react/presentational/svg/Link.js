// @flow
import React from 'react'
import {Layer, Line, Stage, Group, Text} from 'react-konva'

import type {TLinkShape} from '~/types/TLinkShape'
import type {TTableShape} from '~/types/TTableShape'
import type {TTableStyle} from '~/types/TTableStyle'
import type {TBounds} from '~/types/TBounds'
import type {TPoint} from '~/types/TPoint'

import {createSelector} from 'reselect'

type TProps = {
    linkShape: TLinkShape,
    tables: Array<TTableShape>,
    tableStyle: TTableStyle,
}

class Link extends React.Component {
    props: TProps

    render(): * {
        const {linkShape, tables, tableStyle} = this.props
        const {link: {from, to}, path} = linkShape

        const points = path.map(({x, y}) => `${x},${y}`).join(' ')

        const markerId = `marker-arrow.${from.table}.${from.attr}.${to.table}.${to.attr}`
        return (
            <g>
                <marker id={markerId} markerWidth="13" markerHeight="13" refX="10" refY="6"
                        orient="auto">
                    <path d="M2,2 L2,11 L10,6 L2,2" fill="black"/>
                </marker>
                <polyline
                    fill="none"
                    stroke="black"
                    points={points}
                    style={{markerEnd: `url(#${markerId})`}}
                    >
                </polyline>
            </g>
        )
    }
}

export default Link
