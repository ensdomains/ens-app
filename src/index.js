import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from '@apollo/client'
import { createGlobalStyle } from 'styled-components'

import { theme } from '@ensdomains/thorin'

import App from 'App'
import './i18n'
import setup from './setup'
import { clientReactive, networkIdReactive } from './apollo/reactiveVars'
import { setupClient } from './apollo/apolloClient'
import Loader from './components/Loader'

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
    margin: 0;
  }

  * {
    box-sizing: border-box;
  }
  
  html {
    background: ${theme.colors.background.simple};
    overflow-y: auto;
  }
  
  body {
    font-family: "JakartaSans", -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  #root {
    display: flex;
    flex-direction: column;
  }

  @font-face {
    font-family: "JakartaSans";
    src: url("./assets/webfonts/PlusJakartaSans-Regular.woff2") format("woff2"),
    url("./assets/webfonts/PlusJakartaSans-Regular.woff") format("woff");
    font-weight: normal;
  }

  @font-face {
    font-family: "JakartaSans";
    src: url("./assets/webfonts/PlusJakartaSans-Bold.woff2") format("woff2"),
    url("./assets/webfonts/PlusJakartaSans-Bold.woff") format("woff");
    font-weight: bold;
  }
`

setup(false)
window.addEventListener('load', async () => {
  const client = clientReactive(setupClient(networkIdReactive()))
  ReactDOM.render(
    <Suspense fallback={<Loader withWrap large />}>
      <ApolloProvider {...{ client }}>
        <GlobalStyle />
        <App />
      </ApolloProvider>
    </Suspense>,
    document.getElementById('root')
  )
})
