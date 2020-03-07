import React, { useState } from 'react'
import styled from '@emotion/styled'
import { getConfig } from './Config'

const Login = styled('div')`
  width: 400px;
  margin: 16px auto;
  font-size: 16px;
`

const Header = styled('h2')`
  margin-top: 0;
  margin-bottom: 0;
  background: #5483fe;
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
  background: #5384fe;
  width: 100%;
  height: 35px;
  border-color: transparent;
  color: #fff;
  cursor: pointer;
  font-size: 0.95em;
  :hover {
    background: #2c46a6;
  }
  :focus {
    border-color: #2c46a6;
  }
`

const IpfsLogin = props => {
  const [errorMsg, setErrorMsg] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = (username, password) => {
    const client = getConfig('TEMPORAL')
    var data = JSON.stringify({
      username: username.toString(),
      password: password.toString()
    })

    var req = new XMLHttpRequest()
    req.withCredentials = false

    req.addEventListener('readystatechange', () => {
      if (req.readyState === 4) {
        let result = JSON.parse(req.responseText)
        if (result.token) {
          window.localStorage.setItem('ipfsexpire', result.expire)
          window.localStorage.setItem('ipfstoken', result.token)
          setErrorMsg('')
          props.startAuthorizing()
        } else {
          setErrorMsg(result.message)
        }
      }
    })

    req.open('POST', client.loginDev)
    req.setRequestHeader('Cache-Control', 'no-cache')
    req.setRequestHeader('Content-Type', 'text/plain')
    req.send(data)
  }

  const handleChange = evt => {
    const { name, value } = evt.target
    name === `username` ? setUsername(value) : setPassword(value)
  }

  const handleSubmit = evt => {
    evt.preventDefault()
    login(username, password)
  }

  return (
    <Login>
      <Header>Log in</Header>
      <LoginForm onSubmit={handleSubmit}>
        <ErrorMsg>{errorMsg}</ErrorMsg>
        <InputWrapper>
          <TextInput
            type="username"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
        </InputWrapper>
        <InputWrapper>
          <TextInput
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </InputWrapper>
        <InputWrapper>
          <Button type="submit" value="Submit" />
        </InputWrapper>
      </LoginForm>
    </Login>
  )
}

export default IpfsLogin
