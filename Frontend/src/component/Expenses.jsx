import React, { useContext, useState, useReducer, useEffect } from "react";
import { UserContext } from "../context/UserContext";


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
    const {token, incomeId, refreshData, refresher} = useContext(UserContext);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [expenseData, setExpenseData] = useState([]);
    const [expenseId, setExpenseId] = useState([null]);
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        if (!incomeId) return;

        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        const getExpense = async () => {
        try {
            const response = await fetch(`/expenses/${incomeId}`, requestOptions);
            if (!response.ok) {
                throw new Error('Could not load expense information.');
            }
            const data = await response.json();
            setExpenseData(data);
        } catch (error) {
            setErrorMessage(error.message);
        }
    }; 
        getExpense();
    }, [incomeId, token, refreshData, refresher]);

    const submitExpense = async (e) => {
        e.preventDefault();

        if (!incomeId) {
            console.error("Invalid or undefined incomeId:", incomeId);
            setErrorMessage("Invalid income ID.");
            return;
        }

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: name,
                amount: Number(amount),
                due_date: Number(dueDate),
            }),
        };

        try {
            const response = await fetch(`/expenses/${incomeId}`, requestOptions);
            if (!response.ok) {
                throw new Error('Could not add expense information.');
            }
            const data = await response.json();
            setExpenseData(prevExpenses => [...prevExpenses, data]);
            refresher();
        } catch (error) {
            setErrorMessage(error.message);
        }
    
    };

    const updateExpense = async () => {
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: name,
                amount: amount,
                due_date: dueDate,
            }),
        };

        try {
            const response = await fetch(`/expenses/${expenseId}`, requestOptions);
            if (!response.ok) {
                throw new Error('Could not update expense information.');
            }
            const data = await response.json();
            setExpenseData(expenseData.map(exp => exp.id === expenseId ? data : exp));
        } catch (error) {
            setErrorMessage(error.message);
        }
        refresher();
    };

    const deleteExpense = async () => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const response = await fetch(`/expenses/${expenseId}`, requestOptions);
            if (!response.ok) {
                throw new Error('Could not delete expense information.');
            }
            setExpenseData(expenseData.filter(exp => exp.id !== expenseId));
        } catch (error) {
            setErrorMessage(error.message);
        }
        refresher();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitExpense(e);
        
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
                            <tr key={exp.id}>
                                <td>{exp.name}</td>
                                <td>{exp.amount}</td>
                                <td>{exp.due_date}</td>
                                <td>
                                    <button className="button is-danger is-small">Delete</button>
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