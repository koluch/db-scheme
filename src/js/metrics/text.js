// @flow

import type {TFontStyle} from '~/types/TFontStyle'

type MeasureResultType = {
    width: number,
    height: number,
}

let ctx = null

export const getTextSize = (text: string, style: TFontStyle): MeasureResultType => {
    const {
        size,
        weight,
        family,
        style: fontStyle,
        } = style

    const font = `${weight} ${fontStyle} ${size}px ${family}`

    if (ctx === null) {
        const canvas = document.createElement('canvas')
        ctx = ((canvas.getContext('2d') : any) : CanvasRenderingContext2D)
    }

    ctx.font = font
    return {
        width: ctx.measureText(text).width,
        height: size,
    }
}
