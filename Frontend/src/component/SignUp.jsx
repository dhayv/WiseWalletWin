import React, { useState, useContext } from 'react'
import PasswordChecklist from 'react-password-checklist'
import { UserContext } from '../context/UserContext'
import 'react-phone-number-input/style.css'
import ErrorMessage from './ErrorMessage'
import api from '../api'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    userName: '',
    email: '',
    passWord: '',
    confirmationPassword: '',
  })
  const [errorMessages, setErrorMessages] = useState([])
  const [showChecklist, setShowChecklist] = useState(false)

  const { setToken, setUserId } = useContext(UserContext)
  const navigate = useNavigate()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
    if (name === 'passWord' || name === 'confirmationPassword') {
      setShowChecklist(true)
    }
  }

  const submitRegistration = async () => {
    const { firstName, userName, email, passWord, confirmationPassword } = formData

    if (passWord !== confirmationPassword) {
      setErrorMessages(['Passwords do not match.'])
      return
    }

    try {
      const userResponse = await api.post('/user', {
        first_name: firstName,
        username: userName,
        email,
        password: passWord,
      })

      if (userResponse.status === 201) {
        const params = new URLSearchParams()
        params.append('username', userName)
        params.append('password', passWord)

        // retieve token
        const tokenResponse = await api.post('/token', params, {
          headers: { 'Content-type': 'application/x-www-form-urlencoded' }
        })

        if (tokenResponse.status === 200) {
          const data = tokenResponse.data

          // store token to context
          localStorage.setItem('token', data.access_token)
          setToken(data.access_token)

          // get user info
          const userInfoResponse = await api.get('/user/me', {
            headers: { Authorization: `Bearer ${data.access_token}` }
          })

          if (userInfoResponse.status === 200) {
            const userData = userInfoResponse.data

            // store token
            localStorage.setItem('userId', userData._id)
            setUserId(userData._id)

            // to home
            navigate('/')
          }
        } else {
          setErrorMessages(['Failed to register or log in'])
        }
      } else {
        setErrorMessages(['Failed to register'])
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrorMessages(error.response.data.errors.map((err) => err.msg))
      } else {
        setErrorMessages(['Registration failed'])
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    submitRegistration()
  }

  const handleToggle = (e) => {
    e.preventDefault();
    setIsPasswordVisible(prevState => !prevState);
  };

  return (
    <div
      className='container is-flex is-justify-content-center is-align-items-center'
      style={{ minHeight: '100vh' }}
    >
      <div className='columns is-centered'>
        <div className='column '>

          <div className='box'>
            <form onSubmit={handleSubmit}>
              <h1 className='title has-text-centered'>Sign Up</h1>
              {/* First Name */}
              <div className='field'>
                <label className='label' htmlFor='firstName'>First Name</label>
                <div className='control has-icons-left'>
                  <input
                    id='firstName'
                    name='firstName'
                    type='text'
                    placeholder='Enter First Name'
                    value={formData.firstName}
                    onChange={handleChange}
                    className='input'
                    required
                  />
                  <span className='icon is-small is-left'>
                    <i className='fas fa-user' />
                  </span>
                </div>
              </div>
              {/* Username */}
              <div className='field'>
                <label className='label' htmlFor='username'>Username</label>
                <div className='control has-icons-left'>
                  <input
                    id='username'
                    name='userName'
                    type='text'
                    placeholder='Enter Username'
                    value={formData.userName}
                    onChange={handleChange}
                    className='input'
                    required
                    autoComplete='username'
                  />
                  <span className='icon is-small is-left'>
                    <i className='fas fa-user' />
                  </span>
                </div>
              </div>
              {/* Email */}
              <div className='field'>
                <label className='label' htmlFor='email'>Email Address</label>
                <div className='control has-icons-left'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='Enter Email'
                    value={formData.email}
                    onChange={handleChange}
                    className='input'
                    required
                    autoComplete='email'
                  />
                  <span className='icon is-small is-left'>
                    <i className='fas fa-envelope' />
                  </span>
                </div>
              </div>
              {/* Password */}
              <div className='field'>
                <label className='label' htmlFor='password'>Password</label>
                <div className='control has-icons-left '>
                  <input
                    id='password'
                    name='passWord'
                    type={isPasswordVisible ? 'text' : 'password'}
                    placeholder='Enter Password'
                    value={formData.passWord}
                    onChange={handleChange}
                    className='input'
                    autoComplete='new-password'
                  />
                  <span className='icon is-small is-left'>
                    <i className='fas fa-lock' />
                  </span>
                  <span 
                  className='icon is-medium is-left is-clickable' 
                  aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                  style={{ cursor: 'pointer', marginLeft: '14.3rem' }} 
                  onClick={handleToggle}>
                  <i className={isPasswordVisible ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                </span>
                </div>
              </div>
              {/* Confirm Password */}
              <div className='field'>
                <label className='label' htmlFor='confirmationPassword'>Confirm Password</label>
                <div className='control has-icons-left'>
                  <input
                    id='confirmationPassword'
                    name='confirmationPassword'
                    type='password'
                    placeholder='Re-enter Password to Confirm'
                    value={formData.confirmationPassword}
                    onChange={handleChange}
                    className='input'
                    autoComplete='new-password'
                  />
                  <span className='icon is-small is-left'>
                    <i className='fas fa-lock' />
                  </span>
                </div>
              </div>
              {/* Password Checklist */}
              {showChecklist && (
                <div className='field mt-3'>
                  <PasswordChecklist
                    rules={['minLength', 'specialChar', 'number', 'capital', 'match']}
                    minLength={8}
                    value={formData.passWord}
                    valueAgain={formData.confirmationPassword}
                    onChange={(isValid) => {}}
                  />
                </div>
              )}
              <ErrorMessage messages={errorMessages} />
              <br />
              {/* Button */}
              <button className='button is-primary is-fullwidth' type='submit'>
                Sign Up
              </button>
            </form>
            <button className='button is-link is-light is-fullwidth mt-4' onClick={() => navigate('/login')} style={{ marginTop: '10px' }}>
              Have an account already? Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
