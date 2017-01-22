// @flow
import React from 'react'
import cn from 'bem-cn'

const bem = cn('field-set')

let counter = 0

class FieldSet extends React.Component {
    props: {
        fields: Array<[string, *]>,
    }

    render() {
        const {fields} = this.props
        return (
            <table className={bem()}>
                <tbody>
                    {fields.map(([title, input]) => {
                        const id = `field-set-input-${counter++}`
                        return (
                            <tr>
                                <td className={bem('label-cell')}><label htmlFor={id}>{`${title}: `}</label></td>
                                <td className={bem('input-cell')}>{React.cloneElement(input, {id})}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }
}

export default FieldSet
