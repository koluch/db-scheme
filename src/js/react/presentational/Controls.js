// @flow
import React from 'react'
import cn from 'bem-cn'

import type {TTableShape} from '~/types/TTableShape'
import type {TPoint} from '~/types/TPoint'
import type {TAttr} from '~/types/TAttr'
import type {TSchemeMetrics} from '~/types/TSchemeMetrics'
import type {TSelected} from '~/types/TSchemeState'
import type {TSize} from '~/types/TSize'

import {getAttrBounds} from '~/metrics/table'
import Button from '~/react/presentational/Button'
import IconTrash from '~/react/presentational/icons/IconTrash'
import IconKey from '~/react/presentational/icons/IconKey'
import IconPlus from '~/react/presentational/icons/IconPlus'
import IconTable from '~/react/presentational/icons/IconTable'

const bem = cn('controls')

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
            className={bem('position')}
            style={{left: `${x}px`, top: `${y}px`}}
        >
            <div className={bem('container', {[`v-${v}`]: true, [`h-${h}`]: true})}>
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
        <div className={bem('panel', {[`orientation-${orientation}`]: true})}>
            {children}
        </div>
    )
}

const SELECTED_BORDER_MARGIN = 2

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
                        size="small"
                        variant="create"
                    >
                        <IconPlus/>
                    </Button>
                    <Button
                        onClick={this.props.onTableDeleteClick.bind(this, tableShape)}
                        size="small"
                        variant="warning"
                    >
                        <IconTrash/>
                    </Button>
                </Panel>
            </Position>
        )
    }

    renderSelectedTableBorder(tableShape: TTableShape) {
        const {position: {x, y}} = tableShape
        const {metrics} = this.props

        const tableMetrics = metrics.tables.filter((record) => record.name === tableShape.table.name)[0].metrics
        if (!tableMetrics) {
            throw new Error(`Table "${tableShape.table.name}" doesn't have metrics`)
        }

        const {width, height} = tableMetrics.size
        const style = {
            top: y - SELECTED_BORDER_MARGIN,
            left: x - SELECTED_BORDER_MARGIN,
            width: width + (SELECTED_BORDER_MARGIN * 2),
            height: height + (SELECTED_BORDER_MARGIN * 2),
        }
        return (
            <div className={bem('border')} style={style}/>
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
                    <Button
                        onClick={hasLink
                         ? this.props.onLinkDeleteClick.bind(this, tableShape, attr)
                         : this.props.onLinkAddClick.bind(this, tableShape, attr)}
                        size="small"
                        variant={hasLink ? 'warning' : 'create'}
                    >
                        <IconKey/>
                    </Button>
                    <Button
                        size="small"
                        variant="warning"
                        onClick={this.props.onAttrDeleteClick.bind(this, tableShape, attr)}
                    >
                        <IconTrash/>
                    </Button>
                </Panel>
            </Position>
        )
    }

    renderSelectedAttributeBorder(tableShape: TTableShape, attr: TAttr) {
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

        const {width, height, x, y} = bounds
        const style = {
            top: y - SELECTED_BORDER_MARGIN,
            left: x - SELECTED_BORDER_MARGIN,
            width: width + (SELECTED_BORDER_MARGIN * 2),
            height: height + (SELECTED_BORDER_MARGIN * 2),
        }
        return (
            <div className={bem('border')} style={style}/>
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
                        variant="create"
                    >
                        <IconTable/>
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
            return (
                <div>
                    {this.renderSelectedTableBorder(selectedTable)}
                    {this.renderSelectedTableControls(selectedTable)}
                </div>
            )
        }
        else if (selected !== false && selected.type === 'ATTR') {
            const {table, attr} = selected
            const selectedTable = tables.filter((tableShape) => table === tableShape.table.name)[0] //todo: check
            const selectedAttr = selectedTable.table.attrs.filter(({name}) => name === attr)[0]

            return (
                <div>
                    {this.renderSelectedAttributeBorder(selectedTable, selectedAttr)}
                    {this.renderSelectedAttributeControls(selectedTable, selectedAttr)}
                </div>
            )
        }
        return null
    }

    render() {
        const {selected} = this.props
        return (
            <div className={bem()}>
                {this.renderCreateTable()}
                {selected !== false && this.renderSelected(selected)}
            </div>
        )
    }
}

export default Controls
