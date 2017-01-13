// @flow
import React from 'react'

import Modal, {ModalRow} from './Modal'

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
                    <label style={{display: 'flex', flexDirection: 'column'}}>
                        <div>{'JSON: '}</div>
                        <textarea value={json} rows="10" cols="50" readOnly/>
                    </label>
                </ModalRow>
            </Modal>
        )
    }
}

export default JsonExportModal
