import React, { Fragment } from 'react'
import {
  BrowserRouter as Router,
  Route as DefaultRoute,
  Switch
} from 'react-router-dom'
import TestRegistrar from './routes/TestRegistrar'
import Home from './routes/Home'
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
      <Route path="/favourites" component={Home} />
      <Route path="/my-bids" component={Home} />
      <Route path="/about" component={Home} />
      <Route path="/how-it-works" component={Home} />
      <Route path="/name/:name" component={SingleName} />
    </Switch>
  </Router>
)
export default App
