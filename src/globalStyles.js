import { injectGlobal } from 'emotion'

injectGlobal`
  * {
    box-sizing: border-box;
  }
  body {
    font-family: Overpass;
    background: #ea6060;
    margin: 0;
  }

  a {
    color: #ea6060;
    text-decoration: none;
    transition: 0.2s;

    &:hover {
      color: #2C46A6;
    }

    &:visited {
      color: #ea6060
    } 
  }
`
