// @flow
import React from 'react'
import cn from 'bem-cn'

import NumberInput from '~/react/presentational/inputs/NumberInput'
import ToolPanel from './ToolPanel'
import ToolPanelGroup from './ToolPanelGroup'
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
            <div/>

        )
    }
}

export default SettingsPanel
