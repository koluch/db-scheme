// @flow
import type {TWorkareaStyle} from '~/types/TWorkareaStyle'

const fontStyle = {
    size: 24,
    style: 'normal',
    weight: 'normal',
    family: 'Arial',
}

const tableStyle = {
    font: fontStyle,
    attrs: {
        font: fontStyle,
    },
}

const linkStyle = {
    strokeStyle: 'solid',
}

const newLinkStyle = {
    strokeStyle: 'dashed',
}

export const workareaStyle: TWorkareaStyle = {
    table: tableStyle,
    link: linkStyle,
    newLink: newLinkStyle,
}
