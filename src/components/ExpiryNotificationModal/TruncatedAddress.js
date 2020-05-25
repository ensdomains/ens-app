import React from 'react'

export default function TruncatedAddress({ address = '' }) {
  // const [showFullAddress, setShowFullAddress] = useState(false)
  const showFullAddress = false
  const addressTruncated = address.substr(0, 18)

  return (
    <span title={address} style={{ fontWeight: 500 }}>
      {showFullAddress ? address : addressTruncated}

      {!showFullAddress && <span>&hellip;</span>}
    </span>
  )
}
