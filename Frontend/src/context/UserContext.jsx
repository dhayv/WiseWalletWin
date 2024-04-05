import React, { createContext, useEffect, useState } from "react";
import { useCallback } from "react";

export const UserContext = createContext({
    refresher: () => {},
});



export const UserProvider = ({children}) => {
    // Start with a token from local storage if there's one
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [userId, setUserId] = useState(null); 
    const [incomeId, setIncomeId] = useState(null);
    const [refreshData, setRefreshData] = useState(false);


    const refresher = useCallback(() => {
        setRefreshData(prev => !prev);
    },[]);

    useEffect(() => {
        const fetchUser = async () => {
            // Grab the token we just got
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                // If we have a token, let's use it
                setToken(storedToken);
                const requestOptions = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        // Use the token to get user info
                        Authorization: `Bearer ${storedToken}`,
                    },
                };
                const response = await fetch("/user/me", requestOptions);
                if (response.ok) {
                    const data = await response.json();
                    setUserId(data.id);  // Set user ID here
                } else {
                    setToken(null);
                }
            }
        };
        fetchUser();
    }, [token, refreshData]);

    return (
        // This lets any component get the token and user data
        <UserContext.Provider value={{token, setToken, userId, setUserId, incomeId, setIncomeId, refresher, refreshData}}>
            {children}
        </UserContext.Provider>
    );
};
