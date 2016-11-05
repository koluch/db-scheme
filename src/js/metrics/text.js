// @flow

import type {TFontStyle} from '~/types/TFontStyle'

type MeasureResultType = {
    width: number,
    height: number,
}

export const getTextSize = (text: string, style: TFontStyle): MeasureResultType => {
    const {
        size,
        weight,
        family,
        style: fontStyle,
        } = style
    const canvas = document.createElement('canvas')
    const ctx = ((canvas.getContext('2d') : any) : CanvasRenderingContext2D)
    ctx.font = `${weight} ${fontStyle} ${size}px ${family}`
    return {
        width: ctx.measureText(text).width,
        height: size,
    }
}
