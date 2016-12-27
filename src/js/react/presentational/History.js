// @flow
import React from 'react'
import cn from 'bem-cn'

import type {THistoryStateRecord} from '~/types/THistoryState'

const bem = cn('history')

class History extends React.Component {
    props: {
        active: number,
        records: Array<THistoryStateRecord>,
        onRecordClick: (record: THistoryStateRecord) => void,
    }


    renderRecordInfo(record: THistoryStateRecord, future: boolean, active: boolean, title: string, desc: ?string) {
        return (
            <div
                key={record.id}
                className={bem('record', {future, active})}
                onClick={this.props.onRecordClick.bind(this, record)}
            >
                <div className={bem('record-title')}>{title}</div>
                <div className={bem('record-desc')} title={desc}>{desc ? desc : '\u00a0'}</div>
            </div>
        )
    }

    renderRecord(record: THistoryStateRecord, future: boolean, active: boolean) {
        const {id, action} = record

        const renderInfo = this.renderRecordInfo.bind(this, record, future, active)

        if (action.type === 'MOVE_TABLE') {
            return renderInfo('Move table', `${action.table}`)
        }
        else if (action.type === 'SWITCH_ATTRS') {
            return renderInfo('Move attribute', `${action.table}.${action.attr1}`)
        }
        else if (action.type === 'SELECT') {
            if (action.target === 'TABLE') {
                return renderInfo('Select table', `${action.table}`)
            }
            else {
                return renderInfo('Select attribute', `${action.table}.${action.attr}`)
            }
        }
        else if (action.type === 'CANCEL_SELECT') {
            return renderInfo('Reset selection', null)
        }
        else if (action.type === 'ADD_TABLE') {
            return renderInfo('Create table', `${action.table.name}`)
        }
        else if (action.type === 'UPDATE_TABLE') {
            return renderInfo('Edit table', `${action.oldTable.name} → ${action.newTable.name}`)
        }
        else if (action.type === 'UPDATE_ATTR') {
            return renderInfo('Edit attr', `${action.table}.${action.oldAttr.name} → ${action.table}.${action.newAttr.name}`)
        }
        else if (action.type === 'DELETE_TABLE') {
            return renderInfo(`Delete table ${action.table}`, null)
        }
        else if (action.type === 'ADD_ATTR') {
            return renderInfo('Create attribute', `${action.table}.${action.attr.name}`)
        }
        else if (action.type === 'DELETE_ATTR') {
            return renderInfo('Delete attribute', `${action.table}.${action.attr}`)
        }
        else if (action.type === 'ADD_LINK') {
            return renderInfo(
                'Create link',
                `${action.from.table}.${action.from.attr} → ${action.to.table}.${action.to.attr}`
            )
        }
        else if (action.type === 'DELETE_LINK') {
            return renderInfo('Delete link', `${action.table}.${action.attr}`)
        }
        else if (action.type === '@@redux/INIT') {
            return renderInfo('Scheme created', null)
        }
        return renderInfo(action.type, null)
    }

    render() {
        const records = this.props.records.slice(0).reverse()

        const activeIndex = records
            .map(({id}, i) => ({id, i}))
            .filter(({id}) => id === this.props.active)
            .map(({i}) => i)[0]

        return (
            <div className="history">
                {records.map((record, i) => this.renderRecord(record, i < activeIndex, i === activeIndex))}
            </div>
        )
    }
}

export default History
