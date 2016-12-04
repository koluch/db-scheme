// @flow
//import React from 'react'
//import {Layer, Line, Stage, Group, Text} from 'react-konva'
//
//import type {TLinkShape} from '~/types/TLinkShape'
//import type {TTableShape} from '~/types/TTableShape'
//import type {TTableStyle} from '~/types/TTableStyle'
//import type {TBounds} from '~/types/TBounds'
//import type {TPoint} from '~/types/TPoint'
//
//import {createSelector} from 'reselect'
//
//type TProps = {
//    linkShape: TLinkShape,
//    tables: Array<TTableShape>,
//    tableStyle: TTableStyle,
//}
//
//
//class Link extends React.Component {
//    props: TProps
//
//    render() {
//        const {linkShape, tables, tableStyle} = this.props
//        const {link: {from, to}, path} = linkShape
//
//
//        const points = []
//
//        path.forEach(({x, y}) => {
//            points.push(x)
//            points.push(y)
//        })
//
//        return (
//            <Group>
//                <Line
//                    points={points}
//                    fill={'gray'}
//                    stroke={'black'}
//                />
//            </Group>
//        )
//    }
//}
//
//export default Link
