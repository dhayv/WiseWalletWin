import React, { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'
import 'bulma/css/bulma.min.css'
import '../styles/Header.css' // Custom styles if needed
import { useNavigate } from 'react-router-dom'

const Header = ({ title }) => {
  const { token, setToken, setIncomeData, setExpenseData, setUserId } = useContext(UserContext)
  const [isActive, setIsActive] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    setToken(null)
    setUserId(null)
    setIncomeData([])
    setExpenseData([])
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    navigate("/")
  }

  const toggleDropdown = () => {
    setIsActive(!isActive)
  }

  return (
    <header>
      <nav className='navbar' role='navigation' aria-label='main navigation'>
        <div className='container'>
          <div className='navbar-brand'>
            <a
              role='button'
              className={`navbar-burger burger ${isActive ? 'is-active' : ''}`}
              aria-label='menu'
              aria-expanded={isActive ? 'true' : 'false'}
              data-target='navbarMenu'
              onClick={toggleDropdown}
            >
              <span aria-hidden='true' />
              <span aria-hidden='true' />
              <span aria-hidden='true' />
            </a>
          </div>

          <div id='navbarMenu' className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
            <div className='navbar-start'>
              <a className='navbar-item' href='/account-info'>
                Account Information
              </a>
            </div>

            <div className='navbar-end'>
              <div className='navbar-item'>
                <div className='buttons'>
                  <button className='button is-light' onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className='header-title-container'>
        <div className='container has-text-centered'>
          <h1 className='title'>{title}</h1>
        </div>
      </div>
    </header>
  )
}

export default Header
