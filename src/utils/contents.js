import contentHash from 'content-hash'

export function decode(encoded) {
  let decoded, codec, protocolType, error
  if (encoded.error) {
    return { protocolType: null, decoded: encoded.error }
  }
  if (encoded) {
    try {
      decoded = contentHash.decode(encoded)
      codec = contentHash.getCodec(encoded)
      if (codec === 'ipfs-ns') {
        protocolType = 'ipfs'
      } else if (codec === 'swarm-ns') {
        protocolType = 'bzz'
      } else if (codec === 'onion') {
        protocolType = 'onion'
      } else if (codec === 'onion3') {
        protocolType = 'onion3'
      } else {
        decoded = encoded
      }
    } catch (e) {
      error = e.message
    }
  }
  return { protocolType, decoded, error }
}

export function validateContent(encoded) {
  let codec
  try {
    codec = contentHash.getCodec(encoded)
  } catch (e) {
    console.warn(e.message)
    return false
  }

  return (
    codec === 'ipfs-ns' ||
    codec === 'swarm-ns' ||
    codec === 'onion' ||
    codec === 'onion3'
  )
}

export function encode(text) {
  let content, contentType
  let encoded = false
  if (!!text) {
    let matched = text.match(/^(ipfs|bzz|onion):\/\/(.*)/)
    if (matched) {
      contentType = matched[1]
      content = matched[2]
    }
    try {
      if (contentType === 'ipfs') {
        encoded = '0x' + contentHash.fromIpfs(content)
      } else if (contentType === 'bzz') {
        encoded = '0x' + contentHash.fromSwarm(content)
      } else if (contentType === 'onion') {
        encoded = '0x' + contentHash.fromOnion(content)
      } else {
        console.warn('Unsupported protocol or invalid value', {
          contentType,
          text
        })
      }
    } catch (err) {
      console.warn('Error encoding content hash', { text, encoded })
    }
  }
  console.log(encoded)
  return encoded
}
