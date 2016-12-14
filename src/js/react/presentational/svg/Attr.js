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
        this.props.onMouseDown({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY})
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
            <defs>
                <filter
                    id="active_attr_filter"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                >
                    <feOffset result="offOut" in="SourceAlpha" dx="0" dy="0"/>
                    <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10"/>
                    <feBlend in="SourceGraphic" in2="blurOut" mode="normal"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.2"/>
                    </feComponentTransfer>
                </filter>
            </defs>
            <FixClick onClick={this.props.onClick}>
                {active && <rect
                    filter="url(#active_attr_filter)"
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
                    fontWeight={active ? 'bold' : 'normal'}
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
