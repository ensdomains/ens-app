export default class AuthService {
  constructor(domain) {
    this.domain = domain || 'https://api.temporal.cloud/v2/auth/login'
    this.login = this.login.bind(this)
  }

  login(username, password) {
    return this.fetch(`${this.domain}`, {
      method: 'POST',
      body: JSON.stringify({
        username: username.toString(),
        password: password.toString()
      })
    }).then(res => {
      this.setToken(res.token)
      return Promise.resolve(res)
    })
  }

  loggedIn() {
    const token = this.getToken()
    const expire = this.getExpire()
    return !!token && !this.isTokenExpired(expire)
  }

  isTokenExpired(expire) {
    try {
      if (expire < Date.now() / 1000) {
        return true
      } else return false
    } catch (err) {
      return false
    }
  }

  setToken(token) {
    localStorage.setItem('id_token', token)
  }

  setExp(expire) {
    localStorage.setItem('id_expire', expire)
  }

  getToken() {
    return localStorage.getItem('id_token')
  }

  getExpire() {
    return localStorage.getItem('id_expire')
  }

  logout() {
    localStorage.removeItem('id_token')
    localStorage.removeItem('id_expire')
  }
}
