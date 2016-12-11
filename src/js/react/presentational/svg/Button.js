// @flow
import React from 'react'

import type {TTableShape} from '~/types/TTableShape'
import type {TTableStyle} from '~/types/styles/TTableStyle'
import type {TAttrStyle} from '~/types/styles/TAttrStyle'
import type {TPoint} from '~/types/TPoint'
import type {TSize} from '~/types/TSize'
import type {TAttr} from '~/types/TAttr'
import type {TTableMetrics} from '~/types/TWorkareaMetrics'

// import {getTextSize} from '~/metrics/text'


type TProps = {
    width: number,
    height: number,
    x: number,
    y: number,
    title: string,
    onClick: () => void,
}

let seq = 0

class Button extends React.Component {
    props: TProps

    render() {
        const {
            title,
            width, height,
            x, y,
        } = this.props

        const bgId = `background_${x}_${y}`
        return (
            <g>
                <linearGradient id={bgId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop stopColor="#FFFFFF" offset="0"/>
                    <stop stopColor="#DDDDDD" offset="1"/>
                </linearGradient>
                <rect
                    x={x - width / 2}
                    y={y - height / 2}
                    width={width}
                    height={height}
                    fill={`url(#${bgId})`}
                    stroke="#d2d2d2"
                />
                <text
                    x={x}
                    y={y}
                    alignmentBaseline="central"
                    textAnchor="middle"
                    fontSize={15}
                    fontFamily="sans-serif"
                    width={width}
                    height={height}
                    stroke="#4a4a4a"
                >{title}</text>
                <rect
                    x={x - width / 2}
                    y={y - height / 2}
                    width={width}
                    height={height}
                    fill="transparent"
                    stroke="transparent"
                    rx="3" ry="3"
                    onClick={this.props.onClick}
                />
            </g>
        )
    }
}

export default Button
