// @flow
import React from 'react'
import cn from 'bem-cn'

const bem = cn('button')

class Button extends React.Component {
    static defaultProps = {
        disabled: false,
    }

    props: {
        onClick: (e: *) => void,
        children?: *,
        size?: 'small',
        variant?: 'usual' | 'warning' | 'create',
        disabled: boolean,
    }

    render() {
        const {disabled, variant, size} = this.props
        const mods = {}
        mods.disabled = disabled
        if (variant) {
            mods[variant] = true
        }
        if (size) {
            mods[size] = true
        }
        return (
            <div className={bem(mods)} onClick={this.props.onClick}>
                {this.props.children}
            </div>
        )
    }
}

export default Button
