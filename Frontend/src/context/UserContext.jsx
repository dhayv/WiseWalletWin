import React, { createContext, useEffect, useState, useCallback, useLayoutEffect } from 'react'
import api from '../api'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  // Start with a token from local storage if there's one
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [userId, setUserId] = useState(null)
  const [incomeId, setIncomeId] = useState(null)
  const [refreshData, setRefreshData] = useState(false)
  const [userData, setUserData] = useState(null)
  const [totalExpenses, setTotalExpenses] = useState({ total: 0 })
  const [recentPay, setRecentPay] = useState('')
  const [incomeData, setIncomeData] = useState([])
  const [expenseData, setExpenseData] = useState([])



  const fetchUser = useCallback(async () => {
    if (token) {
      try {
        const response = await api.get('/user/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.status === 200) {
          const data = response.data
          setUserData(data)
          setUserId(data._id) // Set user ID here
          console.log('User ID set to:', data._id)
        } else {
          handleLogout()
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        handleLogout()
      }
    }
  }, [token])

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) {
      setUserId(storedUserId)
    }
    fetchUser() // Fetch user data when the component mounts
  }, [fetchUser])

  useEffect(() => {
    if (userId && refreshData) {
      const fetchData = async () => {
        try {
          const [incomeResponse, expenseResponse] = await Promise.all([
            api.get(`/income/${userId}`),
            api.get(`/expenses/${userId}`)
          ])

          if (incomeResponse.status === 200) {
            setIncomeData(incomeResponse.data)
            if (incomeResponse.data.length > 0) {
              setIncomeId(incomeResponse.data[0]._id)
            }
          }

          if (expenseResponse.status === 200) {
            setExpenseData(expenseResponse.data)
          }
        } catch (error) {
          console.error('Failed to fetch data:', error)
        }
      }

      fetchData()
    }
  }, [userId, refreshData])

  const handleLogout = () => {
    setToken(null)
    setUserId(null)
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
  }

  return (
  // This lets any component get the token and user data
    <UserContext.Provider value={{ token, setToken, userId, setUserId, incomeId, setIncomeId, refreshData, userData, totalExpenses, setTotalExpenses, recentPay, setRecentPay, incomeData, setIncomeData, expenseData, setExpenseData }}>
      {children}
    </UserContext.Provider>
  )
}
