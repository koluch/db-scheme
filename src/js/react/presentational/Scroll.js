// @flow
import React from 'react'
import cn from 'bem-cn'

const bem = cn('scroll')

class Scroll extends React.Component {
    props: {
        children?: *,
    }

    render() {
        return (
            <div className={bem()}>
                <div className={bem('body')}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Scroll
