import contentHash from 'content-hash'

export function decode(encoded){
  let decoded, protocolType
  if(encoded.error){
    return { protocolType:null, decoded:encoded.error }
  }
  if(encoded){
    decoded = contentHash.decode(encoded)
    if(contentHash.isHashOfType(encoded, contentHash.Types.ipfs)){
      protocolType = 'ipfs'
    }else if (contentHash.isHashOfType(encoded, contentHash.Types.swarm)){
      protocolType = 'bzz'
    }else{
      decoded = encoded
    }
  }
  console.log('decode', {encoded, decoded})
  return { protocolType, decoded }
}

export function validateContent(encoded){
  return contentHash.isHashOfType(encoded, contentHash.Types.ipfs) || contentHash.isHashOfType(encoded, contentHash.Types.swarm)
}

export function encode(text){
  let content, contentType
  let encoded = false
  if(!!text){
    let matched = text.match(/^(ipfs|bzz):\/\/(.*)/)
    if(matched){
      contentType = matched[1]
      content = matched[2]
    }
  
    try{
      if(contentType === 'ipfs'){
        encoded = '0x' + contentHash.fromIpfs(content)
      }else if(contentType === 'bzz'){
        encoded = '0x' + contentHash.fromSwarm(content)
      }else{
        console.warn('Unsupported protocol or invalid value', {contentType, text})
      }
    }catch(err){
        console.warn('Error encoding content hash', {text, encoded})
    }
  }
  return encoded
}
