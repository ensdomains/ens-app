import React, { Fragment, useContext, useEffect, useState, lazy } from 'react'
import {
  HashRouter,
  BrowserRouter,
  Route as DefaultRoute,
  Switch
} from 'react-router-dom'
import { Query } from 'react-apollo'

import { GET_ERRORS } from './graphql/queries'

// const TestRegistrar = lazy(() =>
//   import(
//     /* webpackChunkName: "TestRegistrar", webpackPrefetch:true */
//     './routes/TestRegistrar'
//   )
// )
//
// const Home = lazy(() =>
//   import(
//     /* webpackChunkName: "Home", webpackPrefetch:true */
//     './routes/Home'
//   )
// )
//
// const SearchResults = lazy(() =>
//   import(
//     /* webpackChunkName: "SearchResults", webpackPrefetch:true */
//     './routes/SearchResults'
//   )
// )
//
// const SingleName = lazy(() =>
//   import(
//     /* webpackChunkName: "SingleName", webpackPrefetch:true */
//     './routes/SingleName'
//   )
// )
//
// const Favourites = lazy(() =>
//   import(
//     /* webpackChunkName: "Favourites", webpackPrefetch:true */
//     './routes/Favourites'
//   )
// )
//
// const Faq = lazy(() =>
//   import(
//     /* webpackChunkName: "Faq", webpackPrefetch:true */
//     './routes/Faq'
//   )
// )
//
// const Address = lazy(() =>
//   import(
//     /* webpackChunkName: "Address", webpackPrefetch:true */
//     './routes/AddressPage'
//   )
// )
//
// const Renew = lazy(() =>
//   import(
//     /* webpackChunkName: "Renew", webpackPrefetch:true */
//     './routes/Renew'
//   )
// )

import TestRegistrar from './routes/TestRegistrar'
import Home from './routes/Home'
import SearchResults from './routes/SearchResults'
import SingleName from './routes/SingleName'
import Favourites from './routes/Favourites'
import Faq from './routes/Faq'
import Address from './routes/AddressPage'
import Renew from './routes/Renew'

import { NetworkError, Error404 } from './components/Error/Errors'
import DefaultLayout from './components/Layout/DefaultLayout'
import { pageview, setup as setupAnalytics } from './utils/analytics'
import StackdriverErrorReporter from 'stackdriver-errors-js'
import GlobalState from './globalState'
import { ApolloProvider } from 'react-apollo'
import { setupClient } from 'apolloClient'
const errorHandler = new StackdriverErrorReporter()

// If we are targeting an IPFS build we need to use HashRouter
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

const App = ({ initialClient, initialNetworkId }) => {
  const { currentNetwork } = useContext(GlobalState)
  let [currentClient, setCurrentClient] = useState(initialClient)
  useEffect(() => {
    if (currentNetwork) {
      setupClient(currentNetwork).then(client => setCurrentClient(client))
    }
  }, [currentNetwork])

  return (
    <ApolloProvider client={currentClient}>
      <Query query={GET_ERRORS}>
        {({ data }) => {
          setupAnalytics()
          errorHandler.start({
            key: 'AIzaSyDW3loXBr_2e-Q2f8ZXdD0UAvMzaodBBNg',
            projectId: 'idyllic-ethos-235310'
          })

          if (data && data.error && data.error.message) {
            return <NetworkError message={data.error.message} />
          } else {
            return (
              <>
                <Router>
                  <Switch>
                    <Route
                      exact
                      path="/"
                      component={Home}
                      layout={HomePageLayout}
                    />
                    <Route path="/test-registrar" component={TestRegistrar} />
                    <Route path="/favourites" component={Favourites} />
                    <Route path="/faq" component={Faq} />
                    <Route path="/my-bids" component={SearchResults} />
                    <Route path="/how-it-works" component={SearchResults} />
                    <Route
                      path="/search/:searchTerm"
                      component={SearchResults}
                    />
                    <Route path="/name/:name" component={SingleName} />
                    <Route
                      path="/address/:address/:domainType"
                      component={Address}
                    />
                    <Route path="/address/:address" component={Address} />
                    <Route path="/renew" component={Renew} />
                    <Route path="*" component={Error404} />
                  </Switch>
                </Router>
              </>
            )
          }
        }}
      </Query>
    </ApolloProvider>
  )
}
export default App
