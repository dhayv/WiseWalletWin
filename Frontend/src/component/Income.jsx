import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import moment from "moment";

const Income = ({}) => {
    const { token, userId } = useContext(UserContext);
    const [showAddIncome, setShowAddIncome] =useState(false);
    const [incomeData, setIncomeData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [amount, setAmount] = useState("");
    const [recentPay, setRecentPay ] = useState("")
    const [lastPay, setLastPay] = useState("")


    const getIncome = async () => {
        if (userId) {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            try {
                const response = await fetch(`/income/${userId}`, requestOptions);
                if (!response.ok) {
                    setErrorMessage('Could not load income information.');
                }
                const data = await response.json();
                setIncomeData(data);
            } catch (error) {
                setErrorMessage(error.message);
            } 
        }
};            


    const submitIncome =  async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                amount,
                recent_pay: recentPay,
                last_pay: lastPay,
            }),
        };
        try {
            const response = await fetch(`/income/${userId}`, requestOptions);
            if (!response.ok) {
                throw new Error('Failed to add income');
            }
            const data = await response.json();
            // Close the dropdown and clear the form
            setShowAddIncome(false);
            setAmount("");
            setRecentPay("");
            setLastPay("");
            // Handle the response data here
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        if (userId) {
            getIncome();
        }
    }, [userId, token]);

    return (
        <div className="card">
            <div className="card-content">
                <div className="content">
                    {errorMessage && <p className="help is-danger">{errorMessage}</p>}

                    {showAddIncome && (
                        <div>
                            <label className="label">Amount</label>
                            <input 
                                className="input mb-5" 
                                type="number" 
                                placeholder="Amount" 
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)} 
                            />
                            <label className="label">Recent Pay Date</label>
                            <input 
                                className="input mb-5" 
                                type="date" 
                                placeholder="Recent Pay Date" 
                                value={recentPay} 
                                onChange={(e) => setRecentPay(e.target.value)} 
                            />
                            <label className="label">Last Pay Date</label>
                            <input 
                                className="input mb-5" 
                                type="date" 
                                placeholder="Last Pay Date" 
                                value={lastPay} 
                                onChange={(e) => setLastPay(e.target.value)} 
                            />
                            <button className="button is-success " onClick={submitIncome}>
                                Submit
                            </button>
                        </div>
                    )}
                    {/* Render existing incomeData here */}
                </div>
            </div>
        </div>
    );
};

export default Income;
