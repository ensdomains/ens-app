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
    this.state = {}
  }

  login(username, password) {
    var data = new FormData()
    data.append('username', username)
    data.append('password', password)

    var xhr = new XMLHttpRequest()
    xhr.withCredentials = false

    xhr.addEventListener(
      'readystatechange',
      function() {
        if (xhr.readyState === 4) {
          let result = JSON.parse(xhr.responseText)
          if (result.code === 200) {
            console.log(result)
          } else {
            // @TODO Error handling
          }
        }
      }.bind(this)
    )

    xhr.open('POST', 'https://api.temporal.cloud/v2/auth/login')
    xhr.setRequestHeader('Cache-Control', 'no-cache')
    xhr.send(data)
  }

  render() {
    return (
      <Login>
        <Triangle />
        <Header>Log in</Header>

        <LoginForm>
          <InputWrapper>
            <TextInput type="email" placeholder="Email" />
          </InputWrapper>
          <InputWrapper>
            <TextInput type="password" placeholder="Password" />
          </InputWrapper>
          <InputWrapper>
            <Button type="submit" value="Log in" onClick={this.login} />
          </InputWrapper>
        </LoginForm>
      </Login>
    )
  }
}

export default IpfsLogin
