export function login(username, password) {
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
        if (result.code === 200) {
          console.log(result)
          localStorage.setItem('Cat', 'Tom')
          localStorage.setItem('id_token', result.token)
          setExp(result.expire)
        } else {
          console.log(result)
        }
      }
    }.bind(this)
  )

  req.open('POST', 'https://dev.api.temporal.cloud/v2/auth/login')
  req.setRequestHeader('Cache-Control', 'no-cache')
  req.setRequestHeader('Content-Type', 'text/plain')
  req.send(data)
}

export function loggedIn() {
  const token = getToken()
  const expire = getExpire()
  return !!token && !isTokenExpired(expire)
}

function isTokenExpired(expire) {
  try {
    if (expire < Date.now() / 1000) {
      return true
    } else return false
  } catch (err) {
    return false
  }
}

function setToken(token) {
  localStorage.setItem('id_token', token)
  localStorage.setItem('Cat', 'Tom')
}

function setExp(expire) {
  localStorage.setItem('id_expire', expire)
}

function getToken() {
  return localStorage.getItem('id_token')
}

function getExpire() {
  return localStorage.getItem('id_expire')
}

export function logout() {
  localStorage.removeItem('id_token')
  localStorage.removeItem('id_expire')
}
