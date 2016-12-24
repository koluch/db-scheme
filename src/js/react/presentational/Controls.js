// @flow
import React from 'react'

import type {TTableShape} from '~/types/TTableShape'
import type {TPoint} from '~/types/TPoint'
import type {TAttr} from '~/types/TAttr'
import type {TSchemeMetrics} from '~/types/TSchemeMetrics'
import type {TSelected} from '~/types/TSchemeState'
import type {TSize} from '~/types/TSize'

import {getAttrBounds} from '~/metrics/table'
import Button from '~/react/presentational/Button'

type TPositionProps = {
    x: number,
    y: number,
    v: 'start' | 'center' | 'end',
    h: 'start' | 'center' | 'end',
    children?: *,
}

const Position = (props: TPositionProps) => {
    const {
        x,
        y,
        v,
        h,
        children,
    } = props

    return (
        <div
            className="controls__position"
            style={{left: `${x}px`, top: `${y}px`}}
        >
            <div className={`controls__container v-${v} h-${h}`}>
                {children}
            </div>
        </div>
    )
}

type TPanelProps = {
    orientation: 'v' | 'h',
    children?: *,
}

const Panel = (props: TPanelProps) => {
    const {children, orientation} = props

    return (
        <div className={`controls__panel orientation-${orientation}`}>
            {children}
        </div>
    )
}


class Controls extends React.Component {

    props: {
        selected: TSelected,
        metrics: TSchemeMetrics,
        tables: Array<TTableShape>,
        size: TSize,
        isDnd: boolean,

        onTableCreateClick: () => void,
        onTableDeleteClick: (tableShape: TTableShape) => void,
        onAttrDeleteClick: (tableShape: TTableShape, attr: TAttr) => void,
        onAttrCreateClick: (tableShape: TTableShape) => void,
        onAttrClick: (tableShape: TTableShape, attr: TAttr) => void,
        onMouseMove: (point: TPoint) => void,
        onLinkAddClick: (tableShape: TTableShape, attr: TAttr) => void,
        onLinkDeleteClick: (tableShape: TTableShape, attr: TAttr) => void,
        onMouseUp: (point: TPoint) => void,
    }

    renderSelectedTableControls(tableShape: TTableShape) {
        const {position: {x, y}} = tableShape
        const {metrics} = this.props

        const tableMetrics = metrics.tables.filter((record) => record.name === tableShape.table.name)[0].metrics
        if (!tableMetrics) {
            throw new Error(`Table "${tableShape.table.name}" doesn't have metrics`)
        }

        const {width, height} = tableMetrics.size
        const BUTTON_MARGIN = 5
        return (
            <Position
                x={x + width / 2}
                y={y + height + BUTTON_MARGIN}
                v="start"
                h="center"
            >
                <Panel orientation="h">
                    <Button
                        onClick={this.props.onAttrCreateClick.bind(this, tableShape)}
                    ><i className="icon small plus"/></Button>
                    <Button
                        onClick={this.props.onTableDeleteClick.bind(this, tableShape)}
                    ><i className="icon small trash"/></Button>
                </Panel>
            </Position>
        )
    }

    renderSelectedAttributeControls(tableShape: TTableShape, attr: TAttr) {
        const {position} = tableShape
        const {metrics} = this.props

        const tableMetrics = metrics.tables.filter((record) => record.name === tableShape.table.name)[0].metrics
        if (!tableMetrics) {
            throw new Error(`Table "${tableShape.table.name}" doesn't have metrics`)
        }

        const bounds = getAttrBounds(tableMetrics, position, attr.name)
        if (!bounds) {
            throw new Error(`Metrics calculation failed for attribute "${tableShape.table.name}.${attr.name}"`)
        }

        const hasLink = tableShape.table.foreignKeys.some(({from}) => from.attr === attr.name)

        const {width, height, x, y} = bounds
        const MARGIN = 5
        return (
            <Position
                x={x + width + MARGIN}
                y={y + height / 2}
                v="center"
                h="start"
            >
                <Panel orientation="h">
                    {!hasLink && <Button
                        onClick={this.props.onLinkAddClick.bind(this, tableShape, attr)}
                                 >
                        <i className="icon small key green"/>
                    </Button>}
                    {hasLink && <Button
                        onClick={this.props.onLinkDeleteClick.bind(this, tableShape, attr)}
                                >
                        <i className="icon small key red"/>
                    </Button>}
                    <Button
                        onClick={this.props.onAttrDeleteClick.bind(this, tableShape, attr)}
                    >
                        <i className="icon small trash"/>
                    </Button>
                </Panel>
            </Position>
        )
    }

    renderCreateTable() {
        const {size: {width}} = this.props
        const MARGIN = 10
        return (
            <Position
                x={width - MARGIN}
                y={MARGIN}
                v="start"
                h="end"
            >
                <Panel orientation="h">
                    <Button
                        onClick={this.props.onTableCreateClick}
                    >
                        <i className="icon add table"/>
                    </Button>
                </Panel>
            </Position>
        )
    }

    renderSelected(selected: TSelected) {
        const {tables} = this.props
        if (selected !== false && selected.type === 'TABLE') {
            const {table} = selected
            const selectedTable = tables.filter((tableShape) => table === tableShape.table.name)[0] //todo: check
            if (!selectedTable) {
                throw new Error(`Selected table doesn't exists "${table}"`)
            }
            return this.renderSelectedTableControls(selectedTable)
        }
        else if (selected !== false && selected.type === 'ATTR') {
            const {table, attr} = selected
            const selectedTable = tables.filter((tableShape) => table === tableShape.table.name)[0] //todo: check
            const selectedAttr = selectedTable.table.attrs.filter(({name}) => name === attr)[0]

            return this.renderSelectedAttributeControls(selectedTable, selectedAttr)
        }
        return null
    }

    render() {
        const {selected} = this.props
        return (
            <div className="controls">
                {this.renderCreateTable()}
                {selected !== false && this.renderSelected(selected)}
            </div>
        )
    }
}

export default Controls
