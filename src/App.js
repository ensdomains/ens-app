import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import TestRegistrar from './routes/TestRegistrar'
import Home from './routes/Home'
import Manager from './routes/Manager'
import SingleName from './routes/SingleName'

const App = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/test-registrar">Test Registrar</Link>
        </li>
        <li>
          <Link to="/manager">Manager</Link>
        </li>
      </ul>

      <hr />
      <Route exact path="/" component={Home} />
      <Route path="/test-registrar" component={TestRegistrar} />
      <Route path="/manager" component={Manager} />
      <Route path="/name/:name" component={SingleName} />
    </div>
  </Router>
)
export default App
