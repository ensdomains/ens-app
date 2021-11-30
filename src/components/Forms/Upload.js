import styled from '@emotion/styled/macro'
import { ReactComponent as Upload } from '../Icons/Upload.svg'

const StyledUpload = styled(Upload)`
  ${p =>
    p.disabled &&
    `
     g {
       fill: #ADBBCD;
     }
  `}
  &:hover {
    g {
      transition: 0.2s;
      fill: #ea5060;
    }
    cursor: pointer;
  }

  ${p =>
    p.disabled &&
    `
    &:hover {
      cursor: default;
      g {
        fill: #ADBBCD;
      }
    }
  `}
`

export default StyledUpload
