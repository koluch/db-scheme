// @flow
import React from 'react'
import type {THistoryStateRecord} from '~/types/THistoryState'

class History extends React.Component {
    props: {
        records: Array<THistoryStateRecord>,
    }

    renderRecord(record: THistoryStateRecord) {
        const {id, action} = record
        if (action.type === 'MOVE_TABLE') {
            return (
                <div key={id}>{id}{': Move table ('}{action.table}{')'}</div>
            )
        }
        else if (action.type === 'SWITCH_ATTRS') {
            return (
                <div key={id}>{`${id}: Move attribute (${action.table}, ${action.attr1}, ${action.attr2}) `}</div>
            )
        }
        return (
            <div key={id}>{id}{': '}{action.type}</div>
        )
    }

    render() {
        return (
            <div className="history">
                {this.props.records.map((record) => (
                    this.renderRecord(record)
                ))}
            </div>
        )
    }
}

export default History
