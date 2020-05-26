import styled from '@emotion/styled/macro'
import mq from 'mediaQuery'

export const H2 = styled('h2')`
  font-size: 18px;
  font-weight: 200;
  color: #adbbcd;

  ${mq.medium`
    font-size: 22px;
  `}
`

export const Title = styled('h2')`
  font-size: 18px;
  font-weight: 100;
  padding: 0;
  margin: 0;
  ${mq.medium`
    font-size: 28px;
  `}
`

export const HR = styled('hr')`
  border: 0;
  border-top: 1px dashed #d3d3d3;
  background-color: #fff;
  margin-bottom: 30px;
  margin-top: 0;
`
