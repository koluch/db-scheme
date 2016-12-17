// @flow
import React from 'react'
import cn from 'bem-cn'

const bem = cn('tool-panel')

class ToolPanel extends React.Component {
    props: {
        title: string,
        children?: *,
    }

    render() {
        return (
            <div className={bem()}>
                <div className={bem('title')}>
                    {this.props.title}
                </div>
                <div className={bem('body')}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default ToolPanel
