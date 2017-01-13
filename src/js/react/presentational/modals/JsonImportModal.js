// @flow
import React from 'react'

import type {TSchemeState} from '~/types/TSchemeState'
import {TSSchemeState} from '~/schemes/TSSchemeState'
import Modal, {ModalRow} from './Modal'

import {validate} from 'validated/json5'
import {object, string, number, maybe, enumeration, oneOf, boolean, constant, arrayOf} from 'validated/schema'

type TSerializedData = {
    version: ?number,
    scheme: TSchemeState,
}

const TSSerializedData = object({
    version: maybe(number),
    scheme: TSSchemeState,
})

const parseSchemeState: (json: string) => ?TSchemeState = (json: string) => {
    try {
        const data: TSerializedData = validate(TSSerializedData, json)
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
