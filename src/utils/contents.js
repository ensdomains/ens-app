import contentHash from 'content-hash'
import multihash from 'multihashes'

export function decode(encoded) {
  let decoded, protocolType, error
  if (encoded.error) {
    return { protocolType: null, decoded: encoded.error }
  }
  if (encoded) {
    try {
      decoded = contentHash.decode(encoded)
      console.log(decoded)
      if (contentHash.isHashOfType(encoded, contentHash.Types.ipfs)) {
        protocolType = 'ipfs'
      } else if (contentHash.isHashOfType(encoded, contentHash.Types.swarm)) {
        protocolType = 'bzz'
      } else if (contentHash.isHashOfType(encoded, Buffer.from('bc', 'hex'))) {
        protocolType = 'onion'
      } else if (contentHash.isHashOfType(encoded, Buffer.from('bd', 'hex'))) {
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
  return (
    contentHash.isHashOfType(encoded, contentHash.Types.ipfs) ||
    contentHash.isHashOfType(encoded, contentHash.Types.swarm) ||
    contentHash.isHashOfType(encoded, Buffer.from('bc', 'hex')) ||
    contentHash.isHashOfType(encoded, Buffer.from('bd', 'hex'))
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
    console.log(contentType, ' tupe')
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
