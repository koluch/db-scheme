// @flow
import React from 'react'
import cn from 'bem-cn'

const bem = cn('tool-panel-group')

class ToolPanelGroup extends React.Component {
    static defaultProps = {
        mode: 'MULTIPLE',
    }

    constructor(props: *) {
        super(props)

        const opened = {}

        props.children.forEach((item, i) => {
            opened[i] = item.props.opened
        })

        // const firstOpenedItem = props.children
        //     .map((item, i) => ({item, i}))
        //     .filter(({item}) => item.props.opened)[0]


        this.state = {opened}
    }

    state: {
        opened: {[id: number]: number},
    }

    props: {
        mode: 'SINGLE' | 'MULTIPLE',
        children?: *, //todo: investigate, how to specify exact type of children (e.g. React.Element<ToolPanel>)
    }

    handleTitleClick = (i: number) => {
        if (this.props.mode === 'SINGLE') {
            const newOpened = {...this.state.opened}
            Object.keys(newOpened).forEach((key) => {
                newOpened[key] = false
            })
            newOpened[i] = true

            this.setState({
                opened: newOpened,
            })
        }
        else {
            this.setState({
                opened: {
                    ...this.state.opened,
                    [i]: !this.state.opened[i],
                },
            })
        }
        // this.setState({
        //     opened: i === this.state.opened ? -1 : i,
        // })
    }

    render() {
        const {children} = this.props
        const {opened} = this.state

        return (
            <div className={bem()}>
                {(children ? children : []).map((child: *, i) => {
                    return React.cloneElement(child, {
                        key: child.props.title,
                        opened: opened[i],
                        onTitleClick: this.handleTitleClick.bind(this, i),
                    })
                })}
            </div>
        )
    }
}

export default ToolPanelGroup
