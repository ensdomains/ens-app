import React, { Fragment } from 'react'
import {
  BrowserRouter as Router,
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
import { TestPage } from './routes/Test'
import Modal from './components/Modal/Modal'
import Confirm from './components/SingleName/Confirm'
import { NetworkError } from './components/Error/Errors'
import { CONFIRM } from './modals'

import DefaultLayout from './components/Layout/DefaultLayout'
import Analytics from './utils/analytics'

const HomePageLayout = ({ children }) => <Fragment>{children}</Fragment>

const Route = ({
  component: Component,
  layout: Layout = DefaultLayout,
  ...rest
}) => {
  Analytics.pageview()
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

const App = () => {
  Analytics.setup()
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} layout={HomePageLayout} />
          <Route path="/test" component={TestPage} />
          <Route path="/test-registrar" component={TestRegistrar} />
          <Route path="/favourites" component={Favourites} />
          <Route path="/my-bids" component={SearchResults} />
          <Route path="/about" component={About} />
          <Route path="/how-it-works" component={SearchResults} />
          <Route path="/search/:searchTerm" component={SearchResults} />
          <Route path="/name/:name" component={SingleName} />
          <Route path="/address/:address" component={Address} />
        </Switch>
      </Router>
      <Modal name={CONFIRM} component={Confirm} />
    </>
  )
}
export default App
