// @flow
import React from 'react'
import cn from 'bem-cn'

const bem = cn('icon')

class Button extends React.Component {
    render() {
        return (
            <svg className={bem({'cursor': true})} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
                <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                    <g transform="translate(-899.000000, -227.000000)">
                        <g id="slice" transform="translate(215.000000, 119.000000)"/>
                        <path
                            d="M914.000027,248.002414 L914.000464,232.002414 L914.000464,232.002414 L907.001354,232.002414 L907.000079,248.002414 L914.000027,248.002414 Z M913.998311,249.002414 L910.501672,254 L907.00169,249.002414 L913.998311,249.002414 Z M914.000492,231.002414 L914.000574,228.002414 C914.000574,227 912.99816,227 912.99816,227 L908.004086,227 C908.004086,227 907.001672,227 907.001672,228.002414 L907.001433,231.002414 L914.000492,231.002414 L914.000492,231.002414 Z"
                            fill="#000000"
                            transform="translate(910.500326, 240.500000) rotate(45.000000) translate(-910.500326, -240.500000) "
                        />
                    </g>
                </g>
            </svg>
        )
    }
}

export default Button
