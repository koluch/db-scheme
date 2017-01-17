// @flow
import React from 'react'
import cn from 'bem-cn'

import NumberInput from '~/react/presentational/inputs/NumberInput'
import Block from './ToolPanel'
import type {TSize} from '~/types/TSize'

const bem = cn('settings-panel')

class SettingsPanel extends React.Component {
    props: {
        children?: *,
        size: TSize,
        onChangeSize: (size: TSize) => void,
    }

    render() {
        const {size} = this.props
        return (
            <Block title={'Settings'}>
                <label>
                    <div>{'Size:'}</div>
                    <NumberInput
                        size="5"
                        value={size.width}
                        onChange={(value) => { this.props.onChangeSize({...size, width: value}) }}
                    />
                    {' x '}
                    <NumberInput
                        size="5"
                        value={this.props.size.height}
                        onChange={(value) => { this.props.onChangeSize({...size, height: value}) }}
                    />
                </label>
            </Block>
        )
    }
}

export default SettingsPanel
