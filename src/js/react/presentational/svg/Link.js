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

    render(): React.Element<*> {
        const {linkShape, tables, tableStyle} = this.props
        const {link: {from, to}, path} = linkShape

        const points = path.map(({x,y}) => `${x},${y}`).join(' ')

        return (
            <polyline fill="none" stroke="black" points={points}>
            </polyline>
        )
    }
}

export default Link
