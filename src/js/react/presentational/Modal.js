// @flow
import React from 'react'

class Modal extends React.Component {
    props: {
        children?: *,
    }

    render() {
        return (
            <div className="modal">
                <div className="modal__body">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Modal
