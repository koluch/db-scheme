// @flow
import React from 'react'

import type {TTable} from '~/types/TTable'
import Modal, {ModalRow} from './Modal'

type TProps = {
    onCancel: () => void,
    onSave: (table: TTable) => void,
}

class AttrAddModal extends React.Component {

    constructor(props: TProps) {
        super(props)
        this.state = {
            name: '',
        }
    }

    state: {
        name: string,
    }

    props: TProps

    handleSubmit = (e: *) => {
        if (e) {
            e.preventDefault()
        }
        if (!this.isSubmitDisabled()) {
            const {name} = this.state
            this.props.onSave(
                {
                    name,
                    attrs: [],
                    foreignKeys: [],
                }
            )
        }
    }

    handleCancel = (e: *) => {
        this.props.onCancel()
    }

    handleChangeName = (e: *) => {
        this.setState({
            name: e.target.value,
        })
    }

    isSubmitDisabled() {
        return this.state.name === ''
    }

    render() {
        const {name} = this.state

        const buttons = [
            {title: 'Create', onClick: this.handleSubmit, variant: 'create', disabled: this.isSubmitDisabled()},
            {title: 'Cancel', onClick: this.handleCancel},
        ]

        return (
            <Modal title="Create table" buttons={buttons}>
                <form onSubmit={this.handleSubmit}>
                    <ModalRow>
                        <label>
                            {'Name: '}
                            <input value={name} onChange={this.handleChangeName}/>
                        </label>
                    </ModalRow>
                </form>
            </Modal>
        )
    }
}

export default AttrAddModal
