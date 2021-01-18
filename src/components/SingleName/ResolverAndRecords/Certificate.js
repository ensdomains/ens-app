function createFetchUrl(name) {
  return `https://eth.domains/names/${name}.domains`
}

function whitelisted() {
  return !['app.ens.domains', 'ens.eth', 'ens.eth.link'].includes(
    window.location.host
  )
}

export function requestCertificate(name) {
  if (!whitelisted()) return
  const fetchUrl = `https://eth.domains/names/${name}.domains`
  fetch(fetchUrl, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      Origin: '*',
      'Content-Type': 'text/plain',
      'Access-Control-Request-Method': 'PUT'
    }
  }).catch(e => {
    console.log(e)
  })
}

export function checkCertificate(name) {
  if (!whitelisted()) return
  return fetch(createFetchUrl(name))
}

export function isEthSubdomain(name) {
  let labels = name.split('.')
  let suffix = labels[labels.length - 1]
  return suffix === 'eth' && name !== 'eth'
}
