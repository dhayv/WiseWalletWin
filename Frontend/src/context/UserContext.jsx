import React, { createContext, useEffect, useState, useCallback, useLayoutEffect } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()


  const fetchIncomeAndExpenses = useCallback(async (userId) => {
    try {

      setIncomeData([]);
      setExpenseData([]);
      setIncomeId(null);

      const incomeResponse = await api.get(`/income/${userId}`);
      if (incomeResponse.status === 200) {
        const incomeData = incomeResponse.data;
        setIncomeData(incomeData);
        if (incomeData.length > 0) {
          const firstIncomeId = incomeData[0]._id;
          setIncomeId(firstIncomeId);

          // fetch expenses associated with incomeId
          const expenseResponse = await api.get(`/expenses/${firstIncomeId}`);
          if (expenseResponse.status === 200) {
            setExpenseData(expenseResponse.data);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch income and expenses:', error);
    }
  }, []);


  const fetchUser = useCallback(async () => {
    try {

      setUserData(null);
      setUserId(null);

      const response = await api.get('/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const data = response.data;
        setUserData(data);
        setUserId(data._id);
        localStorage.setItem('userId', data._id);

        // Fetch Income and Expenses after setting the userId
        await fetchIncomeAndExpenses(data._id);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      handleLogout();
    }
  }, [token, fetchIncomeAndExpenses]);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token, fetchUser]);
  

  useEffect(() => {
    if (userId && refreshData) {
      const fetchData = async () => {
        try {

          setIncomeData([]);
          setExpenseData([]);
          setIncomeId(null);
          
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
    // Completely clear previous users data
    setToken(null)
    setUserId(null)
    setIncomeId(null)
    setUserData(null)
    setTotalExpenses({ total: 0 })
    setRecentPay('')
    setIncomeData([])
    setExpenseData([])
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    navigate("/")
    
  }

  return (
  // This lets any component get the token and user data
    <UserContext.Provider value={{ token, setToken, userId, setUserId, incomeId, setIncomeId, refreshData, userData, totalExpenses, setTotalExpenses, recentPay, setRecentPay, incomeData, setIncomeData, expenseData, setExpenseData }}>
      {children}
    </UserContext.Provider>
  )
}
