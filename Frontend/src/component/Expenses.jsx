import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/UserContext'
import api from '../api'
import { Button, Modal, Form } from 'react-bootstrap'
import '../styles/App.css'

const Expense = () => { // Assuming incomeId is passed as a prop
  const { userId, token, incomeId, refreshData, expenseData, setExpenseData, setTotalExpenses } = useContext(UserContext)
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

        const sumResponse = await api.get(`/user/${userId}/total_expenses`)
        if (sumResponse.status === 200) {
          setTotalExpenses(sumResponse.data)
        } else {
          throw new Error('Error fetching total expenses')
        }
      } catch (error) {
        setErrorMessage(error.message)
      }
    }

    getExpense()
  }, [incomeId, userId, setExpenseData, setTotalExpenses])

  const submitExpense = async (e) => {
    e.preventDefault()
    setErrorMessage('')

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
        const newExpense = response.data

        setExpenseData(prevExpenses => [...prevExpenses, newExpense])
        await updateTotalExpenses()

        handleClose()
        setName('')
        setAmount('')
        setDueDate('')
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
        setExpenseData(prevExpenses => prevExpenses.filter(exp => exp._id !== expenseId))
        await updateTotalExpenses()
      } else {
        throw new Error('Could not delete expense information.')
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
    ;
  }

  const updateTotalExpenses = async () => {
    try {
      const sumResponse = await api.get(`/user/${userId}/total_expenses`)
      if (sumResponse.status === 200) {
        setTotalExpenses(sumResponse.data)
      } else {
        throw new Error('Error fetching total expenses')
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    submitExpense(e)
  }

  const handleDelete = async (expenseId) => {
    await deleteExpense(expenseId)
  }

  if (!userId) {
    return <div>Loading...</div> // Return a loading message or spinner
  }
  const sortedExpenses = [...expenseData].sort((a, b) => a.due_date - b.due_date)
  return (
    <div className='container'>
      <div className='columns'>

        <div className=''>
          <div className='has-text-centered'>
            <button className='button is-primary' onClick={handleOpen}>
              <span className='has-text-weight-bold'>Add Expense</span>
            </button>
          </div>

          <div className='table-container mt-3'>
            <div className='table'>

              <table className='table is-fullwidth'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Due </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedExpenses.map(exp => (
                    <tr key={exp._id}>
                      <td className='has-text-left'>{exp.name}</td>
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
              <Form className='expense-form' onSubmit={handleSubmit}>
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
                    <button type='submit' className='button is-primary is-fullwidth mt-4'>
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
