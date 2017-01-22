// @flow
import React from 'react'
import cn from 'bem-cn'
import FilteredInput from './FilteredInput'

import type {TColor} from '~/types/TColor'

const bem = cn('color-input')

class ColorInput extends React.Component {
    props: {
        value: TColor,
        onChange: (value: TColor) => void,
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

export default ColorInput
