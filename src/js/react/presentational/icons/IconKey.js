// @flow
import React from 'react'
import cn from 'bem-cn'

const bem = cn('icon')

class Button extends React.Component {
    render() {
        return (
            <svg className={bem({'key': true})} enableBackground="new 0 0 24 24" version="1.0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9,2C5.1,2,2,5.1,2,9c0,3.9,3.1,7,7,7c3.9,0,7-3.1,7-7C16,5.1,12.9,2,9,2z M7.5,10C6.1,10,5,8.9,5,7.5C5,6.1,6.1,5,7.5,5  C8.9,5,10,6.1,10,7.5C10,8.9,8.9,10,7.5,10z"/>
                <path d="M15,11l-4,4l2,2v0h2v2l0,0h2v2l0.7,0.7c0.2,0.2,0.4,0.3,0.7,0.3H21c0.6,0,1-0.4,1-1v-2.6c0-0.3-0.1-0.5-0.3-0.7L15,11z"/>
            </svg>
        )
    }
}

export default Button
