import React, { Component } from 'react'
import styled from '@emotion/styled'

const Login = styled('div')`
  width: 400px;
  margin: 16px auto;
  font-size: 16px;
`

const Header = styled('h2')`
  margin-top: 0;
  margin-bottom: 0;
  background: #28d;
  padding: 20px;
  font-size: 1.4em;
  font-weight: normal;
  text-align: center;
  text-transform: uppercase;
  color: #fff;
`

const ErrorMsg = styled('h3')`
  margin-top: 0;
  margin-bottom: 0;
  padding: 10px;
  font-weight: normal;
  text-align: center;
  text-transform: uppercase;
  color: red;
`

const InputWrapper = styled('p')`
  margin-top: 0;
  margin-bottom: 0;
  padding: 12px;
`

const Triangle = styled('div')`
  width: 0;
  margin-right: auto;
  margin-left: auto;
  border: 12px solid transparent;
  border-bottom-color: #28d;
`

const LoginForm = styled('form')`
  background: #ebebeb;
  padding: 12px;
`

const TextInput = styled('input')`
  box-sizing: border-box;
  display: block;
  width: 100%;
  border-width: 1px;
  border-style: solid;
  padding: 16px;
  outline: 0;
  font-family: inherit;
  font-size: 0.95em;
  background: #fff;
  border-color: #bbb;
  color: #555;
  :focus {
    border-color: #888;
  }
`

const Button = styled('input')`
  background: #28d;
  border-color: transparent;
  color: #fff;
  cursor: pointer;
  :hover {
    background: #17c;
  }
  :focus {
    border-color: #05a;
  }
`

class IpfsLogin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: '',
      username: '',
      password: ''
    }

    this.login = this.login.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  login(username, password) {
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
            console.log(`yay`)
            console.log(this.props.authenticated)
            this.props.authenticated = true
          } else {
            console.log('error')
          }
        }
      }.bind(this)
    )

    req.open('POST', 'https://dev.api.temporal.cloud/v2/auth/login')
    req.setRequestHeader('Cache-Control', 'no-cache')
    req.setRequestHeader('Content-Type', 'text/plain')
    req.send(data)
  }

  handleChange(e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.login(this.state.username, this.state.password)
  }

  render() {
    return (
      <Login>
        <Triangle />
        <Header>Log in</Header>

        <LoginForm onSubmit={this.handleSubmit}>
          {this.state.error !== '' ? (
            <ErrorMsg>this.state.error</ErrorMsg>
          ) : (
            <></>
          )}
          <InputWrapper>
            <TextInput
              type="username"
              name="username"
              placeholder="Username"
              onChange={this.handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <TextInput
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <Button type="submit" value="Log in" />
          </InputWrapper>
        </LoginForm>
      </Login>
    )
  }
}

export default IpfsLogin
