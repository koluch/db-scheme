// @flow
import React from 'react'
import cn from 'bem-cn'

const bem = cn('tool-panel')

class ToolPanel extends React.Component {
    static defaultProps = {
        closed: false,
    }

    constructor(props: *) {
        super(props)
        const {closed} = props
        this.state = {
            closed,
        }
    }

    state: {
        closed: boolean,
    }

    props: {
        title: string,
        closed: boolean,
        children?: *,
    }

    handleClose = () => {
        this.setState({
            closed: !this.state.closed,
        })
    }

    render() {
        const {title, children} = this.props
        const {closed} = this.state
        return (
            <div className={bem()}>
                <div className={bem('title')} onClick={this.handleClose}>
                    <span className={bem('triangle')}>{closed ? '\u25B6' : '\u25BC'}</span>
                    {title}
                </div>
                <div style={{display: closed ? 'none' : 'block'}} className={bem('body')}>
                    {children}
                </div>
            </div>
        )
    }
}

export default ToolPanel
