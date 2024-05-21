import React, { useState, useContext } from 'react'

import { UserContext } from '../context/UserContext'
import ErrorMessage from './ErrorMessage'
import api from '../api'

const SignUp = ({ setShowSignUp }) => {
  const [firstName, setFirstName] = useState('')
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [passWord, setPassword] = useState('')

  const [confirmationPassword, setConfirmationPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // Manages token globally
  const { setToken, setUserId } = useContext(UserContext)

  // Function to submit user info(Post)
  const submitRegistration = async () => {
    if (passWord !== confirmationPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    try {
      const userResponse = await api.post('/user', {
        first_name: firstName,
        username: userName,
        email,
        password: passWord,
        phone_number: phoneNumber
      })

      if (userResponse.status === 201) {
        const params = new URLSearchParams()
        params.append('username', userName)
        params.append('password', passWord)

        const tokenResponse = await api.post('/token', params, {
          headers: { 'Content-type': 'application/x-www-form-urlencoded' }
        })

        if (tokenResponse.status === 200) {
          const data = tokenResponse.data
          localStorage.setItem('token', data.access_token)
          setToken(data.access_token)

          const userInfoResponse = await api.get('/user/me', {
            headers: { Authorization: `Bearer ${data.access_token}` }
          })

          if (userInfoResponse.status === 200) {
            const userData = userInfoResponse.data
            localStorage.setItem('userId', userData.id) // Save userId to local storage
            setUserId(userData.id) // Update userId in the context
          }
        } else {
          setErrorMessage('Failed to register or log in')
        }
      } else {
        setErrorMessage('Failed to register')
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || 'Registration failed')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    submitRegistration()
  }

  const validatePassword = (password) => {
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter'
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
    if (!/\d/.test(password)) return 'Password must contain at least one digit'
    if (!/[!@#$%^&*(),.?\\":{}|<>]/.test(password)) return 'Password must contain at least one special character'
    return ''
  }

  const handlePasswordChange = (e) => {
    const newPass = e.target.value
    setPassword(newPass)
    const errorMessage = validatePassword(newPass)
    setPasswordError(errorMessage)
  }

  return (
    <div>
      <div>
        <div>
          <div className='has-text-centered'>
            <h1 className='title is-5 mb-3'>Welcome to Wise Wallet Win!</h1>
            <h2 className='subtitle is-6 mb-5'>
              We're excited to help you take control of your finances. Start by adding your income and expenses, and let us guide you towards smarter financial decisions.
            </h2>
          </div>
          <div className='box'>
            <form onSubmit={handleSubmit}>
              <h1 className='title has-text-centered'>SignUp</h1>
              {/* First Name */}
              <div className='field'>
                <label className='label'>First Name</label>
                <div className='control'>
                  <input
                    type='text'
                    placeholder='Enter First Name'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className='input'
                  />
                </div>
              </div>
              {/* UserName */}
              <div className='field'>
                <label className='label'>Username</label>
                <div className='control'>
                  <input
                    type='text'
                    placeholder='Enter Username'
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className='input'
                    required
                  />
                </div>
              </div>
              {/* Email */}
              <div className='field'>
                <label className='label'>Email Address</label>
                <div className='control'>
                  <input
                    type='email'
                    placeholder='Enter Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='input'
                    required
                  />
                </div>
              </div>
              {/* Password */}
              <div className='field'>
                <label className='label'>Password</label>
                <div className='control'>
                  <input
                    type='password'
                    placeholder='Enter Password'
                    value={passWord}
                    onChange={handlePasswordChange}
                    className='input'
                    minLength='8'
                    required
                  />
                </div>
              </div>
              {/* Password confirmation */}
              <div className='field'>
                <label className='label'>Confirm Password</label>
                <div className='control'>
                  <input
                    type='password'
                    placeholder='Re-enter Password to Confirm'
                    value={confirmationPassword}
                    onChange={(e) => setConfirmationPassword(e.target.value)}
                    className={`input ${passwordError ? 'is-danger' : ''}`}
                    minLength='8'
                    required
                  />
                  {passwordError && <p className='help is-danger'>{passwordError}</p>}
                </div>
              </div>
              {/* Phone Number */}
              <div className='field'>
                <label className='label'>Phone Number</label>
                <div className='control'>
                  <input
                    type='text'
                    placeholder='Enter Phone Number'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    pattern='^(\\d{3}[-\\s]?){2}\\d{4}$'
                    className='input'
                  />
                </div>
              </div>
              <ErrorMessage message={errorMessage} />
              <br />
              {/* Button */}
              <button className='button is-primary is-fullwidth' type='submit'>
                SignUp
              </button>
            </form>
            <button className='button is-link is-light is-fullwidth' onClick={() => setShowSignUp(false)} style={{ marginTop: '10px' }}>
              Already have an account? Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
