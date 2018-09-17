import { injectGlobal } from 'emotion'

injectGlobal`
  * {
    box-sizing: border-box;
  }
  body {
    font-family: Overpass;
    background: #F0F6FA;
  }

  a {
    color: #5284ff;
    text-decoration: none;

    /* &:visited {
      color: #5284ff
    } */
  }
`
