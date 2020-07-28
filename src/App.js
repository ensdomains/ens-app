import React, { Fragment } from 'react'
import {
  HashRouter,
  BrowserRouter,
  Route as DefaultRoute,
  Switch
} from 'react-router-dom'
import { Query } from 'react-apollo'

import { GET_ERRORS } from './graphql/queries'

import TestRegistrar from './routes/TestRegistrar'
import Home from './routes/Home'
import SearchResults from './routes/SearchResults'
import SingleName from './routes/SingleName'
import Favourites from './routes/Favourites'
import About from './routes/About'
import Address from './routes/AddressPage'
import Renew from './routes/Renew'
import Modal from './components/Modal/Modal'
import Confirm from './components/SingleName/Confirm'
import { NetworkError, Error404 } from './components/Error/Errors'
import { CONFIRM } from './modals'
import ExpiryNotificationModal from './components/ExpiryNotification/ExpiryNotificationModal'

import DefaultLayout from './components/Layout/DefaultLayout'
import { pageview, setup } from './utils/analytics'
import StackdriverErrorReporter from 'stackdriver-errors-js'
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

const App = () => (
  <>
    <Query query={GET_ERRORS}>
      {({ data }) => {
        setup()

        errorHandler.start({
          key: 'AIzaSyDW3loXBr_2e-Q2f8ZXdD0UAvMzaodBBNg',
          projectId: 'idyllic-ethos-235310'
        })

        if (data.error && data.error.message) {
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
                  <Route path="/my-bids" component={SearchResults} />
                  <Route path="/about" component={About} />
                  <Route path="/how-it-works" component={SearchResults} />
                  <Route path="/search/:searchTerm" component={SearchResults} />
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
              <Modal name={CONFIRM} component={Confirm} />
              <ExpiryNotificationModal />
            </>
          )
        }
      }}
    </Query>
  </>
)
export default App
