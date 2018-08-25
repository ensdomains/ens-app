import React, { Fragment } from 'react'
import {
  BrowserRouter as Router,
  Route as DefaultRoute,
  Switch
} from 'react-router-dom'
import TestRegistrar from './routes/TestRegistrar'
import Home from './routes/Home'
import SearchResults from './routes/SearchResults'
import SingleName from './routes/SingleName'
import Header from './components/Header/Header'

const DefaultLayout = ({ children }) => (
  <Fragment>
    <Header />
    {children}
  </Fragment>
)

const HomePageLayout = ({ children }) => <Fragment>{children}</Fragment>

const Route = ({
  component: Component,
  layout: Layout = DefaultLayout,
  ...rest
}) => {
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
  <Router>
    <Switch>
      <Route exact path="/" component={Home} layout={HomePageLayout} />
      <Route path="/test-registrar" component={TestRegistrar} />
      <Route path="/favourites" component={SearchResults} />
      <Route path="/my-bids" component={SearchResults} />
      <Route path="/about" component={SearchResults} />
      <Route path="/how-it-works" component={SearchResults} />
      <Route path="/search/:searchTerm" component={SearchResults} />
      <Route path="/name/:name" component={SingleName} />
    </Switch>
  </Router>
)
export default App
