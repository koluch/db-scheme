// @flow
import React from 'react'

import type {TAttr} from '~/types/TAttr'

import Modal, {ModalRow} from './Modal'

type TProps = {
    table: string,
    name?: string,
    edit: boolean,
    onCancel: () => void,
    onSave: (table: string, attr: TAttr) => void,
}

class AttrPropsModal extends React.Component {
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

    componentDidMount() {
        this.nameEl.focus()
    }

    componentWillReceiveProps(newProps: TProps) {
        const {name} = newProps
        this.setState({
            name,
        })
        this.nameEl.focus()
    }

    props: TProps

    nameEl: *

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
        const {edit} = this.props
        const {name} = this.state

        const buttons = [
            {title: edit ? 'Save' : 'Create', onClick: this.handleSubmit, variant: 'create', disabled: this.isSubmitDisabled()},
            {title: 'Cancel', onClick: this.handleCancel},
        ]

        return (
            <Modal
                title={`${edit ? 'Edit' : 'Create'} attribute`}
                buttons={buttons}
            >
                <form onSubmit={this.handleSubmit}>
                    <ModalRow>
                        <label>
                            {'Name: '}
                            <input
                                ref={(el) => { this.nameEl = el }}
                                value={name}
                                onChange={this.handleChangeName}/>
                        </label>
                    </ModalRow>
                </form>
            </Modal>
        )
    }
}

export default AttrPropsModal
