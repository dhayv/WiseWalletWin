import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/UserContext'
import api from '../api'
import '../styles/App.css'
import { Button, Modal, Form } from 'react-bootstrap'

const Expense = () => { // Assuming incomeId is passed as a prop
  const { userId, token, incomeId, refreshData, refresher, expenseData, setExpenseData, setTotalExpenses } = useContext(UserContext)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [expenseId, setExpenseId] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleOpen = () => {
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
  }

  useEffect(() => {
    if (!incomeId) return

    const getExpense = async () => {
      try {
        const response = await api.get(`/expenses/${incomeId}`)
        if (response.status === 200) {
          setExpenseData(response.data)
          setExpenseId(expenseData.map(exp => exp._id))
        } else {
          throw new Error('Could not load expense information.')
        }
      } catch (error) {
        setErrorMessage(error.message)
      }
    }

    getExpense()
  }, [incomeId, setExpenseId, refreshData, setExpenseData])

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
        handleClose()
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
        setExpenseData(expenseData.map(exp => exp._id === expenseId ? data : exp))
        refresher()
        handleClose()
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
        setExpenseData(expenseData => expenseData.filter(exp => exp._id !== expenseId))
        refresher()
      } else {
        throw new Error('Could not delete expense information.')
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
    ;
  }

  useEffect(() => {
    const getSum = async () => {
      if (!userId) return // Prevent running if userId is null or undefined

      try {
        const response = await api.get(`/user/${userId}/total_expenses`)
        if (response.status === 200) {
          setTotalExpenses(response.data) // Ensure this matches the API response structure
        } else {
          throw new Error('Error fetching total expenses')
        }
      } catch (error) {
        console.error('Error fetching total expenses:', error)
        setTotalExpenses({ total_expenses: 0 }) // Set a default value in case of error
      }
    }

    if (userId) {
      getSum() // Only call the function if userId is available
    }
  }, [userId, refreshData])

  const handleSubmit = (e) => {
    e.preventDefault()
    submitExpense(e)
  }

  const handleDelete = async (expenseId) => {
    await deleteExpense(expenseId)
  }

  const sortedExpenses = [...expenseData].sort((a, b) => a.due_date - b.due_date)
  return (
    <div className='container'>
      <div className='columns is centered'>

        <div className=''>

          <div className='table'>

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
                {sortedExpenses.map(exp => (
                  <tr key={exp._id}>
                    <td>{exp.name}</td>
                    <td>${exp.amount}</td>
                    <td>{exp.due_date}</td>
                    <td>
                      <button className='button is-danger is-small' onClick={() => handleDelete(exp._id)}>
                        Delete
                  </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>

          <div className='has-text-centered mt-5'>
            <button className='button is-primary' onClick={handleOpen}>
              <span className='has-text-weight-bold'>Add Expense</span>
            </button>
          </div>

          <Modal
            show={showModal}
            onHide={handleClose}
            size='md'
            aria-labelledby='contained-modal-title-vcenter'
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Add Expense</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form className='expense-form'>
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
                    <button type='submit' className='button is-primary is-fullwidth mt-4' onClick={handleSubmit}>
                      Add
                    </button>
                  </div>
                </div>
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <Button variant='secondary' onClick={handleClose}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>

    </div>
  )
}

export default Expense
