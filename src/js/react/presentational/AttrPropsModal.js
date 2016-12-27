// @flow
import React from 'react'

import type {TAttr} from '~/types/TAttr'
import Button from '~/react/presentational/Button'

import Modal, {ModalRow, ModalBottom} from './Modal'

type TProps = {
    table: string,
    name?: string,
    onCancel: () => void,
    onSave: (table: string, attr: TAttr) => void,
}

class AttrPropsModal extends React.Component {

    constructor(props: TProps) {
        super(props)
        const {name} = props
        this.state = {
            name: name ? name : '',
        }
    }

    state: {
        name: string,
    }

    componentWillReceiveProps(newProps: TProps) {
        const {name} = newProps
        this.setState({
            name,
        })
    }

    props: TProps

    handleSubmit = (e: *) => {
        if (e) {
            e.preventDefault()
        }
        if (!this.isSubmitDisabled()) {
            const {name} = this.state
            this.props.onSave(
                this.props.table,
                {
                    name,
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
            {title: 'Save', onClick: this.handleSubmit, variant: 'create', disabled: this.isSubmitDisabled()},
            {title: 'Cancel', onClick: this.handleCancel},
        ]

        return (
            <Modal title="Create attribute" buttons={buttons}>
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

export default AttrPropsModal
