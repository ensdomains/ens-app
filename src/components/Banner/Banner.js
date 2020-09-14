import styled from '@emotion/styled/macro'
import mq from 'mediaQuery'

const Banner = styled('div')`
  position: relative;
  color: #2b2b2b;
  font-weight: 300;
  font-size: 18px;
  background: white;
  padding: 20px;
  margin-bottom: 20px;

  h3 {
    margin: 0;
    color: #f5a623;
    font-weight: 300;
    font-size: 18px;
  }

  p {
    color: #2b2b2b;
    font-weight: 300;
    font-size: 18px;
    font-weight: 300;
    margin: 0;
  }

  ${mq.small`
    border-radius: 5px; 
  `}
`

export default Banner
