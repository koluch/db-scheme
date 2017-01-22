// @flow
import React from 'react'
import cn from 'bem-cn'
import FilteredInput from './FilteredInput'

const bem = cn('text-input')

class TextInput extends React.Component {
    props: {
        value: string,
        onChange: (value: string) => void,
    }

    handleChange = (value: string) => {
        this.props.onChange(value)
    }

    render() {
        const newProps = {}
        Object.keys(this.props).forEach((key) => {
            newProps[key] = this.props[key]
        })
        return (
            <FilteredInput
                className={bem()}
                {...newProps}
                value={this.props.value}
                onChange={this.handleChange}
                filter={() => true}
            />
        )
    }
}

export default TextInput
