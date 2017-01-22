// @flow
import React from 'react'
import cn from 'bem-cn'

const bem = cn('text-input')

class SelectInput extends React.Component {
    props: {
        value: string,
        options: {[id: string]: string},
        onChange: (value: string) => void,
    }

    handleChange = (e: *) => {
        this.props.onChange(e.target.value)
    }

    render() {
        const {options} = this.props
        return (
            <select className={bem()} value={this.props.value} onChange={this.handleChange}>
                {Object.keys(options).map((key) => (
                    <option key={key} value={key}>{options[key]}</option>
                ))}
            </select>
        )
    }
}

export default SelectInput
