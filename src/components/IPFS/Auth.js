import { getConfig } from './Config'

export function login(username, password) {
  const client = getConfig('Temporal')
  var data = JSON.stringify({
    username: username.toString(),
    password: password.toString()
  })

  var req = new XMLHttpRequest()
  req.withCredentials = false

  req.addEventListener(
    'readystatechange',
    function() {
      if (req.readyState === 4) {
        let result = JSON.parse(req.responseText)
        if (result.token) {
          console.log(result)
          localStorage.setItem('id_expire', result.expire)
          localStorage.setItem('id_token', result.token)
          this.props.startAuthorizing()
        } else {
          console.log('error')
        }
      }
    }.bind(this)
  )

  req.open('POST', client.loginDev)
  req.setRequestHeader('Cache-Control', 'no-cache')
  req.setRequestHeader('Content-Type', 'text/plain')
  req.send(data)
}

export function loggedIn() {
  const token = getToken()
  const expire = getExpire()
  return !!token && isTokenExpired(expire)
}

function isTokenExpired(expire) {
  try {
    if (new Date(expire) > new Date()) {
      return true
    } else {
      console.log('WTF')
      return false
    }
  } catch (err) {
    console.log('WTF Error')
    return false
  }
}

export function getToken() {
  return localStorage.getItem('id_token')
}

function getExpire() {
  return localStorage.getItem('id_expire')
}

export function logout() {
  localStorage.removeItem('id_token')
  localStorage.removeItem('id_expire')
}
