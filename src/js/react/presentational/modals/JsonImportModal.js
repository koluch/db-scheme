// @flow
import React from 'react'

import type {TSchemeState} from '~/types/TSchemeState'

import Modal, {ModalRow} from './Modal'


const parseSchemeState: (json: string) => ?TSchemeState = (json: string) => {
    try {
        const data = JSON.parse(json) // todo: handle parse errors
        const {scheme} = data // todo: implement multiple versions support
        //todo: validate scheme!
        return scheme
    }
    catch (e) {
        console.error(e)
        return null
    }
}


type TProps = {
    onSave: (schemeState: TSchemeState) => void,
    onCancel: () => void,
}

class JsonExportModal extends React.Component {
    static defaultProps = {text: ''}

    constructor(props: TProps) {
        super(props)
        this.state = {
            json: '',
        }
    }

    state: {
        json: string,
    }

    props: TProps

    handleChangeJson = (e: *) => {
        this.setState({
            json: e.target.value,
        })
    }

    handleSave = () => {
        const schemeState = parseSchemeState(this.state.json)
        if (schemeState) {
            this.props.onSave(schemeState)
        }
        else {
            //todo: show error
        }
    }

    handleCancel = (e: *) => {
        this.props.onCancel()
    }

    render() {
        const buttons = [
            {title: 'Import', onClick: this.handleSave},
            {title: 'Cancel', onClick: this.handleCancel},
        ]

        return (
            <Modal title={'Import JSON'} buttons={buttons}>
                <ModalRow>
                    <label>
                        {'JSON: '}
                        <textarea
                            rows="10"
                            cols="50"
                            value={this.state.json}
                            onChange={this.handleChangeJson}
                        />
                    </label>
                </ModalRow>
            </Modal>
        )
    }
}

export default JsonExportModal
