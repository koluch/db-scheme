// @flow
import React from 'react'
import cn from 'bem-cn'

const bem = cn('icon')

class Button extends React.Component {
    render() {
        return (
            <svg className={bem({'plus': true})} enableBackground="new 0 0 256 256" version="1.1" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                <path d="M185.066,128c0,3.534-2.866,6-6.4,6H134v44.666c0,3.534-2.467,6.399-6,6.399c-3.534,0-6-2.865-6-6.399V134H77.332  c-3.535,0-6.4-2.466-6.4-6s2.866-6,6.4-6H122V77.331c0-3.534,2.466-6.4,6-6.4c3.533,0,6,2.866,6,6.4V122h44.666  C182.2,122,185.066,124.466,185.066,128z M256,128C256,57.42,198.58,0,128,0C57.42,0,0,57.42,0,128c0,70.58,57.42,128,128,128  C198.58,256,256,198.58,256,128z M243.2,128c0,63.521-51.679,115.2-115.2,115.2c-63.522,0-115.2-51.679-115.2-115.2  C12.8,64.478,64.478,12.8,128,12.8C191.521,12.8,243.2,64.478,243.2,128z"/>
            </svg>
        )
    }
}

export default Button
