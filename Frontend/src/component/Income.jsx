import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import moment from "moment";
import api from "../api";  // Importing your API instance

const Income = () => {
    const { setUserId ,userId, incomeId, setIncomeId, refreshData, refresher, recentPay, setRecentPay} = useContext(UserContext);
    const [showAddIncome, setShowAddIncome] =useState(false);
    const [incomeData, setIncomeData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [amount, setAmount] = useState("");
    const [lastPay, setLastPay] = useState("");
    const [isActive, setIsActive] = useState(false);

    const formatRecent = recentPay && moment(recentPay).format("MM-DD-YYYY");
    const formatLast = lastPay && moment(lastPay).format("MM-DD-YYYY");
    
    const toggleDropdown = () => 
        setIsActive(!isActive);
 
      ;


    useEffect(() => {
        const getIncome = async( ) => {
                if (!userId) {
                    setShowAddIncome(true);
                    return;
                }
                try {
                    const response = await api.get(`/income/${userId}`);
                    const data = response.data || [];
                    
                    setIncomeData(data);
                    setShowAddIncome(data.length === 0); // Show form if no data
                    if (data.length > 0) {
                        setIncomeId(data[0].id);
                    
                    }
                    setIncomeData(data);
                } catch (error) {
                    setErrorMessage(error.message);
                } 
            };
            getIncome();
                
            }, [userId, setShowAddIncome, setIncomeId, incomeId, refreshData]);      
            
        


    const submitIncome =  async (e) => {
        e.preventDefault();
        
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
            const data = response.data;
            setIncomeData(prevData => method === "POST" ? [...prevData, data] : [data]);
           
            refresher();
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
            
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
            if (response.status === 200) {
                setIncomeData(response.data);
            }
            
        } catch (error) {
            setErrorMessage(error.message);
        } 
       
        
    };


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
        toggleDropdown()
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
                    onClick={handleIncomeClick}
                  >
                    <span>Income: ${amount || ''} </span>
                    <i className="fas fa-angle-down" aria-hidden="true" style={{ marginLeft: '10px' }}></i>
                  </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu" style={{ width: 'auto' }}>
                  <div className="dropdown-content" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                    {errorMessage && <p className="help is-danger">{errorMessage}</p>}
                
                      
                    {isActive && (
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
                          <button className="button is-success mr-5" type='submit' onClick={submitIncome}>
                            {incomeData.length === 0 ? 'Add Income' : 'Update'} 
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
}    

export default Income;
