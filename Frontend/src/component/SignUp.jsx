import React, { useState, useContext } from 'react';
import PasswordChecklist from "react-password-checklist";
import { UserContext } from '../context/UserContext';
import 'react-phone-number-input/style.css';
import ErrorMessage from './ErrorMessage';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const SignUp = ({ setShowSignUp }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    userName: '',
    email: '',
    passWord: '',
    confirmationPassword: '',
    phoneNumber: '',
  });
  const [errorMessages, setErrorMessages] = useState([]);
  const [showChecklist, setShowChecklist] = useState(false);

  const { setToken, setUserId } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    if (name === 'passWord' || name === 'confirmationPassword') {
      setShowChecklist(true);
    }
  };

  const submitRegistration = async () => {
    const { firstName, userName, email, passWord, confirmationPassword, phoneNumber } = formData;

    if (passWord !== confirmationPassword) {
      setErrorMessages(['Passwords do not match.']);
      return;
    }

    try {
      const userResponse = await api.post('/user', {
        first_name: firstName,
        username: userName,
        email,
        password: passWord,
        phone_number: phoneNumber,
      });

      if (userResponse.status === 201) {
        const params = new URLSearchParams();
        params.append('username', userName);
        params.append('password', passWord);

        const tokenResponse = await api.post('/token', params, {
          headers: { 'Content-type': 'application/x-www-form-urlencoded' },
        });

        if (tokenResponse.status === 200) {
          const data = tokenResponse.data;
          localStorage.setItem('token', data.access_token);
          setToken(data.access_token);

          const userInfoResponse = await api.get('/user/me', {
            headers: { Authorization: `Bearer ${data.access_token}` },
          });

          if (userInfoResponse.status === 200) {
            const userData = userInfoResponse.data;
            localStorage.setItem('userId', userData.id);
            setUserId(userData.id);
          }
        } else {
          setErrorMessages(['Failed to register or log in']);
        }
      } else {
        setErrorMessages(['Failed to register']);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrorMessages(error.response.data.errors.map((err) => err.msg));
      } else {
        setErrorMessages(['Registration failed']);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitRegistration();
  };

  return (
    <div className="container is-flex is-justify-content-center is-align-items-center"
    style={{ minHeight: '100vh' }}
    >
      <div className='columns is-centered'>
        <div className='column is-full-mobile is-three-quarters-tablet is-half-desktop'>
          <div className='has-text-centered'>
            <h1 className='title is-4'>Welcome to Wise Wallet Win!</h1>
            <h2 className='subtitle is-6'>
              We're excited to help you take control of your finances. Start by adding your income and expenses, and let us guide you towards smarter financial decisions.
            </h2>
          </div>
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
                    <i className='fas fa-user'></i>
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
                    <i className='fas fa-user'></i>
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
                    name='passWord'
                    type='password'
                    placeholder='Enter Password'
                    value={formData.passWord}
                    onChange={handleChange}
                    className='input'
                    autoComplete='new-password'
                  />
                  <span className='icon is-small is-left'>
                    <i className='fas fa-lock'></i>
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
                    <i className='fas fa-lock'></i>
                  </span>
                </div>
              </div>
              {/* Password Checklist */}
              {showChecklist && (
                <div className="field mt-3 pl-5">
                  <PasswordChecklist
                    rules={["minLength", "specialChar", "number", "capital", "match"]}
                    minLength={8}
                    value={formData.passWord}
                    valueAgain={formData.confirmationPassword}
                    onChange={(isValid) => {}}
                  />
                </div>
              )}
              {/* Phone Number */}
              <div className='field'>
                <label className='label' htmlFor='phoneNumber'>Phone Number (Optional)</label>
                <div className='control has-icons-left'>
                  <input
                    id='phoneNumber'
                    name='phoneNumber'
                    type='text'
                    placeholder='Enter Phone Number (e.g., 123-456-7890)'
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    pattern="^(?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$"
                    className='input'
                  />
                  <span className='icon is-small is-left'>
                    <i className='fas fa-phone'></i>
                  </span>
                </div>
              </div>
              <ErrorMessage messages={errorMessages} />
              <br />
              {/* Button */}
              <button className='button is-primary is-fullwidth' type='submit'>
                Sign Up
              </button>
            </form>
            <button className='button is-link is-light is-fullwidth mt-4' onClick={() => navigate("/login")} style={{ marginTop: '10px' }}>
              Have an account? Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
