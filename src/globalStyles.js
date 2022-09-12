import { injectGlobal } from 'emotion'
import bg from './assets/background.png'

injectGlobal`
  * {
    box-sizing: border-box;
  }
  body {
    font-family: Overpass;
    background: #00000000;
    margin: 0;
  }

  a {
    color: #282929;
    text-decoration: none;
    transition: 0.2s;

    &:hover {
      color: #282929;
    }

    &:visited {
      color: #282929
    } 
  }
`
