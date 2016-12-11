// @flow
import React from 'react'

class Modal extends React.Component {
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
