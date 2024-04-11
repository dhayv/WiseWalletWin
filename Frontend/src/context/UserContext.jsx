import React, { createContext, useEffect, useState } from "react";
import { useCallback } from "react";
import api from "../api";

export const UserContext = createContext();



export const UserProvider = ({children}) => {
    // Start with a token from local storage if there's one
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [userId, setUserId] = useState(null); 
    const [incomeId, setIncomeId] = useState(null);
    const [refreshData, setRefreshData] = useState(false);
    const [userData, setUserData] = useState(null);
    const [totalExpenses, setTotalExpenses] = useState({total: 0});


    const refresher = useCallback(() => {
        setRefreshData(prev => !prev);
    },[]);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);
    

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const response = await api.get("/user/me");
                if (response.status === 200) {
                    const data = response.data;
                    setUserData(data)
                    setUserId(data.id);  // Set user ID here
                    console.log("User ID set to:", data.id);
                } else {
                    setToken(null);
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
                setToken(null);
                localStorage.removeItem('token');
            }    
        }else {
            setUserData(null);
            setUserId(null);
            localStorage.removeItem('userId')
            localStorage.removeItem('token')
        }    
    };
        fetchUser();
    }, [token]);

    useEffect(() => {
  const getSum = async () => {
    if (!userId) return; // Prevent running if userId is null or undefined

    try {
      const response = await api.get(`/user/${userId}/total_expenses`);
      if (response.status === 200) {
        setTotalExpenses(response.data); // Ensure this matches the API response structure
      } else {
        throw new Error('Error fetching total expenses');
      }
    } catch (error) {
      console.error('Error fetching total expenses:', error);
      setTotalExpenses({ total_expenses: 0 }); // Set a default value in case of error
    }
  };

  if (userId) {
    getSum(); // Only call the function if userId is available
  }
}, [userId]); 
 

    return (
        // This lets any component get the token and user data
        <UserContext.Provider value={{token, setToken, userId, setUserId, incomeId, setIncomeId, refresher, refreshData, userData, totalExpenses, setTotalExpenses}}>
            {children}
        </UserContext.Provider>
    );
};
