import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import TestRegistrar from './routes/TestRegistrar'
import Registrar from './routes/Registrar'
import Home from './routes/Home'
import Manager from './routes/Manager'

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
          <Link to="/registrar">Registrar</Link>
        </li>
        <li>
          <Link to="/manager">Manager</Link>
        </li>
      </ul>

      <hr />
      <Route exact path="/" component={Home} />
      <Route path="/test-registrar" component={TestRegistrar} />
      <Route path="/registrar" component={Registrar} />
      <Route path="/manager" component={Manager} />
    </div>
  </Router>
)
export default App
