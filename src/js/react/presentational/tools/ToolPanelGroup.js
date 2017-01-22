// @flow
import React from 'react'
import cn from 'bem-cn'

const bem = cn('tool-panel-group')

class ToolPanelGroup extends React.Component {
    constructor(props: *) {
        super(props)
        const firstOpenedItem = props.children
            .map((item, i) => ({item, i}))
            .filter(({item}) => item.props.opened)[0]

        this.state = {
            opened: firstOpenedItem ? firstOpenedItem.i : -1,
        }
    }

    state: {
        opened: number,
    }

    props: {
        children?: *, //todo: investigate, how to specify exact type of children (e.g. React.Element<ToolPanel>)
    }

    handleTitleClick = (i: number) => {
        this.setState({
            opened: i === this.state.opened ? -1 : i,
        })
    }

    render() {
        const {children} = this.props
        const {opened} = this.state

        return (
            <div className={bem()}>
                {(children ? children : []).map((child: *, i) => {
                    return React.cloneElement(child, {
                        key: child.props.title,
                        opened: i === opened,
                        onTitleClick: this.handleTitleClick.bind(this, i),
                    })
                })}
            </div>
        )
    }
}

export default ToolPanelGroup

//
// class ToolPanelGroup extends React.Component {
//     constructor(props: *) {
//         super(props)
//         const {data} = props
//         const firstOpenedItem = data
//             .map(({opened}, i) => ({i, opened}))
//             .filter(({opened}) => opened !== null ? opened : false)[0]
//         this.state = {
//             opened: firstOpenedItem ? firstOpenedItem.i : -1,
//         }
//     }
//
//     state: {
//         opened: number,
//     }
//
//     props: {
//         data: Array<{title: string, body: *, opened?: boolean}>,
//     }
//
//     handleTitleClick = (i: number) => {
//         this.setState({
//             opened: i,
//         })
//     }
//
//     render() {
//         const {data} = this.props
//         const {opened} = this.state
//         return (
//             <div className={bem()}>
//                 {data.map(({title, body}, i) => (
//                     <ToolPanel key={i} title={title} closed={i !== opened} onTitleClick={this.handleTitleClick.bind(this, i)}>
//                         {body}
//                     </ToolPanel>
//                 ))}
//             </div>
//         )
//     }
// }
//
// export default ToolPanelGroup
