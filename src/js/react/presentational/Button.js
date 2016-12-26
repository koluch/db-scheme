// @flow
import React from 'react'
import cn from 'bem-cn'

const bem = cn('button')

class Button extends React.Component {
    props: {
        onClick: (e: *) => void,
        children?: *,
        size?: 'small',
        variant?: 'warning' | 'create',
    }

    render() {
        const mods = {}
        if (this.props.variant) {
            mods[this.props.variant] = true
        }
        if (this.props.size) {
            mods[this.props.size] = true
        }
        return (
            <div className={bem(mods)} onClick={this.props.onClick}>
                {this.props.children}
            </div>
        )
    }
}

export default Button
