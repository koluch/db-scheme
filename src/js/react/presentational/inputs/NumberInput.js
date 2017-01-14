// @flow
import React from 'react'
import cn from 'bem-cn'
import FilteredInput from './FilteredInput'

const bem = cn('number-input')

const numbersFilter = (value: string): boolean => {
    return /^[0-9]*$/g.test(value)
}

const numbersConverter = (value: string): number => {
    if (!numbersFilter(value)) {
        throw new Error(`String "${value}" could not be converted to number`)
    }
    return Number(value)
}

class NumberInput extends React.Component {
    props: {
        onChange: (value: number) => void,
    }

    handleChange = (value: string) => {
        this.props.onChange(numbersConverter(value))
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
                onChange={this.handleChange}
                filter={numbersFilter}
            />
        )
    }
}

export default NumberInput
