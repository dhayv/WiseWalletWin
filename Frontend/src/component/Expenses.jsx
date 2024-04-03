import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

const Expense = ({ incomeId }) => { // Assuming incomeId is passed as a prop
    const { token, userId } = useContext(UserContext);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [expenseData, setExpenseData] = useState([]);
    const [expenseId, setExpenseId] = useState(null);

    const getExpense = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

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

    const submitExpense = async () => {
        const requestOptions = {
            method: "POST",
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
            const response = await fetch(`/expenses/${incomeId}`, requestOptions);
            if (!response.ok) {
                throw new Error('Could not add expense information.');
            }
            const data = await response.json();
            setExpenseData([...expenseData, data]);
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
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("name" + name +
            "amount" + amount,
            "due_date" + dueDate,);
        submitExpense();
    };

    return (
        <form onSubmit={handleSubmit} className="expense-form">
            <div className="row">
                <div className="col-sm">
                    <label htmlFor="expense-name">Name</label>
                    <input
                        required
                        type="text"
                        className="input mb-5"
                        id="expense-name"
                        placeholder="Name"
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
                        placeholder="Amount"
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
                        placeholder="Due Date"
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
    );
}

export default Expense;