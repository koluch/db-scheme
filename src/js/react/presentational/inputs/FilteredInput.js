// @flow
import React from 'react'
import cn from 'bem-cn'

const bem = cn('filtered-input')

class FilteredInput extends React.Component {

    props: {
        onChange: (value: string) => void,
        filter: (value: string) => boolean,
    }

    handleChange = (e: *) => {
        const {value} = e.target
        const {filter, onChange} = this.props
        if (filter(value)) {
            onChange(value)
        }
    }

    render() {
        const fitleredProps = {}
        Object.keys(this.props)
            .filter((key) => ['onChange', 'filter'].indexOf(key) === -1)
            .forEach((key) => {
                fitleredProps[key] = this.props[key]
            })

        return (
            <input className={bem()} {...fitleredProps} onChange={this.handleChange}/>
        )
    }
}

export default FilteredInput
