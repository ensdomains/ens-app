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
    color: #BD393A;
    text-decoration: none;
    transition: 0.2s;

    &:hover {
      color: #BD393A;
    }

    &:visited {
      color: #BD393A
    } 
  }
`
