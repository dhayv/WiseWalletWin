import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import moment from "moment";
import Expense from "./Expenses";

const Income = () => {
    const { token, userId, incomeId, setIncomeId, refresher, refreshData } = useContext(UserContext);
    const [showAddIncome, setShowAddIncome] =useState(true);
    const [incomeData, setIncomeData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [amount, setAmount] = useState("");
    const [recentPay, setRecentPay ] = useState("");
    const [lastPay, setLastPay] = useState("");
    const [isActive, setIsActive] = useState(false);

    const formatRecent = recentPay && moment(recentPay).format("MM-DD-YYYY");
    const formatLast = lastPay && moment(lastPay).format("MM-DD-YYYY");
    
    const toggleDropdown = () => setIsActive(!isActive);


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
                if (data.length > 0) {
                    setIncomeId(data[0].id);
                    console.log(incomeId);
                }
                setIncomeData(data);
            } catch (error) {
                setErrorMessage(error.message);
            } 
        }
    }, [userId, token, setIncomeId, incomeId, refreshData, refresher]);       

    const submitIncome =  async (e) => {
        e.preventDefault();
        let url = '';
        let method = '';
        if (incomeData.length === 0) {
            url = `/income/${userId}`;
            method = "POST"
        } else {
            url = `/income/${incomeId}`;
            method = "PUT";
        }


        const requestOptions = {
            method: method,
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
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error(`Failed to ${method === "POST" ? 'add' : 'update'} income`);
            }
            const data = await response.json();
            setIncomeData(prevData => method === "POST" ? [...prevData, data] : [data]);
        } catch (error) {
            setErrorMessage(error.message);
        }
        refresher();
    };

    const deleteIncome = async () => {
            const requestOptions = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    amount: amount,
                    recent_pay: formatRecent,
                    last_pay: formatLast,
                })
            };
    
            try {
                const response = await fetch(`/income/${incomeId}`, requestOptions);
                if (!response.ok) {
                    setErrorMessage('Could not delete income information.');
                }
                const data = await response.json();
                setIncomeData(data);
            } catch (error) {
                setErrorMessage(error.message);
            } 
            refresher();
    } ;     


    useEffect(() => {        
            getIncome();    
    }, [getIncome]);

    useEffect(() => {
        if (incomeData.length > 0) {
            const firstIncomeEntry = incomeData[0];
            setAmount(firstIncomeEntry.amount);
            setRecentPay(firstIncomeEntry.recent_pay);
            setLastPay(firstIncomeEntry.last_pay);
        } else {
            setAmount("");
            setRecentPay("");
            setLastPay("");
        }
    }, [incomeData]);

    return (
        <div className="card">
            <div className="card-content">
                <div className="content">
                    <div className={`dropdown ${isActive ? "is-active" : ""}`} >
                        <div className="dropdown-trigger" >
                            <button className="button is-info" aria-haspopup="true" aria-controls="dropdown-menu" onClick={toggleDropdown} >
                                <span>Income: ${amount}</span>
                                <i className="fas fa-angle-down" aria-hidden="true" style={{marginLeft: '10px'}}></i>
                            </button>
                        </div>
                        <div className="dropdown-menu" id="dropdown-menu" role="menu" style={{ width: 'auto' }}>
                            <div className="dropdown-content" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                                {errorMessage && <p className="help is-danger">{errorMessage}</p>}
                                {!showAddIncome && (
                                    <button className="button is-info is-small" onClick={() => setShowAddIncome(true)} style={{ margin: '0 auto'}}>
                                        Add Income
                                    </button>
                                )}
                                {showAddIncome && incomeData.map(income => (
                                    <div key={income.id} style={{ alignItems: 'center' }}>
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
                                                <button className="button is-success mr-5" onClick={() => { submitIncome(); refresher(); }}>
                                                {incomeData.length === 0 ? 'Add' : 'Update'}
                                                </button>

                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            

        </div>
    );
};

export default Income;
