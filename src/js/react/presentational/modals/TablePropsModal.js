// @flow
import React from 'react'

import type {TTable} from '~/types/TTable'
import Modal, {ModalRow} from './Modal'

type TProps = {
    edit: boolean,
    name?: string,
    onCancel: () => void,
    onSave: (table: TTable) => void,
}

class TablePropsModal extends React.Component {
    static defaultProps = {edit: false}

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
        const {edit} = this.props
        const {name} = this.state

        const buttons = [
            {title: edit ? 'Save' : 'Create', onClick: this.handleSubmit, variant: 'create', disabled: this.isSubmitDisabled()},
            {title: 'Cancel', onClick: this.handleCancel},
        ]

        return (
            <Modal title={`${edit ? 'Edit' : 'Create'} table`} buttons={buttons}>
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

export default TablePropsModal
