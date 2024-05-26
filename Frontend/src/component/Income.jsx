import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { UserContext } from '../context/UserContext';
import api from '../api'; // Importing your API instance

const Income = () => {
  const { userId, incomeId, setIncomeId, refreshData, refresher, recentPay, setRecentPay, incomeData, setIncomeData } = useContext(UserContext);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [lastPay, setLastPay] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state

  // Correct date format for the server
  const formatRecent = recentPay && moment(recentPay).format('MM-DD-YYYY');
  const formatLast = lastPay && moment(lastPay).format('MM-DD-YYYY');

  const toggleDropdown = () => setIsActive(!isActive);

  useEffect(() => {
    const getIncome = async () => {
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
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    getIncome();
  }, [userId, setShowAddIncome, setIncomeId, incomeId, refreshData, setIncomeData]);

  const submitIncome = async (e) => {
    e.preventDefault();

    const endpointUrl = incomeData.length === 0 ? `/income/${userId}` : `/income/${incomeId}`;
    const method = incomeData.length === 0 ? 'post' : 'put';

    const payload = {
      amount: parseFloat(amount), // Ensure amount is a float
      recent_pay: formatRecent, // Correct date format
      last_pay: lastPay ? formatLast : null  // Correct date format
    };

    console.log('Submitting payload:', payload);

    try {
      const response = await api({
        method,
        url: endpointUrl,
        data: payload
      });
      const data = response.data;
      setIncomeData(prevData => method === 'post' ? [...prevData, data] : [data]);

      refresher();
    } catch (error) {
      console.error('Error response:', error.response);
      setErrorMessage(error.response?.data?.message || error.message);
      // Log the detailed validation error messages
      console.log('Validation Errors:', error.response?.data?.detail);
      // Optional: Display validation errors to the user
      setErrorMessage(error.response?.data?.detail.join(', '));
    }
  };

  const deleteIncome = async () => {
    try {
      const response = await api.delete(`/income/${incomeId}`, {
        data: {
          amount,
          recent_pay: formatRecent,
          last_pay: formatLast
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
    if (incomeData && incomeData.length > 0) {
      const { amount, recent_pay, last_pay } = incomeData[0];
      setAmount(amount.toString()); // Ensure amount is a string for the input field
      setRecentPay(recent_pay);
      setLastPay(last_pay);
    } else {
      setAmount('');
      setRecentPay('');
      setLastPay('');
    }
  }, [incomeData, setRecentPay]);

  const handleIncomeClick = () => {
    toggleDropdown();
  };

  if (loading) {
    return <div>Loading...</div>; // Render loading indicator while data is being fetched
  }

  return (
    <div className='card'>
      <div className='card-content'>
        <div className='content'>
          <div className={`dropdown ${isActive ? 'is-active' : ''}`}>
            <div className='dropdown-trigger'>
              <button
                aria-haspopup='true'
                aria-controls='dropdown-menu'
                onClick={handleIncomeClick}
              >
                <span className='has-text-weight-bold '>Income: ${amount || ''} </span>
                <i className='fas fa-angle-down' aria-hidden='true' style={{ marginLeft: '10px' }} />
              </button>
            </div>
            <div className='dropdown-menu' id='dropdown-menu' role='menu' style={{ width: 'auto' }}>
              <div className='dropdown-content' style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                {errorMessage && <p className='help is-danger'>{errorMessage}</p>}

                {isActive && (
                  <div style={{ alignItems: 'center' }}>
                    <div>
                      <label className='label'>Amount</label>
                      <input
                        className='input mb-5'
                        type='number'
                        placeholder='Amount'
                        value={amount || ''}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <label className='label'>Recent Pay Date</label>
                      <input
                        className='input mb-5'
                        type='date'
                        placeholder='Recent Pay Date'
                        value={recentPay || ''}
                        onChange={(e) => setRecentPay(e.target.value)}
                      />
                      <button className='button is-success mr-5' type='submit' onClick={submitIncome}>
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
};

export default Income;
