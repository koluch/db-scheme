// @flow
import React from 'react'
import cn from 'bem-cn'

import Button from '~/react/presentational/Button'

const bem = cn('modal')

export class ModalRow extends React.Component {
    props: {
        children?: *,
    }

    render() {
        return (
            <div className={bem('row')}>
                {this.props.children}
            </div>
        )
    }
}

export class ModalBottom extends React.Component {
    props: {
        children?: *,
    }

    render() {
        return (
            <div className={bem('bottom')}>
                {this.props.children}
            </div>
        )
    }
}

type TButtonDesc = {
    title: string,
    onClick: () => void,
    variant?: 'warning' | 'create',
    disabled?: boolean,
}

export default class Modal extends React.Component {
    props: {
        title: string,
        buttons: Array<TButtonDesc>,
        children?: *,
    }

    render() {
        return (
            <div className={bem()}>
                <div className={bem('content')}>
                    <div className={bem('title')}>{this.props.title}</div>
                    <div className={bem('body')}>
                        {this.props.children}
                    </div>
                    <div className={bem('bottom')}>
                        {this.props.buttons.map(({title, onClick, variant, disabled}) => (
                            <Button
                                key={title}
                                disabled={disabled}
                                onClick={onClick}
                                variant={variant}
                            >
                                {title}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}
