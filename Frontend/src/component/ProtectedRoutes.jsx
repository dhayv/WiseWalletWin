import React, { Children } from "react"
import { Navigate } from "react-router-dom"
import { UserContext } from "../context/UserContext" 


const ProtectedRoutes = () => {
    const {token} = useUser();

    if(!token) {
        return <Navigate to="/login" />
    }

    
    return Children;
}

export default ProtectedRoutes