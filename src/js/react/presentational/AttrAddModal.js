// @flow
import React from 'react'

import type {TAttr} from '~/types/TAttr'

import Modal from './Modal'

type TProps = {
    table: string,
    onCancel: () => void,
    onSave: (table: string, attr: TAttr) => void,
}

class AttrAddModal extends React.Component {

    props: TProps

    nameInputEl: *

    handleSubmit = (e: *) => {
        e.preventDefault()
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
        return (
            <Modal>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label>{'Name: '}<input ref={(el) => { this.nameInputEl = el }}/></label>
                    </div>
                    <div>
                        <button type="button" onClick={this.handleCancel}>{'Cancel'}</button>
                        <button type="submit">{'Create'}</button>
                    </div>
                </form>
            </Modal>
        )
    }
}

export default AttrAddModal
