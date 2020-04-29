import React from 'react'
import createIcon from '../utils/blockies'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { useQuery } from 'react-apollo'
import { GET_REVERSE_RECORD } from '../graphql/queries'
const Avatar = styled('img')`
  border-radius: 50%;
  box-shadow: 2px 2px 9px 0 #e1e1e1;
  flex-shrink: 0;
`
const BlockiesContainer = styled('span')``

const Blockies = ({
  address,
  imageSize = 42,
  color,
  bgcolor,
  spotcolor,
  className
}) => {
  const {
    data: { getReverseRecord } = {},
    loading: reverseRecordLoading
  } = useQuery(GET_REVERSE_RECORD, {
    variables: {
      address
    }
  })
  let imgURL
  if (getReverseRecord && getReverseRecord.avatar) {
    imgURL = getReverseRecord.avatar
  } else {
    imgURL = createIcon({
      seed: address.toLowerCase(),
      size: 8,
      scale: 5,
      color,
      bgcolor,
      spotcolor
    }).toDataURL()
  }
  var style = {
    backgroundImage: 'url(' + imgURL + ')',
    backgroundSize: 'cover',
    width: imageSize + 'px',
    height: imageSize + 'px',
    display: 'inline-block'
  }
  return <BlockiesContainer className={className} style={style} />
}

Blockies.propTypes = {
  address: PropTypes.string.isRequired,
  imageSize: PropTypes.number,
  color: PropTypes.string,
  bgcolor: PropTypes.string,
  spotcolor: PropTypes.string,
  className: PropTypes.string
}

export default Blockies

export const SingleNameBlockies = styled(Blockies)`
  margin-right: 10px;
  border-radius: 50%;
  box-shadow: 2px 2px 9px 0 #e1e1e1;
  flex-shrink: 0;
`
