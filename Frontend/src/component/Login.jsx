import React, { useState, useContext } from 'react'
import ErrorMessage from './ErrorMessage'
import { UserContext } from '../context/UserContext'
import api from '../api'


// Define submitLogin inside the Login component if it uses component state or props
const Login = ({ setShowSignUp }) => {
  const [userName, setUserName] = useState('')
  const [passWord, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { setToken, setUserId } = useContext(UserContext)

  const submitLogin = async () => {
    try {
      const params = new URLSearchParams()
      params.append('username', userName)
      params.append('password', passWord)
      params.append('grant_type', '')
      params.append('scope', '')
      params.append('client_id', '')
      params.append('client_secret', '')

      const response = await api.post('/token', params)

      localStorage.setItem('token', response.data.access_token)
      setToken(response.data.access_token)

      const userInfoResponse = await api.get('/user/me', {
        headers: { Authorization: `Bearer ${response.data.access_token}` }
      })
      if (userInfoResponse.status === 200) {
        const userData = userInfoResponse.data
        localStorage.setItem('userId', userData.id) // Save userId to local storage
        setUserId(userData.id) // Update userId in the context
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || 'Login failed')
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    submitLogin()
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  return (
    <div className="container is-flex is-justify-content-center is-align-items-center"
    style={{ minHeight: '100vh' }}
    >
      <div className='columns is-centered'>
        <div className='column is-full-mobile is-three-quarters-tablet is-half-desktop'>
          <div className='has-text-centered'>
            <h1 className='title is-4'>Welcome Back!</h1>
            <h2 className='subtitle is-6'>
              Track your expenses, plan your budget, and stay on top of your finances with Wise Wallet.
            </h2>
          </div>
          <div className='box'>
            <form onSubmit={handleSubmit}>
              <h1 className='title has-text-centered'>Login</h1>
              {/* UserName */}
              <div className='field'>
                <label className='label' htmlFor='username'>Username</label>
                <div className='control has-icons-left'>
                  <input
                    id='username'
                    name='username'
                    type='text'
                    placeholder='Enter Username'
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className='input'
                    required
                    autoComplete='username'
                  />
                  <span className='icon is-small is-left'>
                  <i className='fas fa-user'></i>
                </span>
                </div>
                
              </div>
              {/* Password */}
              <div className='field'>
                <label className='label' htmlFor='password'>Password</label>
                <div className='control has-icons-left'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    placeholder='Enter Password'
                    value={passWord}
                    onChange={handlePasswordChange}
                    className='input'
                    minLength='8'
                    required
                    autoComplete='current-password'
                    
                  />
                  <span className='icon is-small is-left'>
                  <i className='fas fa-lock'></i>
                </span>
                </div>
                
              </div>
              <ErrorMessage message={errorMessage} />
              <br />
              {/* Button */}
              <button className='button is-primary is-fullwidth' type='submit'>
                Login
              </button>
            </form>
            <button className='button is-link is-light is-fullwidth mt-4' onClick={() => setShowSignUp(true)} style={{ marginTop: '10px' }}>
              Don't have an account? Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Login
