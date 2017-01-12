// @flow
import React from 'react'

import type {TAttr} from '~/types/TAttr'
import Button from '~/react/presentational/Button'

import Modal, {ModalRow, ModalBottom} from './Modal'

type TProps = {
    json: string,
    onCancel: () => void,
}

class JsonExportModal extends React.Component {
    static defaultProps = {text: ''}

    props: TProps

    handleCancel = (e: *) => {
        this.props.onCancel()
    }

    render() {
        const {json} = this.props

        const buttons = [
            {title: 'Close', onClick: this.handleCancel},
        ]

        return (
            <Modal title={'Export JSON'} buttons={buttons}>
                <ModalRow>
                    <label>
                        {'JSON: '}
                        <textarea value={json} rows="10" cols="50" readOnly></textarea>
                    </label>
                </ModalRow>
            </Modal>
        )
    }
}

export default JsonExportModal
