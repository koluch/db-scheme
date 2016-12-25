// @flow
import React from 'react'

import type {TAttrStyle} from '~/types/styles/TAttrStyle'
import type {TPoint} from '~/types/TPoint'
import type {TSize} from '~/types/TSize'

import FixClick from './FixClick'

type TProps = {
    name: string,
    style: TAttrStyle,
    active: boolean,
    size: TSize,
    position: TPoint,
    onMouseDown: (point: TPoint) => void,
    onClick: () => void,
}

class Attr extends React.Component {
    props: TProps

    handleMouseDown = (e: *): * => {
        this.props.onMouseDown({x: e.clientX, y: e.clientY})
    }

    render() {
        const {
            name,
            style,
            active,
            size: {width, height},
            position: {x, y},
        } = this.props

        return (<g
            key={`attr-${name}`}
            x={x}
            y={y}
            onMouseDown={this.handleMouseDown}
                >
            <FixClick onClick={this.props.onClick}>
                {active && <rect
                    x={x + 1}
                    y={y}
                    width={width - 2}
                    height={height}
                    fill="black"
                           />}
                {active && <rect
                    x={x + 1}
                    y={y}
                    width={width - 2}
                    height={height}
                    fill="white"
                           />}
                <text
                    fontFamily={style.font.family}
                    alignmentBaseline="middle"
                    x={x + style.padding.left}
                    y={y + height / 2}
                    fontSize={style.font.size}
                >
                    {name}
                </text>
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill="transparent"
                    onMouseDown={this.handleMouseDown}
                />
            </FixClick>
        </g>)
    }
}

export default Attr
