import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import moment from "moment";

const Income = ({}) => {
    const { token, userId } = useContext(UserContext);
    const [showAddIncome, setShowAddIncome] =useState(true);
    const [incomeData, setIncomeData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [amount, setAmount] = useState("");
    const [recentPay, setRecentPay ] = useState()
    const [lastPay, setLastPay] = useState()


    const getIncome = useCallback(async () => {
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
    }, [userId, token]);       

    const submitIncome =  async (e) => {
        const formatRecent = recentPay && moment(recentPay).format("MM-DD-YYYY")
        const formatLast = lastPay && moment(lastPay).format("MM-DD-YYYY")
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                amount: amount,
                recent_pay: formatRecent,
                last_pay: formatLast,
            }),
        };
        try {
            const response = await fetch(`/income/${userId}`, requestOptions);
            if (!response.ok) {
                throw new Error('Failed to add income');
            }
            const data = await response.json();
            incomeData(data)
        } catch (error) {
            setErrorMessage(error.message);
        }
    };


    useEffect(() => {        
            getIncome();    
    }, [getIncome]);

    useEffect(() => {
        if (incomeData.length > 0) {
            const firstIncomeEntry = incomeData[0];
            setAmount(firstIncomeEntry.amount);
            setRecentPay(firstIncomeEntry.recent_pay);
            setLastPay(firstIncomeEntry.last_pay);
        }
    }, [incomeData]);

    return (
        <div className="card">
            <div className="card-content">
                <div className="content">
                    {errorMessage && <p className="help is-danger">{errorMessage}</p>}
                    <span>Income: ${amount}</span>
                    {/* Button to toggle add income form */}
                    {!showAddIncome && (
                        <button className="button is-info is-small" onClick={() => setShowAddIncome(true)}>
                            Add Income
                        </button>
                    )}
                    {showAddIncome && (
                        incomeData.map(income => (
                            <div key={income.id}>
                                <div>
                                    <label className="label">Amount</label>
                                    <input 
                                        className="input mb-5" 
                                        type="number" 
                                        placeholder="Amount"
                                        value={income.amount} 
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
                                    <button className="button is-success" onClick={submitIncome}>
                                        Submit
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Income;
