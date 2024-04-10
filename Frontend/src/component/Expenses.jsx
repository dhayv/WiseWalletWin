import React, { useContext, useState, useReducer, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import api from "../api";


const initialState = {
    expenseData: []
};

const appReducer = (state, action) => {
    switch (action.type) {
        default:
            return state;
    }

};


const Expense = () => { // Assuming incomeId is passed as a prop
    const {token, incomeId, refreshData, refresher, userId} = useContext(UserContext);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [expenseData, setExpenseData] = useState([]);
    const [expenseId, setExpenseId] = useState([null]);
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        if (!incomeId) return;

        const getExpense = async () => {
        
        try {
            
            const response = await api.get(`/expenses/${incomeId}`);
            if (response.status !== 200) {
                throw new Error('Could not load expense information.');
            }
            const data = await response.data;
            setExpenseData(data);
            setExpenseId(data.id)
        } catch (error) {
            setErrorMessage(error.message);
        }
    }; 

        

        getExpense();
        
        
        refresher();
    }, [incomeId, token, setExpenseId]);

    const submitExpense = async (e) => {
        e.preventDefault();

        if (!incomeId) {
            console.error("Invalid or undefined incomeId:", incomeId);
            setErrorMessage("Invalid income ID.");
            return;
        }
           

        try {
            const response = await api.post(`/expenses/${incomeId}`, {
                name: name,
                amount: Number(amount),
                due_date: Number(dueDate),
            });

            if (!response.ok) {
                throw new Error('Could not add expense information.');
            }
            const data = await response.data;
            setExpenseData(prevExpenses => [...prevExpenses, data]);
            refresher();
            setExpenseId(data.id)
        } catch (error) {
            setErrorMessage(error.message);
        }

        
    
    };

    const updateExpense = async () => {
        try {
            const response = await api.put(`/expenses/${expenseId}`, {
                name: name,
                amount: amount,
                due_date: dueDate,
            });
            if (!response.ok) {
                throw new Error('Could not update expense information.');
            }
            const data = await response.data;
            setExpenseData(expenseData.map(exp => exp.id === expenseId ? data : exp));
            refresher();
        } catch (error) {
            setErrorMessage(error.message);
        }
        
    };

    const deleteExpense = async (expenseId) => {
        if (
            expenseId);
        try {
            const response = await api.delete(`/expenses/${expenseId}`);
            if (!response.ok) {
                throw new Error('Could not delete expense information.');
            }
            setExpenseData(expenseData.filter(exp => exp.id !== expenseId));
            refresher()
        } catch (error) {
            setErrorMessage(error.message);
        }
        ;
    };

    



    const handleSubmit = (e) => {
        e.preventDefault();
        submitExpense(e);
        
    };

    const handleDelete = (expenseId) => (e) => {
        e.preventDefault();
        deleteExpense(expenseId);
    };


    return (
        <div>

            <div>
                <table className="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Due Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenseData.map(exp => (
                            <tr key={exp.id} >
                                <td>{exp.name}</td>
                                <td>{exp.amount}</td>
                                <td>{exp.due_date}</td>
                                <td>
                                    <button className="button is-danger is-small" type="delete" onClick={handleDelete(exp.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <h3 className="title mt-5">Add Expense</h3>
            <form onSubmit={handleSubmit} className="expense-form">
                <div className="row">
                    <div className="col-sm">
                        <label htmlFor="expense-name">Name</label>
                        <input
                            required
                            type="text"
                            className="input mb-5"
                            id="expense-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="col-sm">
                        <label htmlFor="expense-amount">Amount</label>
                        <input
                            required
                            type="number"
                            className="input mb-5"
                            id="expense-amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="col-sm">
                        <label htmlFor="expense-due-date">Due Date</label>
                        <input
                            type="number"
                            className="input mb-5"
                            id="expense-due-date"
                            placeholder="Due Day (1-31)"
                            min= "1"
                            max= "31"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>
                    <div className="col-sm">
                        <button type="submit" className="button is-primary">
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};


export default Expense;