import {Component} from 'react'

import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    userIdInput: '',
    pinInput: '',
    isError: false,
    errMsg: '',
  }

  onChangeUserId = event => {
    this.setState({userIdInput: event.target.value})
  }

  onChangePin = event => {
    this.setState({pinInput: event.target.value})
  }

  onSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onFailure = errMsg => {
    this.setState({isError: true, errMsg})
  }

  onSubmitLogin = async event => {
    event.preventDefault()
    const {userIdInput, pinInput} = this.state
    const userDetails = {user_id: userIdInput, pin: pinInput}

    const apiUrl = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSuccess(data.jwt_token)
    } else {
      this.onFailure(data.error_msg)
    }
  }

  render() {
    const {userIdInput, pinInput, isError, errMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="main-container">
        <div className="responsive-container">
          <div className="image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="login-image"
            />
          </div>
          <form className="login-form" onSubmit={this.onSubmitLogin}>
            <h1 className="login-heading">Welcome Back!</h1>
            <div className="input-container">
              <label htmlFor="userId" className="label">
                User Id
              </label>
              <input
                type="text"
                id="userId"
                value={userIdInput}
                className="input"
                placeholder="Enter User Id"
                onChange={this.onChangeUserId}
              />
            </div>
            <div className="input-container">
              <label htmlFor="userPin" className="label">
                Pin
              </label>
              <input
                type="password"
                id="userPin"
                value={pinInput}
                className="input"
                placeholder="Enter Pin"
                onChange={this.onChangePin}
              />
            </div>
            <button type="submit" className="login-btn">
              Login
            </button>
            {isError && <p className="error">{errMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}
export default Login
