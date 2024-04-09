import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import moment from "moment";
import api from "../api";  // Importing your API instance
import Expense from "./Expenses";

const Income = () => {
    const { setUserId ,userId, incomeId, setIncomeId,} = useContext(UserContext);
    const [showAddIncome, setShowAddIncome] =useState(false);
    const [incomeData, setIncomeData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [amount, setAmount] = useState("");
    const [recentPay, setRecentPay ] = useState("");
    const [lastPay, setLastPay] = useState("");
    const [isActive, setIsActive] = useState(false);

    const formatRecent = recentPay && moment(recentPay).format("MM-DD-YYYY");
    const formatLast = lastPay && moment(lastPay).format("MM-DD-YYYY");
    
    const toggleDropdown = () => {
        setIsActive(!isActive);
        setShowAddIncome(incomeData.length === 0);
      };


    
    const getIncome = useCallback(async () => {
            if (!userId) {
                setShowAddIncome(true);
                return;
            }
            try {
                const response = await api.get(`/income/${userId}`);
                const data = response.data || [];
                
                setIncomeData(data);
                setIncomeId(data[0]?.id);
                setShowAddIncome(data.length === 0); // Show form if no data
                setErrorMessage('');
            } catch (error) {{
                    // No income data found, so show the form for the user to add new income
                    setShowAddIncome(true);
                    console.error("Error fetching income:", error);
                    // An error other than 'not found'
                    setErrorMessage("Add your Income");
                }
                
            }
        
            
        }, [userId, setIncomeId, setShowAddIncome]);  

    
        useEffect(() => {
            if (userId) {
                getIncome();
            }
        }, [userId]);     
        
    
    useEffect(() => {
        console.log("UserID in Income component:", userId);
    }, [userId]);

    const submitIncome =  async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const endpointUrl = incomeData.length === 0 ? `/income/${userId}` : `/income/${incomeId}`;
        const method = incomeData.length === 0 ? 'post' : 'put'

        try {
            const response = await api({
                method: method,
                url: endpointUrl,
                data: {
                    amount: amount,
                    recent_pay: formatRecent,
                    last_pay: formatLast,
                },
            });
            const newData = response.data;
            setIncomeData(method === 'post' ? [newData] : [newData, ...incomeData.slice(1)]);
            setShowAddIncome(false);
            setIsActive(false);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
            setIsActive(true);
        }
        
    };

    const deleteIncome = async () => {
        try {
            const response = await api.delete(`/income/${incomeId}`, {
                data: {
                    amount: amount,
                    recent_pay: formatRecent,
                    last_pay: formatLast,
                }
            });
            if (!response.ok) {
                setErrorMessage('Could not delete income information.');
            }
            setIncomeData(response.data);
        } catch (error) {
            setErrorMessage(error.message);
        } 
        
    };

    useEffect(() => {        
        getIncome();    
}, [userId, getIncome]);

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

    const handleIncomeClick = () => {
        setShowAddIncome(!showAddIncome); // Toggle visibility of add income form
        setIsActive(!isActive); // Toggle the dropdown if you're using a dropdown menu
        if (!incomeData.length) {
            setShowAddIncome(!showAddIncome);
          }
      };

      return (
        <div className="card">
          <div className="card-content">
            <div className="content">
              <div className={`dropdown ${isActive ? "is-active" : ""}`}>
                <div className="dropdown-trigger">
                  <button
                    className="button is-info"
                    aria-haspopup="true"
                    aria-controls="dropdown-menu"
                    onClick={toggleDropdown}
                  >
                    <span>Income: ${amount || ''} </span>
                    <i className="fas fa-angle-down" aria-hidden="true" style={{ marginLeft: '10px' }}></i>
                  </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu" style={{ width: 'auto' }}>
                  <div className="dropdown-content" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                    {errorMessage && <p className="help is-danger">{errorMessage}</p>}
                    {showAddIncome && (
                      <div style={{ alignItems: 'center' }}>
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
                          <button className="button is-success mr-5" type='submit' onClick={() => setShowAddIncome(true)}>
                            {incomeData.length === 0 ? 'Add' : 'Update'} Income
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      
};

export default Income;
