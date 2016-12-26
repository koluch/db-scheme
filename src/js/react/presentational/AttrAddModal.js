// @flow
import React from 'react'

import type {TAttr} from '~/types/TAttr'
import Button from '~/react/presentational/Button'

import Modal, {ModalRow, ModalBottom} from './Modal'

type TProps = {
    table: string,
    onCancel: () => void,
    onSave: (table: string, attr: TAttr) => void,
}

class AttrAddModal extends React.Component {

    props: TProps

    nameInputEl: *

    handleSubmit = (e: *) => {
        if (e) {
            e.preventDefault()
        }
        this.props.onSave(
            this.props.table,
            {
                name: this.nameInputEl.value,
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
            <Modal title="Create attribute" buttons={buttons}>
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
