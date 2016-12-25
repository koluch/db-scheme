// @flow
import type {TSchemeStyle} from '~/types/styles/TSchemeStyle'

const fontStyle = {
    color: 'black',
    size: 18,
    style: 'normal',
    weight: 'normal',
    family: 'sans-serif',
}

const headerFontStyle = {
    ...fontStyle,
    color: 'white',
}

const tableStyle = {
    font: fontStyle,
    attrs: {
        font: fontStyle,
        padding: {
            top: 3,
            right: 5,
            bottom: 3,
            left: 5,
        },
    },
    header: {
        padding: {
            top: 4,
            right: 5,
            bottom: 4,
            left: 5,
        },
        backgroundColor: '#363636',
        font: headerFontStyle,
    },
    border: {
        color: '#363636',
    },
}

const linkStyle = {
    strokeStyle: 'solid',
}

const newLinkStyle = {
    strokeStyle: 'dashed',
}

export const schemeStyle: TSchemeStyle = {
    table: tableStyle,
    link: linkStyle,
    newLink: newLinkStyle,
}
