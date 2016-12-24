// @flow
import React from 'react'

class Button extends React.Component {
    props: {
        onClick: () => void,
        children?: *,
    }

    render() {
        return (
            <div className="button" onClick={this.props.onClick}>
                {this.props.children}
            </div>
        )
    }
}

export default Button
