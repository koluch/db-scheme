// @flow
import React from 'react'

import type {TTable} from '~/types/TTable'
import Modal, {ModalRow} from './Modal'

type TProps = {
    onCancel: () => void,
    onSave: (table: TTable) => void,
}

class AttrAddModal extends React.Component {

    props: TProps

    nameInputEl: *

    handleSubmit = (e: *) => {
        if (e) {
            e.preventDefault()
        }
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
        const buttons = [
            {title: 'Create', onClick: this.handleSubmit, variant: 'create'},
            {title: 'Cancel', onClick: this.handleCancel},
        ]

        return (
            <Modal title="Create table" buttons={buttons}>
                <form onSubmit={this.handleSubmit}>
                    <ModalRow>
                        <label>{'Name: '}<input ref={(el) => { this.nameInputEl = el }}/></label>
                    </ModalRow>
                </form>
            </Modal>
        )
    }
}

export default AttrAddModal
