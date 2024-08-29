import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../api'
import ErrorMessage from './ErrorMessage'

const VerifyEmail = () => {
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const useQuery = () => {
    return new URLSearchParams(useLocation().search)
  }

  const query = useQuery()
  const token = query.get('token')

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/verify_email?token=${token}`)
        if (response.status === 200) {
          setMessage(response.data.message)
        } else {
          setErrorMessage('Email verification failed.')
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.detail || 'Email verification failed.')
      }
    }

    if (token) {
      verifyEmail()
    } else {
      setErrorMessage('Invalid or missing verification token.')
    }
  }, [token])

  return (
    <div className='container'>
      <div className='columns is-centered'>
        <div className='column is-half'>
          <div className='box has-text-centered'>
            {message && (
              <div className='notification is-success'>
                {message}
              </div>
            )}
            {errorMessage && (
              <div className='notification is-danger'>
                {errorMessage}
              </div>
            )}
            {!message && !errorMessage && (
              <div className='notification is-info'>
                Verifying your email...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
