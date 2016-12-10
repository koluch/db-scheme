// @flow
import React from 'react'
import {Layer, Line, Stage, Group, Text} from 'react-konva'

import type {TLinkShape} from '~/types/TLinkShape'
import type {TTableShape} from '~/types/TTableShape'
import type {TTableStyle} from '~/types/TTableStyle'
import type {TLinkStyle} from '~/types/TLinkStyle'
import type {TBounds} from '~/types/TBounds'
import type {TPoint} from '~/types/TPoint'
import type {TPath} from '~/types/TPath'

import {createSelector} from 'reselect'

type TProps = {
    path: TPath,
    style: TLinkStyle,
}

let seq = 0

class Link extends React.Component {
    props: TProps

    render(): * {
        const {path, style} = this.props

        const points = path.map(({x, y}) => `${x},${y}`).join(' ')

        const markerEndId = `marker-end.${seq += 1}`
        const markerStartId = `marker-start.${seq += 1}`
        return (
            <g>
                <defs>
                    <marker id={markerStartId} viewBox="0 0 10 10" refX="0" refY="2"
                            markerUnits="userSpaceOnUse"
                            markerWidth="10" markerHeight="10"
                            orient="auto">
                        <circle cx="3" cy="3" r="3" fill="black"/>
                    </marker>
                    <marker id={markerEndId}
                            markerWidth="13"
                            markerHeight="13"
                            refX="10"
                            refY="6"
                            orient="auto">
                        <path d="M2,2 L2,11 L10,6 L2,2" fill="black"/>
                    </marker>
                </defs>
                <polyline
                    fill="none"
                    stroke="black"
                    points={points}
                    strokeDasharray={style.strokeStyle === 'dashed' ? '5,5' : null}
                    style={{
                        markerStart: `url(#${markerStartId})`,
                        markerEnd: `url(#${markerEndId})`,
                    }}
                    >
                </polyline>
            </g>
        )
    }
}

export default Link
