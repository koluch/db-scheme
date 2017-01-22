// @flow
import React from 'react'
import cn from 'bem-cn'

const bem = cn('tool-panel')

class ToolPanel extends React.Component {
    static defaultProps = {
        opened: true,
        onTitleClick: () => {},
    }

    props: {
        title: string,
        opened: boolean,
        children?: *,
        onTitleClick?: () => void,
    }

    render() {
        const {title, children, opened} = this.props
        return (
            <div className={bem({opened})}>
                <div className={bem('title')} onClick={this.props.onTitleClick}>
                    <span className={bem('triangle')}>{opened ? '\u25BC' : '\u25B6'}</span>
                    {title}
                </div>
                <div className={bem('body')}>
                    {children}
                </div>
            </div>
        )
    }
}

export default ToolPanel
