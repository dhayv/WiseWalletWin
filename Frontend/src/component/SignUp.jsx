import React, { useState, useContext } from 'react'
import PasswordChecklist from "react-password-checklist"
import { UserContext } from '../context/UserContext'
import PhoneInput from 'react-phone-number-input';
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
  const [showChecklist, SetShowChecklist] = useState('false');

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

  return (
    <div className='container'>
      <div className='columns is-centered'>
        <div className='column is-full-mobile is-half-tablet is-one-third-desktop'>
          <div className='has-text-centered'>
            <h1 className='title is-4'>Welcome to Wise Wallet Win!</h1>
            <h2 className='subtitle is-6'>
              We're excited to help you take control of your finances. Start by adding your income and expenses, and let us guide you towards smarter financial decisions.
            </h2>
          </div>
          <div className='box'>
            <form onSubmit={handleSubmit}>
              <h1 className='title has-text-centered'>SignUp</h1>
              {/* First Name */}
              <div className='field'>
                <label className='label' htmlFor='firstName'>First Name</label>
                <div className='control has-icons-left'>
                  <input
                    id='firstName'
                    name='firstName'
                    type='text'
                    placeholder='Enter First Name'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className='input'
                    required
                  />
                  <span className='icon is-small is-left'>
                    <i className='fas fa-user'></i>
                  </span>
                </div>
              </div>
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
              {/* Email */}
              <div className='field'>
                <label className='label' htmlFor='email'>Email Address</label>
                <div className='control has-icons-left'>
                  <input
                    id= 'email'
                    name='email'
                    type='email'
                    placeholder='Enter Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='input'
                    required
                    autoComplete='email'
                  />
                  <span className='icon is-small is-left'>
                    <i className='fas fa-envelope'></i>
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      SetShowChecklist(true);
                    }}
                    className='input'
                    minLength='8'
                    required
                    autoComplete='new-password'
                  />
                  <span className='icon is-small is-left'>
                    <i className='fas fa-lock'></i>
                  </span>
                </div>
              </div>
              {/* Password confirmation */}
              <div className='field'>
                <label className='label' htmlFor='confirmationPassword'>Confirm Password</label>
                <div className='control has-icons-left'>
                  <input
                    id='confirmationPassword'
                    name='confirmationPassword'
                    type='password'
                    placeholder='Re-enter Password to Confirm'
                    value={confirmationPassword}
                    onChange={(e) => {
                      setConfirmationPassword(e.target.value);
                      SetShowChecklist(true);  
                    }}
                    className={`input ${passwordError ? 'is-danger' : ''}`}
                    minLength='8'
                    required
                    autoComplete='new-password'
                  />
                  <span className='icon is-small is-left'>
                    <i className='fas fa-lock'></i>
                  </span>
                  {passwordError && <p className='help is-danger'>{passwordError}</p>}
                </div>
                {/* Password Checklist */}
              {showChecklist && (<div className="field mt-3 pl-5">
                <PasswordChecklist
                  rules={["minLength", "specialChar", "number", "capital", "match"]}
                  minLength={8}
                  value={passWord}
                  valueAgain={confirmationPassword}
                  onChange={(isValid) => {}}
                />
              </div>)}
              </div>
              {/* Phone Number */}
              <div className='field'>
                <label className='label' htmlFor='phoneNumber'>Phone Number</label>
                <div className='control has-icons-left'>
                  <PhoneInput
                    id='phoneNumber'
                    name='phoneNumber'
                    
                    placeholder='Enter Phone Number'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    
                    
                    className='input'
                  />
                  <span className='icon is-small is-left'>
                    <i className='fas fa-phone'></i>
                  </span>
                </div>
              </div>
              <ErrorMessage message={errorMessage} />
              <br />
              {/* Button */}
              <button className='button is-primary is-fullwidth' type='submit'>
                SignUp
              </button>
              
            </form>
            <button className='button is-link is-light is-fullwidth mt 4' onClick={() => setShowSignUp(false)} style={{ marginTop: '10px' }}>
              Have an account? Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}  

export default SignUp
