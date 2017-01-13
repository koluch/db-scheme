// @flow
import React from 'react'

import type {TSchemeState} from '~/types/TSchemeState'
import {TSSchemeState} from '~/schemes/TSSchemeState'
import Modal, {ModalRow} from './Modal'

import {validate} from 'validated/json5'
import {object, number, maybe} from 'validated/schema'

type TSerializedData = {
    version: ?number,
    scheme: TSchemeState,
}

const TSSerializedData = object({
    version: maybe(number),
    scheme: TSSchemeState,
})

const parseSchemeState: (json: string) => TSchemeState | string = (json: string) => {
    try {
        const data: TSerializedData = validate(TSSerializedData, json)
        const {scheme} = data // todo: implement multiple versions support
        //todo: validate scheme!
        return scheme
    }
    catch (e) {
        return e.message
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
            error: null,
        }
    }

    state: {
        json: string,
        error: ?string,
    }

    props: TProps

    handleChangeJson = (e: *) => {
        this.setState({
            json: e.target.value,
        })
    }

    handleSave = () => {
        const schemeStateResult = parseSchemeState(this.state.json)
        if (typeof schemeStateResult === 'string') {
            this.setState({
                error: schemeStateResult,
            })
        }
        else {
            this.props.onSave(schemeStateResult)
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

        const {json, error} = this.state

        return (
            <Modal title={'Import JSON'} buttons={buttons}>
                <div style={{width: '600px'}}>
                    <ModalRow>
                        <label style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
                            <div>{'JSON: '}</div>
                            <textarea
                                rows="10"
                                cols="50"
                                value={json}
                                onChange={this.handleChangeJson}
                                style={{flex: 1}}
                            />
                        </label>
                    </ModalRow>
                    <ModalRow>
                        {error !== null && <p style={{
                            color: 'red',
                            fontSize: '12px',
                            fontWeight: 'bold',
                        }}>
                            {error}
                        </p>}
                    </ModalRow>
                </div>
            </Modal>
        )
    }
}

export default JsonExportModal
