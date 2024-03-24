import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {
    // Start with a token from local storage if there's one
    const [token, setToken] = useState(localStorage.getItem("token"));

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
                if (!response.ok) {
                    // If something's wrong, forget the token
                    setToken(null);
                }
            }
        };
        fetchUser();
    }, [token]);

    return (
        // This lets any component get the token and user data
        <UserContext.Provider value={{token, setToken}}>
            {props.children}
        </UserContext.Provider>
    );
};
