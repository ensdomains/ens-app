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
  return localStorage.getItem('idtoken')
}

function getExpire() {
  return localStorage.getItem('idexpire')
}

export function logout() {
  localStorage.removeItem('idtoken')
  localStorage.removeItem('idexpire')
}
