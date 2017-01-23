// @flow
import React from 'react'
import cn from 'bem-cn'

const bem = cn('field-set')

class FieldSet extends React.Component {
    props: {
        children?: *, // todo: check that all children are fields
    }

    render() {
        return (
            <div className={bem()}>
                {this.props.children}
            </div>
        )
    }
}

export class Field extends React.Component {
    props: {
        title: string,
        children?: *,
    }

    render() {
        const {title, children} = this.props
        return (
            <label className={bem('row')} key={title}>
                <div className={bem('label-cell')}>{`${title}: `}</div>
                <div className={bem('input-cell')}>{children}</div>
            </label>
        )
    }
}

export default FieldSet
