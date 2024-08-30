import React, { useState, useContext } from 'react';
import ErrorMessage from './ErrorMessage';
import { UserContext } from '../context/UserContext';
import api from '../api';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [userName, setUserName] = useState('');
  const [passWord, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { setToken, setUserId, setIncomeData, setIncomeId } = useContext(UserContext);
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const submitLogin = async () => {
    try {
      const params = new URLSearchParams();
      params.append('username', userName);
      params.append('password', passWord);

      const response = await api.post('/token', params);


      localStorage.setItem('token', response.data.access_token);
      setToken(response.data.access_token);

      const userInfoResponse = await api.get('/user/me', {
        headers: { Authorization: `Bearer ${response.data.access_token}` }
      });
      if (userInfoResponse.status === 200) {

        const userData = userInfoResponse.data;

        localStorage.setItem('userId', userData._id); // Save userId to local storage
        setUserId(userData._id); // Update userId in the context

        navigate('/');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || 'Login failed');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin();
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

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
        <div className='column'>
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
                    <i className='fas fa-user' />
                  </span>
                </div>
              </div>
              {/* Password */}
              <div className='field'>
                <label className='label' htmlFor='password'>Password</label>
                <div className='control has-icons-left has-icon-right'>
                  <input
                    id='password'
                    name='password'
                    type={isPasswordVisible ? 'text' : 'password'}
                    placeholder='Enter Password'
                    value={passWord}
                    onChange={handlePasswordChange}
                    className='input'
                    minLength='8'
                    required
                    autoComplete='current-password'
                  />
                  <span className='icon is-small is-left'>
                    <i className='fas fa-lock'/>
                  </span>
                  <span 
                  className='icon is-medium is-left is-clickable' 
                  aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                  style={{ cursor: 'pointer', marginLeft: '14.5rem' }} 
                  onClick={handleToggle}>
                  <i className={isPasswordVisible ? "fas fa-eye" : "fas fa-eye-slash"}></i>
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
            <button className='button is-link is-light is-fullwidth mt-4' onClick={() => navigate('/signup')} style={{ marginTop: '10px' }}>
              Don't have an account? Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
