import React, { Fragment, lazy, useEffect } from 'react'
import {
  HashRouter,
  BrowserRouter,
  Route as DefaultRoute,
  Switch
} from 'react-router-dom'
import { useQuery } from '@apollo/client'
import styled from 'styled-components'

import { MainLayout } from '@ensdomains/thorin'

const TestRegistrar = lazy(() =>
  import(
    /* webpackChunkName: "TestRegistrar", webpackPrefetch:true */
    './routes/TestRegistrar'
  )
)

const Home = lazy(() =>
  import(
    /* webpackChunkName: "Home", webpackPrefetch:true */
    './routes/Home'
  )
)

const SearchResults = lazy(() =>
  import(
    /* webpackChunkName: "SearchResults", webpackPrefetch:true */
    './routes/SearchResults'
  )
)

const SingleName = lazy(() =>
  import(
    /* webpackChunkName: "SingleName", webpackPrefetch:true */
    './routes/SingleName'
  )
)

const Favourites = lazy(() =>
  import(
    /* webpackChunkName: "Favourites", webpackPrefetch:true */
    './routes/Favourites'
  )
)

const Faq = lazy(() =>
  import(
    /* webpackChunkName: "Faq", webpackPrefetch:true */
    './routes/Faq'
  )
)

const Address = lazy(() =>
  import(
    /* webpackChunkName: "Address", webpackPrefetch:true */
    './routes/AddressPage'
  )
)

const Renew = lazy(() =>
  import(
    /* webpackChunkName: "Renew", webpackPrefetch:true */
    './routes/Renew'
  )
)

import { NetworkError, Error404 } from './components/Error/Errors'
import DefaultLayout from './components/Layout/DefaultLayout'
import { pageview, setupAnalytics } from './utils/analytics'
import { gql } from '@apollo/client'
import useReactiveVarListeners from './hooks/useReactiveVarListeners'

//If we are targeting an IPFS build we need to use HashRouter
const Router =
  process.env.REACT_APP_IPFS === 'True' ? HashRouter : BrowserRouter

const HomePageLayout = ({ children }) => <Fragment>{children}</Fragment>

const Route = ({
  component: Component,
  layout: Layout = DefaultLayout,
  ...rest
}) => {
  pageview()
  return (
    <DefaultRoute
      {...rest}
      render={props => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  )
}

export const APP_DATA = gql`
  query getAppData @client {
    globalError
  }
`

const App = () => {
  useReactiveVarListeners()
  const {
    data: { globalError }
  } = useQuery(APP_DATA)

  useEffect(() => {
    setupAnalytics()
  }, [])

  if (globalError) {
    return <NetworkError message={globalError} />
  }

  return (
    <Router>
      <MainLayout
        {...{
          languageSelector: true,
          CTA: {
            text: '',
            callback: () => null
          },
          links: [
            {
              text: 'text',
              callback: () => null
            }
          ],
          footer: {
            socials: ['twitter'],
            links: [
              {
                text: 'text',
                callback: () => null
              }
            ]
          }
        }}
      >
        <Switch>
          <DefaultRoute exact path="/" component={Home} />
          <Route path="/test-registrar" component={TestRegistrar} />
          <Route path="/favourites" component={Favourites} />
          <Route path="/faq" component={Faq} />
          <Route path="/my-bids" component={SearchResults} />
          <Route path="/how-it-works" component={SearchResults} />
          <Route path="/search/:searchTerm" component={SearchResults} />
          <Route path="/name/:name" component={SingleName} />
          <Route path="/address/:address/:domainType" component={Address} />
          <Route path="/address/:address" component={Address} />
          <Route path="/renew" component={Renew} />
          <Route path="*" component={Error404} />
        </Switch>
      </MainLayout>
    </Router>
  )
}
export default App
