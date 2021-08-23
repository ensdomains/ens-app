import React, { Fragment, lazy, Suspense } from 'react'
import {
  HashRouter,
  BrowserRouter,
  Route as DefaultRoute,
  Switch
} from 'react-router-dom'
import { useQuery } from '@apollo/client'

const TestRegistrar = lazy(() => import('./routes/TestRegistrar'))
const Home = lazy(() => import('./routes/Home'))
const SearchResults = lazy(() => import('./routes/SearchResults'))
const SingleName = lazy(() => import('./routes/SingleName'))
const Favourites = lazy(() => import('./routes/Favourites'))
const Faq = lazy(() => import('./routes/Faq'))
const Address = lazy(() => import('./routes/AddressPage'))
const Renew = lazy(() => import('./routes/Renew'))

import { NetworkError, Error404 } from './components/Error/Errors'
import DefaultLayout from './components/Layout/DefaultLayout'
import { pageview, setup as setupAnalytics } from './utils/analytics'
import gql from 'graphql-tag'
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
  const { globalError } = useQuery(APP_DATA)

  if (globalError) {
    return <NetworkError message={globalError} />
  }

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={Home} layout={HomePageLayout} />
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
      </Suspense>
    </Router>
  )
}
export default App
