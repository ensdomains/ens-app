import 'cross-fetch/polyfill'

const rootUrl = 'https://preimagedb.appspot.com/keccak256/query'

export function decryptHashes(...hashes) {
  let trimmedHashes = hashes.map(hash => hash.slice(2))

  var myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  return fetch(rootUrl, {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(trimmedHashes)
  })
    .then(res => res.json())
    .then(json => json.data)
}
