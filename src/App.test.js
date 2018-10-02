import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ApolloProvider } from 'react-apollo'
import createClient from './testing-utils/mockedClient'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <ApolloProvider client={createClient()}>
      <App />
    </ApolloProvider>,
    div
  )
  ReactDOM.unmountComponentAtNode(div)
})
