import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/UserContext'
import api from '../api'

const Expense = () => { // Assuming incomeId is passed as a prop
  const { token, incomeId, refreshData, refresher, expenseData, setExpenseData } = useContext(UserContext)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [expenseId, setExpenseId] = useState(null)

  useEffect(() => {
    if (!incomeId) return

    const getExpense = async () => {
      try {
        const response = await api.get(`/expenses/${incomeId}`)
        if (response.status === 200) {
          const data = response.data
          setExpenseData(data)
          setExpenseId(expenseData.map(exp => exp.id))
        } else {
          throw new Error('Could not load expense information.')
        }
      } catch (error) {
        setErrorMessage(error.message)
      }
    }

    getExpense()
  }, [incomeId, token, setExpenseId, refreshData, setExpenseData])

  const submitExpense = async (e) => {
    e.preventDefault()

    if (!incomeId) {
      console.error('Invalid or undefined incomeId:', incomeId)
      setErrorMessage('Invalid income ID.')
      return
    }

    try {
      const response = await api.post(`/expenses/${incomeId}`, {
        name,
        amount: Number(amount),
        due_date: Number(dueDate)
      })

      if (response.status === 201) {
        const data = response.data

        setExpenseData(prevExpenses => [...prevExpenses, ...[response.data]])
        refresher()
      } else {
        throw new Error('Could not add expense information.', response.data)
      };
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const updateExpense = async () => {
    try {
      const response = await api.put(`/expenses/${expenseId}`, {
        name,
        amount,
        due_date: dueDate
      })
      if (response.status === 200) {
        const data = await response.data
        setExpenseData(expenseData.map(exp => exp.id === expenseId ? data : exp))
        refresher()
      } else {
        throw new Error('Could not update expense information.')
      }
    } catch (error) {
      setErrorMessage(error.message)
      console.error('Error adding expense:', error)
    }
  }

  const deleteExpense = async (expenseId) => {
    try {
      const response = await api.delete(`/expenses/${expenseId}`)
      if (response.status === 204) {
        setExpenseData(expenseData => expenseData.filter(exp => exp.id !== expenseId))
        refresher()
      } else {
        throw new Error('Could not delete expense information.')
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
    ;
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    submitExpense(e)
  }

  const handleDelete = async (expenseId) => {
    await deleteExpense(expenseId)
  }

  return (
    <div>

      <div>
        <table className='table is-fullwidth'>
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
                  <button className='button is-danger is-small' onClick={() => handleDelete(exp.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className='has-text-weight-bold subtitle'>Add Expense</h3>
      <form onSubmit={handleSubmit} className='expense-form'>
        <div className='row'>
          <div className='field'>
            <label htmlFor='expense-name'>Name</label>
            <input
              required
              type='text'
              className='input mb-5'
              id='expense-name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='field'>
            <label htmlFor='expense-amount'>Amount</label>
            <input
              required
              type='number'
              className='input mb-5'
              id='expense-amount'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className='field'>
            <label htmlFor='expense-due-date'>Due Date</label>
            <input
              type='number'
              className='input mb-5'
              id='expense-due-date'
              placeholder='Due Day (1-31)'
              min='1'
              max='31'
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className='col-sm'>
            <button type='submit' className='button is-primary'>
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Expense
