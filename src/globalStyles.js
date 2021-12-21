import { injectGlobal } from 'emotion'

injectGlobal`
  * {
    box-sizing: border-box;
  }
  body {
    font-family: Overpass;
    background: #F0F6FA;
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
