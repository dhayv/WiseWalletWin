import React, { useContext, useState } from "react";
import moment from "moment";
import errorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";



const Income = () => {
    const {token} = useContext(UserContext)
    const [amount, SetAmount] = useState("");
    const [recentPay, SetRecentPay] = useState("");
    const [lastPay, SetLastPay] = useState("");
    const [id,setId] = useState(null)

    const getIncome = async

    return (
        <div className='alert alert-secondary'>
            <span>Income: $2000</span>
        </div>
    )
}

export default Income