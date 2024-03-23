import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider =(props) => {
    const [token, setToken] = useState(localStorage.getItem("smartUserToken"));

    useEffect(() => {
        const fetchUser = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };
                const response = await fetch("user/me", requestOptions);
                if (!response.ok) {
                    setToken(null);
                }
                localStorage.setItem("smartUserToken", token)
        };
        fetchUser();
    },    [token]);
        return(
            <UserContext.Provider value={[token, setToken]}>
                {props.children}
            </UserContext.Provider>
        )
};