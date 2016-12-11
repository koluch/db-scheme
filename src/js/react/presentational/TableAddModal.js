// @flow
import React from 'react'

import type {TTable} from '~/types/TTable'

import Modal from './Modal'

type TProps = {
    onCancel: () => void,
    onSave: (table: TTable) => void,
}

class AttrAddModal extends React.Component {

    props: TProps

    nameInputEl: *

    handleSubmit = (e: *) => {
        e.preventDefault()
        this.props.onSave(
            {
                name: this.nameInputEl.value,
                attrs: [],
                foreignKeys: [],
            }
        )
    }

    handleCancel = (e: *) => {
        this.props.onCancel()
    }

    render() {
        return (
            <Modal>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label>Name: <input ref={(el) => { this.nameInputEl = el }}></input></label>
                    </div>
                    <div>
                        <button type="button" onClick={this.handleCancel}>Cancel</button>
                        <button type="submit">Create</button>
                    </div>
                </form>
            </Modal>
        )
    }
}

export default AttrAddModal
