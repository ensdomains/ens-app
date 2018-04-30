import React from 'react'
import ReactDOM from 'react-dom'
import SearchName from './SearchName'

test('check searchName renders', () => {
  const container = document.createElement('div')
  ReactDOM.render(<SearchName />, container)
  console.log(container.innerHTML)
})
