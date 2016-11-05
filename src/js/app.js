// @flow
import ReactDOM from 'react-dom'
import React from 'react'

import Root from '~/react/Root'

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Root/>,
        document.getElementById('react')
    )
})
