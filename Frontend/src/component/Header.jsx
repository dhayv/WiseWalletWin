import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext'

const Header = ({ title }) => {
  // Ensure that you are destructuring the context value correctly
  // It should match the object structure you provided to UserContext.Provider
  const { token, setToken } = useContext(UserContext)

  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem('token') // Also remove the token from localStorage on logout
  }

  return (
    <div className='has-text-centered m-6'>
      <h1 className='title'>{title}</h1>
      {token && (
        <button className='button' onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  )
}

export default Header
